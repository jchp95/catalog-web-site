import type { Metadata } from "next";
import { BrightlineExperience } from "@/features/brightline/BrightlineExperience";
import "./brightline.css";
export const metadata:Metadata={title:"BRIGHTLINE — Home services concept"};
export default function Page(){return <BrightlineExperience/>}
