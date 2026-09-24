"use client";

import { useReducedMotion } from "motion/react";

/** Prefer reduced motion from OS, or force-disable heavy effects. */
export function useMunichReducedMotion(): boolean {
  return Boolean(useReducedMotion());
}
