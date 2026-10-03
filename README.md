# Hookd Development — script showcase

A responsive, cinematic showcase site with black and grey styling, a filterable script gallery, video dialogs, and Discord invite buttons. Plain HTML, CSS, and JavaScript — no dependencies or build step.

## Quick setup

1. Open `config.js` in a text editor.
2. Paste your Discord invite into `discordInvite`.
3. Replace the example script titles and descriptions with your actual scripts.
4. Put a video URL or file path in each script’s `video` field.
5. Optionally add your own thumbnail images in `assets/` and set `thumbnail` to their path.

The three script names and artwork are example content. No videos or Discord invite have been supplied yet. Blank videos show a “Showcase coming soon” message; blank or invalid invites show an invite coming soon message. Set these before launching your site publicly.

## Supported video formats

```js
video: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
// OR
video: "https://youtu.be/YOUR_VIDEO_ID",
// OR
video: "https://vimeo.com/123456789",
// OR (unlisted Vimeo: use the embed URL with its h query parameter)
video: "https://player.vimeo.com/video/123456789?h=YOUR_HASH",
// OR (add your file to assets/videos/)
video: "assets/videos/my-showcase.mp4",
```

Use one value per script, not all of the above. YouTube video IDs must be 11 characters. YouTube and Vimeo videos must allow embedding; private videos may require viewers to sign in. MP4, WebM, and Ogg video files use the browser’s native controls. YouTube/Vimeo are recommended for large files so your repository stays small. Provide captions on the video hosting service, or add a WebVTT `<track>` in `app.js` if using local files.

## Add another showcase

Copy one complete object in the `scripts` array in `config.js`. Give it a unique `id`. Categories supported by the filter buttons are `Gameplay`, `Utilities`, and `Interface`. Additional categories still appear under All; edit the filter buttons in `index.html` to add a matching filter. Themes are `neutral`, `graphite`, and `silver`. Set `featuredId` to the script ID you want in the main spotlight.

```js
{
  id: "my-script",
  title: "My Script",
  category: "Gameplay",
  description: "What this script does.",
  label: "MY SCRIPT / SHOWCASE",
  video: "assets/videos/my-script.mp4",
  thumbnail: "assets/my-thumbnail.jpg",
  theme: "neutral"
}
```

Separate objects with commas. Keep quotes around text. Use an invite such as `https://discord.gg/your-code` or `https://discord.com/invite/your-code`.

## Upload to GitHub and deploy with Netlify

1. Create your GitHub repository.
2. Upload **the contents of this folder** to the repository root. `index.html`, `config.js`, and `netlify.toml` should sit at the top level, alongside the `assets` folder.
3. In Netlify, import the repository as a new project from GitHub.
4. Leave the build command empty. Publish directory: `.` (the included `netlify.toml` sets this).
5. Deploy. Later commits to your connected production branch update the site automatically.

If you keep this folder nested inside the repository, set Netlify’s base directory to that folder. Alternatively, drag this entire folder into Netlify’s manual deploy interface.

Netlify documentation: https://docs.netlify.com/build/configure-builds/overview/

## Preview locally

You can open `index.html` directly for a quick look. For a realistic preview (especially videos), run a local web server from this folder:

```sh
python -m http.server 8080
```

Then open `http://localhost:8080`. Press Ctrl+C to stop the server.

## Customize the look

- Main colors and font choices are CSS variables at the top of `styles.css`.
- Headline and page copy live in `index.html`.
- Brand name, videos, descriptions, and Discord link live in `config.js`.
- Set the default title and meta description in `index.html` when changing the brand.
- Google Fonts are loaded from Google’s servers; the page falls back to system fonts when offline.
- `assets/orbit.svg` is original decorative preview artwork. Replace it or use your own video thumbnails.
- The gallery supports keyboard navigation, visible focus styles, native modal focus trapping, Escape to close, and reduced-motion settings.

This is a static showcase. Editing videos means changing `config.js` and committing the files; there is no visitor upload system or admin login. All files and URLs in this project are public, so never place secrets in them.
