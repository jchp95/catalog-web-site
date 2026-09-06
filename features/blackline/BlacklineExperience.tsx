"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoDialog } from "@/components/ui/DemoDialog";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";

const barbers = [
  { id: "marcus", name: "Marcus Reed", role: "Master barber", cut: "Fades / texture", note: "Crisp lines. Natural texture. A fade that grows out right.", initials: "MR" },
  { id: "dev", name: "Dev Carter", role: "Senior barber", cut: "Classic / beard", note: "Classic shapes and a beard finish with every detail considered.", initials: "DC" },
  { id: "leo", name: "Leo Grant", role: "Barber", cut: "Tapers / design", note: "Clean tapers and individual details that make a cut your own.", initials: "LG" },
];
const services = [
  { id: "cut", name: "The cut", time: "45 min", price: 42, note: "Consultation, precision cut, wash and style." },
  { id: "cut-beard", name: "Cut + beard", time: "60 min", price: 58, note: "The full cut, a shaped beard and a hot towel finish." },
  { id: "shape", name: "Beard shape", time: "30 min", price: 28, note: "Define the shape. Clean the edges. Finish with care." },
];
const slots = ["10:40 AM", "11:30 AM", "1:10 PM", "2:40 PM", "4:20 PM"];
function upcomingDates() {
  const result: { id: string; label: string }[] = [];
  const day = new Date();
  day.setUTCHours(12, 0, 0, 0);
  while (result.length < 4) {
    day.setUTCDate(day.getUTCDate() + 1);
    if (day.getUTCDay() === 0) continue;
    result.push({ id: day.toISOString().slice(0, 10), label: day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }) });
  }
  return result;
}

