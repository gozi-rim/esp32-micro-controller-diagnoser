"use client";

import React, { useState } from "react";
import { ESP32_PINOUT, ESP32PinSpec } from "../data/esp32PinoutData";
import {
  ShieldAlert,
  Zap,
  Cpu,
  Info,
  CheckCircle2,
  X,
  Radio,
  Sliders,
  Terminal,
  Activity
} from "lucide-react";

export type ESP32SubsystemCategory =
  | "root"
  | "brownout"
  | "espnow"
  | "wifi"
  | "gpio"
  | "antenna"
  | "i2c"
  | "spi"
  | "adc"
  | "strap"
  | "custom";

interface ESP32DiagramProps {
  category: ESP32SubsystemCategory;
  activeSubsystemTitle?: string;
}

export function ESP32Diagram({
  category,
  activeSubsystemTitle
}: ESP32DiagramProps) {
  const [selectedPin, setSelectedPin] = useState<ESP32PinSpec | null>(null);
  const [hoveredPin, setHoveredPin] = useState<ESP32PinSpec | null>(null);

  // Highlight state helpers
  const isBrownout = category === "brownout";
  const isEspNow = category === "espnow";
  const isWifi = category === "wifi";
  const isGpio = category === "gpio";
  const isAntenna = category === "antenna";
  const isI2C = category === "i2c";
  const isSPI = category === "spi";
  const isADC = category === "adc";
  const isStrap = category === "strap";

  const leftPins = ESP32_PINOUT.filter((p) => p.side === "left");
  const rightPins = ESP32_PINOUT.filter((p) => p.side === "right");

  const getPinColor = (pin: ESP32PinSpec) => {
    if (selectedPin?.pinIndex === pin.pinIndex) return "#00f2fe";
    if (pin.type === "POWER") return "#ef4444";
    if (pin.type === "GND") return "#64748b";
    if (pin.type === "STRAP") return "#f59e0b";
    if (pin.type === "ADC1") return "#10b981";
    if (pin.type === "ADC2") return "#f59e0b";
    if (pin.type === "FLASH_INTERNAL") return "#dc2626";
    return "#3b82f6";
  };

  return (
    <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-4 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden shrink-0">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Title & Subsystem Badge Header */}
      <div className="w-full flex items-center justify-between gap-2 pb-2.5 mb-2 border-b border-white/[0.08] text-xs font-mono">
        <span className="text-slate-300 flex items-center gap-1.5 truncate font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse shrink-0" />
          ESP32-WROOM-32 SCHEMATIC &amp; PINOUT
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] shrink-0 ${
            isBrownout
              ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30"
              : isEspNow
              ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30"
              : isWifi
              ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
              : isGpio
              ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30"
              : isAntenna
              ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
              : "bg-white/[0.06] text-slate-400 border border-white/[0.08]"
          }`}
        >
          {activeSubsystemTitle || "ALL SUBSYSTEMS IDLE"}
        </span>
      </div>

      {/* Interactive Board Diagram */}
      <div className="w-full h-auto max-h-80 relative my-2 flex justify-center items-center">
        <svg
          viewBox="0 0 340 450"
          className="w-full h-auto max-h-80 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
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
            x="60"
            y="20"
            width="220"
            height="410"
            rx="12"
            fill="#0d1117"
            stroke="#21262d"
            strokeWidth="3"
          />

          {/* Corner Mounting Holes */}
          <circle cx="75" cy="35" r="5" fill="#161b22" stroke="#30363d" strokeWidth="1.5" />
          <circle cx="265" cy="35" r="5" fill="#161b22" stroke="#30363d" strokeWidth="1.5" />
          <circle cx="75" cy="415" r="5" fill="#161b22" stroke="#30363d" strokeWidth="1.5" />
          <circle cx="265" cy="415" r="5" fill="#161b22" stroke="#30363d" strokeWidth="1.5" />

          {/* 1. ANTENNA REGION (PCB MIFA & u.FL Connector) */}
          <g filter={isAntenna ? "url(#glow-purple)" : undefined}>
            <path
              d="M 120 30 H 220 V 50 H 130 V 65 H 210 V 80 H 140 V 90 H 200"
              fill="none"
              stroke={isAntenna ? "#A855F7" : "#CBD5E1"}
              strokeWidth={isAntenna ? "4" : "2.5"}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isAntenna ? "animate-pulse" : undefined}
            />
            <circle
              cx="95"
              cy="70"
              r="7"
              fill="#161b22"
              stroke={isAntenna ? "#C084FC" : "#64748B"}
              strokeWidth="2"
            />
            <circle cx="95" cy="70" r="3" fill={isAntenna ? "#A855F7" : "#475569"} />
            <text x="90" y="92" fill="#94A3B8" fontSize="8" fontFamily="monospace">
              u.FL
            </text>
          </g>

          {/* Metal RF Shield Caning / Boundary */}
          <rect
            x="90"
            y="105"
            width="160"
            height="140"
            rx="6"
            fill="#161b22"
            stroke="#30363d"
            strokeWidth="2"
          />
          <text x="130" y="122" fill="#64748B" fontSize="9" fontFamily="monospace" fontWeight="bold">
            ESP32-WROOM-32
          </text>

          {/* 2. ESP32 D0WD-Q6 System Chip (IC) */}
          <g filter={isEspNow || isWifi ? "url(#glow-cyan)" : undefined}>
            <rect
              x="120"
              y="135"
              width="100"
              height="90"
              rx="4"
              fill="#0a0c10"
              stroke={isEspNow ? "#00f2fe" : isWifi ? "#10b981" : "#30363d"}
              strokeWidth={isEspNow || isWifi ? "3" : "1.5"}
              className={isEspNow || isWifi ? "animate-pulse" : undefined}
            />
            <text x="132" y="165" fill="#F8FAFC" fontSize="11" fontFamily="monospace" fontWeight="bold">
              ESP32-D0WD
            </text>
            <text x="140" y="182" fill="#00f2fe" fontSize="9" fontFamily="monospace">
              2.4GHz Wi-Fi/BT
            </text>
            <text x="145" y="196" fill="#64748B" fontSize="8" fontFamily="monospace">
              Dual Tensilica
            </text>
          </g>

          {/* 3. AMS1117 3.3V POWER REGULATOR */}
          <g filter={isBrownout ? "url(#glow-rose)" : undefined}>
            <rect
              x="80"
              y="265"
              width="50"
              height="35"
              rx="3"
              fill="#0a0c10"
              stroke={isBrownout ? "#ef4444" : "#30363d"}
              strokeWidth={isBrownout ? "3" : "1.5"}
              className={isBrownout ? "animate-pulse" : undefined}
            />
            <rect x="92" y="258" width="26" height="7" fill="#475569" />
            <text x="83" y="286" fill={isBrownout ? "#ef4444" : "#94A3B8"} fontSize="8" fontFamily="monospace" fontWeight="bold">
              AMS1117
            </text>
            <text x="88" y="295" fill="#64748B" fontSize="7" fontFamily="monospace">
              3.3V LDO
            </text>
          </g>

          {/* Decoupling Capacitors */}
          <rect x="140" y="270" width="12" height="20" rx="2" fill="#94A3B8" stroke="#30363d" />
          <rect x="158" y="270" width="10" height="20" rx="2" fill="#94A3B8" stroke="#30363d" />

          {/* Micro-USB Port */}
          <rect x="130" y="415" width="80" height="20" rx="3" fill="#21262d" stroke="#475569" strokeWidth="2" />
          <text x="148" y="429" fill="#94A3B8" fontSize="8" fontFamily="monospace">
            USB-UART
          </text>

          {/* 4. INTERACTIVE LEFT HEADER PINS (19 Pins) */}
          <g>
            {leftPins.map((pin, i) => {
              const y = 110 + i * 16;
              const isSelected = selectedPin?.pinIndex === pin.pinIndex;
              const pinColor = getPinColor(pin);

              return (
                <g
                  key={`left-pin-${pin.pinIndex}`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedPin(pin)}
                  onMouseEnter={() => setHoveredPin(pin)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  <rect
                    x="48"
                    y={y}
                    width="24"
                    height="11"
                    rx="2"
                    fill={isSelected ? "#00f2fe" : "#161b22"}
                    stroke={isSelected ? "#00f2fe" : pinColor}
                    strokeWidth={isSelected ? "2" : "1"}
                    className="transition-all"
                  />
                  <circle cx="60" cy={y + 5.5} r="2.5" fill={pinColor} />
                  {/* Pin label text on left side */}
                  <text
                    x="42"
                    y={y + 8}
                    textAnchor="end"
                    fill={isSelected ? "#00f2fe" : "#94a3b8"}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {pin.label.length > 8 ? pin.label.slice(0, 8) : pin.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* 5. INTERACTIVE RIGHT HEADER PINS (19 Pins) */}
          <g>
            {rightPins.map((pin, i) => {
              const y = 110 + i * 16;
              const isSelected = selectedPin?.pinIndex === pin.pinIndex;
              const pinColor = getPinColor(pin);

              return (
                <g
                  key={`right-pin-${pin.pinIndex}`}
                  className="cursor-pointer group"
                  onClick={() => setSelectedPin(pin)}
                  onMouseEnter={() => setHoveredPin(pin)}
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  <rect
                    x="268"
                    y={y}
                    width="24"
                    height="11"
                    rx="2"
                    fill={isSelected ? "#00f2fe" : "#161b22"}
                    stroke={isSelected ? "#00f2fe" : pinColor}
                    strokeWidth={isSelected ? "2" : "1"}
                    className="transition-all"
                  />
                  <circle cx="280" cy={y + 5.5} r="2.5" fill={pinColor} />
                  {/* Pin label text on right side */}
                  <text
                    x="298"
                    y={y + 8}
                    textAnchor="start"
                    fill={isSelected ? "#00f2fe" : "#94a3b8"}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight={isSelected ? "bold" : "normal"}
                  >
                    {pin.label.length > 8 ? pin.label.slice(0, 8) : pin.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Pin Hover/Quick Hint Bar */}
      <div className="w-full text-center pb-1">
        <span className="text-[10px] font-mono text-slate-500">
          💡 Click any header pin on the board to open the Pinout Telemetry Inspector.
        </span>
      </div>

      {/* Subsystem Inspection Status Text */}
      <div className="w-full p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] text-[11px] font-mono leading-relaxed text-slate-300">
        {isBrownout && (
          <p className="text-[#ef4444]">
            <span className="font-bold">⚠️ Power Rail Active:</span> AMS1117 LDO voltage drop / RF inrush current spike detected.
          </p>
        )}
        {isEspNow && (
          <p className="text-[#00f2fe]">
            <span className="font-bold">📡 RF Synthesizer Active:</span> ESP-NOW Action Frame MAC layer transceiver query.
          </p>
        )}
        {isWifi && (
          <p className="text-[#10b981]">
            <span className="font-bold">🌐 Wi-Fi Stack Active:</span> 802.11 b/g/n MAC/PHY state &amp; FreeRTOS WDT watchdog scan.
          </p>
        )}
        {isGpio && (
          <p className="text-[#f59e0b]">
            <span className="font-bold">⚡ GPIO Buffer Active:</span> 3.3V LVCMOS signal bus &amp; logic level inspection.
          </p>
        )}
        {isAntenna && (
          <p className="text-purple-400">
            <span className="font-bold">📻 RF Path Active:</span> 2.4GHz PCB MIFA &amp; u.FL IPEX connector path inspection.
          </p>
        )}
        {isI2C && (
          <p className="text-[#00f2fe]">
            <span className="font-bold">🔌 I2C Open-Drain Bus:</span> SDA (GPIO 21) &amp; SCL (GPIO 22) pull-up resistance check.
          </p>
        )}
        {isSPI && (
          <p className="text-[#10b981]">
            <span className="font-bold">⚡ SPI Bus Active:</span> MOSI/MISO/SCLK lines &amp; Chip Select (CS) multiplexing inspection.
          </p>
        )}
        {isADC && (
          <p className="text-[#f59e0b]">
            <span className="font-bold">🎯 ADC Channel Conflict:</span> ADC2 vs Wi-Fi Radio SAR controller mutual exclusion.
          </p>
        )}
        {isStrap && (
          <p className="text-[#ef4444]">
            <span className="font-bold">⚠️ Strapping Pins Active:</span> Boot mode sampling (GPIO 0, 2, 12, 15) logic level check.
          </p>
        )}
        {!isBrownout && !isEspNow && !isWifi && !isGpio && !isAntenna && !isI2C && !isSPI && !isADC && !isStrap && (
          <p className="text-slate-400">
            Select a symptom or click any pin to inspect electrical specifications.
          </p>
        )}
      </div>

      {/* Floating Pinout Telemetry Inspector Modal */}
      {selectedPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#161b22] border border-white/[0.12] rounded-2xl shadow-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00f2fe] animate-pulse" />
                <span className="text-xs font-mono text-[#00f2fe] font-bold">
                  PIN TELEMETRY HUD — PIN #{selectedPin.pinIndex}
                </span>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pin Title & Type Banner */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-white font-mono">
                {selectedPin.label}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                  selectedPin.type === "STRAP"
                    ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30"
                    : selectedPin.type === "ADC2"
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                    : selectedPin.type === "POWER"
                    ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    : selectedPin.type === "ADC1"
                    ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
                    : "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30"
                }`}
              >
                {selectedPin.type} PIN
              </span>
            </div>

            {/* Voltage & Current Limits */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block uppercase">Voltage Rating</span>
                <span className="text-slate-200 font-semibold">{selectedPin.voltageRating}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block uppercase">Max Current Sink</span>
                <span className="text-slate-200 font-semibold">{selectedPin.maxCurrent}</span>
              </div>
            </div>

            {/* Multiplexed Functions List */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                Multiplexed Hardware Functions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedPin.functions.map((fn, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#0d1117] border border-white/[0.08] text-xs font-mono text-slate-200"
                  >
                    {fn}
                  </span>
                ))}
              </div>
            </div>

            {/* Engineering Warnings & Strapping Notes */}
            {selectedPin.warning && (
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-mono space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-rose-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Engineering Warning:
                </span>
                <p className="leading-relaxed">{selectedPin.warning}</p>
              </div>
            )}

            {selectedPin.strappingFunction && (
              <div className="p-3.5 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-amber-300 text-xs font-mono space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-[#f59e0b]">
                  <Zap className="w-3.5 h-3.5" />
                  Bootloader Strapping Sampling Function:
                </span>
                <p className="leading-relaxed">{selectedPin.strappingFunction}</p>
              </div>
            )}

            {selectedPin.pullResistor && (
              <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] text-xs font-mono text-slate-300">
                <span className="text-[10px] text-slate-500 block uppercase">Pull-Up / Pull-Down Requirement</span>
                <span>{selectedPin.pullResistor}</span>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPin(null)}
                className="px-5 py-2 rounded-xl bg-[#00f2fe] text-slate-950 font-bold font-mono text-xs hover:bg-[#00f2fe]/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
