"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";
import { DemoDialog } from "@/components/ui/DemoDialog";
import { TiltCard } from "@/components/ui/TiltCard";

type Dish = { id: string; name: string; note: string; price: number; course: string; description: string; pairing: string };
const dishes: Dish[] = [
  { id: "ember", name: "Ember ribeye", note: "16 oz · smoked marrow · charred onion", price: 64, course: "From the fire", description: "A generous cut, a hard sear, a little smoke. Served with roasted bone marrow and sweet onions from the coals.", pairing: "A bold red, a long conversation." },
  { id: "octopus", name: "Coal octopus", note: "ají amarillo · citrus · black garlic", price: 34, course: "To begin", description: "Tender octopus meets the hottest part of the grill, finished with bright citrus and a silky ají amarillo sauce.", pairing: "Start here. Share with someone." },
  { id: "corn", name: "Burnt corn", note: "cotija · lime · chile oil", price: 17, course: "From the garden", description: "Sweet corn, blistered over the fire. Salty cotija, fresh lime and just enough chile to keep things interesting.", pairing: "A little heat for the whole table." },
  { id: "choco", name: "Smoke + cacao", note: "dark chocolate · mezcal · sea salt", price: 16, course: "One last thing", description: "Deep dark chocolate with a whisper of mezcal and a pinch of sea salt. An unhurried ending.", pairing: "Leave a little room." },
];
const reservationTimes = ["5:30 PM", "6:45 PM", "8:00 PM", "9:15 PM"];
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function formatNight(value: string) { return value ? new Date(`${value}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Choose a date"; }

export function CasaFuegoExperience() {
  const [brand, setBrand] = useState("CASA FUEGO");
  const [city, setCity] = useState("Austin, TX");
  const [dishId, setDishId] = useState(dishes[0].id);
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState(reservationTimes[2]);
  const [date, setDate] = useState("");
  const [reserveOpen, setReserveOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const dish = dishes.find((item) => item.id === dishId) ?? dishes[0];
  const openReservation = () => { setConfirmed(false); setReserveOpen(true); };

  return <main className="fuego-shell" id="main-content">
    <header className="fuego-nav"><a href="#top" className="fuego-brand" data-demo-brand>{brand}<span>COCINA AL FUEGO</span></a><nav aria-label="Restaurant navigation"><a href="#menu">The menu</a><a href="#room">The room</a><a href="#visit">Visit us</a></nav><button type="button" onClick={openReservation}>Find a table <ArrowIcon size={14} /></button></header>
    <section id="top" className="fuego-hero">
      <div className="fuego-hero-photo"><Image src="/images/casa-fuego.webp" alt="Warmly lit restaurant with intimate tables and welcoming evening atmosphere" fill priority sizes="100vw" /></div>
      <div className="fuego-side"><span>GOOD COMPANY. OPEN FLAME.</span><span>{city}</span></div>
      <motion.div className="fuego-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}><h1>Dinner starts<br /><em>with fire.</em></h1></motion.div>
      <div className="fuego-hero-bottom"><p>Come hungry. Stay a little longer.<br />There’s always room for another story.</p><a href="#menu">A taste of the menu <ArrowIcon /></a><span>DINNER / TUESDAY–SUNDAY</span></div>
    </section>

    <section id="menu" className="fuego-menu">
      <div className="fuego-menu-head"><span>FROM OUR SAMPLE MENU</span><h2>Built around<br /><em>the embers.</em></h2><p>Seasonal ingredients. A wood-fired grill. Plates made for passing around the table.</p></div>
      <div className="fuego-menu-body">
        <div className="fuego-menu-feature" aria-live="polite">
          <TiltCard className="fuego-menu-photo" intensity={4}><Image src="/images/fuego-food.webp" alt="A fire-grilled sharing board plated for the table" fill sizes="(max-width: 700px) 100vw, 40vw" /><span>FRESH OFF THE GRILL</span></TiltCard>
          <div className="fuego-menu-copy"><span>{dish.course}</span><motion.div key={dish.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}><h3>{dish.name}<i> / ${dish.price}</i></h3><p>{dish.description}</p><em>{dish.pairing}</em></motion.div><small>Menu concept · Please discuss allergies with your server.</small></div>
        </div>
        <div className="fuego-dish-list" role="group" aria-label="Explore the sample menu">{dishes.map((item) => <button type="button" key={item.id} aria-pressed={dishId === item.id} className={dishId === item.id ? "active" : ""} onClick={() => setDishId(item.id)}><span aria-hidden="true">{dishId === item.id ? "↗" : "+"}</span><div><small>{item.course}</small><strong>{item.name}</strong><p>{item.note}</p></div><b>${item.price}</b></button>)}</div>
      </div>
    </section>

    <section id="room" className="fuego-room">
      <div className="fuego-room-visual"><Image src="/images/casa-fuego.webp" alt="An intimate dining room set for an evening with friends" fill sizes="(max-width: 900px) 100vw, 55vw" /><small>A PLACE TO SETTLE IN</small></div>
      <div className="fuego-room-copy"><span>THE OTHER INGREDIENT</span><h2>A full table.<br /><em>A good night.</em></h2><p>Low light. Something cold in your glass. The next plate on its way. Bring your favorite people and let the evening find its own rhythm.</p><div className="fuego-room-details"><span>AT THE COUNTER</span><p>A front-row seat to the kitchen.</p><span>IN THE DINING ROOM</span><p>A little space to make the night yours.</p></div><button type="button" onClick={openReservation}>Make an evening of it <ArrowIcon /></button></div>
    </section>

    <section id="visit" className="fuego-final"><div><span>{brand} / {city}</span><h2>One more story.<br /><em>One more course.</em></h2></div><div className="fuego-visit"><p>Tuesday–Thursday · 5–10 PM<br />Friday–Saturday · 5–11 PM<br />Sunday · 5–9 PM</p><button type="button" onClick={openReservation}>Find your table <ArrowIcon size={22} /></button><small>Fictional restaurant · Interactive reservation demo</small></div></section>

    <DemoDialog open={reserveOpen} onClose={() => setReserveOpen(false)} label="Find your table" className="fuego-dialog" panelClassName="fuego-reserve">
      <header><div><span>TABLE FOR A GOOD NIGHT</span><h2>{confirmed ? "A taste of what’s next." : "Choose your evening."}</h2></div><button type="button" onClick={() => setReserveOpen(false)}>Close ×</button></header>
      {!confirmed ? <form className="fuego-reserve-body" onSubmit={(event) => { event.preventDefault(); setConfirmed(true); }}>
        <label className="fuego-date"><span>Your date</span><input type="date" required min={today()} value={date} onChange={(event) => { setDate(event.target.value); setConfirmed(false); }} /></label>
        <fieldset><legend>People at your table</legend><div>{[1, 2, 3, 4, 5, 6].map((n) => <button type="button" key={n} aria-pressed={guests === n} className={guests === n ? "active" : ""} onClick={() => { setGuests(n); setConfirmed(false); }}>{n}</button>)}</div></fieldset>
        <fieldset><legend>Preferred time · Sample availability</legend><div>{reservationTimes.map((item) => <button type="button" key={item} aria-pressed={time === item} className={time === item ? "active" : ""} onClick={() => { setTime(item); setConfirmed(false); }}>{item}</button>)}</div></fieldset>
        <div className="fuego-reserve-summary"><span>{formatNight(date)} · {guests} {guests === 1 ? "guest" : "guests"}</span><strong>{time}</strong><small>Dining room · {city}</small></div><button className="fuego-reserve-confirm" type="submit">Try this reservation <ArrowIcon /></button><small>This is a sample booking. No restaurant is contacted and no table is reserved.</small>
      </form> : <div className="fuego-reserve-success" role="status"><span>YOUR RESERVATION PREVIEW</span><h3>{time}</h3><p>{formatNight(date)} · {guests} {guests === 1 ? "guest" : "guests"} · {brand}</p><small>Your demo is complete. This is not an actual reservation.</small><button type="button" onClick={() => setConfirmed(false)}>Choose another evening</button><button type="button" className="fuego-return" onClick={() => setReserveOpen(false)}>Back to the menu</button></div>}
    </DemoDialog>
    <DemoSalesDock demoName="CASA FUEGO" industry="Restaurant / hospitality" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#f24d2e" />
  </main>;
}
