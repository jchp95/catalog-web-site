"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  colorwayFrameUrl,
  explodedFrameUrl,
  frameUrl,
  type FrameSequenceVariant,
} from "../config/assets";
import { clamp, lerp } from "../utils/math";

type Options = {
  frameCount: number;
  smoothing?: number;
  enabled?: boolean;
  /** Orbit / exploded / colorway sequences. */
  sequence?: "orbit" | "explod" | "colorway";
  variant?: "desktop" | "mobile";
  resolveUrl?: (index: number) => string;
};

type FrameCache = Map<number, HTMLImageElement>;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Intelligent frame preloader + smoothed frame index from scroll progress.
 */
export function useFrameSequence({
  frameCount,
  smoothing = 0.16,
  enabled = true,
  sequence = "orbit",
  variant = "desktop",
  resolveUrl,
}: Options) {
  const cache = useRef<FrameCache>(new Map());
  const [ready, setReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const current = useRef(0);
  const target = useRef(0);
  const [, bump] = useState(0);

  const urlFor = useCallback(
    (index: number) => {
      if (resolveUrl) return resolveUrl(index);
      if (sequence === "explod") return explodedFrameUrl(index);
      if (sequence === "colorway") return colorwayFrameUrl(index);
      return frameUrl(variant, index);
    },
    [resolveUrl, sequence, variant],
  );

  const getFrame = useCallback(
    (index: number) => cache.current.get(clamp(Math.round(index), 0, frameCount - 1)),
    [frameCount],
  );

  const preloadRange = useCallback(
    async (from: number, to: number) => {
      const jobs: Promise<void>[] = [];
      for (let i = from; i <= to; i++) {
        if (cache.current.has(i)) continue;
        jobs.push(
          loadImage(urlFor(i))
            .then((img) => {
              cache.current.set(i, img);
              setLoadedCount((c) => c + 1);
            })
            .catch(() => undefined),
        );
      }
      await Promise.all(jobs);
    },
    [urlFor],
  );

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    (async () => {
      await preloadRange(0, Math.min(4, frameCount - 1));
      if (cancelled) return;
      setReady(true);
      await preloadRange(5, Math.min(19, frameCount - 1));
      if (cancelled) return;
      await preloadRange(20, frameCount - 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, frameCount, preloadRange]);

  const setProgress = useCallback(
    (progress: number) => {
      target.current = clamp(progress, 0, 1) * (frameCount - 1);
    },
    [frameCount],
  );

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const tick = () => {
      current.current = lerp(current.current, target.current, smoothing);
      bump((n) => (n + 1) % 100000);
      const near = Math.round(current.current);
      for (let i = near - 2; i <= near + 4; i++) {
        if (i < 0 || i >= frameCount || cache.current.has(i)) continue;
        void loadImage(urlFor(i)).then((img) => cache.current.set(i, img));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, frameCount, smoothing, urlFor]);

  return {
    ready,
    loadedCount,
    frameCount,
    getCurrentFrame: () => current.current,
    getFrame,
    setProgress,
    preloadRange,
  };
}

export type { FrameSequenceVariant };
