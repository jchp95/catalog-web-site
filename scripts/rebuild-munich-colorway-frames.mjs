/**
 * Rebuild MUNICH colorway transition frames (green-screen).
 *
 * Source: public/videos/munich-sneaker-colorways.mp4
 * Phases (~10s): Mostaza 0–1.8s | Hueso 2–4.8s | Carbón 5–7.7s | Burdeos 8–9.5s
 * Usage:  node scripts/rebuild-munich-colorway-frames.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VIDEO = path.join(ROOT, "public/videos/munich-sneaker-colorways.mp4");
const RAW = path.join(ROOT, ".tmp/munich-colorway-raw");
const OUT = path.join(ROOT, "public/frames/munich-yellow/colorways");
const TARGET = 96;
const DURATION_S = 10;
const W = 1280;
const H = 720;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t) => t * t * (3 - 2 * t);

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

    // Protect shoe materials across colorways (solid body only — not muddy fringe)
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const sat = mx ? (mx - mn) / mx : 0;
    const isMustard = r > 100 && r >= g - 8 && r > b + 20 && g > 60 && sat > 0.18;
    const isNavy = b > r + 20 && b >= g - 8 && r < 100 && sat > 0.15;
    const isGum = r > 85 && g > 50 && b < 95 && Math.abs(r - g) < 55 && r >= g - 5 && sat > 0.12;
    const isDark = r < 48 && g < 48 && b < 58 && Math.abs(r - g) < 16; // solid carbon
    const isBone = r > 190 && g > 190 && b > 185 && Math.abs(r - g) < 18;
    const isBurgundy = r > 70 && r > g + 25 && r > b + 15 && g < 80 && b < 90 && sat > 0.2;
    const isWhiteX = r > 200 && g > 200 && b > 200;
    if (isMustard || isNavy || isGum || isDark || isBone || isBurgundy || isWhiteX) key *= 0.04;

    if (key > 0.985) {
      d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      continue;
    }

    if (key > 0.04 && g > Math.max(r, b)) {
      const t = clamp(key * 1.25);
      g = Math.round(g * (1 - t) + Math.max(r, b) * t);
    }

    const a = 1 - key;
    if (a <= 0.04) {
      d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      continue;
    }

    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = Math.min(255, Math.round(a * 255));
  }
}

/**
 * Kill pixelated floor shadow / olive key residue under the sole.
 * Safe for solid black colorways — only removes soft/muddy fringe.
 */
