"use client";

import { useEffect, useRef } from "react";
import { drawContain, setupHiDPICanvas } from "../../utils/canvas";
import { clamp } from "../../utils/math";
import { useFrameSequence } from "../../hooks/useFrameSequence";
import { useMunichReducedMotion } from "../../hooks/useMunichReducedMotion";
import { ASSETS } from "../../config/assets";
import { useIsMobile } from "../../hooks/useMediaQuery";

type Props = {
  progress: number;
  velocity?: number;
  className?: string;
  smoothing?: number;
  /** Default orbit 360; explod = construction; colorway = color morph. */
  sequence?: "orbit" | "explod" | "colorway";
  ariaLabel?: string;
  pad?: number;
};

/**
 * Scroll-linked product frame orbit / exploded / colorway sequences (keyed PNG plates).
 */
export function FrameSequenceCanvas({
  progress,
  velocity = 0,
  className = "",
  smoothing,
  sequence = "orbit",
  ariaLabel = "Munich Barru 360 degree product view",
  pad = 0.04,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFrameRef = useRef<HTMLImageElement | null>(null);
  const mobile = useIsMobile();
  const reduced = useMunichReducedMotion();
  const variant = mobile ? "mobile" : "desktop";
  const cfg =
    sequence === "explod"
      ? ASSETS.EXPLODED_FRAME_SEQUENCE
      : sequence === "colorway"
        ? ASSETS.COLORWAY_FRAME_SEQUENCE
        : ASSETS.PRODUCT_FRAME_SEQUENCE[variant];
  const frameCount = cfg.count;
  const useImages =
    sequence === "explod"
      ? ASSETS.EXPLODED_FRAME_SEQUENCE.useImageFrames
      : sequence === "colorway"
        ? ASSETS.COLORWAY_FRAME_SEQUENCE.useImageFrames
        : ASSETS.PRODUCT_FRAME_SEQUENCE.useImageFrames;

  const seq = useFrameSequence({
    sequence,
    variant,
    frameCount,
    smoothing: smoothing ?? (reduced ? 1 : 0.14),
    enabled: useImages,
  });

  useEffect(() => {
    if (useImages) seq.setProgress(reduced ? 0.35 : progress);
  }, [progress, reduced, seq, useImages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    const poster = new Image();
    poster.decoding = "async";
    poster.src = ASSETS.CUTS.side;

    const pickFrame = () => {
      if (!useImages) return null;
      const idx = Math.round(seq.getCurrentFrame());
      const exact = seq.getFrame(idx);
      if (exact && exact.complete && exact.naturalWidth > 0) {
        lastFrameRef.current = exact;
        return exact;
      }
      // Prefer a nearby loaded plate over the static poster cut — that flash
      // felt like two animations fighting while frames streamed in.
      for (let d = 1; d <= 8; d++) {
        const a = seq.getFrame(idx + d);
        if (a?.complete && a.naturalWidth > 0) {
          lastFrameRef.current = a;
          return a;
        }
        const b = seq.getFrame(idx - d);
        if (b?.complete && b.naturalWidth > 0) {
          lastFrameRef.current = b;
          return b;
        }
      }
      if (lastFrameRef.current?.complete && lastFrameRef.current.naturalWidth > 0) {
        return lastFrameRef.current;
      }
      return poster.complete && poster.naturalWidth > 0 ? poster : null;
    };

    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const cssW = parent.clientWidth;
      const cssH = parent.clientHeight;
      const setup = setupHiDPICanvas(canvas, cssW, cssH, 2);
      if (!setup) return;
      const { ctx } = setup;

      const skew = clamp(velocity * 18, -1.5, 1.5);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.save();
      ctx.translate(cssW / 2, cssH / 2);
      ctx.rotate((skew * Math.PI) / 180);
      ctx.translate(-cssW / 2, -cssH / 2);

      const draw = pickFrame();
      if (draw) {
        drawContain(ctx, draw, cssW, cssH, draw.naturalWidth, draw.naturalHeight, pad);
      }
      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [progress, velocity, seq, useImages, pad]);

  return (
    <div className={`munich-frame-stage ${className}`}>
      <canvas ref={canvasRef} aria-label={ariaLabel} />
      {useImages && !seq.ready ? <span className="munich-frame-loading" aria-hidden="true" /> : null}
    </div>
  );
}
