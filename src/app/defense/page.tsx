"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Maximize2,
  Printer,
  ExternalLink,
  Presentation,
  Shield,
  GraduationCap,
  Users
} from "lucide-react";

export default function DefensePage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const iframe = document.getElementById("defense-iframe") as HTMLIFrameElement;
    if (!iframe) return;

    if (!document.fullscreenElement) {
      iframe.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen h-screen w-full flex flex-col bg-[#07090e] text-[#f0f6fc] overflow-hidden">
      {/* Top Header Navigation */}
      <header className="h-14 bg-[#0f141d]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-mono transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Console
          </Link>

          <div className="h-4 w-px bg-white/[0.1] hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20">
              <Presentation className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-2">
                ECE 515.2 Project Defense Deck
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 font-mono hidden md:inline">
                  Group 11 · 8 Slides
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const iframe = document.getElementById("defense-iframe") as HTMLIFrameElement;
              if (iframe?.contentWindow) {
                iframe.contentWindow.print();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-mono transition-all cursor-pointer"
            title="Print or Export Slide Handouts to PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <a
            href="/defense.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-mono transition-all cursor-pointer"
            title="Open in new standalone tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="hidden sm:inline">Open Standalone</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen Deck (F)</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Slide Deck Embed */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        <iframe
          id="defense-iframe"
          src="/defense.html"
          title="NetDiag Expert Project Defense Presentation"
          className="w-full h-full border-0"
          allow="fullscreen; serial"
        />
      </main>
    </div>
  );
}
