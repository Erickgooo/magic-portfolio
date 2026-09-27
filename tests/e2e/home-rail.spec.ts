import { expect, test } from "./fixtures";

for (const width of [390, 1023, 1024, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("rail is visible at >=1024px and hidden below", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto("/");
  await expect(page.locator("[data-home-rail]")).toBeVisible();
  await page.setViewportSize({ width: 1023, height: 900 });
  await expect(page.locator("[data-home-rail]")).toBeHidden();
});

test("the rail does not reduce the content column width", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const width = await page
    .locator("h1")
    .evaluate((h) => h.closest("section")?.getBoundingClientRect().width ?? 0);
  expect(width).toBeGreaterThan(700);
});

test("reduced motion: rail line is fully drawn", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const t = await page
    .locator("[data-home-rail] [data-rail-line]")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
});

test("the reel sits in a docking frame", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-dock-frame] [data-testid='home-video']")).toHaveCount(1);
});
