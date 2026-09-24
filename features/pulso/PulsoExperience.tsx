"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";
import { ProductStage } from "./ProductStage";

/**
 * PULSO — product showroom proof for scroll-linked 360° GLB inspection.
 * The hero track is tall; the stage sticks while scroll progress drives a
 * full revolution of the sneaker.
 */
export function PulsoExperience() {
  const [brand, setBrand] = useState("PULSO");
  const [city, setCity] = useState("Barcelona");
  const trackRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    mass: 0.35,
  });

  const degrees = useTransform(smooth, [0, 1], [0, 360]);
  const degreeLabel = useTransform(degrees, (v) => `${Math.round(v)}°`);
  const progressWidth = useMotionTemplate`${useTransform(smooth, [0, 1], [0, 100])}%`;

  const beat1 = useTransform(smooth, [0, 0.18, 0.32], [1, 1, 0]);
  const beat2 = useTransform(smooth, [0.28, 0.42, 0.58], [0, 1, 0]);
  const beat3 = useTransform(smooth, [0.55, 0.7, 0.88], [0, 1, 0]);
  const beat4 = useTransform(smooth, [0.82, 0.95, 1], [0, 1, 1]);

  const yHint = useTransform(smooth, [0, 0.08], [0, 12]);
  const hintOpacity = useTransform(smooth, [0, 0.12], [1, 0]);

  return (
    <main className="pulso-shell" id="main-content">
      <header className="pulso-nav">
        <Link href="/" className="pulso-back">
          ← Showroom
        </Link>
        <a href="#top" className="pulso-logo" data-demo-brand>
          <i aria-hidden="true" />
          {brand}
        </a>
        <span className="pulso-nav-meta">PRODUCT LAB / {city}</span>
      </header>

      <section
        id="top"
        ref={trackRef}
        className="pulso-track"
        aria-label="Scroll to rotate the product 360 degrees"
      >
        <div className="pulso-sticky">
          <div className="pulso-stage">
            <ProductStage progress={smooth} />
          </div>

          <div className="pulso-overlay">
            <div className="pulso-copy">
              <span className="pulso-kicker">OWN GLB · SCROLL 360</span>
              <h1>
                Turn the
                <br />
                <em>product.</em>
              </h1>

              <div className="pulso-beats" aria-live="polite">
                <motion.p style={{ opacity: beat1 }}>
                  A real model in the page — not a stack of photos.
                </motion.p>
                <motion.p style={{ opacity: beat2 }}>
                  Studio light. Soft contact shadow. Faithful color.
                </motion.p>
                <motion.p style={{ opacity: beat3 }}>
                  Keep scrolling — the shoe completes a full revolution.
                </motion.p>
                <motion.p style={{ opacity: beat4 }}>
                  Swap the GLB. Keep the scroll. Ship the finish.
                </motion.p>
              </div>
            </div>

            <motion.div className="pulso-hint" style={{ y: yHint, opacity: hintOpacity }}>
              <span>Scroll to orbit</span>
              <b aria-hidden="true">↓</b>
            </motion.div>

            <div className="pulso-meter" aria-hidden="true">
              <div className="pulso-meter-bar">
                <motion.i style={{ width: progressWidth }} />
              </div>
              <motion.span>{degreeLabel}</motion.span>
            </div>
          </div>
        </div>
      </section>

      <section className="pulso-specs" id="specs">
        <div className="pulso-specs-head">
          <span>WHY THIS WORKS</span>
          <h2>
            Frame-perfect
            <br />
            <em>without frames.</em>
          </h2>
        </div>
        <ul>
          <li>
            <b>GLB propio</b>
            <span>Your mesh, materials and scale — replace `/models/pulso-sneaker.glb`.</span>
          </li>
          <li>
            <b>Scroll = theta</b>
            <span>Progress 0→1 maps to a clean 360° Y rotation via a spring.</span>
          </li>
          <li>
            <b>Fallback ready</b>
            <span>Reduced motion and missing WebGL keep a flat silhouette.</span>
          </li>
        </ul>
      </section>

      <section className="pulso-final">
        <span>
          {brand} / {city}
        </span>
        <h2>
          Product pages
          <br />
          <em>that move.</em>
        </h2>
        <a href="#top">
          Spin it again <ArrowIcon size={22} />
        </a>
      </section>

      <DemoSalesDock
        demoName="PULSO"
        industry="Product / footwear"
        brand={brand}
        city={city}
        onBrandChange={setBrand}
        onCityChange={setCity}
        accent="#c9a227"
      />
    </main>
  );
}
