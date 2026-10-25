# Lofi Skylines

Pixel-art city nights with endless lofi music, generated live in your browser.
A small, free, open-source tribute to [Lofi Cities](https://loficities.com).

**Live:** <https://lofi-skylines.mrsheerluck003.workers.dev>
**Source:** <https://github.com/MrSheerluck/lofi-skylines>

Three hand-built scenes — Tokyo in neon rain, Paris at blue hour, and the
Brooklyn Bridge in snow — each drawn pixel by pixel on a 480 × 270 canvas.
Every note is synthesized with the Web Audio API. No samples, no streams, no
account, no ads.

![Lofi Skylines](public/assets/og.png)

## What's inside

- **Three animated pixel cities** with rain, snow, clouds, traffic, trains,
  pedestrians, birds, blinking signs, reflections, and falling petals.
- **Endless generative lofi** in three styles: jazzhop, felt piano, ambient.
  Chords, bass, drums, melodies, vinyl crackle, and city ambience are scheduled
  live with the Web Audio API.
- **City picker** with live previews and local times.
- **Weather** (rain, snow, clear) that changes the scene and the sound bed.
- **City tour**, a 25/50-minute focus timer, keyboard shortcuts, volume
  controls, shareable city links, and a downloadable 1920 × 1080 postcard.
- **No build step, no tracking, no third-party requests.** The site is plain
  HTML, CSS, ES modules, Canvas, and Web Audio.

## Run locally

```sh
npm install
npm run dev
```

Open the URL Wrangler prints (usually <http://localhost:8787>). Audio starts on
the first click, as browsers require.

You can also use any static file server:

```sh
python3 -m http.server 8899 --directory public
```

## Deploy to Cloudflare (free)

This repo is set up for **Cloudflare Workers static assets**, which is free for
this kind of site and gives you a `*.workers.dev` URL plus optional custom
domains.

```sh
npx wrangler login
npm run deploy
```

`wrangler.jsonc` serves everything in `public/` and falls back to
`index.html` for unknown paths. No Worker script is needed. The first deploy
asks you to create a Workers subdomain if you do not have one.

### Deploy from the dashboard

1. Push this repository to GitHub.
2. In Cloudflare, go to **Workers & Pages → Create → Workers → Connect to Git**.
3. Pick the repository.
4. Leave the build command empty and set the deploy command to `npx wrangler deploy`.
5. Deploy. Future pushes can redeploy automatically.

Alternatively, create a **Pages** project from the repo with no build command
and `public` as the output directory.

### Custom domain

In the Cloudflare dashboard, open the deployed Worker → **Settings → Domains &
Routes → Add custom domain**. Any domain on your Cloudflare account works over
HTTPS for free.

## Make it yours

| File | What to change |
| --- | --- |
| `public/index.html` | Copy, links, meta tags, and the GitHub URL. |
| `public/styles.css` | Colors, type, spacing, and the UI accent. |
| `public/js/cities.js` | City names, subtitles, time zones, guides, accents. |
| `public/js/scenes.js` | Canvas art and animation per city. |
| `public/js/titles.js` | Track-name pools and style labels. |
| `public/js/audio.js` | Chord progressions, instruments, ambience, and mixes. |

The GitHub links in `index.html` point at this repository. If you fork the
project, update them to point at your fork.

### Adding a city

1. Add a city entry to `CITIES` in `public/js/cities.js`.
2. Add a palette in `SKY_DEFS` in `public/js/scenes.js`.
3. Write a `drawYourCity(ctx, t, weather, reducedMotion)` function and add it
   to the dispatcher in `drawScene`.
4. Add title pools to `TITLES` in `public/js/titles.js`.

Everything else — the picker, deep links, local time, tour, weather, and track
titles — follows automatically.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / pause |
| `N` | Next track |
| `C` | Choose a city |
| `W` | Change weather |
| `V` | Change vibe |
| `T` | Focus timer |
| `F` | Fullscreen |
| `M` | Mute / unmute |
| `A` | City sounds on / off |
| `1` `2` `3` | Jump to a city |
| `←` `→` | Previous / next city |
| `?` | Shortcuts |
| `Esc` | Close a panel |

## Notes

- Audio needs a user gesture. Click the play button once; after that the
  Web Audio graph runs until you pause it.
- `prefers-reduced-motion` freezes the scene and disables decorative motion.
- Local state (city, weather, volume, vibe) is stored in `localStorage` only.
  There is no backend, no analytics, and no cookie.
- The site intentionally has no framework or bundler. It should run on any
  static host, not just Cloudflare.

## Credit

Design inspiration: [Lofi Cities](https://loficities.com) by Safa El Mali.
This is an independent, from-scratch homage; it does not include any assets
from the original site. All pixel art in this project is drawn in code, and
all audio is synthesized live.

MIT licensed. See [LICENSE](LICENSE).
