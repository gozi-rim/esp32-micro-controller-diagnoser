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
  Download,
  Terminal,
  X,
  Trash2,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: string;
  category: string;
  fault: string;
  diagnosisTitle: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  ruleId?: string;
  confidenceFactor?: number;
  details?: string;
  remediation?: string;
  technicianInputs?: string[];
}

const DEFAULT_HISTORICAL_LOGS: LogEntry[] = [
  {
    id: "LOG-9402",
    ruleId: "RULE-PWR-01",
    confidenceFactor: 0.98,
    timestamp: "2026-08-12 00:45:12",
    category: "Power Rail",
    fault: "Spontaneous Reboot on Wi-Fi Init",
    diagnosisTitle: "Transient RF Inrush Current & Cable Impedance Dip",
    severity: "CRITICAL",
    details: "VDD 3.3V rail dropped to 2.54V during RF calibration. Linear regulator AMS1117 experienced dropout due to high USB cable resistance.",
    remediation: "Solder a 470uF low-ESR capacitor across 3V3 and GND pins, or use a 2A dedicated external 3.3V power supply."
  },
  {
    id: "LOG-9398",
    ruleId: "RULE-ESPNOW-01",
    confidenceFactor: 0.99,
    timestamp: "2026-08-11 23:12:04",
    category: "ESP-NOW",
    fault: "esp_now_send() Callback Returned Status 1 (FAIL)",
    diagnosisTitle: "Wi-Fi Primary Channel Asynchrony",
    severity: "CRITICAL",
    details: "Transmitter and receiver ESP32 nodes operated on mismatched Wi-Fi channels (Ch 1 vs Ch 6), preventing Vendor-Specific Action Frame ACKs.",
    remediation: "Call esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE) on both nodes before calling esp_now_init()."
  },
  {
    id: "LOG-9385",
    ruleId: "RULE-WIFI-01",
    confidenceFactor: 0.99,
    timestamp: "2026-08-11 18:30:45",
    category: "FreeRTOS",
    fault: "Task Watchdog Timer (TWDT) Reset in loop()",
    diagnosisTitle: "Synchronous Blocking Loop Starving FreeRTOS Task Watchdog",
    severity: "CRITICAL",
    details: "Synchronous while(!client.available()) blocked for >5000ms, starving the IDLE task on Core 1.",
    remediation: "Insert vTaskDelay(1) or yield() within waiting loops, or increase TWDT timeout in menuconfig."
  },
  {
    id: "LOG-9372",
    ruleId: "RULE-GPIO-01",
    confidenceFactor: 0.99,
    timestamp: "2026-08-11 14:15:22",
    category: "GPIO Logic",
    fault: "ESP32 Hot to Touch / Pin Stuck HIGH",
    diagnosisTitle: "GPIO Overvoltage Substrate Latch-up & Permanent Chip Destruction",
    severity: "CRITICAL",
    details: "Direct 5.0V signal applied to GPIO 4 without level conversion, breaking down internal ESD protection clamping diodes.",
    remediation: "Replace burned ESP32 module and install bidirectional logic level shifter (BSS138 or TXS0108E) for all 5V sensors."
  },
  {
    id: "LOG-9360",
    ruleId: "RULE-ANT-02",
    confidenceFactor: 0.99,
    timestamp: "2026-08-10 09:20:10",
    category: "Antenna RF",
    fault: "Near 100% Packet Loss inside Metal Junction Box",
    diagnosisTitle: "Faraday Shielding Attenuation by Metallic Enclosure",
    severity: "WARNING",
    details: "ESP32 placed inside sealed aluminum junction box. 2.4GHz RF signals experienced >45dB attenuation.",
    remediation: "Use an external 2.4GHz antenna with u.FL pigtail connector brought outside the enclosure."
  }
];

interface HardwareLogsViewProps {
  logs?: LogEntry[];
  onClearLogs?: () => void;
  onDeleteLog?: (id: string) => void;
}

