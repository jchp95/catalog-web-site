"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Maximum tilt in degrees. Defaults to a subtle 6°. */
  intensity?: number;
};

/**
 * A cursor-reactive 3D tilt, generalized from the showroom's LiveDeck.
 * Mouse-only (no fighting a touch scroll) and inert under reduced motion —
 * a small, real depth cue rather than a decorative flourish.
 */
export function TiltCard({ children, className, style, intensity = 6 }: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 22 });
  const sy = useSpring(my, { stiffness: 200, damping: 22 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);

  function track(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      className={className}
      style={{ ...style, transformPerspective: 1000, rotateX: reduceMotion ? 0 : rotateX, rotateY: reduceMotion ? 0 : rotateY }}
      onPointerMove={track}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.div>
  );
}
