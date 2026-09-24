"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { ASSETS } from "../config/assets";

/**
 * PRECISION IN EVERY DETAIL — kept from our build.
 * Visual treatment upgraded with prototype product photography.
 */
export function MacroDetailSection() {
  const root = useRef<HTMLElement>(null);
  const [zoom, setZoom] = useState("100%");

  useEffect(() => {
    ensureGsapPlugins();
    const el = root.current;
    if (!el) return;

    const pin = el.querySelector(".munich-macro-pin");
    const shoe = el.querySelector(".munich-macro-shoe");
    const photo = el.querySelector(".munich-macro-photo");
    const photoImg = el.querySelector(".munich-macro-photo img");
    const lines = el.querySelectorAll(".munich-macro-line");
    const cap = el.querySelector(".munich-macro-cap");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
        pin,
        onUpdate: (self) => {
          const p = self.progress;
          const z = 1 + p * 1.6;
          const ph = Math.max(0, Math.min(1, (p - 0.46) / 0.18));
          setZoom(
            ph > 0.5
              ? `${Math.round(400 + ph * 400)}%`
              : `${Math.round(z * 100)}%`,
          );
        },
      },
    });

    tl.fromTo(
      shoe,
      { scale: 1, opacity: 1, filter: "blur(0px)" },
      { scale: 2.6, opacity: 0, filter: "blur(10px)", ease: "none", duration: 0.64 },
      0,
    )
      .fromTo(photo, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.22 }, 0.46)
      .fromTo(
        photoImg,
        { scale: 1.22 },
        { scale: 1.06, ease: "none", duration: 0.54 },
        0.46,
      );

    lines.forEach((line, i) => {
      tl.fromTo(
        line,
        { opacity: 0, x: i === 1 ? 40 : -40, clipPath: "inset(0 100% 0 0)" },
        {
          opacity: 1,
          x: 0,
          clipPath: "inset(0 0% 0 0)",
          ease: "power2.out",
          duration: 0.12,
        },
        0.2 + i * 0.07,
      );
    });

    if (cap) {
      tl.fromTo(cap, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.64);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="munich-macro"
      data-scene="macro"
      data-tone="dark"
      aria-label="Precision in every detail"
    >
      <div className="munich-macro-track">
        <div className="munich-macro-pin">
          <div className="munich-macro-hud munich-mono" aria-hidden="true">
            <span className="munich-macro-cross" />
            <span>
              Zoom <b>{zoom}</b>
            </span>
          </div>

          <div className="munich-macro-shoe">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.ZOOM_SHOE}
              alt=""
              className="munich-photo-cut munich-photo-cut--clean"
            />
          </div>

          <div className="munich-macro-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ASSETS.PHOTOS.heel}
              alt="Macro del talón: ante mostaza, refuerzo azul y suela de goma"
            />
            <div className="munich-macro-photo-grad" aria-hidden="true" />
          </div>

          <div className="munich-macro-copy">
            <h2>
              <span className="munich-macro-line">PRECISION</span>
              <span className="munich-macro-line munich-macro-line--indent">
                IN EVERY
              </span>
              <span className="munich-macro-line munich-macro-line--accent">
                DETAIL.
              </span>
            </h2>
            <p className="munich-macro-cap">
              Heel reinforcement in navy suede, visible stitch, and herringbone
              gum. Each piece cut and set by hand.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
