import type { Metadata } from "next";
import { HarborExperience } from "@/features/harbor/HarborExperience";
import "./harbor.css";
export const metadata:Metadata={title:"HARBOR — Real estate concept"};
export default function Page(){return <HarborExperience/>}
