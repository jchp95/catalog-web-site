"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";

type Barber = { id:string; name:string; role:string; wait:number; cut:string; initials:string };
const barbers: Barber[] = [
  { id:"marcus", name:"Marcus Reed", role:"Master barber", wait:18, cut:"Fades / texture", initials:"MR" },
  { id:"dev", name:"Dev Carter", role:"Senior barber", wait:8, cut:"Classic / beard", initials:"DC" },
  { id:"leo", name:"Leo Grant", role:"Barber", wait:26, cut:"Tapers / design", initials:"LG" },
];
const services = [
  { id:"cut", name:"Cut", time:"45 min", price:42 },
  { id:"cut-beard", name:"Cut + beard", time:"60 min", price:58 },
  { id:"shape", name:"Beard shape", time:"30 min", price:28 },
];
const slots = ["10:40", "11:30", "1:10", "2:40", "4:20"];

export function BlacklineExperience() {
  const [brand, setBrand] = useState("BLACKLINE");
  const [city, setCity] = useState("Atlanta, GA");
  const [barberId, setBarberId] = useState(barbers[1].id);
  const [serviceId, setServiceId] = useState(services[1].id);
  const [slot, setSlot] = useState(slots[2]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const barber = useMemo(() => barbers.find(item => item.id === barberId) ?? barbers[0], [barberId]);
  const service = useMemo(() => services.find(item => item.id === serviceId) ?? services[0], [serviceId]);

  return <main className="blackline-shell">
    <div className="blackline-scan" aria-hidden="true" />
    <header className="blackline-nav">
      <a href="#top" className="blackline-logo" data-demo-brand>{brand}</a>
      <div><span>{city}</span><span>Walk-ins active</span></div>
      <button type="button" onClick={()=>{setConfirmed(false);setBookingOpen(true)}}>Book a chair <ArrowIcon size={15}/></button>
    </header>

    <section id="top" className="blackline-hero">
      <div className="blackline-hero-index"><span>CHAIR 04</span><b>BARBER SYSTEM / 26</b></div>
      <motion.div className="blackline-type" initial={{opacity:0,y:35}} animate={{opacity:1,y:0}} transition={{duration:.7,ease:[.2,.75,.18,1]}}>
        <span>NO</span><strong>BAD</strong><span>HAIR</span><em>CUTS.</em>
      </motion.div>
      <div className="blackline-chair" aria-hidden="true">
        <span className="chair-head"></span><span className="chair-back"></span><span className="chair-seat"></span><span className="chair-arm l"></span><span className="chair-arm r"></span><span className="chair-base"></span>
      </div>
      <div className="blackline-hero-copy"><p>Choose the barber, see the queue, lock the chair. No call required.</p><button type="button" onClick={()=>{setConfirmed(false);setBookingOpen(true)}}>Find a chair <ArrowIcon/></button></div>
      <div className="blackline-marquee"><div>{["CUT","BEARD","TAPER","TEXTURE","HOT TOWEL","CUT","BEARD","TAPER","TEXTURE","HOT TOWEL"].map((x,i)=><span key={`${x}-${i}`}>{x}<i>✦</i></span>)}</div></div>
    </section>

    <section className="blackline-queue" id="barbers">
      <div className="blackline-section-head"><span>LIVE FLOOR</span><h2>Pick the hand.<br/>Not just the hour.</h2><p>Availability becomes part of the brand experience instead of a dead calendar grid.</p></div>
      <div className="barber-grid">
        {barbers.map((item,index)=><button key={item.id} type="button" className={barberId===item.id?"active":""} onClick={()=>setBarberId(item.id)}>
          <div className="barber-portrait"><span>{item.initials}</span><i>{String(index+1).padStart(2,"0")}</i></div>
          <div className="barber-meta"><span>{item.role}</span><strong>{item.name}</strong><small>{item.cut}</small></div>
          <div className="barber-wait"><span>Next chair</span><b>{item.wait}<small>min</small></b></div>
        </button>)}
      </div>
    </section>

    <section className="blackline-livebook">
      <div><span>SELECTED BARBER</span><strong>{barber.name}</strong><small>{barber.role} · {barber.cut}</small></div>
      <div className="livebook-line"><span style={{width:`${Math.max(22, 100-barber.wait*2)}%`}}></span></div>
      <button type="button" onClick={()=>{setConfirmed(false);setBookingOpen(true)}}>Book with {barber.name.split(" ")[0]} <ArrowIcon/></button>
    </section>

    <section className="blackline-proof">
      <div className="blackline-proof-big"><span>REBOOK RATE</span><strong>81%</strong></div>
      <div><h2>A shop can feel raw<br/>and still run <em>clean.</em></h2><p>The design carries the attitude. The booking logic removes friction.</p></div>
    </section>

    <AnimatePresence>{bookingOpen && <motion.div className="blackline-book-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <button className="blackline-scrim" type="button" aria-label="Close booking" onClick={()=>setBookingOpen(false)}/>
      <motion.aside className="blackline-book" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{duration:.48,ease:[.2,.75,.18,1]}}>
        <header><div><span>DEMO BOOKING</span><h2>{confirmed?"Chair locked.":"Build the visit."}</h2></div><button type="button" onClick={()=>setBookingOpen(false)}>Close</button></header>
        {!confirmed?<>
          <fieldset><legend>Barber</legend><div className="blackline-choice-row">{barbers.map(item=><button type="button" key={item.id} className={barberId===item.id?"active":""} onClick={()=>setBarberId(item.id)}>{item.name.split(" ")[0]}<small>{item.wait}m</small></button>)}</div></fieldset>
          <fieldset><legend>Service</legend><div className="blackline-services">{services.map(item=><button type="button" key={item.id} className={serviceId===item.id?"active":""} onClick={()=>setServiceId(item.id)}><span><b>{item.name}</b><small>{item.time}</small></span><strong>${item.price}</strong></button>)}</div></fieldset>
          <fieldset><legend>Time</legend><div className="blackline-choice-row times">{slots.map(item=><button type="button" key={item} className={slot===item?"active":""} onClick={()=>setSlot(item)}>{item}</button>)}</div></fieldset>
          <div className="blackline-summary"><div><span>{barber.name}</span><small>{service.name} · {slot}</small></div><strong>${service.price}</strong></div>
          <button className="blackline-confirm" type="button" onClick={()=>setConfirmed(true)}>Lock this chair <ArrowIcon/></button>
          <small className="blackline-demo-note">Demo mode — no real appointment is created.</small>
        </>:<div className="blackline-success"><span>04</span><h3>{slot}<br/>{barber.name}</h3><p>{service.name} · ${service.price}</p><button type="button" onClick={()=>setBookingOpen(false)}>Back to the shop</button></div>}
      </motion.aside>
    </motion.div>}</AnimatePresence>

    <DemoSalesDock demoName="BLACKLINE" industry="Barbershop" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#e85d34" />
  </main>;
}
