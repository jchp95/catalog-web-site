import type { Metadata } from "next";
import { MunichExperience } from "@/features/munich/MunichExperience";
import "./munich.css";

export const metadata: Metadata = {
  title: "MUNICH Barru 8290 — Diseñada para moverse",
  description:
    "Experiencia conceptual de producto para la MUNICH Barru 8290: ante mostaza, detalles azul, suela de goma.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "MUNICH Barru 8290 — Diseñada para moverse",
    description: "Ante mostaza, X de piel azul y suela de goma. Scroll para girar.",
    type: "website",
  },
};

export default function Page() {
  return <MunichExperience />;
}
