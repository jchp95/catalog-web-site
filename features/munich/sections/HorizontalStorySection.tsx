"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { ASSETS } from "../config/assets";

const VIEWS = [
  {
    n: "01",
    name: "Lateral",
    src: ASSETS.HORIZONTAL.lateral,
    bg: "#E3DDD2",
    fg: "#111112",
    cap: "Perfil exterior. La X de piel cosida sobre el ante mostaza.",
  },
  {
    n: "02",
    name: "Superior",
    src: ASSETS.HORIZONTAL.superior,
    bg: "#D6A12B",
    fg: "#111112",
    cap: "Cordonera cerrada, lengüeta acolchada y plantilla marcada.",
  },
  {
    n: "03",
    name: "Suela",
    src: ASSETS.HORIZONTAL.sole,
    bg: "#0E1B36",
    fg: "#EFEBE3",
    cap: "Goma con punto de pivote en el antepié y dibujo de ondas.",
  },
  {
    n: "04",
    name: "Talón",
    src: ASSETS.HORIZONTAL.heel,
    bg: "#EFE7DC",
    fg: "#111112",
    cover: true,
    cap: "Refuerzo de ante azul con costura doble.",
  },
  {
    n: "05",
    name: "Medial",
    src: ASSETS.HORIZONTAL.medial,
    bg: "#161617",
    fg: "#EFEBE3",
    cap: "Perfil interior. La misma línea, leída al revés.",
  },
];

export function HorizontalStorySection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const el = root.current;
    if (!el) return;
    const pin = el.querySelector(".munich-hor-pin");
    const track = el.querySelector<HTMLElement>(".munich-hor-track");
    if (!pin || !track) return;

    const getMax = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(track, { x: 0 }, { x: () => -getMax(), ease: "none" });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="munich-hor"
      data-scene="hor"
      data-tone="light"
      aria-label="Cinco vistas del producto"
    >
      <div className="munich-hor-spacer">
        <div className="munich-hor-pin">
          <div className="munich-hor-track">
            <div className="munich-hor-intro">
              <span className="munich-mono">Vistas 01 — 05</span>
              <h2>
                Un objeto.
                <br />
                Cinco
                <br />
                miradas.
              </h2>
              <p>
                La Barru 8290 no tiene lado malo. Recorre la silueta de perfil,
                desde arriba, por debajo y de cerca.
              </p>
            </div>
            {VIEWS.map((v) => (
              <article
                key={v.n}
                className="munich-hor-panel"
                style={{ background: v.bg, color: v.fg }}
              >
                <span className="munich-mono munich-hor-n">{v.n} / 05</span>
                <div className={`munich-hor-img${v.cover ? " munich-hor-img--cover" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.src}
                    alt={v.cap}
                    className={v.cover ? "" : "munich-hor-photo"}
                  />
                </div>
                <div className="munich-hor-foot">
                  <h3>{v.name}</h3>
                  <p>{v.cap}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="munich-hor-tabs munich-mono" aria-hidden="true">
            {VIEWS.map((v) => (
              <span key={v.n}>{v.name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
