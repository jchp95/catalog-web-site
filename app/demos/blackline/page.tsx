import type { Metadata } from "next";
import { BlacklineExperience } from "@/features/blackline/BlacklineExperience";
import "./blackline.css";

export const metadata: Metadata = { title: "BLACKLINE — Barbershop concept" };
export default function Page(){ return <BlacklineExperience/>; }
