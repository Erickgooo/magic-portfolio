# Performance report

## Fase A — Quick wins (`perf/quick-wins`)

### Lighthouse (median of 3), local `next start`, same machine

- **Date:** 2026-09-26
- **Target:** this worktree's own fresh build (`npm run build && npm run start -- -p 3100`), `http://localhost:3100`
- **Tool:** Lighthouse 12.8.2 CLI (`scripts/perf/lighthouse.mjs`), headless Edge (`CHROME_PATH` = Edge, same binary as `base-local`), default simulated throttling (mobile = Moto G Power / slow 4G; desktop = `--preset=desktop`)
- **Method:** `LH_TAG=quickwins-local npm run perf:lh` (3 runs per page × form factor = 30 reports, all 30 written), `npm run perf:report -- quickwins-local base-local`. Lighthouse's Chrome/Edge process again exited non-zero on every run with the same pre-existing Windows temp-dir `EPERM` cleanup error documented in `docs/perf-baseline.md`; judged by report-file existence, as that doc specifies.

| Página | FF | base-local (Perf / A11y / LCP / CLS / TBT / JS / Total) | quickwins-local (Perf / A11y / LCP / CLS / TBT / JS / Total) |
|---|---|---|---|
| home | mobile | 67 / 96 / 5.38 s / 0.226 / 84 ms / 344 KB / 3812 KB | 84 / 100 / 4.21 s / 0.012 / 19 ms / 344 KB / 756 KB |
| home | desktop | 96 / 100 / 0.96 s / 0.111 / 0 ms / 344 KB / 3542 KB | 99 / 100 / 0.85 s / 0.014 / 0 ms / 344 KB / 764 KB |
| about | mobile | 70 / 96 / 4.84 s / 0.218 / 90 ms / 342 KB / 799 KB | 74 / 100 / 4.36 s / 0.197 / 21 ms / 342 KB / 805 KB |
| about | desktop | 96 / 100 / 0.88 s / 0.114 / 0 ms / 342 KB / 795 KB | 99 / 100 / 0.87 s / 0.003 / 0 ms / 342 KB / 801 KB |
| work | mobile | 52 / 96 / 6.54 s / 0.774 / 89 ms / 344 KB / 1129 KB | 78 / 100 / 5.58 s / 0.001 / 20 ms / 344 KB / 1016 KB |
| work | desktop | 75 / 100 / 1.37 s / 0.509 / 0 ms / 344 KB / 1315 KB | 98 / 100 / 1.14 s / 0.000 / 0 ms / 344 KB / 1031 KB |
| blog | mobile | 71 / 86 / 4.74 s / 0.214 / 75 ms / 347 KB / 644 KB | 84 / 100 / 4.37 s / 0.001 / 20 ms / 347 KB / 638 KB |
| blog | desktop | 96 / 90 / 0.94 s / 0.114 / 0 ms / 347 KB / 642 KB | 99 / 100 / 0.87 s / 0.001 / 0 ms / 347 KB / 637 KB |
| gallery | mobile | 70 / 96 / 4.81 s / 0.214 / 98 ms / 1233 KB / 1855 KB | 82 / 100 / 4.74 s / 0.000 / 18 ms / 342 KB / 645 KB |
| gallery | desktop | 94 / 100 / 1.17 s / 0.114 / 0 ms / 1291 KB / 2384 KB | 98 / 100 / 1.13 s / 0.000 / 0 ms / 342 KB / 1060 KB |

Read alongside `docs/perf-baseline.md`'s own caveat: this local run is noisier and slower across the board than production (no CDN/edge caching, shared dev machine running Playwright/Edge/Node concurrently), so it is a same-machine before/after comparison, not a stand-in for the mobile Perf ≥ 95 / LCP < 2.0 s / CLS < 0.05 / TBT < 200 ms budget in the task brief — that budget is checked against the Vercel Preview in Step 7 (out of scope for this task; see "Open items"). Even so, every metric improved or held on this machine: A11y is 100 on every page (was 86–96), mobile CLS dropped from 0.214–0.774 to 0.000–0.197 (all pages now pass the < 0.05 budget except `about` mobile, at 0.197 — see concerns), TBT roughly halved everywhere it was non-zero, and mobile Total bytes fell sharply (home 3812→756 KB, gallery 1855→645 KB). Mobile Perf scores rose 12–26 points per page but are still below the 95 budget on every page (74–84 on this machine); LCP is still 4.2–5.6 s on this loaded local machine, also below the < 2.0 s budget — both are expected to look materially different on the Preview's isolated, CDN-served environment, but that comparison has not been run yet (Step 7).