function scrubFloorShadow(d, W, H) {
  // Bottom of solid shoe body (nearly opaque)
  let soleBottom = 0;
  let soleTop = H;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] > 235) {
        soleBottom = Math.max(soleBottom, y);
        soleTop = Math.min(soleTop, y);
      }
    }
  }
  const floorY = Math.max(0, soleBottom - 6);
  const midY = (soleTop + soleBottom) / 2;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const a = d[i + 3];
      if (a === 0) continue;
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      const sat = mx ? (mx - mn) / mx : 0;

      // Olive / muddy green-gray despill leftovers
      const muddy =
        a < 250 &&
        L < 125 &&
        sat < 0.3 &&
        g >= r - 8 &&
        g >= b - 12 &&
        !(r < 45 && g < 45 && b < 50 && a > 240);

      // Soft contact shadow (semi-transparent dark)
      const softShadow = a < 230 && L < 105 && sat < 0.38;

      // Jagged dark fringe on sole edge (opaque olive fused into cutout)
      const soleFringe =
        y >= floorY &&
        L < 80 &&
        r < 90 &&
        Math.abs(r - g) <= 22 &&
        !(r > 90 && g > 55 && b < 100 && r - b > 25); // keep solid gum

      const underSole = y >= floorY && (softShadow || muddy || a < 220 || soleFringe);

      // Soft dark floating residue anywhere below mid shoe
      const floatDirt = y > midY && softShadow && a < 200;

      if (underSole || muddy || floatDirt || (softShadow && a < 160)) {
        d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      }
    }
  }

  // Third pass: per-column peel under sole.
  // Don't eat thin heel overhangs — require opaque mass above before peeling.
  const MAX_PEEL = 16;
  const FORCE_NIBBLE = 3;
  for (let x = 0; x < W; x++) {
    // Count opaque run from first contact upward
    let contactY = -1;
    let opaqueRun = 0;
    for (let y = H - 1; y >= 0; y--) {
      if (d[(y * W + x) * 4 + 3] >= 12) {
        if (contactY < 0) contactY = y;
        opaqueRun++;
      } else if (contactY >= 0) {
        break;
      }
    }
    if (contactY < 0 || opaqueRun < 8) continue; // skip thin wisps / noise

    let peeled = 0;
    for (let y = contactY; y >= 0 && peeled < MAX_PEEL; y--) {
      const i = (y * W + x) * 4;
      const a = d[i + 3];
      if (a < 12) break;
      // Leave at least 5px of sole body
      if (opaqueRun - peeled <= 5) break;

      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      const warm = r - b;
      const isGum = r > 90 && g > 58 && warm > 25 && r >= g - 3 && L > 78 && b < 95;

      if (peeled < FORCE_NIBBLE) {
        d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
        peeled++;
        continue;
      }
      if (!isGum && a < 220 && L < 120) {
        d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
        peeled++;
        continue;
      }
      const olive = Math.abs(r - g) <= 22 && g + 10 >= r;
      const isDarkFringe =
        !isGum && L < 88 && r < 98 && (L < 70 || olive || warm < 55 || g > r);
      if (isDarkFringe) {
        d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
        peeled++;
        continue;
      }
      break;
    }
  }

  // Fourth pass: kill leftover dark speckles hanging into transparent
  const copy = new Uint8ClampedArray(d);
  for (let y = Math.max(1, floorY - 30); y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = (y * W + x) * 4;
      const a = copy[i + 3];
      if (a < 8) continue;
      const L = 0.299 * copy[i] + 0.587 * copy[i + 1] + 0.114 * copy[i + 2];
      if (L > 95 && a > 240) continue;
      let trans = 0;
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, 1],
        [1, 1],
      ]) {
        if (copy[((y + dy) * W + (x + dx)) * 4 + 3] < 20) trans++;
      }
      if (trans >= 3 && L < 100) {
        d[i] = d[i + 1] = d[i + 2] = d[i + 3] = 0;
      }
    }
  }

  // Fifth pass: recolor remaining dark sole-edge pixels toward local gum
  // so the silhouette doesn't read as an olive fringe on light backgrounds.
  const gumAt = new Array(W);
  for (let x = 0; x < W; x++) {
    let contactY = -1;
    for (let y = H - 1; y >= 0; y--) {
      if (d[(y * W + x) * 4 + 3] > 200) {
        contactY = y;
        break;
      }
    }
    gumAt[x] = null;
    if (contactY < 0) continue;

    let sr = 0,
      sg = 0,
      sb = 0,
      sn = 0;
    for (let y = contactY - 6; y >= Math.max(0, contactY - 22); y--) {
      const i = (y * W + x) * 4;
      if (d[i + 3] < 200) continue;
      const r = d[i],
        g = d[i + 1],
        b = d[i + 2];
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      const warm = r - b;
      if (r > 80 && warm > 18 && L > 70 && L < 170) {
        sr += r;
        sg += g;
        sb += b;
        sn++;
      }
    }
    if (sn >= 3) {
      gumAt[x] = {
        contactY,
        r: Math.round(sr / sn),
        g: Math.round(sg / sn),
        b: Math.round(sb / sn),
      };
    } else {
      gumAt[x] = { contactY, r: 0, g: 0, b: 0, weak: true };
    }
  }

  // Fill weak gum samples from nearest strong neighbor
  for (let x = 0; x < W; x++) {
    if (!gumAt[x] || !gumAt[x].weak) continue;
    let donor = null;
    for (let dlt = 1; dlt < 80 && !donor; dlt++) {
      if (x - dlt >= 0 && gumAt[x - dlt] && !gumAt[x - dlt].weak) donor = gumAt[x - dlt];
      else if (x + dlt < W && gumAt[x + dlt] && !gumAt[x + dlt].weak) donor = gumAt[x + dlt];
    }
    if (donor) {
      gumAt[x].r = donor.r;
      gumAt[x].g = donor.g;
      gumAt[x].b = donor.b;
      gumAt[x].weak = false;
    }
  }

  for (let x = 0; x < W; x++) {
    const ginfo = gumAt[x];
    if (!ginfo || ginfo.weak) continue;
    const { contactY, r: sr, g: sg, b: sb } = ginfo;
    const sampleL = 0.299 * sr + 0.587 * sg + 0.114 * sb;

    for (let y = contactY; y >= Math.max(0, contactY - 5); y--) {
      const i = (y * W + x) * 4;
      if (d[i + 3] < 180) continue;
      const r = d[i],
        g = d[i + 1],
        b = d[i + 2];
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      const olive = Math.abs(r - g) <= 20 && g + 8 >= r;
      if (L < sampleL - 6 || (L < 100 && olive) || (r < 95 && L < 92)) {
        d[i] = Math.round(r * 0.2 + sr * 0.8);
        d[i + 1] = Math.round(g * 0.2 + sg * 0.8);
        d[i + 2] = Math.round(b * 0.2 + sb * 0.8);
        d[i + 3] = 255;
      }
    }
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
console.log(`1/3 ffmpeg extract ${TARGET} frames @ ${fps}fps…`);
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
      source: "munich-sneaker-colorways.mp4",
      size: [W, H],
      duration: DURATION_S,
      key: "chroma-green",
      colorways: {
        mn: { start: 0.0, end: 0.18, label: "Mostaza / Azul" },
        bn: { start: 0.2, end: 0.48, label: "Hueso / Marino" },
        bk: { start: 0.5, end: 0.77, label: "Carbón / Blanco" },
        bu: { start: 0.8, end: 0.95, label: "Burdeos / Crema" },
      },
    },
    null,
    2,
  ),
);

fs.rmSync(RAW, { recursive: true, force: true });
console.log(`3/3 done → ${OUT} (${raws.length} PNG)`);
