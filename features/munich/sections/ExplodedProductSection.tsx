"use client";

import { useEffect, useRef, useState } from "react";
import { FrameSequenceCanvas } from "../components/canvas/FrameSequenceCanvas";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp, mapRange } from "../utils/math";

/**
 * Callouts aligned to the keyed exploded video when pieces are fully open.
 * tip % are relative to the 16:9 stage (shoe faces right), calibrated to
 * open plates (~frame 40–60) after drawContain pad.
 */
const CALLOUTS = [
  {
    id: "upper",
    label: "Ante mostaza",
    kicker: "01 — Upper",
    title: "Ligereza",
    desc: "Panel de ante sin refuerzos rígidos: dobla con el pie desde el primer paso.",
    // Mustard lateral body (sampled @ progress 0.40)
    tip: { left: "44%", top: "35%" },
    dock: "left" as const,
    start: 0.36,
    end: 0.46,
  },
  {
    id: "x",
    label: "Panel X",
    kicker: "02 — Firma",
    title: "Identidad",
    desc: "La X de piel azul ancla el lateral y da la silueta Munich al primer golpe de vista.",
    // Navy X (sampled @ progress 0.50 → rgba navy)
    tip: { left: "48%", top: "43%" },
    dock: "right" as const,
    start: 0.46,
    end: 0.54,
  },
  {
    id: "insole",
    label: "Plantilla",
    kicker: "03 — Comfort",
    title: "Confort",
    desc: "Plantilla acolchada que reparte la presión y mantiene el pie fresco en movimiento.",
    // Center of the floating black insole slab (below upper, above gum sole)
    tip: { left: "51%", top: "75%" },
    dock: "left" as const,
    start: 0.54,
    end: 0.62,
  },
  {
    id: "sole",
    label: "Suela de goma",
    kicker: "04 — Grip",
    title: "Tracción",
    desc: "Goma con dibujo de ondas y punto de pivote para giros limpios en cancha.",
    // Gum outsole while still open (sampled @ progress 0.65)
    tip: { left: "54%", top: "81%" },
    dock: "right" as const,
    start: 0.62,
    end: 0.72,
  },
];

/**
 * Scroll-scrubbed exploded construction from real green-screen plates.
 */
export function ExplodedProductSection() {
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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
      scrub: 0.9,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => st.kill();
  }, []);

  const active = CALLOUTS.find((c) => progress >= c.start && progress < c.end);
  const openAmount = clamp(mapRange(progress, 0.2, 0.42, 0, 1), 0, 1);
  const stepIndex = active
    ? CALLOUTS.findIndex((c) => c.id === active.id)
    : progress < CALLOUTS[0].start
      ? -1
      : CALLOUTS.length - 1;

  return (
    <section
      ref={trackRef}
      className="munich-exp"
      data-scene="exp"
      data-tone="light"
      aria-label="Despiece del producto"
    >
      <div ref={pinRef} className="munich-exp-pin">
        <div className="munich-exp-top munich-mono">
          <span>Despiece — 04 capas</span>
          <span className="munich-exp-count">
            {stepIndex < 0
              ? "00 / 04"
              : `${String(stepIndex + 1).padStart(2, "0")} / 04`}
          </span>
        </div>

        <div
          className="munich-exp-stage"
          style={{
            transform: `translate(-50%, -52%) scale(${0.92 + openAmount * 0.08})`,
          }}
        >
          <FrameSequenceCanvas
            sequence="explod"
            progress={progress}
            pad={0.03}
            ariaLabel="Despiece Barru 8290 — capas del producto"
            smoothing={0.18}
          />

          {active ? (
            <div
              className={`munich-exp-call munich-exp-call--${active.dock}`}
              aria-hidden="true"
            >
              <span
                className="munich-exp-tip"
                style={{ left: active.tip.left, top: active.tip.top }}
              />
              <svg className="munich-exp-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line
                  x1={active.dock === "left" ? 16 : 84}
                  y1={parseFloat(active.tip.top)}
                  x2={parseFloat(active.tip.left)}
                  y2={parseFloat(active.tip.top)}
                  stroke="currentColor"
                  strokeWidth="0.35"
                />
              </svg>
              <div
                className="munich-exp-call-copy"
                style={
                  active.dock === "left"
                    ? { left: "3%", top: `${Math.max(8, parseFloat(active.tip.top) - 6)}%` }
                    : { right: "3%", top: `${Math.max(8, parseFloat(active.tip.top) - 8)}%` }
                }
              >
                <span className="munich-mono munich-exp-call-k">{active.kicker}</span>
                <strong>{active.label}</strong>
              </div>
            </div>
          ) : null}
        </div>

        <div className="munich-exp-story" aria-live="polite">
          {active ? (
            <>
              <h2 className="munich-exp-title">{active.title}</h2>
              <p className="munich-exp-desc">{active.desc}</p>
            </>
          ) : progress < 0.22 ? (
            <>
              <h2 className="munich-exp-title">Construcción</h2>
              <p className="munich-exp-desc">
                Cada capa de la Barru 8290 se revela al deslizar: upper, firma, plantilla y suela.
              </p>
            </>
          ) : progress > 0.78 ? (
            <>
              <h2 className="munich-exp-title">Unidad</h2>
              <p className="munich-exp-desc">
                Las piezas vuelven a encajar. Ligereza, confort y tracción en una sola silueta.
              </p>
            </>
          ) : (
            <>
              <h2 className="munich-exp-title">Despiece</h2>
              <p className="munich-exp-desc">
                Las capas se separan para mostrar cómo trabaja cada componente.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
