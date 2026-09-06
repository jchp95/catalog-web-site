import type { Metadata } from "next";
import { ApexExperience } from "@/features/apex/ApexExperience";
import "./apex.css";

export const metadata: Metadata = { title: "APEX — Auto detailing demo", robots: { index: false, follow: false } };
export default function Page(){ return <ApexExperience/>; }
