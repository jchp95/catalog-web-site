/**
 * Rebuild MUNICH exploded-view frames from green-screen video.
 *
 * Source: public/videos/munich-sneaker-exploded.mp4
 * Usage:  node scripts/rebuild-munich-explod-frames.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { scrubFloorShadow } from "./lib/scrub-floor-shadow.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VIDEO = path.join(ROOT, "public/videos/munich-sneaker-exploded.mp4");
const RAW = path.join(ROOT, ".tmp/munich-explod-raw");
const OUT = path.join(ROOT, "public/frames/munich-yellow/explod");
const TARGET = 96;
const DURATION_S = 10;
const W = 1280;
const H = 720;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

/** Chroma green key (~RGB 55,126,76) — keep mustard / navy / gum / black insole. */
function keyGreen(d) {
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    const gd = g - Math.max(r, b);
    let key = gd <= 8 ? 0 : gd >= 40 ? 1 : smooth((gd - 8) / 32);

    if (g > 95 && g > r + 22 && g > b + 12 && r < 110) {
      key = Math.max(key, clamp((g - Math.max(r, b) - 14) / 48));
    }

    const isMustard = r > 85 && r >= g - 8 && r > b && g > b;
    const isNavy = b > r + 15 && b >= g - 12 && r < 100;
    const isGum = r > 60 && g > 40 && b < 80 && Math.abs(r - g) < 60 && r >= g - 5;
    const isDark = r < 55 && g < 55 && b < 70; // insole / tongue tag
    if (isMustard || isNavy || isGum || isDark) key *= 0.06;

    if (key > 0.985) {
      d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      continue;
    }

    if (key > 0.04 && g > Math.max(r, b)) {
      const t = clamp(key * 1.2);
      g = Math.round(g * (1 - t) + Math.max(r, b) * t);
    }

    const a = 1 - key;
    if (a <= 0.02) {
      d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      continue;
    }

    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = Math.min(255, Math.round(a * 255));
  }
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} failed (${r.status})`);
}

if (!fs.existsSync(VIDEO)) throw new Error(`Missing video: ${VIDEO}`);

fs.rmSync(RAW, { recursive: true, force: true });
fs.mkdirSync(RAW, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) {
  if (/^frame_\d+\.(png|webp)$/i.test(f)) fs.unlinkSync(path.join(OUT, f));
}

const fps = TARGET / DURATION_S;
console.log(`1/3 ffmpeg extract ${TARGET} landscape frames @ ${fps}fps…`);
run("ffmpeg", [
  "-y",
  "-i",
  VIDEO,
  "-vf",
  `fps=${fps},scale=${W}:${H}:flags=lanczos`,
  "-start_number",
  "1",
  path.join(RAW, "raw_%04d.png"),
]);

const raws = fs
  .readdirSync(RAW)
  .filter((f) => f.endsWith(".png"))
  .sort();
console.log(`2/3 key ${raws.length} frames…`);

let i = 0;
for (const name of raws) {
  i++;
  const { data, info } = await sharp(path.join(RAW, name))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
  keyGreen(pixels);
  scrubFloorShadow(pixels, info.width, info.height);

  await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 8 })
    .toFile(path.join(OUT, `frame_${String(i).padStart(4, "0")}.png`));

  if (i % 16 === 0 || i === raws.length) process.stdout.write(`  ${i}/${raws.length}\n`);
}

fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify(
    {
      count: raws.length,
      source: "munich-sneaker-exploded.mp4",
      size: [W, H],
      duration: DURATION_S,
      key: "chroma-green",
      phases: {
        assembled: [0, 0.15],
        exploding: [0.15, 0.42],
        open: [0.42, 0.68],
        closing: [0.68, 1],
      },
    },
    null,
    2,
  ),
);

fs.rmSync(RAW, { recursive: true, force: true });
console.log(`3/3 done → ${OUT} (${raws.length} PNG)`);
