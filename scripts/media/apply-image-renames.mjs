// Rewrites every reference to a renamed image inside src/ (tsx/ts/mdx/md/scss/css/json).
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const { renames } = JSON.parse(await readFile("scripts/media/image-renames.json", "utf8"));
// Longest first so a shorter path never partially rewrites a longer one.
const pairs = Object.entries(renames).sort((a, b) => b[0].length - a[0].length);

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx?|mdx?|s?css|json)$/.test(p)) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of await walk("src")) {
  const original = await readFile(file, "utf8");
  let text = original;
  for (const [from, to] of pairs) text = text.split(from).join(to);
  if (text !== original) {
    await writeFile(file, text);
    changed++;
    console.log(`updated ${file}`);
  }
}
console.log(`${changed} files updated`);
