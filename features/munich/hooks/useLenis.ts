"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapPlugins } from "./useGSAPContext";
import { useMunichReducedMotion } from "./useMunichReducedMotion";

/** Boots Lenis + wires it to ScrollTrigger. Disabled under reduced motion. */
export function useLenis(enabled = true) {
  const reduced = useMunichReducedMotion();

  useEffect(() => {
    if (!enabled || reduced) return;
    ensureGsapPlugins();

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    // Expose for QA / browser automation (scrollTo bypass)
    (window as Window & { __munichLenis?: Lenis }).__munichLenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      const w = window as Window & { __munichLenis?: Lenis };
      if (w.__munichLenis === lenis) delete w.__munichLenis;
      lenis.destroy();
    };
  }, [enabled, reduced]);
}
