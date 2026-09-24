"use client";

import { useEffect, useRef, useState } from "react";
import { FrameSequenceCanvas } from "../components/canvas/FrameSequenceCanvas";
import { COLORWAYS, type ColorwayId } from "../config/tokens";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp } from "../utils/math";

/**
 * Progress windows for each colorway inside the morph video.
 * Centers sit in the stable hold of each color (not the morph edges).
 */
const COLOR_PROGRESS: Record<
  ColorwayId,
  { start: number; end: number; center: number }
> = {
  mn: { start: 0.0, end: 0.22, center: 0.08 },
  bn: { start: 0.22, end: 0.48, center: 0.34 },
  bk: { start: 0.48, end: 0.74, center: 0.6 },
  bu: { start: 0.74, end: 1.0, center: 0.88 },
};

function colorFromProgress(p: number): ColorwayId {
  if (p < COLOR_PROGRESS.bn.start) return "mn";
  if (p < COLOR_PROGRESS.bk.start) return "bn";
  if (p < COLOR_PROGRESS.bu.start) return "bk";
  return "bu";
}

/**
 * Scroll-scrubbed colorway morph — frames from green-screen transition video,
 * synced with swatch bolitas.
 */
export function ColorwaysSection() {
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [progress, setProgress] = useState(0);
  const id = colorFromProgress(progress);
  const cw = COLORWAYS.find((c) => c.id === id) ?? COLORWAYS[0];

  useEffect(() => {
    ensureGsapPlugins();
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin) return;

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      pin,
      scrub: 0.85,
      onUpdate: (self) => setProgress(self.progress),
    });
    stRef.current = st;

    return () => {
      st.kill();
      stRef.current = null;
    };
  }, []);

  const selectColor = (next: ColorwayId) => {
    const st = stRef.current;
    const track = trackRef.current;
    if (!st || !track) return;
    const target = COLOR_PROGRESS[next].center;
    const start = st.start;
    const end = st.end;
    const y = start + (end - start) * target;
    const lenis = (window as Window & { __munichLenis?: { scrollTo: (v: number, o?: object) => void } })
      .__munichLenis;
    if (lenis) {
      lenis.scrollTo(y, { duration: 1.1 });
    } else {
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const tone =
    cw.fg === "#EFEBE3" || cw.fg === "#F0E2D6" ? "dark" : "light";

  return (
    <section
      ref={trackRef}
      className="munich-col"
      data-scene="col"
      data-tone={tone}
      aria-label="Colores"
    >
      <div
        ref={pinRef}
        className="munich-col-pin"
        style={{ background: cw.bg, color: cw.fg }}
      >
        <div className="munich-col-name" aria-hidden="true">
          {cw.short}
        </div>

        <div className="munich-col-top">
          <div>
            <span className="munich-mono">Colores — 04 ediciones</span>
            <h2>{cw.name}</h2>
          </div>
          <span className="munich-mono munich-col-note">
            Morph real · frames del estudio
          </span>
        </div>

        <div className="munich-col-wrap" data-cursor="view">
          <FrameSequenceCanvas
            sequence="colorway"
            progress={clamp(progress, 0, 1)}
            pad={0.04}
            smoothing={0.2}
            ariaLabel={`Barru 8290 colorway ${cw.name}`}
          />
        </div>

        <div className="munich-col-bot">
          <div role="radiogroup" aria-label="Elegir color" className="munich-col-swatches">
            {COLORWAYS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={c.id === id}
                aria-label={c.name}
                data-cursor="link"
                className={c.id === id ? "is-active" : ""}
                onClick={() => selectColor(c.id)}
              >
                <span
                  className="munich-col-swatch"
                  style={{
                    background: `linear-gradient(135deg, ${c.a} 50%, ${c.b} 50%)`,
                  }}
                />
                <span>{c.short}</span>
              </button>
            ))}
          </div>
          <div className="munich-col-cta">
            <span className="munich-mono">110,00 €</span>
            <a href="#shop" data-cursor="cta" className="munich-pill">
              Comprar este color <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
