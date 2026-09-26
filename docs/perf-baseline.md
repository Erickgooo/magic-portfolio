# Performance baseline — erickmahecha.com

- **Date:** 2026-09-26
- **Target:** production, `https://www.erickmahecha.com` (content of commit `ae7350e`, see verification note)
- **Tool:** Lighthouse 12.8.2 CLI, headless Edge 153, default simulated throttling (mobile = Moto G Power / slow 4G; desktop = `--preset=desktop`)
- **Method:** 3 runs per page × form factor; **median** reported. Blog post measured: `/blog/my-workspace`.
- Transfer sizes are from the Lighthouse network log (compressed, as served), including third parties (YouTube embeds on Gallery).

## Lighthouse (median of 3)

| Página | Form factor | n | Perf | A11y | LCP | CLS | TBT | FCP | JS (transfer) | Img | Media | Total | Elemento LCP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| home | mobile | 3 | 80 | 96 | 3.41 s | 0.224 | 55 ms | 1.13 s | 324 KB | 119 KB | 3530 KB | 4228 KB | I'm Erick, a one-person growth department. At Quic |
| home | desktop | 3 | 99 | 100 | 0.72 s | 0.062 | 0 ms | 0.36 s | 324 KB | 130 KB | 3515 KB | 4223 KB | I Build Marketing Infrastructure From Zero. And Ma |
| about | mobile | 3 | 78 | 96 | 3.55 s | 0.240 | 88 ms | 1.28 s | 323 KB | 10 KB | 0 KB | 576 KB | I'm a one-person growth department. I've built com |
| about | desktop | 3 | 96 | 100 | 0.73 s | 0.113 | 0 ms | 0.36 s | 323 KB | 6 KB | 0 KB | 571 KB | I'm a one-person growth department. I've built com |
| work | mobile | 3 | 67 | 96 | 3.91 s | 0.497 | 84 ms | 1.13 s | 323 KB | 260 KB | 238 KB | 1099 KB | Quick Metal Shop: Engineering Virality with AI |
| work | desktop | 3 | 78 | 100 | 1.02 s | 0.459 | 0 ms | 0.36 s | 323 KB | 422 KB | 238 KB | 1284 KB | Quick Metal Shop: Engineering Virality with AI |
| blog | mobile | 3 | 76 | 86 | 4.13 s | 0.214 | 66 ms | 1.13 s | 327 KB | 93 KB | 0 KB | 660 KB | My Workspace: The System Behind My Creative & AI W |
| blog | desktop | 3 | 96 | 90 | 0.80 s | 0.113 | 0 ms | 0.36 s | 327 KB | 91 KB | 0 KB | 658 KB | My Workspace: The System Behind My Creative & AI W |
| gallery | mobile | 3 | 78 | 96 | 3.51 s | 0.214 | 77 ms | 1.16 s | 1212 KB | 268 KB | 0 KB | 1869 KB | This section collects paid ad creatives, short-for |
| gallery | desktop | 3 | 94 | 100 | 1.06 s | 0.114 | 0 ms | 0.39 s | 1212 KB | 815 KB | 0 KB | 2478 KB | Artesa Panadería December campaign creative |

> INP is a field metric; Lighthouse lab runs report **TBT** as its proxy. Field INP will be read from Vercel Speed Insights / CrUX if available.

## First Load JS (`next build`, Next.js 15.5.23, gzip)

| Route | Page size | First Load JS |
|---|---|---|
| `/` | 2.25 kB | **311 kB** |
| `/about` | 1.44 kB | **275 kB** |
| `/work` | 176 B | **309 kB** |
| `/work/[slug]` | 176 B | 309 kB |
| `/blog` | 1.71 kB | 310 kB |
| `/blog/[slug]` | 3.38 kB | **312 kB** |
| `/gallery` | 2.72 kB | **286 kB** |
| Shared by all | — | 112 kB |
| Middleware | — | 34.7 kB |

## Assets

- `public/` total: **109 MB**
- Largest offenders: `images/projects/qms-arquiexpo/2.png` 17.3 MB · `images/projects/project-01/video-01.mp4` 14.8 MB · `videohome.mp4` 3.6 MB (loaded on Home with `preload="auto"`, ~3.5 MB per visit) · `images/projects/project-01/leadbot.mp4` 3.5 MB · gallery PNGs 1.0–2.0 MB each · `images/blog/PC.jpg` 1.6 MB · `images/avatar.jpg` 532 KB.
- `next.config.mjs` has **no** `images.formats` → Next serves WebP only, never AVIF.

## Root causes found while measuring

1. **CLS 0.21–0.50 on every page, mobile.** The top shift (0.214, identical on every route) is the `<footer>`: `RouteGuard` renders a spinner during SSR and only swaps in the page after hydration (`useEffect` → `setLoading(false)`), so the whole page body appears late and pushes the footer down. `/work` adds ~0.28 more from project cards resizing.
2. **Mobile LCP 3.4–4.1 s** has the same root cause: the LCP element (hero text) is not in the server HTML at all; it paints only after JS downloads, parses and hydrates.
3. **Gallery ships ~1.2 MB of JS** — ~950 KB of it is YouTube iframe player code loaded eagerly for every embed.
4. **Home downloads ~3.5 MB of video** on load (`preload="auto"` + autoplay).
5. Minor: FaqChatbot teaser bubble shifts 0.037 on every page.

## Known console errors

