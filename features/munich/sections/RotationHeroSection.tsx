"use client";

import { useEffect, useRef, useState } from "react";
import { FrameSequenceCanvas } from "../components/canvas/FrameSequenceCanvas";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { useScrollVelocity } from "../hooks/useScrollVelocity";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clamp, mapRange } from "../utils/math";

const CALLOUTS = [
  {
    id: "a",
    start: 0.1,
    end: 0.27,
    kicker: "01 — Movimiento",
    title: "Diseñada\npara\nmoverse.",
    align: "left" as const,
  },
  {
    id: "b",
    start: 0.27,
    end: 0.43,
    kicker: "02 — Peso",
    title: "Ultra\nligera",
    align: "right" as const,
    line: "Empeine de ante flexible",
    linePos: { left: "46%", top: "36%" },
  },
  {
    id: "c",
    start: 0.43,
    end: 0.6,
    kicker: "03 — Tracción",
    title: "Sistema\nde agarre",
    align: "left" as const,
    line: "Goma · punto de pivote",
    linePos: { left: "60%", top: "88%" },
  },
  {
    id: "d",
    start: 0.6,
    end: 0.77,
    kicker: "04 — Materiales",
    title: "Construcción\ntranspirable",
    align: "right" as const,
    line: "Forro textil acolchado",
    linePos: { left: "34%", top: "30%" },
  },
];

/**
 * Combined Hero + pinned 360° orbit — Claude Design structure.
 */
export function RotationHeroSection() {
  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const velocity = useScrollVelocity(0.085);

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

    return () => st.kill();
  }, []);

  const h = clamp(mapRange(progress, 0, 0.085, 0, 1), 0, 1);
  const frameP = clamp(mapRange(progress, 0.1, 0.9, 0, 1), 0, 1);
  const angle = Math.round(frameP * 90);
  const frameN = Math.round(frameP * 119) + 1;
  const showCada = progress > 0.77 && progress < 0.97;

  // shoe path keyframes (vw, vh, scale) matching prototype
  const shoeT = (() => {
    const K: [number, number, number, number][] = [
      [0, 0, 0, 1],
      [0.1, 0, 0, 1],
      [0.2, 15, 3, 0.86],
      [0.35, -12, 5, 1],
      [0.51, 8, -6, 1.06],
      [0.68, -13, 1, 1],
      [0.85, 0, 0, 0.9],
      [1, 0, -4, 0.72],
    ];
    let j = 0;
    while (j < K.length - 2 && progress > K[j + 1][0]) j++;
    const a = K[j];
    const b = K[j + 1];
    const tt = clamp((progress - a[0]) / (b[0] - a[0] || 1), 0, 1);
    const ease = tt < 0.5 ? 4 * tt * tt * tt : 1 - Math.pow(-2 * tt + 2, 3) / 2;
    return {
      x: a[1] + (b[1] - a[1]) * ease,
      y: a[2] + (b[2] - a[2]) * ease,
      s: a[3] + (b[3] - a[3]) * ease,
    };
  })();

  const skew = clamp(velocity * 18, -2.2, 2.2);

  return (
    <section
      ref={trackRef}
      id="top"
      className="munich-rot"
      data-scene="rot"
      data-tone="dark"
      aria-label="Barru 8290, rotación del producto"
    >
      <div ref={pinRef} className="munich-rot-pin">
        <div className="munich-rot-glow" aria-hidden="true" />

        <div
          className="munich-rot-back"
          aria-hidden="true"
          style={{
            opacity: 1 - h,
            transform: `translate3d(0, calc(-50% - ${h * 16}vh), 0) scale(${1 + h * 0.1})`,
          }}
        >
          <span>MUNICH</span>
        </div>

        {showCada ? (
          <div className="munich-rot-cada" aria-hidden="true">
            Cada
            <br />
            ángulo
          </div>
        ) : null}

        <div
          className="munich-rot-shoe"
          data-cursor="drag"
          style={{
            transform: `translate3d(calc(-50% + ${shoeT.x}vw), calc(-50% + ${shoeT.y}vh), 0) rotate(${skew}deg) skewX(${-skew * 0.5}deg) scale(${shoeT.s})`,
          }}
        >
          <div className="munich-rot-shadow" aria-hidden="true" />
          <FrameSequenceCanvas progress={frameP} velocity={velocity} />

          {CALLOUTS.filter((c) => c.line).map((c) => {
            const on = progress >= c.start && progress < c.end;
            if (!on || !c.linePos) return null;
            return (
              <div key={c.id} className="munich-rot-linecall" aria-hidden="true">
                <span
                  className="munich-rot-dot"
                  style={{ left: c.linePos.left, top: c.linePos.top }}
                />
                <span className="munich-rot-linetext" style={{ left: `calc(${c.linePos.left} + 8%)`, top: c.linePos.top }}>
                  {c.line}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className="munich-rot-front"
          style={{
            opacity: 1 - clamp(h * 1.4, 0, 1),
            transform: `translate3d(0, ${h * 4}vh, 0)`,
          }}
        >
          <div>
            <span className="munich-mono">Colección 26 — Edición mostaza</span>
            <h1>
              Barru
              <br />
              <em>8290</em>
            </h1>
          </div>
          <div className="munich-rot-front-r">
            <p>Ante mostaza, X de piel azul y suela de goma translúcida.</p>
            <span className="munich-mono">110,00 €</span>
          </div>
        </div>

        <div
          className="munich-rot-scroll"
          aria-hidden="true"
          style={{ opacity: 0.8 * (1 - clamp(h * 4, 0, 1)) }}
        >
          <span>Desliza</span>
          <i />
        </div>

        {CALLOUTS.map((c) => {
          const on = progress >= c.start && progress < c.end;
          if (!on) return null;
          const local = clamp(mapRange(progress, c.start, c.end, 0, 1), 0, 1);
          const fade = local > 0.75 ? (1 - local) / 0.25 : 1;
          return (
            <div
              key={c.id}
              className={`munich-rot-cal munich-rot-cal--${c.align}`}
              style={{ opacity: fade }}
            >
              <span className="munich-mono munich-rot-cal-k">{c.kicker}</span>
              <h2>{c.title}</h2>
            </div>
          );
        })}

        <div
          className="munich-rot-hud"
          aria-hidden="true"
          style={{
            opacity:
              progress > 0.08 && progress < 0.92 ? 0.7 : 0,
          }}
        >
          <span>
            Frame {String(Math.min(120, frameN)).padStart(3, "0")} / 120
          </span>
          <span>{angle}°</span>
        </div>
      </div>
    </section>
  );
}
