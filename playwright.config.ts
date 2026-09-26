import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const e2e = /e2e[\\/].*\.spec\.ts$/;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001 } },
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  projects: [
    { name: "unit", testMatch: /unit[\\/].*\.spec\.ts$/ },
    { name: "chromium", testMatch: e2e, use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", testMatch: e2e, use: { ...devices["Pixel 7"] } },
    { name: "firefox", testMatch: e2e, use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", testMatch: e2e, use: { ...devices["Desktop Safari"] } },
  ],
  // Requires `npm run build` first. Reuses a server already listening on PORT.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
