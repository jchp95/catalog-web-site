"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ensureGsapPlugins } from "../hooks/useGSAPContext";

export function FooterSection() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    ensureGsapPlugins();
    const el = root.current;
    if (!el) return;
    const chars = el.querySelectorAll(".munich-foot-ch");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { yPercent: 105, rotate: 5 },
        {
          yPercent: 0,
          rotate: 0,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 70%", end: "top 20%", scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <footer
      ref={root}
      className="munich-foot"
      data-scene="foot"
      data-tone="dark"
    >
      <div className="munich-foot-top">
        <form onSubmit={subscribe} className="munich-foot-form">
          <span className="munich-mono">Newsletter</span>
          <p>
            Acceso anticipado
            <br />
            a cada lanzamiento.
          </p>
          <div className="munich-foot-input">
            <input
              type="email"
              required
              aria-label="Correo electrónico"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" data-cursor="link">
              {done ? "Apuntado ✓" : "Suscribirme"}
            </button>
          </div>
        </form>
        <nav aria-label="Pie" className="munich-foot-nav">
          <a href="#shop" data-cursor="link">Tienda</a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener" data-cursor="link">Instagram</a>
          <a href="#collection" data-cursor="link">Colecciones</a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener" data-cursor="link">TikTok</a>
          <a href="#story" data-cursor="link">Nosotros</a>
          <a href="mailto:hola@example.com" data-cursor="link">Contacto</a>
        </nav>
        <button
          type="button"
          className="munich-foot-topbtn"
          data-cursor="cta"
          aria-label="Volver arriba"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span aria-hidden="true">↑</span>
          Volver
          <br />
          arriba
        </button>
      </div>

      <div>
        <div className="munich-foot-word" aria-label="MUNICH">
          {"MUNICH".split("").map((ch, i) => (
            <span key={i} className="munich-foot-slot">
              <span className={`munich-foot-ch${i === 5 ? " is-accent" : ""}`}>{ch}</span>
            </span>
          ))}
        </div>
        <div className="munich-foot-legal munich-mono">
          <span>© 2026 — Estudio conceptual. No es un sitio oficial de MUNICH.</span>
          <span>Barcelona</span>
        </div>
      </div>
    </footer>
  );
}
