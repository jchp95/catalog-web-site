"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoDialog } from "@/components/ui/DemoDialog";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";

const services = [
  { id: "signature", name: "Signature cut", note: "A conversation, a considered cut, a beautiful finish.", duration: "75 min", price: 92 },
  { id: "color", name: "Color dimension", note: "Soft dimension and a gloss, made for your undertone.", duration: "150 min", price: 185 },
  { id: "ritual", name: "Scalp ritual", note: "A slow scalp massage, nourishing treatment and finish.", duration: "60 min", price: 78 },
];
const stylists = ["Mara", "Sofia", "Elena"];
const times = ["10:30 AM", "12:15 PM", "2:00 PM", "3:45 PM", "5:20 PM"];
function upcomingDates() {
  const result: { id: string; label: string }[] = [];
  const day = new Date();
  day.setUTCHours(12, 0, 0, 0);
  while (result.length < 4) {
    day.setUTCDate(day.getUTCDate() + 1);
    if (day.getUTCDay() < 2) continue;
    result.push({ id: day.toISOString().slice(0, 10), label: day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) });
  }
  return result;
}

export function MireyaExperience() {
  const reducedMotion = useReducedMotion();
  const [brand, setBrand] = useState("MIREYA");
  const [city, setCity] = useState("Miami, FL");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [serviceId, setServiceId] = useState(services[0].id);
  const [stylist, setStylist] = useState(stylists[0]);
  const [dates] = useState(upcomingDates);
  const [dateIndex, setDateIndex] = useState(0);
  const [time, setTime] = useState(times[2]);
  const [confirmed, setConfirmed] = useState(false);
  const service = services.find((item) => item.id === serviceId) ?? services[0];
  function openBooking(id?: string) {
    if (id) setServiceId(id);
    setMenuOpen(false);
    setConfirmed(false);
    setBookingOpen(true);
  }

  return <main className="mireya-shell" id="main-content">
    <header className="mireya-nav">
      <Link href="/" className="mireya-back" aria-label="Back to the showroom">LOCAL/ <span>showroom</span></Link>
      <a className="mireya-logo" href="#top" data-demo-brand>{brand}</a>
      <div className="mireya-actions"><button type="button" onClick={() => openBooking()}>Book a visit</button><button type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mireya-menu" onClick={() => setMenuOpen((value) => !value)}><span /><span /></button></div>
      <AnimatePresence>{menuOpen && <motion.nav id="mireya-menu" className="mireya-menu" aria-label="Salon navigation" initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}>
        <a href="#services" onClick={() => setMenuOpen(false)}>The service menu <ArrowIcon /></a><a href="#studio" onClick={() => setMenuOpen(false)}>Our approach <ArrowIcon /></a><a href="#visit" onClick={() => setMenuOpen(false)}>Plan your visit <ArrowIcon /></a><span>{city} · Salon concept</span>
      </motion.nav>}</AnimatePresence>
    </header>

    <section id="top" className="mireya-hero">
      <div className="mireya-hero-copy">
        <span className="mireya-eyebrow"><span /> A little time, entirely yours.</span>
        <motion.h1 initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .7 }}>Beautiful<br />looks <em>like you.</em></motion.h1>
        <p>Thoughtful hair, luminous color, and a little room to breathe. Come as you are. Leave feeling more like yourself.</p>
        <button type="button" className="mireya-primary" onClick={() => openBooking()}>Find your appointment <ArrowIcon /></button>
        <div className="mireya-hero-foot"><span>HAIR / COLOR / CARE</span><a href="#services">Explore the menu <span>↓</span></a></div>
      </div>
      <motion.figure className="mireya-portrait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : .9 }}>
        <div className="mireya-photo-frame"><Image src="/images/mireya.webp" alt="An editorial portrait celebrating natural hair, soft texture and personal style" fill priority sizes="(max-width: 720px) 100vw, 50vw" /></div>
        <div className="mireya-photo-mark" aria-hidden="true">m.</div><figcaption><span>Good hair.<br />Your energy.</span><span>{city}<br />By appointment</span></figcaption>
      </motion.figure>
    </section>
    <div className="mireya-philosophy"><span>PERSONAL BY NATURE</span><p>A look that belongs to you.<br /><em>A moment that does, too.</em></p><span>THE {brand} WAY</span></div>

    <section id="services" className="mireya-services">
      <div className="mireya-section-intro"><span className="mireya-eyebrow">The service menu</span><div><h2>Good things.<br /><em>Beautifully done.</em></h2><p>Start with what you need. Every visit leaves room for a conversation.</p></div></div>
      <div className="mireya-service-list">{services.map((item) => <button type="button" key={item.id} onClick={() => openBooking(item.id)} className="mireya-service-row" aria-label={`Book ${item.name}, $${item.price}`}><div><strong>{item.name}</strong><small>{item.note}</small></div><div><small>{item.duration}</small><b>${item.price}</b></div><span className="mireya-service-arrow"><ArrowIcon /></span></button>)}</div>
      <p className="mireya-menu-note">Sample services and pricing for this salon concept. Choose one to try the booking experience.</p>
    </section>

    <section id="studio" className="mireya-studio">
      <div className="mireya-studio-word" aria-hidden="true">slow<br /><em>beauty.</em></div>
      <div className="mireya-studio-copy"><span className="mireya-eyebrow">Our approach</span><h2>Less rush.<br />More <em>attention.</em></h2><p>Your texture. Your routine. The way you like to wear your hair on an ordinary Tuesday. That is where we start.</p><p>From the first conversation to the finishing touch, the appointment is shaped around you.</p><a href="#visit">Make a little space for yourself <ArrowIcon /></a></div>
      <div className="mireya-ritual"><span>THE LITTLE DETAILS</span><p>A proper consultation.</p><p>Time to settle in.</p><p>Care you can take home.</p></div>
    </section>

    <section id="visit" className="mireya-cta">
      <div><span className="mireya-eyebrow">Your next good hair day</span><p>{city} · A salon concept by LOCAL/</p></div>
      <button type="button" onClick={() => openBooking()}>Make time<br /><em>for you.</em><span><ArrowIcon size={32} /></span></button>
      <footer><a href="#top" data-demo-brand>{brand}</a><span>Hair with intention.</span><Link href="/">Explore the showroom ↗</Link></footer>
    </section>

    <DemoDialog open={bookingOpen} onClose={() => setBookingOpen(false)} label="Book an appointment at Mireya" className="booking-layer" panelClassName="booking-panel">
      <div className="booking-head"><div><span>TRY THE BOOKING EXPERIENCE</span><h2>{confirmed ? "A little time for you." : "Build your visit."}</h2></div><button type="button" onClick={() => setBookingOpen(false)} aria-label="Close booking">Close <span aria-hidden="true">×</span></button></div>
      {!confirmed ? <>
        <p className="booking-intro">Choose your service, your stylist, and a time that feels right. All availability below is for this demo.</p>
        <fieldset><legend>1 · Your service</legend><div className="booking-options services">{services.map((item) => <button type="button" aria-pressed={serviceId === item.id} className={serviceId === item.id ? "active" : ""} key={item.id} onClick={() => setServiceId(item.id)}><span>{item.name}<small>{item.duration}</small></span><b>${item.price}</b></button>)}</div></fieldset>
        <fieldset><legend>2 · Your stylist</legend><div className="booking-options compact">{stylists.map((item) => <button type="button" aria-pressed={stylist === item} className={stylist === item ? "active" : ""} key={item} onClick={() => setStylist(item)}>{item}</button>)}</div></fieldset>
        <fieldset><legend>3 · Your day</legend><div className="booking-options compact dates">{dates.map((item, index) => <button type="button" aria-pressed={dateIndex === index} className={dateIndex === index ? "active" : ""} key={item.id} onClick={() => setDateIndex(index)}>{item.label}</button>)}</div></fieldset>
        <fieldset><legend>4 · Your time · {city}</legend><div className="booking-options compact times">{times.map((item) => <button type="button" aria-pressed={time === item} className={time === item ? "active" : ""} key={item} onClick={() => setTime(item)}>{item}</button>)}</div></fieldset>
        <div className="booking-summary" aria-live="polite"><div><span>{service.name}</span><small>{stylist} · {dates[dateIndex].label} · {time}</small></div><strong>${service.price}</strong></div>
        <button type="button" className="booking-confirm" onClick={() => setConfirmed(true)}>Preview my appointment <ArrowIcon /></button><small className="booking-note">Demo only. No appointment is reserved and no payment is taken.</small>
      </> : <div className="booking-success" role="status"><div aria-hidden="true">✓</div><span className="booking-success-label">YOUR DEMO APPOINTMENT</span><p><strong>{service.name}</strong><br />with {stylist}</p><dl><div><dt>Day</dt><dd>{dates[dateIndex].label}</dd></div><div><dt>Time</dt><dd>{time}</dd></div><div><dt>Total</dt><dd>${service.price}</dd></div></dl><span>This is a preview. No real appointment has been reserved.</span><button type="button" onClick={() => setConfirmed(false)}>Change my selection</button><button type="button" onClick={() => setBookingOpen(false)}>Return to {brand} <ArrowIcon /></button></div>}
    </DemoDialog>
    <DemoSalesDock demoName="MIREYA" industry="Beauty / salon" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#8c6cff" />
  </main>;
}
