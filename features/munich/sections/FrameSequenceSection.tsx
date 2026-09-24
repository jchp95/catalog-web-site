"use client";

import { FrameSequenceCanvas } from "../components/canvas/FrameSequenceCanvas";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { useScrollVelocity } from "../hooks/useScrollVelocity";
import { clamp, mapRange } from "../utils/math";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

const callouts = [
  { start: 0, end: 0.22, title: "MUNICH", body: "Designed to move." },
  { start: 0.22, end: 0.42, title: "ULTRA\nLIGHT", body: "Upper engineered for daily pace." },
  { start: 0.42, end: 0.62, title: "GRIP\nSYSTEM", body: "Cupsole rubber that holds the court." },
  { start: 0.62, end: 0.82, title: "BREATHABLE", body: "Construction that keeps air moving." },
  { start: 0.82, end: 1, title: "360°\nDESIGN", body: "Every angle, intentional." },
];

export function FrameSequenceSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const velocity = useScrollVelocity(0.1);

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

  const active = callouts.find((c) => progress >= c.start && progress < c.end) ?? callouts[0];
  const bgMix = progress < 0.33 ? "carbon" : progress < 0.66 ? "navy" : "mustard";

  return (
    <section
      ref={trackRef}
      id="orbit"
      className={`munich-orbit munich-orbit--${bgMix}`}
      data-scene="orbit"
      data-tone={bgMix === "mustard" ? "light" : "dark"}
    >
      <div ref={pinRef} className="munich-orbit-pin">
        <div className="munich-orbit-stage" data-cursor="drag">
          <FrameSequenceCanvas progress={progress} velocity={velocity} />
        </div>

        <div className="munich-orbit-callout" key={active.title}>
          <span className="munich-kicker">
            {String(Math.round(progress * 360)).padStart(3, "0")}°
          </span>
          <h2>{active.title}</h2>
          <p>{active.body}</p>
          <div className="munich-orbit-line" aria-hidden="true">
            <i
              style={{
                transform: `scaleX(${clamp(mapRange(progress, active.start, active.end, 0, 1), 0, 1)})`,
              }}
            />
          </div>
        </div>

        <div className="munich-orbit-hint" aria-hidden="true">
          Keep scrolling to orbit
        </div>
      </div>
    </section>
  );
}
