"use client";

import { useEffect, useRef, useState } from "react";
import { lerp } from "../../utils/math";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useMunichReducedMotion } from "../../hooks/useMunichReducedMotion";

type Mode = "default" | "drag" | "view";

/**
 * Desktop custom cursor. System cursor stays visible until this arms
 * `.munich-root--custom-cursor` on first pointer move (see munich.css).
 */
export function CustomCursor() {
  const enabled = useMediaQuery("(pointer: fine) and (min-width: 1024px)");
  const reduced = useMunichReducedMotion();
  const active = enabled && !reduced;
  const dot = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const armed = useRef(false);
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;

    const root = document.querySelector(".munich-root");
    const arm = () => {
      if (armed.current) return;
      armed.current = true;
      root?.classList.add("munich-root--custom-cursor");
      setVisible(true);
    };
    const disarm = () => {
      armed.current = false;
      root?.classList.remove("munich-root--custom-cursor");
      setVisible(false);
    };

    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!armed.current) {
        current.current = { x: e.clientX, y: e.clientY };
        arm();
      }
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      const next = (el?.dataset.cursor as Mode | undefined) ?? "default";
      setMode(next);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", disarm);

    let raf = 0;
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.22);
      current.current.y = lerp(current.current.y, target.current.y, 0.22);
      if (dot.current) {
        dot.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", disarm);
      disarm();
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={dot}
      className={`munich-cursor munich-cursor--${mode} ${visible ? "is-on" : ""}`}
      aria-hidden="true"
    >
      <i />
      <span>{mode === "default" ? "" : mode.toUpperCase()}</span>
    </div>
  );
}
