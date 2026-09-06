"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";
import { DemoDialog } from "@/components/ui/DemoDialog";
import { VehicleStage } from "./VehicleStage";

type Vehicle = "Coupe" | "Sedan" | "SUV";
type PackageId = "reset" | "correct" | "ceramic";
const vehicleBase: Record<Vehicle, number> = { Coupe: 0, Sedan: 30, SUV: 90 };
const packages = [
  { id: "reset" as PackageId, name: "Surface reset", price: 220, note: "Decon · polish · protection", level: "01" },
  { id: "correct" as PackageId, name: "Paint correction", price: 520, note: "2-step correction · seal", level: "02" },
  { id: "ceramic" as PackageId, name: "Ceramic system", price: 890, note: "Correction · ceramic coating", level: "03" },
];
const colors = [
  { name: "Carbon", hex: "#15181d" },
  { name: "Titanium", hex: "#9ea4aa" },
  { name: "Signal", hex: "#d94836" },
  { name: "Cobalt", hex: "#3158bd" },
];

function VehicleTop({ color }: { color: string }) {
  return (
    <svg className="apex-car-svg" viewBox="0 0 420 820" role="img" aria-label="Top view vehicle visualization">
      <defs>
        <linearGradient id="carBody" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".22"/><stop offset=".22" stopColor={color}/><stop offset=".7" stopColor={color}/><stop offset="1" stopColor="#000" stopOpacity=".55"/></linearGradient>
        <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#9de8ff" stopOpacity=".48"/><stop offset="1" stopColor="#0b171f" stopOpacity=".9"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="9" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ellipse cx="210" cy="420" rx="164" ry="360" fill="#000" opacity=".38"/>
      <path d="M210 30C139 30 94 82 74 155L43 320c-12 67-12 132 0 199l31 146c18 85 73 125 136 125s118-40 136-125l31-146c12-67 12-132 0-199l-31-165C326 82 281 30 210 30Z" fill="url(#carBody)" stroke="#d9f6ff" strokeOpacity=".25" strokeWidth="2"/>
      <path d="M116 210c24-55 55-82 94-82s70 27 94 82l33 139H83l33-139Z" fill="url(#glass)" stroke="#bdefff" strokeOpacity=".25"/>
      <path d="M87 390h246l-19 214c-7 75-48 113-104 113s-97-38-104-113L87 390Z" fill="#0d1419" fillOpacity=".78" stroke="#bdefff" strokeOpacity=".18"/>
      <path d="M210 60v670" stroke="#c8f2ff" strokeOpacity=".09" strokeDasharray="5 9"/>
      <path d="M62 301 20 338v89l39 20M358 301l42 37v89l-39 20" fill="none" stroke="#d7f6ff" strokeOpacity=".36" strokeWidth="3"/>
      <rect x="60" y="232" width="22" height="118" rx="9" fill="#090c0f"/><rect x="338" y="232" width="22" height="118" rx="9" fill="#090c0f"/><rect x="60" y="525" width="22" height="118" rx="9" fill="#090c0f"/><rect x="338" y="525" width="22" height="118" rx="9" fill="#090c0f"/>
      <path d="M118 103c29-35 58-49 92-49s63 14 92 49" stroke="#87e4ff" strokeWidth="4" strokeLinecap="round" opacity=".72" filter="url(#glow)"/>
      <path d="M130 748c24 14 50 21 80 21s56-7 80-21" stroke="#ff694d" strokeWidth="4" strokeLinecap="round" opacity=".75" filter="url(#glow)"/>
    </svg>
  );
}

