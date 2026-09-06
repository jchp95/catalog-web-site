"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";
import { DemoDialog } from "@/components/ui/DemoDialog";
import { TiltCard } from "@/components/ui/TiltCard";

type Home = { id: string; name: string; area: string; price: number; beds: number; baths: number; sqft: number; image: string; description: string };
const homes: Home[] = [
  { id: "bay", name: "Bay House", area: "Old Cove", price: 875000, beds: 4, baths: 3, sqft: 2940, image: "/images/harbor.webp", description: "Room to gather, space to retreat. An open living area and generous outdoor spaces make this a home for every part of your day." },
  { id: "pine", name: "Pine Court", area: "North Ridge", price: 642000, beds: 3, baths: 2, sqft: 2180, image: "/images/harbor-pine.webp", description: "A quieter rhythm in North Ridge. Thoughtfully arranged living spaces and a garden for slow weekend mornings." },
  { id: "glass", name: "Glassline", area: "Harbor East", price: 1240000, beds: 4, baths: 4, sqft: 3610, image: "/images/harbor-glass.webp", description: "A modern point of view. Expansive living areas bring everyone together, with private spaces when you need a little distance." },
  { id: "sand", name: "Sand Key", area: "West Point", price: 715000, beds: 3, baths: 3, sqft: 2410, image: "/images/harbor-sand.webp", description: "Light, ease and a place to make your own. A welcoming home with flexible spaces for work, rest and everything in between." },
];
const tourWindows = ["10:00 AM", "12:30 PM", "3:00 PM"];
const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function formatDate(value: string) { return value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Choose a date"; }

export function HarborExperience() {
  const [brand, setBrand] = useState("HARBOR");
  const [city, setCity] = useState("Tampa Bay, FL");
  const [maxPrice, setMaxPrice] = useState(1300000);
  const [beds, setBeds] = useState(2);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [activeId, setActiveId] = useState(homes[0].id);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourDone, setTourDone] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(tourWindows[0]);
  const filtered = useMemo(() => homes.filter((home) => home.price <= maxPrice && home.beds >= beds && (!savedOnly || saved.includes(home.id))), [maxPrice, beds, savedOnly, saved]);
  const active = filtered.find((home) => home.id === activeId) ?? filtered[0];
  function toggleSave(id: string) { setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function resetFilters() { setMaxPrice(1300000); setBeds(2); setSavedOnly(false); }
  function openTour() { if (active) { setTourDone(false); setTourOpen(true); } }

  return <main className="harbor-shell" id="main-content">
    <header className="harbor-nav"><a href="#top" className="harbor-brand" data-demo-brand>{brand}<i>°</i></a><div><span>HOMES & A NEW PERSPECTIVE</span><span>{city}</span></div><a className="harbor-nav-action" href="#explore">Find your place <ArrowIcon size={14} /></a></header>
    <section className="harbor-hero" id="top">
      <div className="harbor-hero-image"><Image src="/images/harbor.webp" alt="Modern home with generous windows, terraces and outdoor living space" fill priority sizes="(max-width: 760px) 100vw, 60vw" /></div>
      <div className="harbor-hero-copy"><span>A LITTLE CLOSER TO YOUR KIND OF LIFE</span><motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75 }}>Space for<br /><em>what’s next.</em></motion.h1><p>The morning light. The neighborhood walk. The feeling when you turn the key. Find a home that fits more than your furniture.</p><a href="#explore">Meet your next home <ArrowIcon /></a><div className="harbor-hero-caption"><span>ROOTED IN</span><strong>{city}</strong></div></div>
      <a href="#property" className="harbor-feature-card" onClick={() => { resetFilters(); setActiveId("bay"); }}><span>IN THE COLLECTION / OLD COVE</span><strong>Bay House <ArrowIcon size={21} /></strong><p>4 beds · 3 baths · 2,940 sqft</p><b>$875,000</b></a>
    </section>

    <section className="harbor-explorer" id="explore">
      <aside className="harbor-filters"><span>A PLACE THAT FITS</span><h2>Start with<br />your everyday.</h2><label htmlFor="harbor-budget"><span>Your budget, up to</span><input id="harbor-budget" type="range" min="600000" max="1300000" step="50000" value={maxPrice} aria-valuetext={fmt(maxPrice)} onChange={(event) => { setMaxPrice(Number(event.target.value)); setTourDone(false); }} /><b>{fmt(maxPrice)}</b></label><fieldset><legend>At least this many bedrooms</legend><div>{[2, 3, 4].map((n) => <button key={n} type="button" aria-pressed={beds === n} className={beds === n ? "active" : ""} onClick={() => { setBeds(n); setTourDone(false); }}>{n}+</button>)}</div></fieldset><div className="harbor-view-filter" role="group" aria-label="Homes to show"><button type="button" aria-pressed={!savedOnly} className={!savedOnly ? "active" : ""} onClick={() => setSavedOnly(false)}>All homes</button><button type="button" aria-pressed={savedOnly} className={savedOnly ? "active" : ""} onClick={() => setSavedOnly(true)}>Saved ({saved.length})</button></div><p aria-live="polite">{filtered.length} {filtered.length === 1 ? "home matches" : "homes match"} your search</p><button type="button" className="harbor-reset" onClick={resetFilters}>Reset search</button></aside>
      <div className="harbor-results"><div className="harbor-results-top"><span>THE COLLECTION / {city}</span><span>{String(filtered.length).padStart(2, "0")} HOMES</span></div><p className="harbor-sample-note">Fictional listings and illustrative photography. Explore the experience; these homes are not offered for sale.</p><div className="harbor-home-grid">{filtered.length ? filtered.map((home, index) => <motion.article key={home.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .04, duration: .3 }} className={active?.id === home.id ? "active" : ""}><a href="#property" className="home-image" onClick={() => { setActiveId(home.id); setTourDone(false); }} aria-label={`View ${home.name}`}><Image src={home.image} alt={`Illustrative residence for ${home.name}`} fill sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 35vw" /><small>{home.area}</small></a><div><button type="button" className="save" onClick={() => toggleSave(home.id)} aria-pressed={saved.includes(home.id)} aria-label={`${saved.includes(home.id) ? "Unsave" : "Save"} ${home.name}`}>{saved.includes(home.id) ? "♥" : "♡"}</button><span>{home.beds} beds · {home.baths} baths · {home.sqft.toLocaleString("en-US")} sqft</span><a href="#property" onClick={() => { setActiveId(home.id); setTourDone(false); }}><strong>{home.name}</strong></a><b>{fmt(home.price)}</b><a className="harbor-home-link" href="#property" onClick={() => { setActiveId(home.id); setTourDone(false); }}>Take a closer look <ArrowIcon size={14} /></a></div></motion.article>) : <div className="harbor-empty" role="status"><span aria-hidden="true">H°</span><strong>{savedOnly && !saved.length ? "A home worth keeping." : "A little more room to search."}</strong><p>{savedOnly && !saved.length ? "Tap the heart on a home to start your collection. Your favorites stay here while you explore." : "There are no homes with this budget and bedroom count. Try a higher budget or fewer bedrooms."}</p><button type="button" onClick={resetFilters}>Explore all four homes <ArrowIcon size={16} /></button></div>}</div></div>
    </section>

    {active && <section id="property" className="harbor-selected"><TiltCard className="harbor-selected-visual" intensity={3}><Image key={active.image} src={active.image} alt={`Illustrative exterior of ${active.name}`} fill sizes="(max-width: 900px) 100vw, 60vw" /><small>{active.area} / SAMPLE PROPERTY</small></TiltCard><div className="harbor-selected-copy"><span>A CLOSER LOOK / {active.area}</span><h2>{active.name}</h2><p>{active.beds} beds · {active.baths} baths · {active.sqft.toLocaleString("en-US")} sqft</p><strong>{fmt(active.price)}</strong><hr /><p>{active.description}</p><button type="button" onClick={openTour}>Picture yourself here <ArrowIcon /></button><small>Explore a private tour request in demo mode.</small></div></section>}
    <footer className="harbor-footer"><a href="#top">{brand}°</a><p>A fresh perspective on coming home.<br />{city}</p><a href="#explore">Explore the collection <ArrowIcon size={17} /></a></footer>

    <DemoDialog open={tourOpen && !!active} onClose={() => setTourOpen(false)} label="Plan a private home tour" className="harbor-dialog" panelClassName="harbor-tour">
      {active && <><header><div><span>YOUR PRIVATE TOUR / DEMO</span><h2>{tourDone ? "Your next chapter, previewed." : `Come see ${active.name}.`}</h2></div><button type="button" onClick={() => setTourOpen(false)}>Close ×</button></header>{!tourDone ? <form onSubmit={(event) => { event.preventDefault(); setTourDone(true); }}><div className="tour-card"><span>{active.area}</span><strong>{fmt(active.price)}</strong><small>{active.beds} beds · {active.baths} baths</small></div><label className="harbor-tour-date"><span>Your preferred date</span><input type="date" required min={today()} value={date} onChange={(event) => { setDate(event.target.value); setTourDone(false); }} /></label><fieldset><legend>Choose a time · Sample availability</legend>{tourWindows.map((item) => <button type="button" key={item} aria-pressed={time === item} className={time === item ? "active" : ""} onClick={() => { setTime(item); setTourDone(false); }}>{item}<span aria-hidden="true">{time === item ? "✓" : "○"}</span></button>)}</fieldset><button className="tour-confirm" type="submit">Preview tour request <ArrowIcon /></button><p className="harbor-tour-note">Try the booking experience. No agent is contacted and no tour is scheduled.</p></form> : <div className="tour-success" role="status"><span aria-hidden="true">H°</span><h3>{active.name}</h3><p>{formatDate(date)} · {time}<br />Your demo tour request is complete. This is not a scheduled appointment.</p><button type="button" onClick={() => setTourDone(false)}>Change the date or time</button><button type="button" className="harbor-tour-return" onClick={() => setTourOpen(false)}>Back to the collection</button></div>}</>}
    </DemoDialog>
    <DemoSalesDock demoName="HARBOR" industry="Real estate" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#2c6a72" />
  </main>;
}
