"use client";

import { useState } from "react";
import { ASSETS } from "../config/assets";
import { COLORWAYS, type ColorwayId } from "../config/tokens";

const GRID: {
  id: number;
  name: string;
  cw: ColorwayId;
  img: string;
  price: string;
  w: "wide" | "narrow" | "mid" | "mid2";
  mt: string;
}[] = [
  { id: 0, name: "Barru 8290", cw: "mn", img: ASSETS.COLORWAY_STILLS.mn, price: "110,00 €", w: "wide", mt: "0" },
  { id: 1, name: "Barru 8290", cw: "bn", img: ASSETS.COLORWAY_STILLS.bn, price: "110,00 €", w: "narrow", mt: "16vh" },
  { id: 2, name: "Barru 8290", cw: "bk", img: ASSETS.COLORWAY_STILLS.bk, price: "115,00 €", w: "mid", mt: "0" },
  { id: 3, name: "Barru 8290", cw: "bu", img: ASSETS.COLORWAY_STILLS.bu, price: "115,00 €", w: "mid2", mt: "12vh" },
];

export function ProductsGridSection() {
  const [hover, setHover] = useState(-1);
  const [qv, setQv] = useState<number | null>(null);

  return (
    <section
      id="collection"
      className="munich-grid"
      data-scene="grid"
      data-tone="light"
      aria-label="La colección"
    >
      <div className="munich-grid-head">
        <h2>
          La
          <br />
          colección
        </h2>
        <div>
          <span className="munich-mono">04 ediciones — Colección 26</span>
          <p>
            Cuatro ediciones de una misma silueta. Pasa el cursor para ver la
            segunda vista, pulsa para abrirla.
          </p>
        </div>
      </div>

      <div className="munich-grid-list">
        {GRID.map((g, i) => {
          const c = COLORWAYS.find((x) => x.id === g.cw) ?? COLORWAYS[0];
          const h = hover === i;
          return (
            <article
              key={g.id}
              className={`munich-grid-item munich-grid-item--${g.w}`}
              style={{ marginTop: g.mt }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
            >
              <button
                type="button"
                data-cursor="view"
                aria-label={`Vista rápida: ${g.name} ${c.name}`}
                className="munich-grid-card"
                style={{ background: h ? c.bg : "#E2DCD1" }}
                onClick={() => setQv(i)}
              >
                <span className="munich-mono munich-grid-tag" style={{ color: h ? c.fg : "#111" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.img}
                  alt=""
                  className="munich-photo-cut munich-photo-cut--clean munich-grid-shoe"
                  style={{
                    transform: h ? "translate3d(0,-3%,0) rotate(-3deg) scale(1.04)" : undefined,
                  }}
                />
              </button>
              <div className={`munich-grid-meta${h ? " is-show" : ""}`}>
                <div>
                  <strong>{g.name}</strong>
                  <span>{c.name}</span>
                </div>
                <span className="munich-mono">{g.price}</span>
              </div>
            </article>
          );
        })}
      </div>

      {qv !== null ? (
        <div className="munich-qv" role="dialog" aria-modal="true" aria-label="Vista rápida">
          <button type="button" className="munich-qv-backdrop" aria-label="Cerrar" onClick={() => setQv(null)} />
          <div className="munich-qv-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GRID[qv].img}
              alt=""
              className="munich-photo-cut munich-photo-cut--clean munich-grid-shoe"
            />
            <div>
              <span className="munich-mono">Vista rápida</span>
              <h3>{GRID[qv].name}</h3>
              <p>
                Silueta baja de inspiración indoor. Empeine de ante con X de piel
                cosida, refuerzo de talón en contraste y suela de goma con punto
                de pivote.
              </p>
              <button type="button" className="munich-pill munich-pill--dark" onClick={() => setQv(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
