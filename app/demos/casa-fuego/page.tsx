import type { Metadata } from "next";
import { CasaFuegoExperience } from "@/features/casa-fuego/CasaFuegoExperience";
import "./casa-fuego.css";
export const metadata: Metadata={title:"CASA FUEGO — Restaurant concept"};
export default function Page(){return <CasaFuegoExperience/>}
