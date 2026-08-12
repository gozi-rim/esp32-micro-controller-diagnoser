import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NetDiag Expert - ESP32 & ESP-NOW Diagnostic System",
  description: "ECE 515.2 Rule-based Expert System for localized IoT and ESP32 network hardware failures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-white">{children}</body>
    </html>
  );
}
