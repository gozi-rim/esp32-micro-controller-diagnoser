import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NetDiag.Expert — ESP32 Diagnostic Core & Telemetry Workbench",
  description:
    "ECE 515.2 High-density professional telemetry & forward-chaining diagnostic workbench for localized IoT, ESP32 microcontrollers, and ESP-NOW network hardware failures.",
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
      className={`h-full antialiased ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0c10] text-[#f0f6fc] font-sans selection:bg-[#00f2fe]/20 selection:text-[#00f2fe]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

