import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures";

// Seeks every Web Animation on the intro to a fixed time, so each screenshot is
// a deterministic frame regardless of machine speed.
async function seek(page: Page, ms: number) {
  await page.evaluate((t) => {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t;
    }
  }, ms);
}

test.describe("IntroLoader wordmark font", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "reference frames are Chromium-only");
  test.use({ viewport: { width: 1280, height: 800 } });
  // Forced serial: concurrent headless Chromium workers racing on the same
  // paused-animation screenshot were observed to collapse the 2500ms and
  // 3500ms frames to identical pixels (a rendering-pipeline timing artifact
  // under parallel load, verified by re-running with --workers=1). Serial
  // execution makes each frame's capture deterministic.
  test.describe.configure({ mode: "serial" });

  for (const ms of [500, 2500, 3500]) {
    test(`frame at ${ms}ms is unchanged`, async ({ page }) => {
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await seek(page, ms);
      await expect(page.locator('[class*="IntroLoader_overlay"]')).toHaveScreenshot(`intro-${ms}.png`, {
        animations: "allow",
      });
    });
  }
});
