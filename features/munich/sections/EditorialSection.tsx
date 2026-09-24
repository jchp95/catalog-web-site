"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { ASSETS } from "../config/assets";

export function EditorialSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const el = root.current;
    if (!el) return;
    const a = el.querySelector(".munich-edi-a img");
    const b = el.querySelector(".munich-edi-b img");
    const t = el.querySelector(".munich-edi-t");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        a,
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        b,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        t,
        { x: "2.5vw" },
        {
          x: "-2.5vw",
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
      id="story"
      className="munich-edi"
      data-scene="edi"
      data-tone="light"
      aria-label="Nacida en Barcelona"
    >
      <div className="munich-edi-inner">
        <div className="munich-edi-stage">
          {/* Type under the shoes — letters peek from behind the product */}
          <h2 className="munich-edi-t">
            Nacida
            <br />
            <span>en</span>
            <br />
            Barcelona.
          </h2>

          <figure className="munich-edi-a">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.EDITORIAL.hero}
              alt="Barru 8290 mostaza — perfil"
              className="munich-photo-cut munich-photo-cut--clean munich-edi-shoe"
              draggable={false}
            />
          </figure>

          <figure className="munich-edi-b">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.EDITORIAL.float}
              alt="Barru 8290 mostaza — tres cuartos"
              className="munich-photo-cut munich-photo-cut--clean munich-edi-shoe"
              draggable={false}
            />
          </figure>

          <div className="munich-edi-coords munich-mono" aria-hidden="true">
            Barcelona — 41.3874° N · 2.1686° E
          </div>
        </div>

        <div className="munich-edi-copy">
          <span className="munich-mono">Historia</span>
          <p>
            Una silueta de pista cubierta llevada a la calle. Ante, piel y goma
            en una ciudad que no se queda quieta: la Barru mira al mar, al
            asfalto y a la grada al mismo tiempo.
          </p>
        </div>
      </div>
    </section>
  );
}
