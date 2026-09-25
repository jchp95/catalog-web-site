"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CartProvider, useCart } from "./components/ui/CartContext";
import { ensureGsapPlugins } from "./hooks/useGSAPContext";
import { useMunichReducedMotion } from "./hooks/useMunichReducedMotion";
import { ASSETS, framesAsset } from "./config/assets";
import { COLORWAYS, type ColorwayId } from "./config/tokens";

const SIZES = [39, 40, 41, 42, 43, 44, 45];

const GALLERY = [
  { id: "side", label: "Perfil", src: ASSETS.EDITORIAL.hero },
  { id: "three", label: "Tres cuartos", src: ASSETS.EDITORIAL.float },
  { id: "rear", label: "Trasera", src: ASSETS.EDITORIAL.wide },
  { id: "orbit", label: "Lateral", src: framesAsset("/frames/munich-yellow/desktop/frame_0001.png") },
] as const;

const DETAILS = [
  {
    id: "mat",
    title: "Materiales",
    body: "Upper de ante con acabado mate, X y talón en piel contrastada, forro textil transpirable y plantilla extraíble con marca Munich.",
  },
  {
    id: "sole",
    title: "Suela y tracción",
    body: "Cupsole de goma con textura pebble y punto de pivote en el antepié. Amortiguación firme para calle y cancha cubierta.",
  },
  {
    id: "fit",
    title: "Ajuste",
    body: "Horma regular. Recomendamos tu talla EU habitual. Cordones planos a tono; lengüeta acolchada para un cierre estable.",
  },
  {
    id: "care",
    title: "Cuidado",
    body: "Cepillo suave en seco. Evita agua abundante sobre el ante. Guarda en lugar fresco, lejos de calor directo.",
  },
] as const;

const SPECS: { label: string; value: string }[] = [
  { label: "Modelo", value: "Barru 8290" },
  { label: "Colección", value: "26" },
  { label: "Upper", value: "Ante + piel" },
  { label: "Suela", value: "Goma cupsole" },
  { label: "Tallas", value: "EU 39–45" },
  { label: "Origen", value: "Diseñada en Barcelona" },
];

