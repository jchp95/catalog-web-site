/**
 * Offline cream-studio keying for MUNICH product photos.
 * Port of Claude Design prototype keyData → WebP RGBA cuts.
 *
 * Usage: node scripts/cut-munich-photos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public/munich/images/products");
const OUT = path.join(ROOT, "public/munich/cuts");

const PHOTO_CROP = 0.036;
const PHOTO_MAX = 1400;

const JOBS = [
  { id: "side", file: "barru-side-lateral.jpg", k: 2.45, s0: 0.18, s1: 0.3 },
  { id: "medial", file: "barru-side-medial.jpg", k: 2.45, s0: 0.18, s1: 0.3 },
  { id: "sole", file: "barru-sole.jpg", k: 2.35, s0: 0.17, s1: 0.29 },
  { id: "pair", file: "barru-pair.jpg", k: 2.45, s0: 0.18, s1: 0.3 },
  { id: "top", file: "barru-top.jpg", k: 2.45, s0: 0.18, s1: 0.3 },
  // Heel is mostly a detail plate; still cut for grid/shop float use
  { id: "heel", file: "barru-heel-detail.jpg", k: 2.25, s0: 0.16, s1: 0.28 },
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

/** Cream studio → alpha + unpremultiply (same math as prototype). */
function keyData(d, W, H, o = {}) {
  let Lb = o.Lb;
  if (Lb == null) {
    let s = 0;
    let n = 0;
    for (const [x, y] of [
      [4, 4],
      [W - 5, 4],
      [W >> 1, 4],
      [4, H >> 3],
      [W - 5, H >> 3],
    ]) {
      const i = (y * W + x) * 4;
      s += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      n++;
    }
    Lb = s / n;
  }
  const k = o.k ?? 2.1;
  const s0 = o.s0 ?? 0.13;
  const s1 = o.s1 ?? 0.24;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const mx = r > g ? (r > b ? r : b) : g > b ? g : b;
    const mn = r < g ? (r < b ? r : b) : g < b ? g : b;
    const sat = mx ? (mx - mn) / mx : 0;
    const L = 0.299 * r + 0.587 * g + 0.114 * b;
    const w = sat <= s0 ? 0 : sat >= s1 ? 1 : smooth((sat - s0) / (s1 - s0));
    const sh = clamp(((Lb - L) / Lb) * k);
    const a = w + (1 - w) * sh;
    if (a <= 0.004) {
      d[i + 3] = 0;
      continue;
    }
    d[i] = (r * w) / a;
    d[i + 1] = (g * w) / a;
    d[i + 2] = (b * w) / a;
    d[i + 3] = a * 255;
  }
}

async function cutOne(job) {
  const input = path.join(SRC, job.file);
  if (!fs.existsSync(input)) throw new Error(`Missing ${input}`);

  const meta = await sharp(input).metadata();
  const iw = meta.width;
  const ih = meta.height;
  const c = PHOTO_CROP;
  const sx = Math.round(iw * c);
  const sy = Math.round(ih * c);
  const sw = Math.round(iw * (1 - 2 * c));
  const sh = Math.round(ih * (1 - 2 * c));
  const sc = Math.min(1, PHOTO_MAX / sw);
  const W = Math.round(sw * sc);
  const H = Math.round(sh * sc);

  const { data, info } = await sharp(input)
    .extract({ left: sx, top: sy, width: sw, height: sh })
    .resize(W, H, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
  keyData(pixels, info.width, info.height, { k: job.k, s0: job.s0, s1: job.s1 });

  const outWebp = path.join(OUT, `${job.id}.webp`);
  const outPng = path.join(OUT, `${job.id}.png`);

  await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .webp({ quality: 94, alphaQuality: 100 })
    .toFile(outWebp);

  await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outPng);

  const st = fs.statSync(outWebp);
  console.log(
    `✓ ${job.id.padEnd(7)} ${info.width}×${info.height}  webp ${(st.size / 1024).toFixed(0)}KB`,
  );
}

fs.mkdirSync(OUT, { recursive: true });
console.log(`Cutting → ${OUT}\n`);
for (const job of JOBS) {
  await cutOne(job);
}
console.log("\nDone. Wire ASSETS.CUTS in features/munich/config/assets.ts");
