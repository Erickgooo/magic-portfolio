import { expect, test } from "./fixtures";

test.describe("home video", () => {
  test("downloads 0 video bytes on load and plays once scrolled into view", async ({
    page,
    browserName,
  }) => {
    const videoRequests: string[] = [];
    page.on("request", (r) => {
      if (/videohome\.(mp4|webm)/.test(r.url())) videoRequests.push(r.url());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(videoRequests).toEqual([]);

    const video = page.locator('[data-testid="home-video"] video');
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => videoRequests.length).toBeGreaterThan(0);
    test.skip(browserName === "webkit", "WebKit on Windows has no H.264 decoder");
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  });

  test("respects prefers-reduced-motion: no autoplay, accessible play button", async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const wrap = page.locator('[data-testid="home-video"]');
    await wrap.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(await wrap.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    const play = wrap.getByRole("button", { name: /play/i });
    await expect(play).toBeVisible();
    await play.focus();
    await page.keyboard.press("Enter");
    test.skip(browserName === "webkit", "WebKit on Windows has no H.264 decoder");
    await expect
      .poll(() => wrap.locator("video").evaluate((v: HTMLVideoElement) => !v.paused))
      .toBe(true);
  });

  test("reserves its box so it causes no layout shift", async ({ page }) => {
    await page.goto("/");
    const before = await page.locator('[data-testid="home-video"]').boundingBox();
    await page.locator('[data-testid="home-video"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const after = await page.locator('[data-testid="home-video"]').boundingBox();
    expect(Math.round(after?.height ?? 0)).toBe(Math.round(before?.height ?? -1));
  });
});
