/**
 * Rebuild MUNICH orbit frames from the stable green-screen 360 turntable.
 *
 * Source: public/videos/munich-sneaker-360-turntable.mp4 (full chroma green bg)
 * Usage:  node scripts/rebuild-munich-frames.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import { scrubFloorShadow } from "./lib/scrub-floor-shadow.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VIDEO = path.join(ROOT, "public/videos/munich-sneaker-360-turntable.mp4");
const RAW = path.join(ROOT, ".tmp/munich-turntable-raw");
const OUT = path.join(ROOT, "public/frames/munich-yellow/desktop");
const TARGET = 120;
const SIZE = 1024;
const DURATION_S = 10; // turntable length

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

/**
 * Pure chroma-green key tuned for the new turntable (~RGB 16,150,65).
 * Protects mustard upper, navy X and gum sole; despill soft green fringes.
 */
function keyGreen(d, W, H) {
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    // Green dominance vs red/blue — strong on flat studio green
    const gd = g - Math.max(r, b);
    // Soft ramp so contours stay anti-aliased
    let key = gd <= 8 ? 0 : gd >= 42 ? 1 : smooth((gd - 8) / 34);

    // Flat mid greens even with lower dominance (screen fill)
    if (g > 110 && g > r + 28 && g > b + 18 && r < 90) {
      key = Math.max(key, clamp((g - Math.max(r, b) - 18) / 50));
    }

    // Mustard / gum / navy protection — never key warm yellows or deep blues
    const isMustard = r > 90 && r > g && r > b && g > b;
    const isNavy = b > r + 20 && b >= g - 10 && r < 90;
    const isGum = r > 70 && g > 45 && b < 70 && Math.abs(r - g) < 55 && r >= g;
    if (isMustard || isNavy || isGum) key *= 0.08;

    if (key > 0.985) {
      d[i] = 0;
      d[i + 1] = 0;
      d[i + 2] = 0;
      d[i + 3] = 0;
      continue;
    }

    // Despill: pull green channel toward max(r,b) on semi-transparent edges
    if (key > 0.05 && g > Math.max(r, b)) {
      const t = clamp(key * 1.15);
      g = Math.round(g * (1 - t) + Math.max(r, b) * t);
    }

    const a = 1 - key;
    if (a <= 0.02) {
      d[i] = 0;
      d[i + 1] = 0;
      d[i + 2] = 0;
      d[i + 3] = 0;
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
console.log(`1/3 ffmpeg extract ${TARGET} frames @ ${fps}fps from green-screen turntable…`);
// Keep aspect (1280x720), pad to square with green so key removes the pad too
run("ffmpeg", [
  "-y",
  "-i",
  VIDEO,
  "-vf",
  [
    `fps=${fps}`,
    "scale=1024:576:flags=lanczos",
    "pad=1024:1024:0:224:0x109640",
  ].join(","),
  "-start_number",
  "1",
  path.join(RAW, "raw_%04d.png"),
]);

const raws = fs
  .readdirSync(RAW)
  .filter((f) => f.endsWith(".png"))
  .sort();
console.log(`2/3 key ${raws.length} frames (chroma green)…`);

let i = 0;
for (const name of raws) {
  i++;
  const input = path.join(RAW, name);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
  keyGreen(pixels, info.width, info.height);
  scrubFloorShadow(pixels, info.width, info.height);

  // Bounds of opaque shoe — recenter with breathing room so contain never clips
  const pad = 80;
  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (pixels[(y * info.width + x) * 4 + 3] > 18) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const out = path.join(OUT, `frame_${String(i).padStart(4, "0")}.png`);
  if (maxX < 0 || maxY < 0) {
    await sharp({
      create: {
        width: SIZE,
        height: SIZE,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .png({ compressionLevel: 8 })
      .toFile(out);
    continue;
  }

  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const maxContent = SIZE - pad * 2;
  const scale = Math.min(maxContent / bw, maxContent / bh);
  const dw = Math.max(1, Math.round(bw * scale));
  const dh = Math.max(1, Math.round(bh * scale));
  const dx = Math.round((SIZE - dw) / 2);
  const dy = Math.round((SIZE - dh) / 2);

  const keyed = await sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left: minX, top: minY, width: bw, height: bh })
    .resize(dw, dh, { fit: "fill", kernel: "lanczos3" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: keyed, left: dx, top: dy }])
    .png({ compressionLevel: 8 })
    .toFile(out);

  if (i % 20 === 0 || i === raws.length) process.stdout.write(`  ${i}/${raws.length}\n`);
}

fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify(
    {
      count: raws.length,
      source: "munich-sneaker-360-turntable.mp4",
      size: SIZE,
      duration: DURATION_S,
      key: "chroma-green",
    },
    null,
    2,
  ),
);

fs.rmSync(RAW, { recursive: true, force: true });
console.log(`3/3 done → ${OUT} (${raws.length} PNG)`);
