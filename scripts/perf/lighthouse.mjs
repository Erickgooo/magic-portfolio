// Runs Lighthouse LH_RUNS times per page and form factor and writes the JSON
// reports to .perf/<LH_TAG>/<page>-<formFactor>-<run>.json.
// Lighthouse's Windows temp-dir cleanup can exit non-zero (EPERM) after a
// successful run, so success is judged by the report file existing.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const LH_CLI = path.join(path.dirname(require.resolve("lighthouse/package.json")), "cli", "index.js");

const BASE = process.env.LH_BASE_URL ?? "http://localhost:3100";
const TAG = process.env.LH_TAG ?? "local";
const RUNS = Number(process.env.LH_RUNS ?? 3);
const PAGES = {
  home: "/",
  about: "/about",
  work: "/work",
  blog: "/blog/my-workspace",
  gallery: "/gallery",
};

const outDir = path.join(".perf", TAG);
mkdirSync(outDir, { recursive: true });

let headersFile = null;
if (process.env.LH_BYPASS) {
  headersFile = path.join(outDir, "extra-headers.json");
  writeFileSync(
    headersFile,
    JSON.stringify({
      "x-vercel-protection-bypass": process.env.LH_BYPASS,
      "x-vercel-set-bypass-cookie": "true",
    }),
  );
}

const failures = [];
for (const [name, pagePath] of Object.entries(PAGES)) {
  for (const formFactor of ["mobile", "desktop"]) {
    for (let run = 1; run <= RUNS; run++) {
      const file = path.join(outDir, `${name}-${formFactor}-${run}.json`);
      const args = [
        LH_CLI,
        BASE + pagePath,
        "--output=json",
        `--output-path=${file}`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--max-wait-for-load=45000",
        "--quiet",
        "--chrome-flags=--headless=new --no-sandbox",
      ];
      if (formFactor === "desktop") args.push("--preset=desktop");
      if (headersFile) args.push(`--extra-headers=${headersFile}`);
      spawnSync(process.execPath, args, { stdio: "inherit", timeout: 240_000 });
      if (!existsSync(file)) failures.push(`${name}-${formFactor}-${run}`);
    }
  }
}
if (failures.length) {
  console.error(`Missing reports: ${failures.join(", ")}`);
  process.exit(1);
}
console.log(`Reports written to ${outDir}`);
