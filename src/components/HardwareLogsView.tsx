"use client";

import React, { useState } from "react";
import {
  History,
  Search,
  Filter,
  AlertOctagon,
  AlertTriangle,
  Info,
  ChevronRight,
  Download
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  category: string;
  fault: string;
  diagnosisTitle: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
}

export function HardwareLogsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const [logs] = useState<LogEntry[]>([
    {
      id: "LOG-9402",
      timestamp: "2026-08-12 00:45:12",
      category: "Brownout",
      fault: "Spontaneous Reboot on Wi-Fi Init",
      diagnosisTitle: "Transient RF Inrush Current & Cable Impedance Dip",
      severity: "CRITICAL"
    },
    {
      id: "LOG-9398",
      timestamp: "2026-08-11 23:12:04",
      category: "ESP-NOW",
      fault: "esp_now_send() Callback Returned Status 1 (FAIL)",
      diagnosisTitle: "Wi-Fi Primary Channel Asynchrony",
      severity: "CRITICAL"
    },
    {
      id: "LOG-9385",
      timestamp: "2026-08-11 18:30:45",
      category: "Wi-Fi",
      fault: "Task Watchdog Timer (TWDT) Reset in loop()",
      diagnosisTitle: "Synchronous Blocking Loop Starving FreeRTOS Task Watchdog",
      severity: "CRITICAL"
    },
    {
      id: "LOG-9372",
      timestamp: "2026-08-11 14:15:22",
      category: "GPIO",
      fault: "ESP32 Hot to Touch / Pin Stuck HIGH",
      diagnosisTitle: "GPIO Overvoltage Substrate Latch-up & Permanent Chip Destruction",
      severity: "CRITICAL"
    },
    {
      id: "LOG-9360",
      timestamp: "2026-08-10 09:20:10",
      category: "Antenna",
      fault: "Near 100% Packet Loss inside Metal Junction Box",
      diagnosisTitle: "Faraday Shielding Attenuation by Metallic Enclosure",
      severity: "WARNING"
    }
  ]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.fault.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.diagnosisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      filterSeverity === "ALL" || log.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800 font-mono">
            <AlertOctagon className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 font-mono">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
      case "INFO":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-neon-cyan border border-cyan-800 font-mono">
            <Info className="w-3 h-3" />
            INFO
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-card-border">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <History className="w-5 h-5 text-neon-cyan" />
            Hardware Diagnostic Session Logs
          </h2>
          <p className="text-xs text-slate-400">
            Historical records of past forward-chaining inference runs.
          </p>
        </div>

        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(logs, null, 2)], {
              type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `HardwareLogs-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white border border-card-border text-xs font-mono"
        >
          <Download className="w-3.5 h-3.5 text-neon-cyan" />
          Export All Logs
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="w-full flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by ID, fault, or diagnosis title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">Severity:</span>
          {["ALL", "CRITICAL", "WARNING", "INFO"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterSeverity === sev
                  ? "bg-cyan-950 text-neon-cyan border border-cyan-800"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Full-Width Logs Table */}
      <div className="w-full bg-surface-card border border-card-border rounded-2xl overflow-hidden shadow-xl">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-card-border uppercase text-[10px]">
                <th className="py-3.5 px-4 font-bold">Session ID</th>
                <th className="py-3.5 px-4 font-bold">Timestamp</th>
                <th className="py-3.5 px-4 font-bold">Domain</th>
                <th className="py-3.5 px-4 font-bold">Observed Fault</th>
                <th className="py-3.5 px-4 font-bold">Confirmed Diagnosis</th>
                <th className="py-3.5 px-4 font-bold">Severity</th>
                <th className="py-3.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-800/60 transition-colors"
                >
                  <td className="py-3.5 px-4 font-bold text-neon-cyan">
                    {log.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 font-sans font-medium">
                    {log.fault}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-sans">
                    {log.diagnosisTitle}
                  </td>
                  <td className="py-3.5 px-4">
                    {renderSeverityBadge(log.severity)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
