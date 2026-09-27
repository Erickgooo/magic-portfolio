import { expect, test } from "./fixtures";

test("intro-pending clears when the intro starts fading (~4 s), not at the 7 s backstop", async ({
  page,
}) => {
  await page.goto("/");
  const t0 = Date.now();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("intro-pending")), {
      timeout: 8000,
    })
    .toBe(false);
  const elapsed = Date.now() - t0;
  expect(elapsed).toBeGreaterThan(3000);
  expect(elapsed).toBeLessThan(5500);
});

test("while the intro plays, hero animations are paused but the h1 is visible", async ({
  page,
}) => {
  await page.goto("/");
  const state = await page.$eval("h1 [data-kinetic-word]", (w) => ({
    playState: getComputedStyle(w).animationPlayState,
    opacity: getComputedStyle(w).opacity,
  }));
  expect(state.playState).toBe("paused");
  expect(state.opacity).toBe("1");
});

test("the IntroLoader still ignores prefers-reduced-motion (brand exemption)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator('[class*="IntroLoader_overlay"]')).toBeVisible();
});