### Lighthouse (median of 3), Vercel Preview vs production baseline

**Not run.** Per the controller's task split, this task (Task 11, Steps 1–5) stops before push/Preview/Step 7. The Preview Lighthouse run, its comparison against `docs/perf-baseline.md`'s production table, and the mobile Perf ≥ 95 / LCP < 2.0 s / CLS < 0.05 / TBT < 200 ms / First Load JS ≤ baseline budget check against a production-like environment are deferred to whoever runs Steps 6–8.

### First Load JS (`next build`)

| Route | Baseline | Quick wins | Δ |
|---|---|---|---|
| `/` | 311 kB | 311 kB | 0 |
| `/about` | 275 kB | 275 kB | 0 |
| `/work` | 309 kB | 310 kB | **+1 kB** |
| `/blog/[slug]` | 312 kB | 312 kB | 0 |
| `/gallery` | 286 kB | 286 kB | 0 |

`/work/[slug]` (not in the budget table) also moved 309 kB → 310 kB, same +1 kB. All other routes are unchanged or match baseline exactly. The `/work` +1 kB is a real, budget-missing regression (see "Concerns" below) — most likely from `YouTubeFacade.tsx`/`ProjectCard.tsx` additions shared with `/work`'s bundle; not chased further since Step 11 is verification-only, not a code-change task.

### Assets

| | Baseline | Quick wins |
|---|---|---|
| `public/` total | 109 MB | 54 MB |
| Home video bytes on load | ~3.5 MB | 0 |
| Gallery JS incl. third parties | ~1212 KB | 342 KB |

### Video audio decisions

Source: `.perf/video-decisions.txt` (Task 2/3 optimization pass, plus the Task 3 fix round).

```
public/videohome.mp4: 3.44MB -> mp4 3.47MB / webm 4.42MB | crf 32 | 1280x720 | audio: none -> REMOVED  !! OVER TARGET
public/images/projects/project-01/leadbot.mp4: 3.31MB -> mp4 2.34MB / webm 4.12MB | crf 32 | 1402x720 | audio: none -> REMOVED  !! OVER TARGET
public/images/projects/project-01/chatbot-artesa.mp4: 0.23MB -> mp4 0.25MB / webm 0.29MB | crf 26 | 640x360 | audio: none -> REMOVED
public/images/projects/cuatrimotos-project/chatbot-video.mp4: 1.02MB -> mp4 0.90MB / webm 1.37MB | crf 28 | 854x480 | audio: none -> REMOVED
public/images/projects/project-01/video-01.mp4: 14.12MB -> mp4 6.97MB / webm 8.25MB | crf 32 | 1804x1080 | audio: none -> REMOVED  !! OVER TARGET

--- fix round 1 (2026-09-26) ---
Issue: canPlayWebm() preferred WebM for every non-Apple browser, but the VP9 pass produced a
LARGER file than the MP4 for all 5 videos, and 2 of the 5 MP4 re-encodes were themselves larger
than the pre-task originals. Fixed optimize-videos.mjs: (a) an MP4 re-encode is discarded and the
original bytes kept if the encode isn't strictly smaller ("KEPT ORIGINAL"); (b) a WebM sibling is
kept only if it ends up >=10% smaller than the final MP4, with one retry at crf+14 (vs the
original crf+8) before giving up and deleting it.

public/videohome.mp4: mp4 3,611,663 B -> 3,639,353 B at crf 32 (LARGER) -> KEPT ORIGINAL (3,611,663 B, 3.44MB) | 1280x720 | audio: none | !! OVER TARGET (1.2MB target)
  webm retry 1 (crf 40): 4,639,192 B (bigger than mp4, fail)
  webm retry 2 (crf 46): 3,433,590 B vs threshold 3,250,497 B (90% of mp4) -> still fails -> WEBM DELETED, not referenced

public/images/projects/project-01/leadbot.mp4: mp4 3,466,938 B -> 2,455,421 B at crf 32 -> KEPT RECOMPRESSED (shrank) | 1402x720 | audio: none | !! OVER TARGET (1.2MB target)
  webm retry 1 (crf 40): 4,321,492 B (bigger than mp4, fail)
  webm retry 2 (crf 46): 2,978,325 B vs threshold 2,209,879 B (90% of mp4) -> still fails -> WEBM DELETED, not referenced

public/images/projects/project-01/chatbot-artesa.mp4: mp4 242,932 B -> 262,976 B at crf 26 (LARGER) -> KEPT ORIGINAL (242,932 B, 0.23MB) | 640x360 | audio: none
  webm retry 1 (crf 34): 299,882 B (bigger than mp4, fail)
  webm retry 2 (crf 40): 229,285 B vs threshold 218,639 B (90% of mp4) -> still fails -> WEBM DELETED, not referenced

public/images/projects/cuatrimotos-project/chatbot-video.mp4: mp4 1,068,851 B -> 947,740 B at crf 28 -> KEPT RECOMPRESSED (shrank) | 854x480 | audio: none
  webm retry 1 (crf 36): 1,438,050 B (bigger than mp4, fail)
  webm retry 2 (crf 42): 902,973 B vs threshold 852,966 B (90% of mp4) -> still fails -> WEBM DELETED, not referenced

public/images/projects/project-01/video-01.mp4: mp4 14,805,693 B -> 7,304,559 B at crf 32 -> KEPT RECOMPRESSED (shrank) | 1804x1080 | audio: none | !! OVER TARGET (4MB target) | unreferenced in src (rg check), deletion candidate
  webm retry 1 (crf 40): 8,649,579 B (bigger than mp4, fail)
  webm retry 2 (crf 46): 5,952,327 B vs threshold 6,574,103 B (90% of mp4) -> PASSES (18.5% smaller) -> WEBM KEPT

Final state: only public/images/projects/project-01/video-01.webm is kept and referenced (though
video-01.mp4 itself is unreferenced in src, so this webm currently ships to nobody either — flagged
alongside the mp4 as part of the same deletion candidate). public/videohome.webm and the other two
project WebMs no longer exist; src/app/page.tsx no longer passes `webm` to LazyVideo for Home.
```

