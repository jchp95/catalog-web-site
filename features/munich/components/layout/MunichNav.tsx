"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMunichReducedMotion } from "../../hooks/useMunichReducedMotion";

const links = [
  { href: "#shop", label: "Hombre", n: "01" },
  { href: "#shop", label: "Mujer", n: "02" },
  { href: "#collection", label: "Colecciones", n: "03" },
  { href: "#story", label: "Historia", n: "04" },
  { href: "/demos/munich/barru", label: "Ficha Barru", n: "05" },
];

type Props = {
  sceneTone?: "dark" | "light";
  cartCount?: number;
};

export function MunichNav({ sceneTone = "dark", cartCount = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useMunichReducedMotion();

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (!reduced) setHidden(y > last && y > window.innerHeight * 0.7);
      if (y < last || y < window.innerHeight * 0.3) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`munich-nav munich-nav--${sceneTone} ${hidden && !open ? "munich-nav--hidden" : ""}`}
        data-munich-nav
      >
        <div className="munich-nav-bg" aria-hidden="true" />
        <div className="munich-nav-inner">
          <Link href="/demos/munich" className="munich-nav-logo" data-cursor="link" aria-label="MUNICH, inicio">
            MUNICH
          </Link>
          <nav className="munich-nav-center" aria-label="Principal">
            <a href="#shop" data-cursor="link">Hombre</a>
            <a href="#shop" data-cursor="link">Mujer</a>
            <a href="#collection" data-cursor="link">Colecciones</a>
            <a href="#story" data-cursor="link">Historia</a>
          </nav>
          <div className="munich-nav-right">
            <button type="button" className="munich-nav-ghost munich-nav-desktop" data-cursor="link" aria-label="Buscar">
              Buscar
            </button>
            <button type="button" className="munich-nav-ghost" data-cursor="link" aria-label={`Bolsa, ${cartCount} artículos`}>
              Bolsa
              <span className="munich-nav-bag">{cartCount}</span>
            </button>
            <button
              type="button"
              className="munich-nav-menu-btn"
              aria-expanded={open}
              aria-controls="munich-fullscreen-menu"
              onClick={() => setOpen((v) => !v)}
              data-cursor="link"
            >
              <span>{open ? "Cerrar" : "Menú"}</span>
              <span className={`munich-burger${open ? " is-open" : ""}`} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="munich-fullscreen-menu"
            className="munich-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            initial={{ clipPath: "circle(0% at calc(100% - 52px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 52px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 52px) 36px)" }}
            transition={{ duration: 1.05, ease: [0.77, 0, 0.18, 1] }}
          >
            <nav aria-label="Menú completo">
              {links.map((l, i) => (
                <motion.a
                  key={l.n}
                  href={l.href}
                  data-cursor="link"
                  onClick={() => setOpen(false)}
                  initial={{ y: "105%", filter: "blur(12px)", opacity: 0 }}
                  animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.07, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="munich-mono">{l.n}</span>
                  <span>{l.label}</span>
                </motion.a>
              ))}
            </nav>
            <p>
              Barru 8290 · Edición Mostaza / Azul. Ante, piel y goma. Envío en 48 h
              en península.
            </p>
            <div className="munich-menu-foot munich-mono">
              <span>Barcelona · 41.38° N 2.17° E</span>
              <span>Instagram · TikTok</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
