import type { Metadata } from "next";
import { PulsoExperience } from "@/features/pulso/PulsoExperience";
import "./pulso.css";

export const metadata: Metadata = {
  title: "PULSO — Product scroll 360 demo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PulsoExperience />;
}