On top of the recompression above, Task 6/7's lazy-video work (`preload="none"`, play only once in viewport, no autoplay under reduced-motion/save-data) means the Home video downloads **0 bytes on load** regardless of its 3.44 MB file size — confirmed both by `tests/e2e/lazy-video.spec.ts` (passing on chromium/mobile-chromium/firefox in this run) and by the Home "Media" transfer column not appearing among Lighthouse's byte totals above.

### Security checks

Source: `.perf/security-notes.txt` (Task 3 Step 8, server-side RouteGuard/protected-route verification) plus this task's Steps 2–3.

**Task 3 Step 8 summary (full text in `.perf/security-notes.txt`):**
- Without an auth cookie: `/work` returns `200` with `Cache-Control: no-store`, and 0 matches for protected content (`LeadBot AI`) across plain HTML, a dynamic child route (`/work/leadbot-ai`), and the RSC payload (`RSC: 1` header) — protected content is never sent to an unauthenticated request in any response shape.
- With a valid cookie (via `/api/authenticate` with the correct password, `200`): `/work` then returns ≥1 match for the protected content — the unlock path works.
- Disabled-route check (`/gallery: false`): comparing the new synchronous `RouteGuard` against the old (pre-fix) version at commit `e1a6d5a`, both return HTTP `200`, but only the new version renders the NotFound UI as real, visible server HTML (outside `<script>` tags) — the old version's server HTML instead contains the loading Spinner, with NotFound only present inside the client-hydration JSON payload. This is exactly the CLS root cause (0.214 footer shift) that Task 3 fixes; the branch's disabled-route status code is not worse than pre-fix (both 200).
- Cleanup was verified: temporary env-var-only credentials were never written to `.env.local`; `protectedRoutes.ts`/`once-ui.config.ts` test edits were reverted (confirmed via `git status --short`); `RouteGuard.tsx` restored to the fixed version; a final `npm run build` left the tree in the fixed, rebuilt state; test ports (3100, 3300) verified free afterward.

