"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";

type ServiceId="hvac"|"plumbing"|"electric";
const services=[
 {id:"hvac" as ServiceId,name:"HVAC",issue:"Not cooling",base:89,eta:"Today · 2–4 PM"},
 {id:"plumbing" as ServiceId,name:"Plumbing",issue:"Leak / clog",base:79,eta:"Today · 1–3 PM"},
 {id:"electric" as ServiceId,name:"Electrical",issue:"Power / panel",base:99,eta:"Today · 3–5 PM"},
];
const windows=["9–11 AM","12–2 PM","3–5 PM","5–7 PM"];
export function BrightlineExperience(){
 const [brand,setBrand]=useState("BRIGHTLINE");const [city,setCity]=useState("Orlando, FL");
 const [serviceId,setServiceId]=useState<ServiceId>("hvac");const [urgent,setUrgent]=useState(false);const [zip,setZip]=useState("32801");const [window,setWindow]=useState(windows[2]);const [open,setOpen]=useState(false);const [done,setDone]=useState(false);
 const service=useMemo(()=>services.find(s=>s.id===serviceId)??services[0],[serviceId]);const dispatch=service.base+(urgent?45:0);
 return <main className="bright-shell">
   <header className="bright-nav"><a href="#top" className="bright-brand" data-demo-brand>{brand}<i>+</i></a><div><span>HOME SYSTEMS</span><span>{city}</span></div><button type="button" onClick={()=>{setDone(false);setOpen(true)}}>Request service <ArrowIcon size={14}/></button></header>
   <section className="bright-hero" id="top">
    <div className="blueprint-grid" aria-hidden="true"></div>
    <div className="bright-copy"><span>HEATING · COOLING · PLUMBING · ELECTRICAL</span><motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.75,ease:[.2,.75,.18,1]}}>The house<br/>should just<br/><em>work.</em></motion.h1><p>Turn an urgent service call into a calm, guided intake before the phone ever rings.</p><button type="button" onClick={()=>{setDone(false);setOpen(true)}}>Diagnose the issue <ArrowIcon/></button></div>
    <div className="bright-house" aria-hidden="true"><span className="roof"></span><span className="wall"></span><span className="pipe p1"></span><span className="pipe p2"></span><span className="wire w1"></span><span className="unit"></span><i className="pulse"></i></div>
    <div className="bright-status"><span><i></i> DISPATCH OPEN</span><strong>4.9 / 5</strong><small>local service rating</small></div>
   </section>

   <section className="bright-diagnostic" id="services"><div className="bright-diagnostic-head"><span>START WITH THE SYSTEM</span><h2>What stopped<br/>working?</h2><p>The prospect picks a recognizable problem first. Technical classification happens underneath.</p></div><div className="system-grid">{services.map((item,index)=><button type="button" key={item.id} className={serviceId===item.id?"active":""} onClick={()=>setServiceId(item.id)}><span>{String(index+1).padStart(2,"0")}</span><div className={`system-icon ${item.id}`}><i></i><i></i><i></i></div><strong>{item.name}</strong><small>{item.issue}</small><b>Dispatch from ${item.base}</b></button>)}</div></section>

   <section className="bright-flow"><aside><span>LIVE INTAKE</span><h2>One minute<br/>to a useful lead.</h2><p>No generic “contact us” form. Every answer gives the service team context.</p></aside><div className="bright-intake-card"><div className="intake-top"><span>ACTIVE REQUEST</span><b>{service.name}</b></div><label><span>ZIP code</span><input value={zip} onChange={e=>setZip(e.target.value.replace(/\D/g,"").slice(0,5))} inputMode="numeric"/></label><div className="urgent-row"><div><span>Urgency</span><strong>{urgent?"Active issue":"Can schedule"}</strong></div><button type="button" className={urgent?"active":""} onClick={()=>setUrgent(v=>!v)}><i></i>{urgent?"Urgent":"Routine"}</button></div><div className="window-row"><span>Preferred window</span><div>{windows.map(w=><button type="button" key={w} className={window===w?"active":""} onClick={()=>setWindow(w)}>{w}</button>)}</div></div><div className="dispatch-total"><div><span>Dispatch estimate</span><small>applied to completed work</small></div><strong>${dispatch}</strong></div><button className="intake-continue" type="button" onClick={()=>{setDone(false);setOpen(true)}}>Continue request <ArrowIcon/></button></div></section>

   <section className="bright-trust"><div><span>01</span><strong>Clear arrival windows</strong><p>Reduce anxiety before the technician arrives.</p></div><div><span>02</span><strong>Useful issue context</strong><p>Give dispatch a better starting point.</p></div><div><span>03</span><strong>Lead routing ready</strong><p>Connect the real build to CRM, SMS or dispatch software.</p></div></section>

   <AnimatePresence>{open&&<motion.div className="bright-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button className="bright-scrim" type="button" aria-label="Close request" onClick={()=>setOpen(false)}/><motion.aside className="bright-panel" initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}} transition={{duration:.5,ease:[.2,.75,.18,1]}}><header><div><span>DEMO SERVICE REQUEST</span><h2>{done?"Dispatch ready.":"Confirm the visit."}</h2></div><button type="button" onClick={()=>setOpen(false)}>Close</button></header>{!done?<div className="bright-panel-body"><div className="request-spec"><span>System</span><b>{service.name}</b></div><div className="request-spec"><span>Priority</span><b>{urgent?"Urgent":"Routine"}</b></div><div className="request-spec"><span>ZIP</span><b>{zip||"—"}</b></div><div className="request-spec"><span>Window</span><b>{window}</b></div><div className="request-price"><span>Dispatch estimate</span><strong>${dispatch}</strong></div><button type="button" onClick={()=>setDone(true)}>Request this visit <ArrowIcon/></button><small>Demo mode — nothing is dispatched or charged.</small></div>:<div className="bright-success"><div className="success-pulse"><i></i></div><span>REQUEST / READY</span><h3>{service.name}<br/>{window}</h3><p>A production build would send this to the business and trigger customer confirmation.</p><button type="button" onClick={()=>setOpen(false)}>Return home</button></div>}</motion.aside></motion.div>}</AnimatePresence>
   <DemoSalesDock demoName="BRIGHTLINE" industry="Home services" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#1976d2"/>
 </main>
}
