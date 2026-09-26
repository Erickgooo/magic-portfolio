import { expect, test } from "@playwright/test";
import { isRouteEnabled } from "@/utils/routeEnabled";

const routes = { "/": true, "/about": true, "/work": true, "/blog": false, "/gallery": true } as const;

test.describe("isRouteEnabled", () => {
  test("static routes follow the config", () => {
    expect(isRouteEnabled("/", routes)).toBe(true);
    expect(isRouteEnabled("/about", routes)).toBe(true);
    expect(isRouteEnabled("/blog", routes)).toBe(false);
  });
  test("dynamic children inherit /work and /blog", () => {
    expect(isRouteEnabled("/work/leadbot-ai", routes)).toBe(true);
    expect(isRouteEnabled("/blog/my-workspace", routes)).toBe(false);
  });
  test("/unauthorized is always enabled (middleware rewrite target)", () => {
    expect(isRouteEnabled("/unauthorized", routes)).toBe(true);
  });
  test("unknown or missing paths are disabled", () => {
    expect(isRouteEnabled("/nope", routes)).toBe(false);
    expect(isRouteEnabled("/gallery/x", routes)).toBe(false);
    expect(isRouteEnabled("/workshop", routes)).toBe(false);
    expect(isRouteEnabled(null, routes)).toBe(false);
  });
});
