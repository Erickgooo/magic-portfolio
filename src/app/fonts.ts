// Server-only font declarations — Manual de Marca, Sección 04:
// Space Grotesk (titulares), Inter (cuerpo/label), JetBrains Mono (datos).
//
// This module is owned by the root layout (imported only from
// src/app/layout.tsx) so the three font instances have a single, obvious
// source of truth, and `@/resources/once-ui.config.ts` merely re-exports
// them for backward compatibility (Task 11b).
//
// Task 11b root cause (verified, not the module-location theory): the
// built HTML had zero `<link rel="preload" as="font">` tags on this
// machine regardless of which module held these calls — moving them here
// alone did not fix it. Inspecting `.next/server/next-font-manifest.json`
// showed `"app": {}` (always empty), and the webpack module-graph request
// string for next/font-processed modules on Windows uses backslashes
// (`...\next-font-loader\index.js?...`), while
// `next/dist/build/webpack/plugins/next-font-manifest-plugin.js` tests
// `mod.request.includes('/next-font-loader/index.js?')` — a
// forward-slash-only substring. That check can never match on Windows, so
// the manifest is never populated and no preload/preconnect is ever
// emitted, independent of our source layout (matches vercel/next.js#57008,
// reproduced with three different module structures during this task).
// Worked around locally via `patches/next+15.5.23.patch`
// (patch-package) — see that file and docs/perf-report.md for detail. On
// Linux (Vercel Preview/production) request strings already use forward
// slashes, so the plugin's original code works there without the patch;
// it is a no-op on that platform.
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

export const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Measured with `preload: false` first (JetBrains Mono isn't visually used
// above the fold on Home/Gallery), but Lighthouse's layout-shifts audit then
// attributed a residual 0.033 About-mobile CLS to this exact font file
// swapping in late on the sticky meta panel. Preloading it removes that
// shift; see docs/perf-report.md, Follow-up 11b, for the measurements.
export const code = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});