**Task 11 Steps 2–3 (this run):**
- **Step 2 — security headers vs production:** `curl -sI https://www.erickmahecha.com/` vs `curl -sI http://localhost:3100/` for `content-security-policy`, `x-frame-options`, `x-content-type-options`, `referrer-policy`, `permissions-policy`, `strict-transport-security`, `x-dns-prefetch-control`. Only one byte-level diff: `X-Dns-Prefetch-Control` (production, likely re-cased by Vercel's edge) vs `X-DNS-Prefetch-Control` (this branch, from Next.js directly) — HTTP header names are case-insensitive per RFC 7230, so this is not a functional difference. Every header's **value** is byte-identical, including the full CSP string. Not `HEADERS IDENTICAL` verbatim from `diff`, but semantically identical.
- **Step 3 — auth endpoints, branch vs production:**
  | Endpoint | Local branch (3100) | Production |
  |---|---|---|
  | `GET /api/check-auth` | 401 | 401 |
  | `POST /api/authenticate` (wrong password) | 500 | 500 |

  Codes match production in both cases — no regression. (The `500` on a wrong password, on both branch and production, is pre-existing behavior, not introduced by this branch; not investigated further as it's identical on both sides.)
- **Chatbot live check:** deferred to the Preview (Step 7, out of scope here) — this worktree has no `.env.local` (confirmed: only `.env.example` is present) and the brief requires it never be read, created, or copied.
- **`npm audit`:** see "Open items" — the `--omit=dev` count is **not** zero as the brief anticipated; the 3 production-dependency vulnerabilities are unrelated to this branch's new devDependencies (confirmed pre-existing: `package.json`'s `dependencies` and `overrides` are byte-identical to `main`; only `devDependencies` gained `@playwright/test` and `lighthouse`).

### Open items

- `videohome.mp4` remains **OVER TARGET** (3.44 MB, original kept — the recompression attempt was larger and was discarded; 0 bytes on load thanks to lazy-load). Meeting the 1.2 MB target needs a resolution/trim decision by the owner.
- `leadbot.mp4` is 2.34 MB (**OVER TARGET**); `video-01.mp4`/`.webm` are unreferenced anywhere in `src` — deletion candidates (Erick decides).
- The owner condition "font preloaded when the intro renders" is **not met**: the app emits no `rel=preload as=font` tag anywhere in the served HTML (confirmed by grep against the local branch server's `/` response — the only `rel=preload` present is for a script chunk). This is **pre-existing, not a regression** introduced by this branch. Option: declare the fonts via `next/font` in the root layout (`src/app/layout.tsx`), either as part of Plan 2 or as a separate follow-up change.
- `public/images/og/home.jpg` (1.6 aspect ratio) is cropped ~10% by the 16:9 carousel on the oldest `/work` card; the Plan 2 index change is expected to replace this carousel.
- `npm audit`: **full** `npm audit` reports **24 vulnerabilities (17 moderate, 6 high, 1 critical)**. `npm audit --omit=dev` reports **3 vulnerabilities (2 high, 1 critical)** — **not 0**, contrary to what the brief anticipated. These 3 (`next` critical RCE advisory, `sharp` high, `js-yaml` via `gray-matter`) are pre-existing production-dependency issues, unrelated to this branch (verified: `package.json`'s `dependencies`/`overrides` sections are unchanged from `main`; only `devDependencies` gained `@playwright/test` and `lighthouse`). The remaining 21 (17 moderate + 4 high) come from the new devDependencies' own dependency chain (Lighthouse → puppeteer-core → `@puppeteer/browsers` → `extract-zip`), all dev-only, not shipped to production.
- iOS YouTube single-tap check pending (Erick, on the Preview); `MUTE_ON_IOS = false` in `src/components/YouTubeFacade.tsx`.
- Extra line-level `biome-ignore` suppressions added in Task 1 (FaqChatbot regex loop, greeting bubble) and import-order-only formatting of the middleware/auth route files.
- **New, found during this task's Step 1 gate run:** `/work` and `/work/[slug]` First Load JS grew **309 kB → 310 kB** (+1 kB), a small miss against the "≤ baseline" budget. Every other route matches or beats baseline exactly. Not chased further — Task 11 is verification-only.
- **New, found during this task's Step 1 gate run:** `tests/e2e/intro-font.spec.ts` failed on `mobile-chromium` (3 tests) — a genuine test defect from Task 10, not a product regression: its `test.skip(({ browserName }) => browserName !== "chromium", …)` only excludes Firefox/WebKit, because `mobile-chromium`'s underlying engine is also named `"chromium"` by Playwright, but Task 10 only captured/committed baseline screenshots for the desktop `chromium` project. Fixed here by skipping on `testInfo.project.name !== "chromium"` instead (same pattern already used in `tests/e2e/a11y-names.spec.ts`), matching the test's own stated intent ("reference frames are Chromium-only" = one desktop project, not every Chromium-engine project). No product code changed. Full suite is green after the fix: 105 passed, 27 skipped (declared), 0 failed.
