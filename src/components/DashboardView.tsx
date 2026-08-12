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
  Sparkles
} from "lucide-react";

interface DashboardViewProps {
  onStartDiagnostic: (categoryKey?: string) => void;
  onViewLogs: () => void;
}

export function DashboardView({
  onStartDiagnostic,
  onViewLogs
}: DashboardViewProps) {
  const faultTrees = [
    {
      key: "brownout",
      name: "Brownout Resets & Power Rail",
      icon: Zap,
      color: "text-rose-400 border-rose-800/60 bg-rose-950/40",
      description: "Diagnosing 350-500mA RF transmit current spikes, AMS1117 LDO voltage drops & decoupling."
    },
    {
      key: "espnow",
      name: "ESP-NOW MAC Pairing & Peers",
      icon: Share2,
      color: "text-neon-cyan border-cyan-800/60 bg-cyan-950/40",
      description: "Troubleshooting primary Wi-Fi channel sync, Station vs AP MAC mismatches & peer capacity."
    },
    {
      key: "wifi",
      name: "Wi-Fi Stack & WDT Timeouts",
      icon: Wifi,
      color: "text-emerald-green border-emerald-800/60 bg-emerald-950/40",
      description: "Resolving FreeRTOS Task Watchdog blocking loops, 5GHz band steering & DHCP timeouts."
    },
    {
      key: "gpio",
      name: "GPIO Logic & 5V Interfacing",
      icon: Cpu,
      color: "text-amber-400 border-amber-800/60 bg-amber-950/40",
      description: "Identifying 3.3V LVCMOS gate breakdown, 5V level shifter requirements & inductive relay back-EMF."
    },
    {
      key: "antenna",
      name: "Antenna, RSSI & 2.4GHz Noise",
      icon: Radio,
      color: "text-purple-400 border-purple-800/60 bg-purple-950/40",
      description: "Diagnosing u.FL 0402 selector jumper alignment, metal enclosure Faraday shielding & ISM noise."
    }
  ];

  const recentLogs = [
    {
      id: "LOG-9402",
      time: "10 mins ago",
      fault: "Brownout detector triggered during Wi-Fi setup",
      category: "Brownout",
      severity: "CRITICAL"
    },
    {
      id: "LOG-9398",
      time: "1 hour ago",
      fault: "ESP-NOW send callback returned status 1 (FAIL)",
      category: "ESP-NOW",
      severity: "WARNING"
    },
    {
      id: "LOG-9385",
      time: "3 hours ago",
      fault: "Task watchdog timer (TWDT) triggered on loop()",
      category: "Wi-Fi",
      severity: "CRITICAL"
    }
  ];

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Hero Banner / Primary CTA */}
      <div className="w-full relative overflow-hidden rounded-2xl bg-surface-card border border-card-border p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 text-neon-cyan border border-cyan-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            ECE 515.2 Rule-Based Expert System
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Localized IoT &amp; Embedded Hardware <br />
            <span className="text-neon-cyan font-mono">Diagnostic Engine</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-4xl">
            Instantly diagnose power supply brownout loops, ESP-NOW MAC pairing failures, FreeRTOS task watchdog hangs, and 5V GPIO over-voltage destruction on ESP32 microcontrollers using deterministic forward-chaining rule trees.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onStartDiagnostic()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neon-cyan hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/30"
            >
              <Play className="w-4 h-4 fill-current" />
              Start System Diagnostic Scan
            </button>

            <button
              onClick={onViewLogs}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-card-border transition-colors text-sm font-mono"
            >
              <History className="w-4 h-4 text-slate-400" />
              View Hardware Logs
            </button>
          </div>
        </div>
      </div>

      {/* System Metrics Strip */}
      <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-card border border-card-border space-y-1">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Fault Trees</p>
          <p className="text-xl font-bold font-mono text-white">5 Hardware Domains</p>
          <p className="text-[10px] text-slate-500">Power, ESP-NOW, Wi-Fi, GPIO, RF</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-card-border space-y-1">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Inference Engine</p>
          <p className="text-xl font-bold font-mono text-neon-cyan">Forward-Chaining</p>
          <p className="text-[10px] text-slate-500">Deterministic rule traversal</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-card-border space-y-1">
          <p className="text-[11px] font-mono text-slate-400 uppercase">Target Platform</p>
          <p className="text-xl font-bold font-mono text-emerald-green">ESP32 / ESP-NOW</p>
          <p className="text-[10px] text-slate-500">Dual Tensilica LX6 Micro</p>
        </div>

        <div className="p-4 rounded-xl bg-surface-card border border-card-border space-y-1">
          <p className="text-[11px] font-mono text-slate-400 uppercase">System Status</p>
          <p className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-green animate-pulse" />
            100% Operational
          </p>
          <p className="text-[10px] text-slate-500">Zero latency inference</p>
        </div>
      </div>

      {/* 5 Fault Tree Quick Launch Cards - Fluid 5-column layout on XL screens */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-neon-cyan" />
            Hardware Diagnostic Knowledge Domains
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Click any domain to jump directly
          </span>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {faultTrees.map((tree) => {
            const Icon = tree.icon;
            return (
              <div
                key={tree.key}
                onClick={() => onStartDiagnostic(tree.key)}
                className="group p-5 rounded-2xl bg-surface-card hover:bg-slate-800/90 border border-card-border hover:border-neon-cyan transition-all cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${tree.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-neon-cyan transform group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-neon-cyan transition-colors">
                    {tree.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tree.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-neon-cyan">
                  <span>Diagnose Issue</span>
                  <span className="text-slate-500 group-hover:text-slate-300">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Diagnostic Sessions History Preview */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-green" />
            Recent Session Logs
          </h2>
          <button
            onClick={onViewLogs}
            className="text-xs font-mono text-neon-cyan hover:underline"
          >
            View All Logs →
          </button>
        </div>

        <div className="w-full bg-surface-card border border-card-border rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {log.id}
                  </span>
                  <span className="text-slate-200 font-sans font-medium text-sm">
                    {log.fault}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {log.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === "CRITICAL"
                        ? "bg-rose-950 text-rose-400 border border-rose-800"
                        : "bg-amber-950 text-amber-400 border border-amber-800"
                    }`}
                  >
                    {log.severity}
                  </span>
                  <span className="text-slate-500 text-[11px]">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