export function HardwareLogsView({
  logs = DEFAULT_HISTORICAL_LOGS,
  onClearLogs,
  onDeleteLog
}: HardwareLogsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const displayLogs = logs.length > 0 ? logs : DEFAULT_HISTORICAL_LOGS;

  const filteredLogs = displayLogs.filter((log) => {
    const matchesSearch =
      log.fault.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.diagnosisTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.ruleId && log.ruleId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeverity =
      filterSeverity === "ALL" || log.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 font-mono">
            <AlertOctagon className="w-3 h-3" />
            CRITICAL
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 font-mono">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
      case "INFO":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-mono">
            <Info className="w-3 h-3" />
            INFO
          </span>
        );
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(displayLogs, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ESP32-Telemetry-Logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#161b22] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe] font-semibold">
            <History className="w-4 h-4" />
            RECORDED HARDWARE EVENTS &amp; INFERENCE LOGS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Hardware Telemetry Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Chronological audit trail of diagnostic runs, electrical faults, and forward-chaining resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161b22] hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-white/[0.08] hover:border-rose-500/30 text-xs font-mono transition-all cursor-pointer shadow-sm"
              title="Clear Local Session History"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Telemetry JSON
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#161b22] border border-white/[0.08] shadow-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Fault ID, Rule ID, symptom, or diagnosis..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1117] border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00f2fe]/50 transition-colors"
          />
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0d1117] border border-white/[0.08] text-xs font-mono">
          {["ALL", "CRITICAL", "WARNING", "INFO"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                filterSeverity === sev
                  ? "bg-[#161b22] text-[#00f2fe] shadow-sm border border-white/[0.08]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / Card Grid */}
      <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0d1117]/80 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Log ID / Rule</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Subsystem</th>
                <th className="py-3 px-4">Reported Symptom</th>
                <th className="py-3 px-4">Verified Hypothesis</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-[#21262d]/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#00f2fe]">{log.id}</span>
                      {log.ruleId && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300">
                          {log.ruleId}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-300 text-[10px]">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-200 max-w-[200px] truncate font-sans">
                    {log.fault}
                  </td>
                  <td className="py-3.5 px-4 text-white font-semibold max-w-[220px] truncate font-sans">
                    {log.diagnosisTitle}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {renderSeverityBadge(log.severity)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLog(log);
                      }}
                      className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-[#00f2fe]/20 text-slate-400 hover:text-[#00f2fe] border border-white/[0.08] transition-all cursor-pointer inline-flex items-center gap-1 text-[10px]"
                    >
                      Inspect
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-mono text-xs">
                    No hardware telemetry logs matched your filter query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Log Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#161b22] border border-white/[0.12] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe]">
                  <Terminal className="w-3.5 h-3.5" />
                  TELEMETRY LOG INSPECTOR — {selectedLog.id}
                  {selectedLog.ruleId && (
                    <span className="px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-bold">
                      {selectedLog.ruleId}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-sans">
                  {selectedLog.diagnosisTitle}
                </h3>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl bg-[#0d1117] hover:bg-[#21262d] text-slate-400 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subsystem & Timestamp */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block uppercase">Subsystem</span>
                <span className="text-slate-200 font-semibold">{selectedLog.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block uppercase">Timestamp</span>
                <span className="text-slate-200 font-semibold">{selectedLog.timestamp}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block uppercase">Severity</span>
                <span className="inline-block mt-0.5">{renderSeverityBadge(selectedLog.severity)}</span>
              </div>
            </div>

            {/* Root Cause Details */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-[#00f2fe] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Root Cause &amp; Electrical Failure Mode
              </span>
              <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] text-xs font-mono text-slate-300 leading-relaxed">
                {selectedLog.details || "Electrical telemetry confirms parameter threshold breach on ESP32 silicon."}
              </div>
            </div>

            {/* Actionable Remediation */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-[#10b981] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recommended Engineering Remediation
              </span>
              <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] text-xs font-mono text-emerald-400/90 leading-relaxed">
                {selectedLog.remediation || "Follow recommended hardware isolation and power decoupling protocols."}
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center">
              {onDeleteLog && (
                <button
                  onClick={() => {
                    onDeleteLog(selectedLog.id);
                    setSelectedLog(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-400 border border-rose-500/30 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Log
                </button>
              )}
              <button
                onClick={() => setSelectedLog(null)}
                className="ml-auto px-5 py-2 rounded-xl bg-[#00f2fe] hover:bg-[#00f2fe]/90 text-slate-950 font-bold font-mono text-xs transition-all cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
