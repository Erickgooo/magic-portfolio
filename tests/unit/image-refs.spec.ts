import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const MAP = "scripts/media/image-renames.json";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test("no source file references a renamed image", () => {
  expect(existsSync(MAP)).toBe(true);
  const { renames } = JSON.parse(readFileSync(MAP, "utf8")) as { renames: Record<string, string> };
  const sources = walk("src").filter((f) => /\.(tsx?|mdx?|s?css|json)$/.test(f));
  const offenders: string[] = [];
  for (const file of sources) {
    const text = readFileSync(file, "utf8");
    for (const oldPath of Object.keys(renames)) {
      if (text.includes(oldPath)) offenders.push(`${file}: ${oldPath}`);
    }
  }
  expect(offenders).toEqual([]);
});

test("every /images path referenced in src exists in public", () => {
  const sources = walk("src").filter((f) => /\.(tsx?|mdx?)$/.test(f));
  // Matched per quote style rather than one shared character class: some
  // gallery filenames contain spaces (e.g. "Artesa - Panettone 2x1.webp"), so
  // a path inside quotes must be allowed to contain spaces, while a path
  // inside parens (markdown image syntax) still stops at whitespace.
  const patterns = [
    /"(\/images\/[^"]+)"/g,
    /'(\/images\/[^']+)'/g,
    /\((\/images\/[^)\s]+)\)/g,
  ];
  const missing: string[] = [];
  for (const file of sources) {
    const text = readFileSync(file, "utf8");
    for (const pattern of patterns) {
      for (const m of text.matchAll(pattern)) {
        if (!existsSync(path.join("public", m[1]))) missing.push(`${file}: ${m[1]}`);
      }
    }
  }
  expect(missing).toEqual([]);
});
