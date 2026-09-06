"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type DemoSalesDockProps = {
  demoName: string;
  industry: string;
  brand: string;
  city: string;
  onBrandChange: (value: string) => void;
  onCityChange: (value: string) => void;
  accent?: string;
};

export function DemoSalesDock({
  demoName,
  industry,
  brand,
  city,
  onBrandChange,
  onCityChange,
  accent = "#2855ff",
}: DemoSalesDockProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftBrand, setDraftBrand] = useState(brand);
  const [draftCity, setDraftCity] = useState(city);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlBrand = params.get("brand");
    const urlCity = params.get("city");
    if (urlBrand) onBrandChange(urlBrand);
    if (urlCity) onCityChange(urlCity);
  }, [onBrandChange, onCityChange]);

  useEffect(() => setDraftBrand(brand), [brand]);
  useEffect(() => setDraftCity(city), [city]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    if (brand && brand !== demoName) url.searchParams.set("brand", brand);
    else url.searchParams.delete("brand");
    if (city) url.searchParams.set("city", city);
    else url.searchParams.delete("city");
    return url.toString();
  }, [brand, city, demoName]);

  async function share() {
    const url = shareUrl || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${brand || demoName} — website concept`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Share cancellation should not interrupt the demo.
    }
  }

  function apply() {
    onBrandChange(draftBrand.trim() || demoName);
    onCityChange(draftCity.trim());
    setOpen(false);
  }

  function reset() {
    setDraftBrand(demoName);
    setDraftCity(city);
    onBrandChange(demoName);
  }

  return (
    <>
      <div className="sales-dock" style={{ "--sales-accent": accent } as CSSProperties}>
        <Link href="/" className="sales-dock-home" aria-label="Back to showroom">LOCAL/</Link>
        <div className="sales-dock-context">
          <span>CLIENT PREVIEW</span>
          <b>{brand || demoName}</b>
        </div>
        <button type="button" onClick={() => setOpen(true)}>Customize</button>
        <button type="button" onClick={share}>{copied ? "Copied" : "Share"}</button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="sales-customize-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="sales-customize-scrim" type="button" aria-label="Close customization" onClick={() => setOpen(false)} />
            <motion.aside
              className="sales-customize-panel"
              initial={{ y: 42, opacity: 0, scale: .98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 42, opacity: 0, scale: .98 }}
              transition={{ duration: .42, ease: [.2, .75, .18, 1] }}
            >
              <div className="sales-customize-head">
                <div><span>LIVE SALES TOOL</span><h2>Put the prospect inside the concept.</h2></div>
                <button type="button" onClick={() => setOpen(false)}>Close</button>
              </div>
              <div className="sales-customize-meta"><span>{industry}</span><span>{demoName} base system</span></div>
              <label>
                <span>Business name</span>
                <input value={draftBrand} onChange={(event) => setDraftBrand(event.target.value)} placeholder="Mike's Barber Shop" />
              </label>
              <label>
                <span>City / market</span>
                <input value={draftCity} onChange={(event) => setDraftCity(event.target.value)} placeholder="Miami, FL" />
              </label>
              <div className="sales-customize-preview">
                <small>PREVIEW SIGNAL</small>
                <strong>{draftBrand || demoName}</strong>
                <span>{draftCity || "Your city"}</span>
              </div>
              <div className="sales-customize-actions">
                <button type="button" className="primary" onClick={apply}>Apply to demo</button>
                <button type="button" onClick={reset}>Reset brand</button>
              </div>
              <p>Customization is temporary and stays in demo mode. Sharing creates a URL with the current business name and city.</p>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
