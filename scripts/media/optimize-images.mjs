// Converts public/images/**/*.{png,jpg,jpeg} into high-quality masters:
//  - WebP q90 (max 2400px long edge, never upscaled) for everything rendered on-site,
//    so next/image recompresses to AVIF/WebP from a near-lossless source.
//  - Optimized JPEG for images consumed by third parties that may not accept WebP
//    (Open Graph crawlers, RSS readers, the Satori renderer in /api/og/generate).
// Writes scripts/media/image-renames.json and deletes the replaced originals.
import { readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "public/images";
const MAX = 2400;
const KEEP_JPEG = new Map([
  ["/images/avatar.jpg", { max: 800 }],
  ["/images/blog/PC.jpg", { max: 1600 }],
  ["/images/og/home.jpg", { max: 1200 }],
  ["/images/og/social-preview.jpg", { max: 1200 }],
]);

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const toWeb = (p) => `/${p.split(path.sep).join("/").replace(/^public\//, "")}`;
const renames = {};
const jpeg = [];
let before = 0;
let after = 0;

for (const file of await walk(ROOT)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const webPath = toWeb(file);
  const size = (await stat(file)).size;
  before += size;

  if (KEEP_JPEG.has(webPath)) {
    const { max } = KEEP_JPEG.get(webPath);
    const tmp = `${file}.tmp`;
    await sharp(file)
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true, progressive: true })
      .toFile(tmp);
    const newSize = (await stat(tmp)).size;
    if (newSize < size) {
      await rename(tmp, file);
      after += newSize;
    } else {
      await rm(tmp);
      after += size;
    }
    jpeg.push(webPath);
    console.log(`jpeg  ${webPath}  ${(size / 1024) | 0}KB -> ${(Math.min(newSize, size) / 1024) | 0}KB`);
    continue;
  }

  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(file)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(out);
  const newSize = (await stat(out)).size;
  after += newSize;
  await rm(file);
  renames[webPath] = toWeb(out);
  console.log(`webp  ${webPath}  ${(size / 1024) | 0}KB -> ${(newSize / 1024) | 0}KB`);
}

await writeFile("scripts/media/image-renames.json", `${JSON.stringify({ renames, jpeg }, null, 2)}\n`);
console.log(`\nTotal: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
