import { expect, test } from "./fixtures";

test("home stats expose their real value to assistive tech; overlay is aria-hidden", async ({
  page,
}) => {
  await page.goto("/");
  const stat = page.locator("[data-home-stats] li").first();
  await expect(stat).toContainText("338K+");
  await expect(stat.locator("[aria-hidden='true']")).toHaveCount(1);
  expect(await stat.locator("[aria-live]").count()).toBe(0);
});

test("home stats end on the exact values after the intro", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(7500); // intro (~5 s) + decode (0.6 s)
  const shown = await page.$$eval("[data-home-stats] li", (lis) =>
    lis.map((li) => ({
      overlay: li.querySelector("[aria-hidden='true']")?.textContent ?? "x",
      running: li.querySelector("[data-running]") !== null,
    })),
  );
  expect(shown.length).toBe(4);
  expect(shown.every((s) => s.overlay === "" && !s.running)).toBe(true);
});

test("reduced motion shows the final value without scrambling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(7000);
  expect(await page.locator("[data-home-stats] [data-running]").count()).toBe(0);
});
