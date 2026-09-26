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

test("client navigation never flashes NotFound", async ({ page, browserName }) => {
  // WebKit only: next.config.mjs's production CSP sends
  // `upgrade-insecure-requests` (correctly — real HTTPS deployments need
  // it), and this Playwright-WebKit build, unlike Chromium/Firefox, doesn't
  // exempt `localhost` from it. It upgrades every subresource the *document*
  // references — CSS, JS chunks, images — to `https://`, which then fails
  // to connect since the local e2e server (`npm run start`, per
  // playwright.config.ts) has no TLS listener. That cascade of failed CSS
  // loads is what broke this test: with the page's own layout CSS never
  // applied, an unrelated `next/image fill` element (e.g. a project's team
  // avatar) lost its positioned containing block and stretched across the
  // whole document, intercepting the click meant for the header link
  // underneath it. Confirmed via getComputedStyle/requestfailed logging
  // during the investigation (see task-3-report.md, Fix round 1) that
  // stripping the response's CSP/HSTS headers before the browser parses the
  // document removes the upgrade entirely and the page then renders and
  // behaves identically to Chromium/Firefox — i.e. this was never a real
  // click-target bug, just a test-environment artifact of testing a
  // production CSP over plain HTTP. Scoped to `document` requests only and
  // to WebKit only, since Chromium/Firefox never had this problem.
  if (browserName === "webkit") {
    await page.route("**/*", async (route) => {
      const request = route.request();
      if (request.resourceType() !== "document") {
        await route.continue();
        return;
      }
      const response = await route.fetch();
      const {
        "content-security-policy": _csp,
        "strict-transport-security": _hsts,
        ...headers
      } = response.headers();
      await route.fulfill({ response, headers });
    });
  }

  // Starts on /about, not /, so the Home-only IntroLoader overlay (which
  // covers the page and blocks pointer events for several seconds on first
  // load) never appears and can't interfere with the clicks below.
  await page.goto("/about");
  const seen: string[] = [];
  await page.exposeFunction("__record", (t: string) => seen.push(t));
  await page.evaluate(() => {
    new MutationObserver(() => {
      if (document.body.innerText.includes("This page hasn't been built yet")) {
        (window as unknown as { __record: (t: string) => void }).__record("404");
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
  // Header renders a desktop (labelled) and a mobile (icon-only, unlabelled)
  // ToggleButton for each route; scoping to `header` and matching by
  // accessible name targets only the labelled desktop link unambiguously,
  // regardless of which variant CSS happens to show at this viewport.
  const header = page.locator("header");
  await header.getByRole("link", { name: "Projects" }).click();
  await page.waitForURL("**/work");
  await header.getByRole("link", { name: "About" }).click();
  await page.waitForURL((url) => url.pathname === "/about");
  expect(seen).toEqual([]);
});
