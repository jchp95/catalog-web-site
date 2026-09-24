"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";

export function KineticTypographySection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const el = root.current;
    if (!el) return;
    const k0 = el.querySelector(".munich-kin-0");
    const k1 = el.querySelector(".munich-kin-1");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        k0,
        { xPercent: 0 },
        {
          xPercent: -38,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        k1,
        { xPercent: -52 },
        {
          xPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="munich-kin"
      data-scene="kin"
      data-tone="dark"
      aria-label="Muévete, corre, crea, repite"
    >
      <div className="munich-kin-0" aria-hidden="true">
        Muévete — Corre — Crea — Repite — Muévete — Corre — Crea — Repite —
      </div>
      <div className="munich-kin-mid munich-mono">
        <span>Barru 8290</span>
        <span>Ante · Piel · Goma</span>
      </div>
      <div className="munich-kin-1" aria-hidden="true">
        Repite — Crea — Corre — Muévete — Repite — Crea — Corre — Muévete — Repite —
      </div>
      <p className="sr-only">Muévete, corre, crea, repite.</p>
    </section>
  );
}
