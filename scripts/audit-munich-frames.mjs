import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, ".tmp/playwright-munich");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://127.0.0.1:3000/demos/munich", {
  waitUntil: "domcontentloaded",
  timeout: 120000,
});

await page
  .waitForFunction(
    () => !document.querySelector(".munich-preloader:not(.munich-preloader--exit)"),
    { timeout: 180000 },
  )
  .catch(() => {});
await page.waitForTimeout(1000);
await page.evaluate(() => {
  document.querySelectorAll(".munich-preloader").forEach((el) => el.remove());
  window.scrollTo(0, 0);
});
await page.waitForTimeout(500);

const hero = page.locator(".munich-rot-pin").first();
await hero.screenshot({ path: path.join(outDir, "01-hero-top.png") });

const trackBox = await page.locator(".munich-rot").boundingBox();
const shots = [];
if (trackBox) {
  for (const [name, frac] of [
    ["02-orbit-25", 0.25],
    ["03-orbit-45", 0.45],
    ["04-orbit-70", 0.7],
  ]) {
    await page.evaluate(
      ({ y, h, f }) => window.scrollTo(0, y + h * f),
      { y: trackBox.y, h: trackBox.height, f: frac },
    );
    await page.waitForTimeout(800);
    await hero.screenshot({ path: path.join(outDir, `${name}.png`) });
    shots.push(name);
  }
}

const probe = await page.evaluate(() => {
  const canvas = document.querySelector(".munich-rot-shoe canvas");
  if (!canvas) return { ok: false, reason: "no canvas" };
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const img = ctx.getImageData(0, 0, w, h);
  const a = (x, y) => img.data[(y * w + x) * 4 + 3];
  let minX = w,
    minY = h,
    maxX = 0,
    maxY = 0,
    opaque = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (a(x, y) > 20) {
        opaque++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return {
    ok: opaque > 0,
    w,
    h,
    padT: minY,
    padB: h - 1 - maxY,
    padL: minX,
    padR: w - 1 - maxX,
    cy: (minY + maxY) / 2 / h,
    opaque,
    clippedTop: minY <= 1,
    clippedBottom: maxY >= h - 2,
    clippedLeft: minX <= 1,
    clippedRight: maxX >= w - 2,
  };
});

fs.writeFileSync(path.join(outDir, "probe.json"), JSON.stringify({ probe, shots }, null, 2));
console.log(JSON.stringify({ probe, shots }, null, 2));
await browser.close();
