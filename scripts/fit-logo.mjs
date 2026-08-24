// Frame-fitting for club logos: NO color changes.
// Removes the white matte (border-connected white only), crops to the emblem
// bounding box, centers it, and pads to a square canvas so the mark fills the
// same visual frame at every display size on the site.
//
// Usage:
//   node scripts/fit-logo.mjs                      (defaults: both clubs)
//   node scripts/fit-logo.mjs scriptsoldiers.png
//
// Source files must be untouched originals (see public/logos/_original/).

import sharp from "sharp";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOGO_DIR = path.join(root, "public", "logos");
const ORIG_DIR = path.join(LOGO_DIR, "_original");

const BG_LUM = 235;
const PAD = 0.06;

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function markMatte(data, w, h, c) {
  const matte = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const isWhite = (i) => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    return a > 8 && lum(r, g, b) > BG_LUM;
  };

  const push = (x, y) => {
    const p = y * w + x;
    if (matte[p]) return;
    matte[p] = 1;
    queue[tail++] = p;
  };

  for (let x = 0; x < w; x++) {
    if (isWhite(x * c)) push(x, 0);
    if (isWhite(((h - 1) * w + x) * c)) push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    if (isWhite(y * w * c)) push(0, y);
    if (isWhite((y * w + w - 1) * c)) push(w - 1, y);
  }

  while (head < tail) {
    const p = queue[head++];
    const x = p % w;
    const y = (p / w) | 0;
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const np = ny * w + nx;
      if (matte[np]) continue;
      if (isWhite(np * c)) push(nx, ny);
    }
  }

  return matte;
}

async function fit(file) {
  const src = path.join(LOGO_DIR, file);
  const orig = path.join(ORIG_DIR, file);
  if (!existsSync(orig)) {
    console.error("no untouched original for", file, "- restore it first.");
    return;
  }

  const { data, info } = await sharp(orig)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const matte = markMatte(data, w, h, c);

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (matte[p]) continue;
      const i = p * c;
      if (data[i + 3] < 8) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) {
    console.error("no content found in", file);
    return;
  }

  const contentW = maxX - minX + 1;
  const contentH = maxY - minY + 1;
  const pad = Math.round(Math.max(contentW, contentH) * PAD);
  const canvas = Math.max(contentW, contentH) + pad * 2;
  const out = Buffer.alloc(canvas * canvas * 4);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = y * w + x;
      if (matte[p]) continue;
      const i = p * c;
      if (data[i + 3] < 8) continue;
      const oi = ((y - minY + pad) * canvas + (x - minX + pad)) * 4;
      const L = lum(data[i], data[i + 1], data[i + 2]);
      let a = data[i + 3];
      if (L > BG_LUM - 25) {
        a = Math.min(255, Math.round(a * ((BG_LUM - L) / 25)));
      }
      out[oi] = data[i];
      out[oi + 1] = data[i + 1];
      out[oi + 2] = data[i + 2];
      out[oi + 3] = a;
    }
  }

  await sharp(out, { raw: { width: canvas, height: canvas, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(src);

  console.log(
    `fitted: ${file} (${w}x${h} -> ${canvas}x${canvas}, emblem ${contentW}x${contentH})`,
  );
}

for (const file of process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["scriptsoldiers.png", "cyberknights.png"]) {
  await fit(file);
}
console.log("originals untouched in", path.relative(root, ORIG_DIR));