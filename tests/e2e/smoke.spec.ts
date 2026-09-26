import { expect, test } from "@playwright/test";
import { ROUTES } from "./helpers";

// Pre-existing console errors observed on this build, unrelated to the
// harness itself (see docs/perf-baseline.md § "Known console errors").
// Excluded by exact message text so any NEW console error still fails the test.
const KNOWN_CONSOLE_ERRORS = [
  // @vercel/analytics requests this script; it exists only when served by
  // Vercel, so it 404s locally and is then refused for its resulting MIME type.
  "Failed to load resource: the server responded with a status of 404 (Not Found)",
  "Refused to execute script from 'http://localhost:3100/_vercel/insights/script.js' because its MIME type ('text/html') is not executable, and strict MIME type checking is enabled.",
  // Gallery only: two images are PNG files saved with a `.jpg` extension
  // (`Artesa - Nuevo Menú.jpg`, `Artesa - Día de la Madre.jpg`); Next's
  // built-in `/_next/image` optimizer 400s them.
  "Failed to load resource: the server responded with a status of 400 (Bad Request)",
];

for (const route of ROUTES) {
  test(`smoke: ${route.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !KNOWN_CONSOLE_ERRORS.includes(msg.text())) errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}
