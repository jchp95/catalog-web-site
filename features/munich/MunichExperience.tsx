"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "./hooks/useLenis";
import { Preloader } from "./components/layout/Preloader";
import { MunichNav } from "./components/layout/MunichNav";
import { CustomCursor } from "./components/layout/CustomCursor";
import { ScrollProgress } from "./components/layout/ScrollProgress";
import { CartProvider, useCart } from "./components/ui/CartContext";
import { DemoSalesDock } from "@/components/sales/DemoSalesDock";

const RotationHeroSection = dynamic(
  () => import("./sections/RotationHeroSection").then((m) => m.RotationHeroSection),
  { ssr: false },
);
const ExplodedProductSection = dynamic(
  () => import("./sections/ExplodedProductSection").then((m) => m.ExplodedProductSection),
  { ssr: false },
);
const MacroDetailSection = dynamic(
  () => import("./sections/MacroDetailSection").then((m) => m.MacroDetailSection),
  { ssr: false },
);
const HorizontalStorySection = dynamic(
  () => import("./sections/HorizontalStorySection").then((m) => m.HorizontalStorySection),
  { ssr: false },
);
const ColorwaysSection = dynamic(
  () => import("./sections/ColorwaysSection").then((m) => m.ColorwaysSection),
  { ssr: false },
);
const EditorialSection = dynamic(
  () => import("./sections/EditorialSection").then((m) => m.EditorialSection),
  { ssr: false },
);
const VideoSection = dynamic(
  () => import("./sections/VideoSection").then((m) => m.VideoSection),
  { ssr: false },
);
const KineticTypographySection = dynamic(
  () => import("./sections/KineticTypographySection").then((m) => m.KineticTypographySection),
  { ssr: false },
);
const ProductsGridSection = dynamic(
  () => import("./sections/ProductsGridSection").then((m) => m.ProductsGridSection),
  { ssr: false },
);
const ShopSection = dynamic(
  () => import("./sections/ShopSection").then((m) => m.ShopSection),
  { ssr: false },
);
const FooterSection = dynamic(
  () => import("./sections/FooterSection").then((m) => m.FooterSection),
  { ssr: false },
);

function ExperienceInner() {
  const [warmed, setWarmed] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const { count } = useCart();
  const [brand, setBrand] = useState("MUNICH");
  const [city, setCity] = useState("Barcelona");

  const booted = warmed;
  useLenis(revealed);

  const onWarm = useCallback(() => setWarmed(true), []);
  const onReveal = useCallback(() => setRevealed(true), []);
  const onPreloadDone = useCallback(() => setLoaderGone(true), []);

  useEffect(() => {
    if (!revealed) return;
    const id = requestAnimationFrame(() => {
      void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    });
    return () => cancelAnimationFrame(id);
  }, [revealed]);

  useEffect(() => {
    if (!revealed) return;
    const nodes = document.querySelectorAll<HTMLElement>("[data-tone]");
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          const t = visible.target.dataset.tone;
          if (t === "light" || t === "dark") setTone(t);
        }
      },
      { threshold: [0.35, 0.55] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [revealed]);

  return (
    <div className={`munich-root munich-root--${tone}`}>
      <div className="munich-grain" aria-hidden="true" />
      {!loaderGone ? (
        <Preloader onWarm={onWarm} onReveal={onReveal} onDone={onPreloadDone} />
      ) : null}
      <MunichNav sceneTone={tone} cartCount={count} />
      <CustomCursor />
      <ScrollProgress />
      <main
        id="main-content"
        className={`munich-main${revealed ? " is-revealed" : ""}${booted ? " is-mounted" : ""}`}
      >
        {booted ? (
          <>
            <RotationHeroSection />
            <ExplodedProductSection />
            <MacroDetailSection />
            <HorizontalStorySection />
            <ColorwaysSection />
            <EditorialSection />
            <VideoSection />
            <KineticTypographySection />
            <ProductsGridSection />
            <ShopSection />
            <FooterSection />
          </>
        ) : null}
      </main>
      <DemoSalesDock
        demoName="MUNICH"
        industry="Product / footwear"
        brand={brand}
        city={city}
        onBrandChange={setBrand}
        onCityChange={setCity}
        accent="#D6A12B"
      />
    </div>
  );
}

export function MunichExperience() {
  return (
    <CartProvider>
      <ExperienceInner />
    </CartProvider>
  );
}