export function ApexExperience() {
  const [brand, setBrand] = useState("APEX DETAIL LAB");
  const [city, setCity] = useState("Miami, FL");
  const [vehicle, setVehicle] = useState<Vehicle>("Sedan");
  const [paint, setPaint] = useState(colors[0]);
  const [packageId, setPackageId] = useState<PackageId>("ceramic");
  const [interior, setInterior] = useState(true);
  const [wheels, setWheels] = useState(false);
  const [compare, setCompare] = useState(62);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const activePackage = packages.find((item) => item.id === packageId)!;
  const total = useMemo(() => activePackage.price + vehicleBase[vehicle] + (interior ? 140 : 0) + (wheels ? 110 : 0), [activePackage.price, vehicle, interior, wheels]);
  const openQuote = () => { setConfirmed(false); setQuoteOpen(true); };

  return (
    <main className="apex-shell" id="main-content">
      <header className="apex-nav">
        <a href="#top" className="apex-logo" data-demo-brand><i aria-hidden="true" />{brand}</a>
        <span className="apex-nav-location">DETAILING STUDIO / {city}</span>
        <nav aria-label="Detailing navigation"><a href="#config">Treatments</a><a href="#compare">The finish</a><button type="button" onClick={openQuote}>Your estimate <ArrowIcon size={14} /></button></nav>
      </header>

      <section id="top" className="apex-hero">
        <div className="apex-hero-photo"><Image src="/images/apex.webp" alt="Sculpted bodywork and polished finish of a performance car" fill priority sizes="100vw" /></div>
        <div className="apex-hero-copy">
          <span className="apex-kicker">FOR THE DRIVE. AND THE DOUBLE TAKE.</span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>Obsess over<br /><em>the details.</em></motion.h1>
          <p>Paint correction, ceramic protection and the kind of care you notice every time you get behind the wheel.</p>
          <a href="#config">Build your treatment <ArrowIcon /></a>
        </div>
        <div className="apex-hero-footer"><span>{city} / BY APPOINTMENT</span><span>WASH. REFINE. PROTECT.</span><a href="#config" aria-label="Explore detailing treatments">↓</a></div>
      </section>

      <section id="config" className="apex-config">
        <div className="apex-config-head"><span>YOUR CAR. YOUR CALL.</span><h2>A finish<br /><em>worth keeping.</em></h2><p>Choose your vehicle and the care it needs. Explore sample pricing before an in-person paint inspection.</p></div>
        <div className="apex-configurator">
          <div className="config-stage"><div className="config-stage-grid" aria-hidden="true" /><VehicleStage><VehicleTop color={paint.hex} /></VehicleStage><div className="config-badge"><span>COLOR PREVIEW / ILLUSTRATION</span><b>{paint.name}</b><small>{vehicle} · {activePackage.name}</small></div></div>
          <div className="config-controls">
            <fieldset className="control-group"><legend>01 / Your vehicle</legend><div className="segmented">{(["Coupe", "Sedan", "SUV"] as Vehicle[]).map((item) => <button type="button" aria-pressed={vehicle === item} className={vehicle === item ? "active" : ""} key={item} onClick={() => { setVehicle(item); setConfirmed(false); }}>{item}<small>{vehicleBase[item] ? `+$${vehicleBase[item]}` : "Base price"}</small></button>)}</div></fieldset>
            <fieldset className="control-group"><legend>02 / Paint color reference</legend><div className="paint-row">{colors.map((item) => <button type="button" className={paint.name === item.name ? "active" : ""} key={item.name} onClick={() => { setPaint(item); setConfirmed(false); }} aria-pressed={paint.name === item.name}><i style={{ background: item.hex }} /><small>{item.name}</small></button>)}</div></fieldset>
            <fieldset className="control-group"><legend>03 / Your treatment</legend><div className="package-list">{packages.map((item) => <button type="button" aria-pressed={packageId === item.id} className={packageId === item.id ? "active" : ""} key={item.id} onClick={() => { setPackageId(item.id); setConfirmed(false); }}><span aria-hidden="true">{packageId === item.id ? "●" : "○"}</span><div><b>{item.name}</b><small>{item.note}</small></div><strong>${item.price}</strong></button>)}</div></fieldset>
            <fieldset className="control-group"><legend>04 / A little extra care</legend><label className="toggle-row"><input type="checkbox" checked={interior} onChange={(e) => { setInterior(e.target.checked); setConfirmed(false); }} /><span>Interior reset</span><b>+$140</b></label><label className="toggle-row"><input type="checkbox" checked={wheels} onChange={(e) => { setWheels(e.target.checked); setConfirmed(false); }} /><span>Wheel ceramic</span><b>+$110</b></label></fieldset>
            <div className="config-total"><div><span>YOUR ESTIMATE</span><small>Sample pricing · final quote after inspection.</small></div><strong aria-live="polite">${total}</strong><button type="button" onClick={openQuote}>Review your estimate <ArrowIcon /></button></div>
          </div>
        </div>
      </section>

      <section id="compare" className="apex-compare">
        <div className="compare-head"><span>AN EYE FOR THE FINISH</span><div><h2>Reflections,<br />without distractions.</h2><p>Move the slider to explore an illustrated finish comparison. Actual results depend on the paint condition.</p></div></div>
        <div className="compare-stage">
          <div className="compare-before"><Image src="/images/apex.webp" alt="" fill sizes="100vw" /><span>UNTREATED / ILLUSTRATION</span><div className="surface-noise" /></div>
          <div className="compare-after" style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}><Image src="/images/apex.webp" alt="" fill sizes="100vw" /><span>REFINED / ILLUSTRATION</span></div>
          <div className="compare-line" style={{ left: `${compare}%` }}><i /></div>
          <input type="range" min="0" max="100" value={compare} onChange={(e) => setCompare(Number(e.target.value))} aria-label="Illustrated paint finish comparison" aria-valuetext={`${compare}% refined finish visible`} />
        </div>
        <div className="compare-metrics"><div><b>Clean.</b><span>Lift the contamination</span></div><div><b>Refine.</b><span>Address surface imperfections</span></div><div><b>Protect.</b><span>Choose your finishing layer</span></div></div>
      </section>

      <section className="apex-final"><span>{brand} / {city}</span><h2>Make the next drive<br /><em>feel like the first.</em></h2><button type="button" onClick={openQuote}>Build your estimate <ArrowIcon size={26} /></button></section>

      <DemoDialog open={quoteOpen} onClose={() => setQuoteOpen(false)} label="Your detailing estimate" className="apex-dialog" panelClassName="apex-quote">
        <div className="quote-head"><div><span>YOUR DEMO ESTIMATE</span><h2>{confirmed ? "Your build is ready." : "Every detail, together."}</h2></div><button type="button" onClick={() => setQuoteOpen(false)}>Close ×</button></div>
        {!confirmed ? <div className="quote-body"><div className="quote-spec"><span>Vehicle</span><b>{vehicle}</b></div><div className="quote-spec"><span>Color</span><b>{paint.name}</b></div><div className="quote-spec"><span>Treatment</span><b>{activePackage.name}</b></div><div className="quote-spec"><span>Extras</span><b>{[interior && "Interior", wheels && "Wheels"].filter(Boolean).join(" + ") || "None"}</b></div><div className="quote-price"><span>Sample estimate</span><strong>${total}</strong></div><button type="button" className="quote-send" onClick={() => setConfirmed(true)}>Create demo estimate <ArrowIcon /></button><small>Try the complete experience. This sample estimate is not sent to a business and no payment is collected.</small></div> : <div className="quote-success" role="status"><div aria-hidden="true">✓</div><p><strong>${total}</strong> estimated treatment</p><span>{vehicle} · {activePackage.name}<br />Your demo estimate is complete. No appointment has been booked.</span><button type="button" onClick={() => setQuoteOpen(false)}>Keep exploring</button></div>}
      </DemoDialog>
      <DemoSalesDock demoName="APEX DETAIL LAB" industry="Automotive / detailing" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#73d9ff" />
    </main>
  );
}
