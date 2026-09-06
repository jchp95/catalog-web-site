"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { DemoDialog } from "@/components/ui/DemoDialog";

type DemoSalesDockProps = {
  demoName: string;
  industry: string;
  brand: string;
  city: string;
  onBrandChange: (value: string) => void;
  onCityChange: (value: string) => void;
  accent?: string;
};

const TEXT_LIMIT = 42;
const normalize = (value: string) => value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, TEXT_LIMIT);

export function DemoSalesDock({ demoName, industry, brand, city, onBrandChange, onCityChange, accent = "#2855ff" }: DemoSalesDockProps) {
  const [open, setOpen] = useState(false);
  const [draftBrand, setDraftBrand] = useState(brand);
  const [draftCity, setDraftCity] = useState(city);
  const [shareStatus, setShareStatus] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [sharing, setSharing] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const defaults = useRef({ brand: brand || demoName, city });
  const updateBrand = useRef(onBrandChange);
  const updateCity = useRef(onCityChange);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  updateBrand.current = onBrandChange;
  updateCity.current = onCityChange;

  function createUrl(nextBrand: string, nextCity: string) {
    const url = new URL(window.location.href);
    const cleanBrand = normalize(nextBrand) || defaults.current.brand;
    const cleanCity = normalize(nextCity);
    if (cleanBrand === defaults.current.brand) url.searchParams.delete("brand");
    else url.searchParams.set("brand", cleanBrand);
    if (cleanCity === defaults.current.city) url.searchParams.delete("city");
    else url.searchParams.set("city", cleanCity);
    return url;
  }

  useEffect(() => {
    function readUrl() {
      const params = new URLSearchParams(window.location.search);
      updateBrand.current(normalize(params.get("brand") || defaults.current.brand) || defaults.current.brand);
      updateCity.current(params.has("city") ? normalize(params.get("city") || "") : defaults.current.city);
    }
    readUrl();
    setCanShare(typeof navigator.share === "function");
    window.addEventListener("popstate", readUrl);
    return () => {
      window.removeEventListener("popstate", readUrl);
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, []);

  useEffect(() => setDraftBrand(brand), [brand]);
  useEffect(() => setDraftCity(city), [city]);

  function announce(message: string) {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setShareStatus(message);
    statusTimer.current = setTimeout(() => setShareStatus(""), 5000);
  }

  async function copyLink() {
    const url = createUrl(brand, city).toString();
    setSharing(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setManualUrl("");
      announce("Link copied. Ready to send.");
    } catch {
      setManualUrl(url);
      setOpen(true);
      announce("Select and copy the link below.");
    } finally {
      setSharing(false);
    }
  }

  async function shareLink() {
    if (!navigator.share) return copyLink();
    setSharing(true);
    try {
      await navigator.share({ title: `${brand || demoName} — website preview`, url: createUrl(brand, city).toString() });
      announce("Preview shared.");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setManualUrl(createUrl(brand, city).toString());
        announce("Sharing is unavailable. Copy the link below.");
      }
    } finally {
      setSharing(false);
    }
  }

  function personalize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextBrand = normalize(draftBrand) || defaults.current.brand;
    const nextCity = normalize(draftCity);
    onBrandChange(nextBrand);
    onCityChange(nextCity);
    window.history.replaceState(window.history.state, "", createUrl(nextBrand, nextCity));
    setManualUrl("");
    setOpen(false);
    announce("Your preview is ready.");
  }

  function reset() {
    onBrandChange(defaults.current.brand);
    onCityChange(defaults.current.city);
    setDraftBrand(defaults.current.brand);
    setDraftCity(defaults.current.city);
    window.history.replaceState(window.history.state, "", createUrl(defaults.current.brand, defaults.current.city));
    setManualUrl("");
    announce("Original name and city restored.");
  }

  function openTools() {
    setDraftBrand(brand);
    setDraftCity(city);
    setOpen(true);
  }

  return (
    <>
      <nav className="sales-dock" aria-label="Website preview tools" style={{ "--sales-accent": accent } as CSSProperties}>
        <Link href="/#work" className="sales-dock-home" aria-label="Back to the website collection"><span aria-hidden="true">↗</span> Collection</Link>
        <div className="sales-dock-context"><span>INTERACTIVE DEMO</span><b>{brand || demoName}</b></div>
        <button type="button" className="sales-dock-customize" onClick={openTools}>Personalize</button>
        <button type="button" onClick={copyLink} disabled={sharing} aria-label="Copy a link to this personalized preview">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.6"/></svg>
          <span>{sharing ? "Copying…" : "Copy link"}</span>
        </button>
      </nav>
      <div className={`sales-status${shareStatus && !open ? " is-visible" : ""}`} role="status" aria-live="polite">{!open ? shareStatus : ""}</div>

      <DemoDialog open={open} onClose={() => setOpen(false)} label="Personalize and share this website" className="sales-customize-dialog" panelClassName="sales-customize-panel">
        <div className="sales-customize-head">
          <div><span>YOUR BUSINESS, IN THE PICTURE</span><h2>Make yourself<br/>at home.</h2></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close preview tools">×</button>
        </div>
        <div className="sales-customize-meta"><span>{industry}</span><span>{demoName} concept</span></div>
        <form onSubmit={personalize}>
          <label><span>Business name</span><input value={draftBrand} maxLength={TEXT_LIMIT} onChange={(event) => setDraftBrand(event.target.value)} placeholder={demoName} autoComplete="organization" /></label>
          <label><span>City / market</span><input value={draftCity} maxLength={TEXT_LIMIT} onChange={(event) => setDraftCity(event.target.value)} placeholder="Miami, FL" autoComplete="address-level2" /></label>
          <div className="sales-customize-preview"><small>A FIRST LOOK</small><strong>{normalize(draftBrand) || demoName}</strong><span>{normalize(draftCity) || "Your city"}</span></div>
          <div className="sales-customize-actions"><button type="submit" className="primary">Apply to website <span aria-hidden="true">↗</span></button><button type="button" onClick={reset}>Reset name & city</button></div>
        </form>
        <div className="sales-share-row"><div><strong>Pass the idea along.</strong><span>Share the name and city currently on the website.</span></div><button type="button" onClick={copyLink} disabled={sharing}>Copy link</button>{canShare && <button type="button" onClick={shareLink} disabled={sharing}>Share…</button>}</div>
        <p className="sales-panel-status" role="status" aria-live="polite">{open ? shareStatus : ""}</p>
        {manualUrl && <label className="sales-manual-link"><span>Preview link — select to copy</span><input readOnly value={manualUrl} onFocus={(event) => event.currentTarget.select()} onClick={(event) => event.currentTarget.select()} /></label>}
        <p className="sales-demo-note">This is an interactive concept. Demo requests are simulated and do not reach a real business.</p>
      </DemoDialog>
    </>
  );
}
