// Usage: node scripts/perf/report.mjs <tag> [compareTag]
// Prints a markdown table with the median of each metric per page/form factor.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const [tag, compareTag] = process.argv.slice(2);
if (!tag) {
  console.error("usage: report.mjs <tag> [compareTag]");
  process.exit(1);
}

const median = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};

function load(t, page, ff) {
  const runs = [];
  for (let i = 1; i <= 5; i++) {
    const f = path.join(".perf", t, `${page}-${ff}-${i}.json`);
    if (!existsSync(f)) continue;
    const j = JSON.parse(readFileSync(f, "utf8"));
    if (!j.runtimeError && j.categories.performance.score != null) runs.push(j);
  }
  return runs;
}

function bytes(j, type) {
  const items = j.audits["network-requests"]?.details?.items ?? [];
  return items
    .filter((r) => !type || r.resourceType === type)
    .reduce((sum, r) => sum + (r.transferSize ?? 0), 0);
}

function metrics(runs) {
  if (!runs.length) return null;
  const m = (fn) => median(runs.map(fn));
  return {
    perf: Math.round(m((j) => j.categories.performance.score * 100)),
    a11y: Math.round(m((j) => j.categories.accessibility.score * 100)),
    lcp: m((j) => j.audits["largest-contentful-paint"].numericValue) / 1000,
    cls: m((j) => j.audits["cumulative-layout-shift"].numericValue),
    tbt: Math.round(m((j) => j.audits["total-blocking-time"].numericValue)),
    js: Math.round(m((j) => bytes(j, "Script")) / 1024),
    total: Math.round(m((j) => bytes(j)) / 1024),
  };
}

const fmt = (x) =>
  x
    ? `${x.perf} / ${x.a11y} / ${x.lcp.toFixed(2)} s / ${x.cls.toFixed(3)} / ${x.tbt} ms / ${x.js} KB / ${x.total} KB`
    : "n/a";

console.log(
  compareTag
    ? `| Página | FF | ${compareTag} (Perf / A11y / LCP / CLS / TBT / JS / Total) | ${tag} |`
    : "| Página | FF | Perf / A11y / LCP / CLS / TBT / JS / Total |",
);
console.log(compareTag ? "|---|---|---|---|" : "|---|---|---|");
for (const page of ["home", "about", "work", "blog", "gallery"]) {
  for (const ff of ["mobile", "desktop"]) {
    const a = metrics(load(tag, page, ff));
    if (compareTag) {
      const b = metrics(load(compareTag, page, ff));
      console.log(`| ${page} | ${ff} | ${fmt(b)} | ${fmt(a)} |`);
    } else {
      console.log(`| ${page} | ${ff} | ${fmt(a)} |`);
    }
  }
}
