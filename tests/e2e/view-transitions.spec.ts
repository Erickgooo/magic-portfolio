import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

async function duplicateVtNames(page: Page) {
  return page.evaluate(() => {
    const names = [...document.querySelectorAll("*")]
      .map((el) => getComputedStyle(el).viewTransitionName)
      .filter((n) => n && n !== "none");
    return names.filter((n, i) => names.indexOf(n) !== i);
  });
}

const workLink = (page: Page) => page.locator("header").getByRole("link", { name: "Projects" });

test("internal navigation runs a view transition and lands on the page", async ({
  page,
  browserName,
}) => {
  test.skip(browserName === "firefox", "same-document VT support varies in Firefox");
  await page.goto("/about");
  await page.evaluate(() => {
    const w = window as unknown as { __vt: number };
    w.__vt = 0;
    const orig = document.startViewTransition?.bind(document);
    if (!orig) return;
    document.startViewTransition = ((cb: () => Promise<void>) => {
      w.__vt++;
      return orig(cb);
    }) as typeof document.startViewTransition;
  });
  await workLink(page).click();
  await page.waitForURL("**/work");
  expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBe(1);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("vt-active")))
    .toBe(false);
});

test("slow navigation skips the transition and still navigates", async ({ page, browserName }) => {
  test.skip(browserName === "firefox", "same-document VT support varies in Firefox");
  await page.goto("/about");
  await page.route(/\/work(\?|$)/, async (route) => {
    await new Promise((r) => setTimeout(r, 900));
    await route.continue();
  });
  await workLink(page).click();
  await page.waitForURL("**/work", { timeout: 10_000 });
  await expect(page.locator("h1").first()).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("vt-active")))
    .toBe(false);
});

test("back navigation restores scroll without leftover transition names", async ({ page }) => {
  await page.goto("/about");
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(300);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 1200));
  await workLink(page).click();
  await page.waitForURL("**/work");
  await page.goBack();
  await page.waitForURL("**/about");
  await expect
    .poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 3000 })
    .toBeGreaterThan(1000);
  expect(await duplicateVtNames(page)).toEqual([]);
  const inline = await page.$$eval("[style*='view-transition-name']", (els) =>
    els
      .map((e) => (e as HTMLElement).style.viewTransitionName)
      .filter((n) => n && n !== "site-header"),
  );
  expect(inline).toEqual([]);
});

test("modified clicks are not intercepted", async ({ page, context }) => {
  await page.goto("/blog/my-workspace");
  const popupPromise = context.waitForEvent("page", { timeout: 5000 }).catch(() => null);
  await workLink(page).click({ modifiers: ["ControlOrMeta"] });
  const popup = await popupPromise;
  if (popup) await popup.close();
  expect(new URL(page.url()).pathname).toBe("/blog/my-workspace");
});

test("no page ever has duplicate view-transition names", async ({ page }) => {
  for (const p of ["/", "/about", "/work", "/work/leadbot-ai", "/blog/my-workspace", "/gallery"]) {
    await page.goto(p);
    expect(await duplicateVtNames(page), p).toEqual([]);
  }
});
