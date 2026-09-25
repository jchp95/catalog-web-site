"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";
import { ASSETS } from "../config/assets";

export function VideoSection() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ensureGsapPlugins();
    const el = root.current;
    if (!el) return;
    const pin = el.querySelector(".munich-vid-pin");
    const box = el.querySelector(".munich-vid-box");
    const media = el.querySelector(".munich-vid-media");
    const lines = el.querySelectorAll(".munich-vid-l");
    const dark = el.querySelector(".munich-vid-dark");
    const cap = el.querySelector(".munich-vid-cap");
    const video = videoRef.current;

    const tryPlay = () => {
      video?.play().catch(() => {});
    };
    tryPlay();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) tryPlay();
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      box,
      { clipPath: "inset(30% 35% 30% 35% round 40px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", duration: 0.5 },
      0,
    )
      .fromTo(media, { scale: 0.36 }, { scale: 1, ease: "none", duration: 0.5 }, 0)
      .to(cap, { opacity: 0, duration: 0.12 }, 0);

    lines.forEach((l, i) => {
      tl.fromTo(
        l,
        { opacity: 0, scale: 1.25 },
        { opacity: 1, scale: 1, duration: 0.12 },
        0.3 + i * 0.07,
      );
      tl.to(l, { opacity: 0, filter: "blur(14px)", duration: 0.1 }, 0.8);
    });

    tl.to(dark, { opacity: 0.94, duration: 0.2 }, 0.78);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      io.disconnect();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="munich-vid"
      data-scene="vid"
      data-tone="dark"
      aria-label="Muévete sin límites"
    >
      <div className="munich-vid-track">
        <div className="munich-vid-pin">
          <div className="munich-vid-cap munich-mono" aria-hidden="true">
            Reel · 00:10 · 360°
          </div>
          <div className="munich-vid-box">
            <div className="munich-vid-media">
              <video
                ref={videoRef}
                src={ASSETS.EDITORIAL_VIDEO}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                aria-hidden="true"
              />
            </div>
            <div className="munich-vid-dark" aria-hidden="true" />
            <div className="munich-vid-copy">
              <div className="munich-vid-l">Muévete</div>
              <div className="munich-vid-l munich-vid-l--accent">sin</div>
              <div className="munich-vid-l">límites.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
