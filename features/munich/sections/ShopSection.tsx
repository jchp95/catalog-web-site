"use client";

import { useState } from "react";
import { ASSETS } from "../config/assets";
import { COLORWAYS } from "../config/tokens";
import { useCart } from "../components/ui/CartContext";
import { MagneticButton } from "../components/motion/MagneticButton";

const SIZES = [39, 40, 41, 42, 43, 44, 45];

export function ShopSection() {
  const [cwId, setCwId] = useState("mn");
  const [size, setSize] = useState<number | null>(null);
  const [err, setErr] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const cw = COLORWAYS.find((c) => c.id === cwId) ?? COLORWAYS[0];

  const onAdd = () => {
    if (!size) {
      setErr(true);
      return;
    }
    add();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section
      id="shop"
      className="munich-shop"
      data-scene="shop"
      data-tone="dark"
      aria-label="Comprar Barru 8290"
    >
      <div className="munich-shop-img">
        <span className="munich-mono">Completa el look</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.COLORWAY_STILLS[cwId as keyof typeof ASSETS.COLORWAY_STILLS] ?? ASSETS.COLORWAY_STILLS.mn}
          alt={`Barru 8290 ${cw.name}`}
          className="munich-photo-cut munich-photo-cut--clean munich-grid-shoe"
        />
      </div>
      <div className="munich-shop-panel">
        <div>
          <span className="munich-mono" style={{ opacity: 0.7 }}>
            MUNICH · Colección 26
          </span>
          <h2>Barru 8290</h2>
          <div className="munich-shop-price">
            <span>{cw.name}</span>
            <span className="munich-mono">110,00 €</span>
          </div>
        </div>

        <div className="munich-shop-block">
          <span className="munich-mono">Color</span>
          <div className="munich-shop-colors">
            {COLORWAYS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-label={c.name}
                aria-pressed={c.id === cwId}
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

        <div className="munich-shop-block">
          <div className="munich-shop-size-row munich-mono">
            <span>Talla EU</span>
            <span style={{ color: err ? "var(--m-mustard)" : "inherit" }}>
              {err ? "Elige una talla" : size ? `EU ${size}` : "Guía de tallas"}
            </span>
          </div>
          <div className="munich-shop-sizes" role="radiogroup" aria-label="Talla">
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

        <MagneticButton className="munich-shop-add" onClick={onAdd} data-cursor="cta">
          {added ? "Añadida a la bolsa" : "Añadir a la bolsa"}
        </MagneticButton>

        <div className="munich-shop-meta">
          <span>Envío en 48 h · Devolución gratuita 30 días</span>
          <a href="/demos/munich/barru" data-cursor="link">
            Ver ficha completa →
          </a>
        </div>
      </div>
    </section>
  );
}
