"use client";

import { useEffect, useRef, useState } from "react";
import { lerp } from "../utils/math";

export function useScrollVelocity(smoothing = 0.12) {
  const [velocity, setVelocity] = useState(0);
  const lastY = useRef(0);
  const lastT = useRef(0);
  const smooth = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    lastT.current = performance.now();

    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY.current;
      const dt = Math.max(16, now - lastT.current);
      const raw = dy / dt;
      smooth.current = lerp(smooth.current, raw, smoothing);
      setVelocity(smooth.current);
      lastY.current = window.scrollY;
      lastT.current = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [smoothing]);

  return velocity;
}

export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pos;
}
