import type { Metadata } from "next";
import { MunichProductPage } from "@/features/munich/MunichProductPage";
import "../munich.css";

export const metadata: Metadata = {
  title: "BARRU 8290 — Product",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MunichProductPage />;
}
