"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function ensureGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/** Scoped GSAP context that auto-kills on unmount. */
export function useGSAPContext(
  setup: (ctx: gsap.Context) => void,
  deps: unknown[] = [],
) {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    ensureGsapPlugins();
    if (!root.current) return;
    const ctx = gsap.context(() => setup(ctx), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return root;
}
