import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/components/sales/sales.css";

export const metadata: Metadata = {
  title: {
    default: "LOCAL/ — Digital experiences for local businesses",
    template: "%s · LOCAL/",
  },
  description:
    "An interactive sales showroom of high-end website concepts for local businesses.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f7fb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
