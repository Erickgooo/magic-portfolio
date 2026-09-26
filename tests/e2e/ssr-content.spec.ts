import { expect, test } from "@playwright/test";

// With JavaScript disabled the page shows exactly the server HTML. Before the
// fix RouteGuard rendered a spinner on the server, so no heading existed.
test.describe("server-rendered content", () => {
  test.use({ javaScriptEnabled: false });

  const cases = [
    { path: "/", text: /I Build Marketing Infrastructure/ },
    { path: "/about", text: /Erick Mahecha/ },
    { path: "/work", text: /Projects/ },
    { path: "/blog/my-workspace", text: /My Workspace/ },
    { path: "/gallery", text: /Visual Work/ },
  ];

  for (const c of cases) {
    test(`${c.path} has its h1 in the server HTML`, async ({ page }) => {
      await page.goto(c.path);
      await expect(page.locator("h1").first()).toHaveText(c.text);
    });
  }
});

test("client navigation never flashes NotFound", async ({ page }) => {
  await page.goto("/");
  const seen: string[] = [];
  await page.exposeFunction("__record", (t: string) => seen.push(t));
  await page.evaluate(() => {
    new MutationObserver(() => {
      if (document.body.innerText.includes("This page hasn't been built yet")) {
        (window as unknown as { __record: (t: string) => void }).__record("404");
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
  await page.locator('header a[href="/work"]').first().click();
  await page.waitForURL("**/work");
  await page.locator('header a[href="/"]').first().click();
  await page.waitForURL((url) => url.pathname === "/");
  expect(seen).toEqual([]);
});