Found running the Playwright smoke test (`tests/e2e/smoke.spec.ts`) against `npm run build && npm run start -- -p 3100`. Both are pre-existing, unrelated to the Task 2 harness. Chromium's console text for a failed resource load is generic and does not include the resource's URL, so the test excludes each one by exact message text **AND** the failing resource's URL (from `msg.location().url`, or from the message text itself when Chromium embeds the URL there directly) — see the `KNOWN_CONSOLE_ERRORS` / `isKnownConsoleError` comments in the spec file. Any 404/400 for a different resource, or on a different page than specified, still fails the test.

1. **`@vercel/analytics` script 404 (all pages).** The client injects a request for `/_vercel/insights/script.js`; that script only exists when served by Vercel, so locally it 404s, and the browser then logs a second console error refusing to execute it (`text/html` MIME type from the 404 page). Messages, both scoped to `urlIncludes: "/_vercel/insights/script.js"`:
   - `Failed to load resource: the server responded with a status of 404 (Not Found)` — resource URL from `msg.location().url`: `http://localhost:3100/_vercel/insights/script.js`
   - `Refused to execute script from 'http://localhost:3100/_vercel/insights/script.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.` — Chromium's `location().url` for this message type is the *page's* URL, not the script's, but the script's URL is embedded directly in the text itself, which is what's matched.
2. **Gallery page: two images 400 via `/_next/image` (gallery route only).** `public/images/gallery/Artesa - Nuevo Menú.jpg` and `public/images/gallery/Artesa - Día de la Madre.jpg` are actually **PNG** files saved with a `.jpg` extension (confirmed via magic bytes: `89 50 4E 47 …`). The static file itself serves fine (`/images/gallery/...` → 200), and `sharp` decodes the bytes without error, but Next's built-in `/_next/image` optimizer does its own internal re-request of the file and its `detectContentType` check rejects it, returning `400` with body "The requested resource isn't a valid image." Message text is the same generic string for both, so each is scoped separately by its (URL-encoded) filename in `msg.location().url` **and** `route: "gallery"`:
   - `Failed to load resource: the server responded with a status of 400 (Bad Request)` — resource URLs observed: `http://localhost:3100/_next/image?url=%2Fimages%2Fgallery%2FArtesa%20-%20Nuevo%20Men%C3%BA.jpg&w=640&q=75` and `http://localhost:3100/_next/image?url=%2Fimages%2Fgallery%2FArtesa%20-%20D%C3%ADa%20de%20la%20Madre.jpg&w=640&q=75`
   - Not fixed in this task (out of scope for the measurement harness) — worth a follow-up: rename the files with a correct `.png` extension (or re-export them as real JPEGs) so `next/image` can optimize them.

## Local next start (same machine, for apples-to-apples comparison)

- **Date:** 2026-09-26
- **Target:** this worktree's own build (`npm run build && npm run start -- -p 3100`), `http://localhost:3100`
- **Tool:** Lighthouse 12.8.2 CLI (`scripts/perf/lighthouse.mjs`), headless Edge (`CHROME_PATH` = Edge 153), default simulated throttling (mobile = Moto G Power / slow 4G; desktop = `--preset=desktop`)
- **Method:** `LH_TAG=base-local npm run perf:lh` (3 runs per page × form factor = 30 reports), `npm run perf:report -- base-local` for the median table below.
- Lighthouse's Chrome/Edge process exited non-zero on every run due to a Windows temp-dir cleanup `EPERM` (`chrome-launcher`'s `destroyTmp` failing to `rmSync` its own temp profile dir after the browser already produced the report) — expected per the task brief; `lighthouse.mjs` judges success by the report JSON file existing, and all 30 files were written.

| Página | FF | Perf / A11y / LCP / CLS / TBT / JS / Total |
|---|---|---|
| home | mobile | 67 / 96 / 5.38 s / 0.226 / 84 ms / 344 KB / 3812 KB |
| home | desktop | 96 / 100 / 0.96 s / 0.111 / 0 ms / 344 KB / 3542 KB |
| about | mobile | 70 / 96 / 4.84 s / 0.218 / 90 ms / 342 KB / 799 KB |
| about | desktop | 96 / 100 / 0.88 s / 0.114 / 0 ms / 342 KB / 795 KB |
| work | mobile | 52 / 96 / 6.54 s / 0.774 / 89 ms / 344 KB / 1129 KB |
| work | desktop | 75 / 100 / 1.37 s / 0.509 / 0 ms / 344 KB / 1315 KB |
| blog | mobile | 71 / 86 / 4.74 s / 0.214 / 75 ms / 347 KB / 644 KB |
| blog | desktop | 96 / 90 / 0.94 s / 0.114 / 0 ms / 347 KB / 642 KB |
| gallery | mobile | 70 / 96 / 4.81 s / 0.214 / 98 ms / 1233 KB / 1855 KB |
| gallery | desktop | 94 / 100 / 1.17 s / 0.114 / 0 ms / 1291 KB / 2384 KB |

> This local run is slower/noisier than the production table above (no CDN, no edge caching, shared dev machine running Playwright/Edge/Node concurrently) — it is meant as this machine's own before/after baseline for later perf tasks, not a like-for-like comparison with the production numbers.

## Production verification (Fase 0.1)

- `git ls-remote origin main` → `ae7350e`.
- `ae7350e` only changes `public/images/avatar.jpg` (29,506 → 532,019 bytes). Production serves `/images/avatar.jpg` at exactly **532,019 bytes** → the deployed tree contains `ae7350e`.
- Caveat: the latest GitHub Deployment record from Vercel is for `fa4f820`; `ae7350e` has no deployment/status entry (likely a manual redeploy). Vercel CLI was not available to run `vercel inspect`.
