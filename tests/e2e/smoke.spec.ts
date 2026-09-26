import { expect, test } from "@playwright/test";
import type { ConsoleMessage } from "@playwright/test";
import { ROUTES } from "./helpers";

// Pre-existing console errors observed on this build, unrelated to the
// harness itself (see docs/perf-baseline.md § "Known console errors").
//
// Chromium's console text for a failed resource load is generic and does not
// include the resource's URL ("Failed to load resource: the server responded
// with a status of 404 (Not Found)" / "... 400 (Bad Request)"), so matching by
// text alone would silently swallow ANY new 404/400 on ANY page. Each entry
// below is therefore matched on the exact text AND the failing resource's
// URL, and (for the gallery-only entries) the route as well — anything that
// doesn't match on all of those still fails the test.
//
// The failing resource's URL comes from `msg.location().url` for a
// "Failed to load resource" message (that's where Chromium puts it — the
// text itself doesn't carry it), and from the message text itself for the
// "Refused to execute script" message (Chromium embeds the URL directly in
// that text). Observed once via a throwaway debug script during development
// (not committed):
//   404 "Failed to load resource...": location().url = "http://localhost:3100/_vercel/insights/script.js"
//   400 "Failed to load resource..." (gallery): location().url =
//     "http://localhost:3100/_next/image?url=%2Fimages%2Fgallery%2FArtesa%20-%20Nuevo%20Men%C3%BA.jpg&w=640&q=75"
//     "http://localhost:3100/_next/image?url=%2Fimages%2Fgallery%2FArtesa%20-%20D%C3%ADa%20de%20la%20Madre.jpg&w=640&q=75"
interface KnownConsoleError {
  text: string;
  /** Substring identifying the failing resource, checked against location().url and, as a
   * fallback, the message text itself (Chromium exposes the URL differently per message type). */
  urlIncludes: string;
  /** Restrict this exclusion to one route; omit to apply on every page. */
  route?: (typeof ROUTES)[number]["name"];
}

const KNOWN_CONSOLE_ERRORS: KnownConsoleError[] = [
  // @vercel/analytics requests this script; it exists only when served by
  // Vercel, so it 404s locally and is then refused for its resulting MIME type.
  {
    text: "Failed to load resource: the server responded with a status of 404 (Not Found)",
    urlIncludes: "/_vercel/insights/script.js",
  },
  {
    text: "Refused to execute script from 'http://localhost:3100/_vercel/insights/script.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.",
    urlIncludes: "/_vercel/insights/script.js",
  },
  // Gallery only: two images are PNG files saved with a `.jpg` extension
  // (`Artesa - Nuevo Menú.jpg`, `Artesa - Día de la Madre.jpg`); Next's
  // built-in `/_next/image` optimizer 400s them. Scoped to the exact
  // (URL-encoded) filename and to the gallery route, so a 400 for any other
  // resource, on any page, still fails the test.
  {
    text: "Failed to load resource: the server responded with a status of 400 (Bad Request)",
    urlIncludes: "Artesa%20-%20Nuevo%20Men%C3%BA.jpg",
    route: "gallery",
  },
  {
    text: "Failed to load resource: the server responded with a status of 400 (Bad Request)",
    urlIncludes: "Artesa%20-%20D%C3%ADa%20de%20la%20Madre.jpg",
    route: "gallery",
  },
];

function isKnownConsoleError(msg: ConsoleMessage, routeName: string): boolean {
  const text = msg.text();
  const locationUrl = msg.location().url;
  return KNOWN_CONSOLE_ERRORS.some(
    (known) =>
      (!known.route || known.route === routeName) &&
      text === known.text &&
      (locationUrl.includes(known.urlIncludes) || text.includes(known.urlIncludes)),
  );
}

for (const route of ROUTES) {
  test(`smoke: ${route.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !isKnownConsoleError(msg, route.name)) errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}