export function BlacklineExperience() {
  const reducedMotion = useReducedMotion();
  const [brand, setBrand] = useState("BLACKLINE");
  const [city, setCity] = useState("Atlanta, GA");
  const [barberId, setBarberId] = useState(barbers[1].id);
  const [serviceId, setServiceId] = useState(services[1].id);
  const [dates] = useState(upcomingDates);
  const [dateIndex, setDateIndex] = useState(0);
  const [slot, setSlot] = useState(slots[2]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const barber = barbers.find(item => item.id === barberId) ?? barbers[0];
  const service = services.find(item => item.id === serviceId) ?? services[0];
  function openBooking(id?: string) {
    if (id) setServiceId(id);
    setConfirmed(false);
    setBookingOpen(true);
  }

  return <main className="blackline-shell" id="main-content">
    <header className="blackline-nav">
      <a href="#top" className="blackline-logo" data-demo-brand>{brand}<span>BARBER CO.</span></a>
      <nav aria-label="Barbershop navigation"><a href="#services">The menu</a><a href="#barbers">The crew</a><Link href="/">Showroom ↗</Link></nav>
      <button type="button" onClick={() => openBooking()}>Book a chair <ArrowIcon size={16} /></button>
    </header>

    <section id="top" className="blackline-hero">
      <Image src="/images/blackline.webp" alt="A barber carefully shaping a client's haircut in a contemporary barbershop" fill priority sizes="100vw" className="blackline-hero-photo" />
      <div className="blackline-hero-shade" />
      <div className="blackline-hero-eyebrow"><span>{city} / BARBER CULTURE</span><span>COME THROUGH. LEAVE SHARP.</span></div>
      <motion.h1 className="blackline-type" initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .7 }}>GOOD<br />HAIR.<br /><span>NO HYPE.</span></motion.h1>
      <div className="blackline-hero-bottom"><p>A clean cut. A familiar chair.<br />Your next look starts here.</p><button type="button" onClick={() => openBooking()}>Find your barber <ArrowIcon size={24} /></button><a href="#services" className="blackline-scroll">SCROLL FOR THE GOOD STUFF <span>↓</span></a></div>
    </section>
    <div className="blackline-service-strip" aria-label="Cuts, beard care, tapers, texture and hot towels"><span>CUTS</span><i aria-hidden="true">✳</i><span>BEARDS</span><i aria-hidden="true">✳</i><span>TAPERS</span><i aria-hidden="true">✳</i><span>TEXTURE</span><i aria-hidden="true">✳</i><span>HOT TOWELS</span></div>

    <section id="services" className="blackline-menu">
      <div className="blackline-section-head"><span>THE MENU</span><h2>Keep it<br /><em>sharp.</em></h2><p>No overthinking it. Choose your service and we’ll take care of the details.</p></div>
      <div className="blackline-menu-list">{services.map(item => <button type="button" key={item.id} onClick={() => openBooking(item.id)} aria-label={`Book ${item.name}, $${item.price}`}><div><strong>{item.name}</strong><span>{item.note}</span></div><small>{item.time}</small><b>${item.price}</b><ArrowIcon size={25} /></button>)}</div>
      <p className="blackline-sample-note">Sample menu and pricing. Try a service to explore the booking demo.</p>
    </section>

    <section className="blackline-crew" id="barbers">
      <div className="blackline-section-head"><span>THE CREW</span><h2>Find your<br /><em>person.</em></h2><p>Different hands. The same attention to detail. Pick the barber that fits your style.</p></div>
      <div className="barber-grid">{barbers.map(item => <button key={item.id} type="button" aria-pressed={barberId === item.id} className={barberId === item.id ? "active" : ""} onClick={() => setBarberId(item.id)} aria-label={`Select ${item.name}, ${item.cut}`}><div className="barber-card-top"><span>{item.role}</span><span className="barber-selected">{barberId === item.id ? "SELECTED ✓" : "SELECT +"}</span></div><span className="barber-monogram" aria-hidden="true">{item.initials}<span>↗</span></span><div className="barber-meta"><strong>{item.name}</strong><small>{item.cut}</small><p>{item.note}</p></div></button>)}</div>
      <div className="blackline-livebook"><div aria-live="polite"><span>YOUR BARBER</span><strong>{barber.name}</strong><small>{barber.cut}</small></div><p>Your style. Their craft.<br />Let’s find your time.</p><button type="button" onClick={() => openBooking()}>Book with {barber.name.split(" ")[0]} <ArrowIcon /></button></div>
    </section>

    <section className="blackline-shop"><div className="blackline-shop-word" aria-hidden="true">TAKE<br />A SEAT<span>↗</span></div><div className="blackline-shop-copy"><span>MORE THAN THE FINISH</span><h2>The chair is yours.</h2><p>Bring a reference. Bring a new idea. Or just ask for your usual. We’ll talk it through before the clippers come on.</p><p>Good conversation, a fresh cut, and a little time out of your day. That’s the whole idea.</p><button type="button" onClick={() => openBooking()}>Make it your next stop <ArrowIcon /></button></div></section>
    <footer className="blackline-footer"><a href="#top" data-demo-brand>{brand}</a><div><span>{city}</span><span>A barbershop concept by LOCAL/</span></div><Link href="/">Back to the showroom <ArrowIcon size={16} /></Link></footer>

    <DemoDialog open={bookingOpen} onClose={() => setBookingOpen(false)} label="Book a chair at Blackline" className="blackline-book-layer" panelClassName="blackline-book">
      <header><div><span>TRY THE BOOKING EXPERIENCE</span><h2>{confirmed ? "Looking sharp." : "Your chair. Your time."}</h2></div><button type="button" onClick={() => setBookingOpen(false)} aria-label="Close booking">Close ×</button></header>
      {!confirmed ? <>
        <p className="blackline-book-intro">Choose the cut and the person behind it. The dates and times below are sample availability.</p>
        <fieldset><legend>1 / Barber</legend><div className="blackline-choice-row">{barbers.map(item => <button type="button" aria-pressed={barberId === item.id} key={item.id} className={barberId === item.id ? "active" : ""} onClick={() => setBarberId(item.id)}>{item.name.split(" ")[0]}</button>)}</div></fieldset>
        <fieldset><legend>2 / Service</legend><div className="blackline-services">{services.map(item => <button type="button" aria-pressed={serviceId === item.id} key={item.id} className={serviceId === item.id ? "active" : ""} onClick={() => setServiceId(item.id)}><span><b>{item.name}</b><small>{item.time}</small></span><strong>${item.price}</strong></button>)}</div></fieldset>
        <fieldset><legend>3 / Day</legend><div className="blackline-choice-row dates">{dates.map((item, index) => <button type="button" aria-pressed={dateIndex === index} key={item.id} className={dateIndex === index ? "active" : ""} onClick={() => setDateIndex(index)}>{item.label}</button>)}</div></fieldset>
        <fieldset><legend>4 / Time · {city}</legend><div className="blackline-choice-row times">{slots.map(item => <button type="button" aria-pressed={slot === item} key={item} className={slot === item ? "active" : ""} onClick={() => setSlot(item)}>{item}</button>)}</div></fieldset>
        <div className="blackline-summary" aria-live="polite"><div><span>{barber.name} · {service.name}</span><small>{dates[dateIndex].label} · {slot}</small></div><strong>${service.price}</strong></div>
        <button className="blackline-confirm" type="button" onClick={() => setConfirmed(true)}>Preview my booking <ArrowIcon /></button><small className="blackline-demo-note">Demo only. No appointment is reserved and no payment is taken.</small>
      </> : <div className="blackline-success" role="status"><span>YOUR DEMO BOOKING</span><h3>{service.name}<br />with {barber.name.split(" ")[0]}.</h3><dl><div><dt>Day</dt><dd>{dates[dateIndex].label}</dd></div><div><dt>Time</dt><dd>{slot}</dd></div><div><dt>Total</dt><dd>${service.price}</dd></div></dl><p>This is a preview. No real appointment has been reserved.</p><button type="button" onClick={() => setConfirmed(false)}>Change my selection</button><button type="button" onClick={() => setBookingOpen(false)}>Back to the shop <ArrowIcon /></button></div>}
    </DemoDialog>
    <DemoSalesDock demoName="BLACKLINE" industry="Barbershop" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#e85d34" />
  </main>;
}