function ProductInner() {
  const { add, count, setSize: setCartSize } = useCart();
  const reduced = useMunichReducedMotion();
  const [cwId, setCwId] = useState<ColorwayId>("mn");
  const [size, setSize] = useState<number | null>(null);
  const [err, setErr] = useState(false);
  const [added, setAdded] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [openDetail, setOpenDetail] = useState<string>("mat");
  const root = useRef<HTMLDivElement>(null);
  const cw = COLORWAYS.find((c) => c.id === cwId) ?? COLORWAYS[0];
  const still = ASSETS.COLORWAY_STILLS[cwId];
  const heroSrc = galleryIdx === 0 ? still : GALLERY[galleryIdx].src;

  useEffect(() => {
    setGalleryIdx(0);
  }, [cwId]);

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    ensureGsapPlugins();
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll(
        ".munich-pdp-mark, .munich-pdp-shoe, .munich-pdp-buy > *",
      );
      gsap.set(targets, { opacity: 1, y: 0 });
      gsap.from(targets, {
        opacity: 0,
        y: 16,
        duration: 0.75,
        stagger: 0.045,
        ease: "power3.out",
        delay: 0.05,
        clearProps: "transform",
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (!reduced) return;
    const el = root.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>(".munich-pdp-mark, .munich-pdp-shoe, .munich-pdp-buy > *").forEach(
      (n) => {
        n.style.opacity = "1";
        n.style.transform = "none";
      },
    );
  }, [reduced]);

  const onAdd = () => {
    if (!size) {
      setErr(true);
      return;
    }
    setCartSize(size);
    add();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div ref={root} className="munich-root munich-root--light munich-pdp" data-tone="light">
      <header className="munich-pdp-nav">
        <Link href="/demos/munich" data-cursor="link">
          ← Experience
        </Link>
        <span className="munich-mono">BARRU 8290</span>
        <span className="munich-mono">Bolsa {count}</span>
      </header>

      <section className="munich-pdp-hero" aria-label="Barru 8290">
        <div className="munich-pdp-gallery">
          <p className="munich-pdp-mark" aria-hidden="true">
            BARRU
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={heroSrc}
            src={heroSrc}
            alt={`Barru 8290 ${cw.name} — ${GALLERY[galleryIdx].label}`}
            className="munich-photo-cut munich-photo-cut--clean munich-pdp-shoe"
            draggable={false}
          />
          <div className="munich-pdp-thumbs" role="tablist" aria-label="Vistas del producto">
            {GALLERY.map((g, i) => {
              const thumb = i === 0 ? still : g.src;
              return (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={galleryIdx === i}
                  aria-label={g.label}
                  data-cursor="link"
                  className={galleryIdx === i ? "is-active" : ""}
                  onClick={() => setGalleryIdx(i)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt="" className="munich-photo-cut munich-photo-cut--clean" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="munich-pdp-buy">
          <span className="munich-mono munich-pdp-kicker">MUNICH · Colección 26</span>
          <h1>Barru 8290</h1>
          <div className="munich-pdp-price-row">
            <span>{cw.name}</span>
            <span className="munich-mono">110,00 €</span>
          </div>
          <p className="munich-pdp-desc">
            Upper de ante, acentos de piel en contraste y suela de goma. Una
            silueta de pista cubierta reconstruida para moverse — edición{" "}
            {cw.short.toLowerCase()}.
          </p>

          <div className="munich-pdp-block">
            <span className="munich-mono">Color</span>
            <div className="munich-pdp-colors" role="radiogroup" aria-label="Color">
              {COLORWAYS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={c.id === cwId}
                  aria-label={c.name}
                  data-cursor="link"
                  className={c.id === cwId ? "is-active" : ""}
                  style={{
                    background: `linear-gradient(135deg, ${c.a} 50%, ${c.b} 50%)`,
                  }}
                  onClick={() => setCwId(c.id)}
                />
              ))}
            </div>
          </div>

          <div className="munich-pdp-block">
            <div className="munich-pdp-size-row munich-mono">
              <span>Talla EU</span>
              <span className={err ? "is-err" : ""}>
                {err ? "Elige una talla" : size ? `EU ${size}` : "Guía de tallas"}
              </span>
            </div>
            <div className="munich-pdp-sizes" role="radiogroup" aria-label="Talla">
              {SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={size === n}
                  data-cursor="link"
                  className={size === n ? "is-active" : ""}
                  onClick={() => {
                    setSize(n);
                    setErr(false);
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="munich-pdp-add" onClick={onAdd}>
            {added ? "Añadida a la bolsa" : "Añadir a la bolsa"}
          </button>

          <ul className="munich-pdp-promises">
            <li>Envío en 48 h</li>
            <li>Devolución gratuita 30 días</li>
            <li>Pago seguro</li>
          </ul>
        </div>
      </section>

      <div className="munich-pdp-specs munich-mono" aria-label="Especificaciones rápidas">
        <span>Ante</span>
        <span>X de piel</span>
        <span>Goma cupsole</span>
        <span>EU 39–45</span>
      </div>

      <section className="munich-pdp-body" aria-label="Detalle del producto">
        <div className="munich-pdp-body-grid">
          <div className="munich-pdp-accordion">
            <h2 className="munich-pdp-section-title">Detalle</h2>
            {DETAILS.map((d) => {
              const open = openDetail === d.id;
              return (
                <div key={d.id} className={`munich-pdp-acc${open ? " is-open" : ""}`}>
                  <button
                    type="button"
                    className="munich-pdp-acc-btn"
                    aria-expanded={open}
                    data-cursor="link"
                    onClick={() => setOpenDetail(open ? "" : d.id)}
                  >
                    <span>{d.title}</span>
                    <span className="munich-mono" aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  {open ? <p className="munich-pdp-acc-body">{d.body}</p> : null}
                </div>
              );
            })}
          </div>

          <div className="munich-pdp-specsheet">
            <h2 className="munich-pdp-section-title">Ficha técnica</h2>
            <dl>
              {SPECS.map((row) => (
                <div key={row.label} className="munich-pdp-spec-row">
                  <dt className="munich-mono">{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="munich-pdp-editorial" aria-label="Construcción">
        <div className="munich-pdp-edi-copy">
          <span className="munich-mono">Construcción</span>
          <h2>Hecha para el giro</h2>
          <p>
            Cada capa tiene un trabajo: el ante aguanta el roce, la X de piel
            fija la silueta, la goma responde en el pivote. La Barru 8290 es
            una pieza de pista llevada a la calle sin perder precisión.
          </p>
        </div>
        <div className="munich-pdp-edi-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASSETS.EDITORIAL.float}
            alt="Barru 8290 — vista tres cuartos"
            className="munich-photo-cut munich-photo-cut--clean"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ASSETS.EDITORIAL.wide}
            alt="Barru 8290 — vista trasera"
            className="munich-photo-cut munich-photo-cut--clean"
          />
        </div>
      </section>

      <section className="munich-pdp-related" aria-label="Otras ediciones">
        <div className="munich-pdp-related-head">
          <h2 className="munich-pdp-section-title">Otras ediciones</h2>
          <Link href="/demos/munich#collection" data-cursor="link">
            Ver colección →
          </Link>
        </div>
        <div className="munich-pdp-related-grid">
          {COLORWAYS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`munich-pdp-related-card${c.id === cwId ? " is-active" : ""}`}
              data-cursor="link"
              onClick={() => {
                setCwId(c.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span
                className="munich-pdp-related-swatch"
                style={{ background: `linear-gradient(135deg, ${c.a} 50%, ${c.b} 50%)` }}
                aria-hidden="true"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ASSETS.COLORWAY_STILLS[c.id]}
                alt=""
                className="munich-photo-cut munich-photo-cut--clean"
              />
              <span className="munich-pdp-related-meta">
                <strong>{c.name}</strong>
                <span className="munich-mono">110,00 €</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <footer className="munich-pdp-foot">
        <p className="munich-mono">MUNICH · BARRU 8290 · BARCELONA</p>
        <Link href="/demos/munich" data-cursor="link">
          Volver a la experience
        </Link>
      </footer>
    </div>
  );
}

export function MunichProductPage() {
  return (
    <CartProvider>
      <ProductInner />
    </CartProvider>
  );
}
