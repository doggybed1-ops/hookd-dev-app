(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const scripts = Array.isArray(config.scripts) ? config.scripts : [];
  const gallery = document.getElementById('gallery');
  const dialog = document.getElementById('video-dialog');
  const content = document.getElementById('video-content');
  let lastTrigger;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const safeUrl = value => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:', 'file:'].includes(url.protocol) ? url : null;
    } catch { return null; }
  };
  document.querySelectorAll('[data-brand]').forEach(node => { node.textContent = config.brand || 'Hookd Development'; });
  document.title = `${config.brand || 'Hookd Development'} — Scripts in action`;
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('all-count').textContent = String(scripts.length).padStart(2, '0');

  function illustration(theme) {
    if (theme === 'graphite') {
      const terminal = make('span', 'terminal-art');
      terminal.append(make('span', 'terminal-head', 'utility.toolkit'));
      ['> initialize toolkit', '  modules ready', '  workflow streamlined', '> make something great_'].forEach(line => terminal.append(make('span', 'code-line', line)));
      terminal.setAttribute('aria-hidden', 'true');
      return terminal;
    }
    if (theme === 'silver') {
      const ui = make('span', 'interface-art');
      const top = make('span', 'interface-top', 'Interface / Overview');
      top.append(make('span', 'ui-dot'));
      const bars = make('span', 'ui-bars');
      for (let i = 0; i < 6; i++) bars.append(make('span'));
      const row = make('span', 'ui-row');
      for (let i = 0; i < 3; i++) row.append(make('span'));
      ui.append(top, bars, row);
      ui.setAttribute('aria-hidden', 'true');
      return ui;
    }
    return make('span', 'mini-orbit');
  }

  function render(filter = 'All') {
    gallery.replaceChildren();
    scripts.forEach((script, index) => {
      if (filter !== 'All' && script.category !== filter) return;
      const card = make('article', 'card');
      const theme = ['neutral', 'graphite', 'silver'].includes(script.theme) ? script.theme : 'neutral';
      const button = make('button', `card-visual ${theme}`);
      button.type = 'button';
      button.setAttribute('aria-label', `Watch ${script.title}`);
      const imageUrl = safeUrl(script.thumbnail);
      if (imageUrl) {
        const img = make('img'); img.src = imageUrl.href; img.alt = ''; img.loading = 'lazy';
        img.addEventListener('error', () => { img.remove(); button.prepend(illustration(theme)); }, { once: true });
        button.append(img);
      } else button.append(illustration(theme));
      button.append(make('span', 'visual-tag', script.label || 'SCRIPT SHOWCASE'), make('span', 'visual-number', String(index + 1).padStart(2, '0')), make('span', 'visual-bottom', script.video ? 'WATCH SHOWCASE' : 'PREVIEW ARTWORK'), make('span', 'card-play', '▶'));
      button.addEventListener('click', () => openVideo(script, button));
      const meta = make('div', 'card-meta');
      meta.append(make('h3', '', script.title), make('span', 'category', script.category));
      card.append(button, meta, make('p', '', script.description));
      gallery.append(card);
    });
    if (!gallery.children.length) gallery.append(make('p', 'empty-results', 'New showcases are on the way. Check back soon.'));
  }

  function prepareDialog(title, category, description, trigger) {
    lastTrigger = trigger;
    content.replaceChildren();
    document.getElementById('dialog-title').textContent = title;
    document.getElementById('dialog-category').textContent = category;
    document.getElementById('dialog-description').textContent = description || '';
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }
  function emptyState(title, message, icon = '▶') {
    const empty = make('div', 'empty-video');
    empty.append(make('span', '', icon), make('h3', '', title), make('p', '', message));
    content.replaceChildren(empty);
  }
  function openVideo(script, trigger) {
    prepareDialog(script.title, script.category || 'SHOWCASE', script.description, trigger);
    const url = safeUrl(script.video);
    if (!url) { emptyState('Showcase coming soon', 'The video for this script is on its way. Explore the collection and check back for the full showcase.'); return; }
    const host = url.hostname.toLowerCase();
    let embed = '';
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'].includes(host)) {
      const id = host === 'youtu.be' ? url.pathname.split('/')[1] : url.searchParams.get('v') || (/^\/(?:embed|shorts)\/([^/]+)/.exec(url.pathname) || [])[1];
      if (/^[\w-]{11}$/.test(id || '')) embed = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    } else if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(host)) {
      const id = url.pathname.match(/\/(\d+)\/?$/)?.[1];
      if (id) {
        const target = new URL(`https://player.vimeo.com/video/${id}`);
        target.searchParams.set('autoplay', '1');
        const hash = url.searchParams.get('h');
        if (hash && /^[a-zA-Z0-9]+$/.test(hash)) target.searchParams.set('h', hash);
        embed = target.href;
      }
    }
    if (embed) {
      const frame = make('iframe');
      frame.src = embed; frame.title = `${script.title} video showcase`;
      frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
      frame.allowFullscreen = true; frame.referrerPolicy = 'strict-origin-when-cross-origin';
      content.append(frame);
    } else if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
      const video = make('video'); video.src = url.href; video.controls = true; video.playsInline = true; video.preload = 'metadata';
      video.setAttribute('aria-label', `${script.title} video showcase`);
      const poster = safeUrl(script.thumbnail); if (poster) video.poster = poster.href;
      video.addEventListener('error', () => emptyState('Video unavailable', 'This video could not be loaded. Please try again later.'), { once: true });
      content.append(video);
      video.play().catch(() => {});
    } else emptyState('Video unavailable', 'This video link is not supported. Please check back later.');
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
    });
    render(button.dataset.filter);
  }));
  const featured = scripts.find(script => script.id === config.featuredId) || scripts[0];
  const featuredButton = document.getElementById('featured-play');
  if (featured) {
    document.getElementById('featured-title').textContent = featured.title;
    featuredButton.setAttribute('aria-label', `Watch ${featured.title}`);
    featuredButton.addEventListener('click', () => openVideo(featured, featuredButton));
    const thumbnail = safeUrl(featured.thumbnail);
    if (thumbnail) {
      const image = document.querySelector('.stage-art'); image.src = thumbnail.href; image.alt = ''; image.style.objectFit = 'cover';
      image.addEventListener('error', () => { image.src = 'assets/orbit.svg'; image.style.objectFit = 'contain'; }, { once: true });
    }
  } else { featuredButton.disabled = true; document.getElementById('featured-title').textContent = 'New showcases coming soon'; }
  const invite = safeUrl(config.discordInvite);
  const validInvite = invite && invite.protocol === 'https:' && ['discord.gg', 'discord.com', 'www.discord.com'].includes(invite.hostname) && (invite.hostname === 'discord.gg' ? /^\/[^/]+\/?$/.test(invite.pathname) : /^\/invite\/[^/]+\/?$/.test(invite.pathname));
  document.querySelectorAll('.discord-link').forEach(link => {
    if (validInvite) { link.href = invite.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else link.addEventListener('click', event => {
      event.preventDefault(); prepareDialog('The community', 'HOOKD DEVELOPMENT / DISCORD', '', link);
      emptyState('An invite is on the way', 'The Discord invite will be available here soon. Check back to join the community.', '✳');
    });
  });
  document.querySelector('.close-button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { content.replaceChildren(); document.body.style.overflow = ''; lastTrigger?.focus(); });
  render();
})();
