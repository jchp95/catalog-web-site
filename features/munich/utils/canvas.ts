/** Draw an image covering a canvas while preserving aspect ratio (object-fit: cover). */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  canvasW: number,
  canvasH: number,
  imgW: number,
  imgH: number,
): void {
  const scale = Math.max(canvasW / imgW, canvasH / imgH);
  const w = imgW * scale;
  const h = imgH * scale;
  const x = (canvasW - w) / 2;
  const y = (canvasH - h) / 2;
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, x, y, w, h);
}

/** Fit entire image inside canvas (object-fit: contain) — no crop. */
export function drawContain(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  canvasW: number,
  canvasH: number,
  imgW: number,
  imgH: number,
  pad = 0.04,
): void {
  const innerW = canvasW * (1 - pad * 2);
  const innerH = canvasH * (1 - pad * 2);
  const scale = Math.min(innerW / imgW, innerH / imgH);
  const w = imgW * scale;
  const h = imgH * scale;
  const x = (canvasW - w) / 2;
  const y = (canvasH - h) / 2;
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, x, y, w, h);
}

export function setupHiDPICanvas(
  canvas: HTMLCanvasElement,
  cssW: number,
  cssH: number,
  maxDpr = 2,
): { ctx: CanvasRenderingContext2D; dpr: number } | null {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  canvas.width = Math.max(1, Math.floor(cssW * dpr));
  canvas.height = Math.max(1, Math.floor(cssH * dpr));
  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, dpr };
}
