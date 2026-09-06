import type { Metadata } from "next";
import { MireyaExperience } from "@/features/mireya/MireyaExperience";
import "./mireya.css";

export const metadata: Metadata = { title: "MIREYA — Beauty salon demo", robots: { index: false, follow: false } };
export default function Page() { return <MireyaExperience />; }
