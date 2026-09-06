"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";

type Home={id:string;name:string;area:string;price:number;beds:number;baths:number;sqft:number;tone:string};
const homes:Home[]=[
{id:"bay",name:"Bay House",area:"Old Cove",price:875000,beds:4,baths:3,sqft:2940,tone:"#b9d6df"},
{id:"pine",name:"Pine Court",area:"North Ridge",price:642000,beds:3,baths:2,sqft:2180,tone:"#d9d1be"},
{id:"glass",name:"Glassline",area:"Harbor East",price:1240000,beds:4,baths:4,sqft:3610,tone:"#bdc8c2"},
{id:"sand",name:"Sand Key",area:"West Point",price:715000,beds:3,baths:3,sqft:2410,tone:"#dac5b4"},
];
const fmt=(n:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n);
export function HarborExperience(){
 const [brand,setBrand]=useState("HARBOR");const [city,setCity]=useState("Tampa Bay, FL");
 const [maxPrice,setMaxPrice]=useState(1000000);const [beds,setBeds]=useState(3);const [saved,setSaved]=useState<string[]>([]);const [activeId,setActiveId]=useState(homes[0].id);const [tourOpen,setTourOpen]=useState(false);const [tourDone,setTourDone]=useState(false);
 const filtered=useMemo(()=>homes.filter(h=>h.price<=maxPrice&&h.beds>=beds),[maxPrice,beds]);const active=homes.find(h=>h.id===activeId)??homes[0];
 function toggleSave(id:string){setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])}
 return <main className="harbor-shell">
  <header className="harbor-nav"><a href="#top" className="harbor-brand" data-demo-brand>{brand}<i>°</i></a><div><span>RESIDENTIAL / ADVISORY</span><span>{city}</span></div><button type="button" onClick={()=>{setTourDone(false);setTourOpen(true)}}>Schedule a tour <ArrowIcon size={14}/></button></header>
  <section className="harbor-hero" id="top">
    <div className="harbor-map" aria-hidden="true"><span className="shore a"></span><span className="shore b"></span><span className="road r1"></span><span className="road r2"></span><i className="pin p1"></i><i className="pin p2"></i><i className="pin p3"></i></div>
    <div className="harbor-hero-copy"><span>LIVE WHERE THE DAY OPENS UP</span><motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.75,ease:[.2,.75,.18,1]}}>Find the<br/><em>right edge</em><br/>of the city.</motion.h1><p>Search homes by the life around them, not by a wall of identical listing cards.</p><a href="#explore">Explore the map <ArrowIcon/></a></div>
    <div className="harbor-feature-card"><div className="house-abstract"><span></span><i></i></div><span>FEATURED / OLD COVE</span><strong>Bay House</strong><p>4 bd · 3 ba · 2,940 sqft</p><b>$875K</b></div>
  </section>

  <section className="harbor-explorer" id="explore">
    <aside className="harbor-filters"><span>LIVE SEARCH</span><h2>Move the<br/>market.</h2><label><span>Maximum price</span><input type="range" min="650000" max="1300000" step="50000" value={maxPrice} onChange={e=>setMaxPrice(Number(e.target.value))}/><b>{fmt(maxPrice)}</b></label><label><span>Minimum beds</span><div>{[2,3,4].map(n=><button key={n} type="button" className={beds===n?"active":""} onClick={()=>setBeds(n)}>{n}+</button>)}</div></label><p>{filtered.length} homes match · {saved.length} saved</p></aside>
    <div className="harbor-results"><div className="harbor-results-top"><span>{city}</span><span>Updated now</span></div><div className="harbor-home-grid">{filtered.length?filtered.map((home,index)=><motion.article key={home.id} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:index*.05}} className={activeId===home.id?"active":""}><button type="button" className="home-image" onClick={()=>setActiveId(home.id)} style={{"--home-tone":home.tone} as CSSProperties}><span className="home-silhouette"><i></i></span><small>{home.area}</small></button><div><button type="button" className="save" onClick={()=>toggleSave(home.id)} aria-label="Save home">{saved.includes(home.id)?"♥":"♡"}</button><span>{home.beds} bd · {home.baths} ba · {home.sqft.toLocaleString()} sqft</span><strong>{home.name}</strong><b>{fmt(home.price)}</b></div></motion.article>):<div className="harbor-empty"><strong>No homes inside that line.</strong><p>Raise the price or lower the bed count to reopen the map.</p></div>}</div></div>
  </section>

  <section className="harbor-selected"><div className="harbor-selected-visual" style={{"--home-tone":active.tone} as CSSProperties}><span className="selected-house"><i></i><i></i><i></i></span><small>{active.area}</small></div><div className="harbor-selected-copy"><span>SELECTED HOME</span><h2>{active.name}</h2><p>{active.beds} beds · {active.baths} baths · {active.sqft.toLocaleString()} sqft</p><strong>{fmt(active.price)}</strong><hr/><p>Morning light across an open plan, private outdoor space and a short line back to the waterfront.</p><button type="button" onClick={()=>{setTourDone(false);setTourOpen(true)}}>Tour this home <ArrowIcon/></button></div></section>

  <AnimatePresence>{tourOpen&&<motion.div className="harbor-tour-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button type="button" className="harbor-tour-scrim" aria-label="Close tour" onClick={()=>setTourOpen(false)}/><motion.aside className="harbor-tour" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{duration:.48,ease:[.2,.75,.18,1]}}><header><div><span>DEMO TOUR</span><h2>{tourDone?"Tour requested.":active.name}</h2></div><button type="button" onClick={()=>setTourOpen(false)}>Close</button></header>{!tourDone?<><div className="tour-card"><span>{active.area}</span><strong>{fmt(active.price)}</strong><small>{active.beds} bd · {active.baths} ba</small></div><fieldset><legend>Choose a window</legend>{["Sat · 11:00","Sat · 2:30","Sun · 10:00"].map(x=><button type="button" key={x}>{x}</button>)}</fieldset><button className="tour-confirm" type="button" onClick={()=>setTourDone(true)}>Request private tour <ArrowIcon/></button><small>Demo mode — no inquiry is sent.</small></>:<div className="tour-success"><span>H°</span><h3>Request received.</h3><p>A real site would route this lead to the agent or CRM immediately.</p><button type="button" onClick={()=>setTourOpen(false)}>Return to property</button></div>}</motion.aside></motion.div>}</AnimatePresence>
  <DemoSalesDock demoName="HARBOR" industry="Real estate" brand={brand} city={city} onBrandChange={setBrand} onCityChange={setCity} accent="#2c6a72"/>
 </main>
}
