"use client";

import React from "react";
import {
  Zap,
  Share2,
  Wifi,
  Cpu,
  Radio,
  Play,
  History,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Activity,
  Layers,
  Gauge,
  ShieldAlert
} from "lucide-react";
import { LogEntry } from "./HardwareLogsView";

interface DashboardViewProps {
  onStartDiagnostic: (categoryKey?: string) => void;
  onViewLogs: () => void;
  recentLogs?: LogEntry[];
}

export function DashboardView({
  onStartDiagnostic,
  onViewLogs,
  recentLogs = []
}: DashboardViewProps) {
  const faultTrees = [
    {
      key: "brownout",
      name: "Power & Brownouts",
      icon: Zap,
      accent: "text-rose-400 border-rose-500/30 bg-rose-500/10",
      description: "Diagnose 350–500mA RF inrush spikes, AMS1117 LDO dropout & decoupling caps."
    },
    {
      key: "espnow",
      name: "ESP-NOW MAC & Peers",
      icon: Share2,
      accent: "text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/10",
      description: "Troubleshoot 2.4GHz Wi-Fi channel sync, STA vs AP MAC mismatches & 20-peer tables."
    },
    {
      key: "wifi",
      name: "Wi-Fi & FreeRTOS WDT",
      icon: Wifi,
      accent: "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10",
      description: "Resolve FreeRTOS Task Watchdog blocking loops, 5GHz band steering & DHCP timeouts."
    },
    {
      key: "gpio",
      name: "GPIO 5V Overvoltage",
      icon: Cpu,
      accent: "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10",
      description: "Identify 3.3V LVCMOS gate breakdown, level shifter requirements & relay back-EMF."
    },
    {
      key: "antenna",
      name: "Antenna & RF Noise",
      icon: Radio,
      accent: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      description: "Diagnose u.FL 0402 selector jumper alignment, metal Faraday shields & ISM noise."
    },
    {
      key: "i2c",
      name: "I2C Bus & Display",
      icon: Layers,
      accent: "text-[#00f2fe] border-[#00f2fe]/30 bg-[#00f2fe]/10",
      description: "Solve open-drain SDA/SCL lockups, missing 4.7kΩ pull-ups & 7-bit NACK address errors."
    },
    {
      key: "spi",
      name: "SPI Bus & SD Mount",
      icon: Activity,
      accent: "text-[#10b981] border-[#10b981]/30 bg-[#10b981]/10",
      description: "Fix >20MHz clock slew degradation on breadboards & floating Chip Select (CS) lines."
    },
    {
      key: "adc",
      name: "ADC2 & Wi-Fi Radio",
      icon: Gauge,
      accent: "text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10",
      description: "Isolate ADC2 SAR controller lockout when Wi-Fi is active; migrate to ADC1 pins."
    },
    {
      key: "strap",
      name: "Bootloader Strapping",
      icon: ShieldAlert,
      accent: "text-[#ef4444] border-[#ef4444]/30 bg-[#ef4444]/10",
      description: "Resolve GPIO 0, 2, 12, 15 external bootloader download traps & 1.8V flash mismatches."
    }
  ];

  const displayRecent = recentLogs.slice(0, 5);

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Hero Workbench Banner */}
      <div className="w-full relative overflow-hidden rounded-2xl bg-[#161b22] border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            ECE 515.2 Rule-Based Hardware Expert System
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
            ESP32 Microcontroller &amp; IoT <br />
            <span className="text-[#00f2fe] font-mono">Hardware Diagnostic Workbench</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
            Instantly troubleshoot power rail brownout loops, ESP-NOW peer pairing drops, FreeRTOS task watchdog hangs, 5V GPIO destruction, and ADC2 radio conflicts using deterministic forward-chaining rule trees.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onStartDiagnostic()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00f2fe] hover:bg-[#00d8e4] text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Launch Active Diagnostic Scan
            </button>

            <button
              onClick={onViewLogs}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0d1117] hover:bg-[#21262d] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.14] transition-all text-xs sm:text-sm font-mono cursor-pointer shadow-sm"
            >
              <History className="w-4 h-4 text-slate-400" />
              View Telemetry Logs ({recentLogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* System Metrics Strip */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#161b22] border border-white/[0.08] space-y-1 shadow-sm">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Knowledge Trees</p>
          <p className="text-lg font-bold font-mono text-white">9 Failure Domains</p>
          <p className="text-[10px] text-slate-500 font-sans">Power, ESP-NOW, Wi-Fi, GPIO, RF, I2C, SPI, ADC, Boot</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161b22] border border-white/[0.08] space-y-1 shadow-sm">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Inference Engine</p>
          <p className="text-lg font-bold font-mono text-[#00f2fe]">Forward-Chaining</p>
          <p className="text-[10px] text-slate-500 font-sans">Deterministic rule matching</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161b22] border border-white/[0.08] space-y-1 shadow-sm">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Target Platform</p>
          <p className="text-lg font-bold font-mono text-[#10b981]">ESP32 / ESP-NOW</p>
          <p className="text-[10px] text-slate-500 font-sans">Dual Tensilica LX6 240MHz</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161b22] border border-white/[0.08] space-y-1 shadow-sm">
          <p className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Diagnostic Core</p>
          <p className="text-lg font-bold font-mono text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            100% Operational
          </p>
          <p className="text-[10px] text-slate-500 font-sans">Live telemetry session capture</p>
        </div>
      </div>

      {/* 9 Fault Tree Quick Launch Cards */}
      <div className="w-full space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00f2fe]" />
            Hardware Diagnostic Failure Domains (9 Trees)
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Select a domain to jump directly
          </span>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {faultTrees.map((tree) => {
            const Icon = tree.icon;
            return (
              <div
                key={tree.key}
                onClick={() => onStartDiagnostic(tree.key)}
                className="group p-5 rounded-2xl bg-[#161b22] hover:bg-[#21262d] border border-white/[0.08] hover:border-[#00f2fe]/40 transition-all cursor-pointer shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${tree.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00f2fe] transform group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-[#00f2fe] transition-colors font-sans">
                    {tree.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {tree.description}
                  </p>
                </div>

                <div className="pt-3.5 mt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#00f2fe]">
                  <span>Diagnose Domain</span>
                  <span className="text-slate-500 group-hover:text-slate-300">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Session Logs Preview */}
      <div className="w-full space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#10b981]" />
            Recent Telemetry Sessions ({recentLogs.length})
          </h2>
          <button
            onClick={onViewLogs}
            className="text-xs font-mono text-[#00f2fe] hover:underline cursor-pointer"
          >
            View All Logs ({recentLogs.length}) →
          </button>
        </div>

        <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-white/[0.06]">
            {displayRecent.map((log) => (
              <div
                key={log.id}
                onClick={onViewLogs}
                className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-[#21262d]/50 transition-colors text-xs font-mono cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-lg bg-[#0d1117] border border-white/[0.08] text-[#00f2fe] font-bold">
                    {log.id}
                  </span>
                  {log.ruleId && (
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400 text-[10px]">
                      {log.ruleId}
                    </span>
                  )}
                  <span className="text-slate-200 font-sans font-medium text-xs sm:text-sm">
                    {log.fault || log.diagnosisTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md bg-[#0d1117] border border-white/[0.06] text-slate-400 text-[11px]">
                    {log.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === "CRITICAL"
                        ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30"
                        : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30"
                    }`}
                  >
                    {log.severity}
                  </span>
                  <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                </div>
              </div>
            ))}

            {displayRecent.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                No active diagnostic sessions recorded yet. Launch a scan to record telemetry logs.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
