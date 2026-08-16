"use client";

import React, { useState } from "react";
import {
  Layers,
  Cpu,
  Zap,
  Radio,
  Wifi,
  ShieldCheck,
  Activity,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Info
} from "lucide-react";
import { ESP32Diagram } from "./ESP32Diagram";

export function SystemSpecsView() {
  const [selectedSubsystem, setSelectedSubsystem] = useState<
    "brownout" | "espnow" | "wifi" | "gpio" | "antenna"
  >("brownout");

  const specsList = [
    {
      domain: "Microcontroller Core",
      specs: [
        { label: "Processor", value: "Xtensa 32-bit LX6 Dual-Core @ 240 MHz" },
        { label: "Compute Power", value: "Up to 600 DMIPS" },
        { label: "Internal SRAM", value: "520 KB on-chip SRAM" },
        { label: "Flash Memory", value: "4 MB SPI Flash (Quad SPI @ 80MHz)" },
        { label: "Operating Voltage", value: "2.7V to 3.6V (Nominal 3.3V)" }
      ]
    },
    {
      domain: "Wireless & RF Subsystem",
      specs: [
        { label: "Wi-Fi Standard", value: "802.11 b/g/n (802.11n up to 150 Mbps)" },
        { label: "Frequency Range", value: "2.4 GHz to 2.5 GHz ISM Band" },
        { label: "ESP-NOW Frame", value: "802.11 Action Frame (Vendor-Specific)" },
        { label: "Max Peers", value: "20 paired nodes (6 encrypted maximum)" },
        { label: "Peak TX Current", value: "350mA to 500mA in short bursts" }
      ]
    },
    {
      domain: "GPIO & Peripherals",
      specs: [
        { label: "Total GPIOs", value: "36 physical pins (Input-only: 34-39)" },
        { label: "Logic Voltage", value: "3.3V LVCMOS (Absolute Max 3.6V)" },
        { label: "Max Pin Sinking", value: "12mA recommended (40mA absolute max)" },
        { label: "ADC Resolution", value: "12-bit SAR ADC (ADC1 independent, ADC2 Wi-Fi shared)" },
        { label: "Strapping Pins", value: "GPIO 0, 2, 12, 15 (Must not pull high/low on boot)" }
      ]
    }
  ];

  const inferenceArchitecture = [
    {
      title: "1. Rule Knowledge Base (KB)",
      desc: "Structured production rules formatted as IF [Symptom Conditions] THEN [Fault Diagnosis + Remediation Action] across 5 failure domains."
    },
    {
      title: "2. Working Memory / Fact Base",
      desc: "Dynamically records observed symptoms, technician multimeter readings, logic analyzer states, and custom technician inputs."
    },
    {
      title: "3. Forward-Chaining Inference Engine",
      desc: "Data-driven root-to-leaf traversal. Evaluates current facts against antecedent conditions to execute deterministic transitions."
    },
    {
      title: "4. Heuristic Fallback & AI Synthesis",
      desc: "When facts fail to match hardcoded deterministic production rules, symptoms route to deep LLM domain synthesis."
    }
  ];

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00f2fe]" />
            ESP32 System Architecture &amp; Engineering Specs
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Microcontroller hardware pinouts, power rail parameters, and forward-chaining AI inference specifications.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span className="px-3 py-1 rounded-full bg-[#161b22] border border-white/[0.08] text-[#10b981] font-semibold">
            Target: ESP32-WROOM-32 / ECE 515.2
          </span>
        </div>
      </div>

      {/* Interactive Subsystem Inspector & Diagram */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Diagram */}
        <div className="w-full lg:col-span-6 space-y-4">
          <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00f2fe] uppercase">
                Interactive Schematic Subsystem Focus
              </span>
              <span className="text-[10px] font-mono text-slate-400">Click tab to isolate</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "brownout", label: "Power Rail / LDO", icon: Zap },
                { key: "espnow", label: "ESP-NOW / IC", icon: Radio },
                { key: "wifi", label: "Wi-Fi / Watchdog", icon: Wifi },
                { key: "gpio", label: "GPIO Pins", icon: Cpu },
                { key: "antenna", label: "RF Antenna", icon: Activity }
              ].map((sub) => {
                const Icon = sub.icon;
                const isActive = selectedSubsystem === sub.key;
                return (
                  <button
                    key={sub.key}
                    onClick={() => setSelectedSubsystem(sub.key as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/40 font-bold"
                        : "bg-[#0d1117] text-slate-400 border border-white/[0.06] hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {sub.label}
                  </button>
                );
              })}
            </div>

            <ESP32Diagram category={selectedSubsystem} activeSubsystemTitle={`ACTIVE: ${selectedSubsystem.toUpperCase()}`} />
          </div>
        </div>

        {/* Right Column: Hardware Specifications Tables */}
        <div className="w-full lg:col-span-6 space-y-4">
          {specsList.map((domain, idx) => (
            <div
              key={idx}
              className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3"
            >
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#00f2fe]" />
                {domain.domain}
              </h3>
              <div className="space-y-1.5">
                {domain.specs.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-xl bg-[#0d1117] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="text-slate-200 font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inference Engine Architecture Specs */}
      <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div>
          <span className="text-xs font-mono font-bold text-[#10b981] uppercase tracking-wider block mb-1">
            Artificial Intelligence Architecture
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans">
            Forward-Chaining Rule-Based Expert System (ECE 515.2)
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            The inference mechanism traverses an acyclic directed graph of hardware propositions to guarantee exact root cause determinism.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inferenceArchitecture.map((arch, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1.5"
            >
              <h4 className="text-xs font-mono font-bold text-[#00f2fe] uppercase">
                {arch.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {arch.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
