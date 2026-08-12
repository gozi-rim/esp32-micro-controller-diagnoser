"use client";

import React from "react";

interface ESP32DiagramProps {
  category: "root" | "brownout" | "espnow" | "wifi" | "gpio" | "antenna" | "custom";
  activeSubsystemTitle?: string;
}

export function ESP32Diagram({
  category,
  activeSubsystemTitle
}: ESP32DiagramProps) {
  // Highlight state helpers
  const isBrownout = category === "brownout";
  const isEspNow = category === "espnow";
  const isWifi = category === "wifi";
  const isGpio = category === "gpio";
  const isAntenna = category === "antenna";

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />

      {/* Title & Subsystem Badge Header */}
      <div className="w-full flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800 text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping shrink-0" />
          ESP32-WROOM-32 SCHEMATIC
        </span>
        <span
          className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] shrink-0 ${
            isBrownout
              ? "bg-rose-950 text-rose-400 border border-rose-800"
              : isEspNow
              ? "bg-cyan-950 text-[#06B6D4] border border-cyan-800"
              : isWifi
              ? "bg-emerald-950 text-emerald-green border border-emerald-800"
              : isGpio
              ? "bg-amber-950 text-amber-400 border border-amber-800"
              : isAntenna
              ? "bg-purple-950 text-purple-400 border border-purple-800"
              : "bg-slate-800 text-slate-300 border border-slate-700"
          }`}
        >
          {activeSubsystemTitle || "ALL SUBSYSTEMS IDLE"}
        </span>
      </div>

      {/* SVG ESP32 Microcontroller Board Diagram - Fluid max-h-96 scaling */}
      <div className="w-full h-auto max-h-96 relative my-2 flex justify-center items-center">
        <svg
          viewBox="0 0 300 450"
          className="w-full h-auto max-h-96 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          <defs>
            {/* Glow Filters */}
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ESP32 PCB Board Base */}
          <rect
            x="40"
            y="20"
            width="220"
            height="410"
            rx="12"
            fill="#0F172A"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* Corner Mounting Holes */}
          <circle cx="55" cy="35" r="5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="245" cy="35" r="5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="55" cy="415" r="5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          <circle cx="245" cy="415" r="5" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />

          {/* 1. ANTENNA REGION (PCB MIFA & u.FL Connector) */}
          <g filter={isAntenna ? "url(#glow-purple)" : undefined}>
            {/* PCB Trace Antenna Gold Meander */}
            <path
              d="M 100 30 H 200 V 50 H 110 V 65 H 190 V 80 H 120 V 90 H 180"
              fill="none"
              stroke={isAntenna ? "#A855F7" : "#E2E8F0"}
              strokeWidth={isAntenna ? "4" : "2.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isAntenna ? "animate-pulse" : undefined}
            />
            {/* u.FL IPEX Connector */}
            <circle
              cx="75"
              cy="70"
              r="7"
              fill="#1E293B"
              stroke={isAntenna ? "#C084FC" : "#64748B"}
              strokeWidth="2"
            />
            <circle cx="75" cy="70" r="3" fill={isAntenna ? "#A855F7" : "#475569"} />
            <text x="70" y="92" fill="#94A3B8" fontSize="8" fontFamily="monospace">
              u.FL
            </text>
          </g>

          {/* Metal RF Shield Caning / Boundary */}
          <rect
            x="70"
            y="105"
            width="160"
            height="140"
            rx="6"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="2"
          />
          <text x="110" y="122" fill="#64748B" fontSize="9" fontFamily="monospace" fontWeight="bold">
            ESP32-WROOM-32
          </text>

          {/* 2. ESP32 D0WD-Q6 System Chip (IC) */}
          <g filter={isEspNow || isWifi ? "url(#glow-cyan)" : undefined}>
            <rect
              x="100"
              y="135"
              width="100"
              height="90"
              rx="4"
              fill="#090D16"
              stroke={isEspNow ? "#06B6D4" : isWifi ? "#10B981" : "#475569"}
              strokeWidth={isEspNow || isWifi ? "3" : "1.5"}
              className={isEspNow || isWifi ? "animate-pulse" : undefined}
            />
            {/* Silicon IC Labels */}
            <text x="112" y="165" fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="bold">
              ESP32-D0WD
            </text>
            <text x="120" y="182" fill="#06B6D4" fontSize="9" fontFamily="monospace">
              2.4GHz Wi-Fi/BT
            </text>
            <text x="125" y="196" fill="#64748B" fontSize="8" fontFamily="monospace">
              Dual Tensilica
            </text>
          </g>

          {/* 3. AMS1117 3.3V POWER REGULATOR */}
          <g filter={isBrownout ? "url(#glow-rose)" : undefined}>
            <rect
              x="60"
              y="265"
              width="50"
              height="35"
              rx="3"
              fill="#090D16"
              stroke={isBrownout ? "#F43F5E" : "#475569"}
              strokeWidth={isBrownout ? "3" : "1.5"}
              className={isBrownout ? "animate-pulse" : undefined}
            />
            <rect x="72" y="258" width="26" height="7" fill="#64748B" />
            <text x="63" y="286" fill={isBrownout ? "#FB7185" : "#94A3B8"} fontSize="8" fontFamily="monospace" fontWeight="bold">
              AMS1117
            </text>
            <text x="68" y="295" fill="#64748B" fontSize="7" fontFamily="monospace">
              3.3V LDO
            </text>
          </g>

          {/* Decoupling Capacitors near regulator */}
          <rect x="120" y="270" width="12" height="20" rx="2" fill="#94A3B8" stroke="#334155" />
          <rect x="138" y="270" width="10" height="20" rx="2" fill="#94A3B8" stroke="#334155" />

          {/* Micro-USB Port at bottom */}
          <rect x="110" y="415" width="80" height="20" rx="3" fill="#334155" stroke="#64748B" strokeWidth="2" />
          <text x="128" y="429" fill="#94A3B8" fontSize="8" fontFamily="monospace">
            USB-UART
          </text>

          {/* 4. GPIO HEADER PINS (Left & Right Rails) */}
          <g filter={isGpio ? "url(#glow-amber)" : undefined}>
            {/* Left Header Pins */}
            {[...Array(12)].map((_, i) => (
              <g key={`lpin-${i}`}>
                <rect
                  x="44"
                  y={130 + i * 22}
                  width="18"
                  height="12"
                  rx="1"
                  fill={isGpio ? "#F59E0B" : "#1E293B"}
                  stroke={isGpio ? "#FBBF24" : "#475569"}
                  strokeWidth="1"
                />
                <circle cx="53" cy={136 + i * 22} r="2.5" fill="#CBD5E1" />
              </g>
            ))}

            {/* Right Header Pins */}
            {[...Array(12)].map((_, i) => (
              <g key={`rpin-${i}`}>
                <rect
                  x="238"
                  y={130 + i * 22}
                  width="18"
                  height="12"
                  rx="1"
                  fill={isGpio ? "#F59E0B" : "#1E293B"}
                  stroke={isGpio ? "#FBBF24" : "#475569"}
                  strokeWidth="1"
                />
                <circle cx="247" cy={136 + i * 22} r="2.5" fill="#CBD5E1" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Subsystem Inspection Status Text */}
      <div className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono leading-relaxed text-slate-300">
        {isBrownout && (
          <p className="text-rose-400">
            <span className="font-bold">⚠️ Power Rail Active:</span> AMS1117 LDO voltage drop / RF inrush current spike detected.
          </p>
        )}
        {isEspNow && (
          <p className="text-[#06B6D4]">
            <span className="font-bold">📡 RF Synthesizer Active:</span> ESP-NOW Action Frame MAC layer transceiver query.
          </p>
        )}
        {isWifi && (
          <p className="text-emerald-green">
            <span className="font-bold">🌐 Wi-Fi Stack Active:</span> 802.11 b/g/n MAC/PHY state &amp; FreeRTOS WDT watchdog scan.
          </p>
        )}
        {isGpio && (
          <p className="text-amber-400">
            <span className="font-bold">⚡ GPIO Buffer Active:</span> 3.3V LVCMOS signal bus &amp; logic level inspection.
          </p>
        )}
        {isAntenna && (
          <p className="text-purple-400">
            <span className="font-bold">📻 RF Path Active:</span> 2.4GHz PCB MIFA &amp; u.FL IPEX connector path inspection.
          </p>
        )}
        {!isBrownout && !isEspNow && !isWifi && !isGpio && !isAntenna && (
          <p className="text-slate-400">
            Select a symptom or category to inspect hardware subsystem components.
          </p>
        )}
      </div>
    </div>
  );
}
