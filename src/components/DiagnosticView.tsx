"use client";

import React, { useState, useMemo } from "react";
import {
  knowledgeBase,
  KnowledgeNode,
  QuestionNode
} from "@/data/knowledgeBase";
import { ESP32Diagram } from "./ESP32Diagram";
import {
  Search,
  ArrowLeft,
  ChevronRight,
  Layers,
  Activity,
  Zap,
  Radio,
  Wifi,
  Cpu,
  FilterX
} from "lucide-react";

interface DiagnosticViewProps {
  currentNodeId: string;
  history: string[];
  onSelectOption: (nextNodeId: string) => void;
  onGoBack: () => void;
  onReset: () => void;
}

export function DiagnosticView({
  currentNodeId,
  history,
  onSelectOption,
  onGoBack,
  onReset
}: DiagnosticViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const currentNode: KnowledgeNode = knowledgeBase.nodes[currentNodeId];
  const isQuestion = currentNode?.type === "question";

  // Filter options based on hybrid text input
  const filteredOptions = useMemo(() => {
    if (!isQuestion) return [];
    const options = (currentNode as QuestionNode).options;

    if (!searchQuery.trim()) return options;

    const query = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.description && opt.description.toLowerCase().includes(query))
    );
  }, [currentNode, isQuestion, searchQuery]);

  // Generate live telemetry mock values based on active category
  const telemetry = useMemo(() => {
    const cat = currentNode?.category;
    switch (cat) {
      case "brownout":
        return { vdd: "2.54 V (CRITICAL DIP)", rssi: "-68 dBm", ch: "Ch 6", heap: "184 KB", loss: "35%" };
      case "espnow":
        return { vdd: "3.28 V (STABLE)", rssi: "-72 dBm", ch: "Ch 1 (UNSYNCED)", heap: "210 KB", loss: "100%" };
      case "wifi":
        return { vdd: "3.31 V (STABLE)", rssi: "-81 dBm", ch: "Ch 6 (DFS)", heap: "112 KB (WDT)", loss: "65%" };
      case "gpio":
        return { vdd: "3.30 V (OVERVOLT)", rssi: "-70 dBm", ch: "Ch 1", heap: "220 KB", loss: "0%" };
      case "antenna":
        return { vdd: "3.29 V (STABLE)", rssi: "-94 dBm (WEAK)", ch: "Ch 11", heap: "240 KB", loss: "82%" };
      default:
        return { vdd: "3.30 V", rssi: "-65 dBm", ch: "Ch 1", heap: "245 KB", loss: "0%" };
    }
  }, [currentNode]);

  if (!currentNode || !isQuestion) return null;

  const questionNode = currentNode as QuestionNode;

  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950 animate-fadeIn">
      {/* LEFT PANE: Interaction Container (60% Desktop) - Pinned Search + Independently Scrollable Bento Options */}
      <div className="w-full lg:w-[60%] h-full flex flex-col pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden shrink-0 lg:shrink">
        {/* Pinned Top Header & Search Bar Section */}
        <div className="shrink-0 space-y-4 pb-4 border-b border-slate-800">
          {/* Controls & Step Indicator */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={onGoBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-[#06B6D4] border border-slate-800 transition-all text-xs font-mono"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-surface-card border border-slate-800 text-slate-200">
                  Step {history.length + 1}
                </span>
                {currentNode.category !== "root" && (
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-[#06B6D4] capitalize font-bold">
                    Category: {currentNode.category}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onReset}
              className="text-xs font-mono text-slate-400 hover:text-[#06B6D4] transition-colors"
            >
              Reset Session
            </button>
          </div>

          {/* Question Query Card */}
          <div className="w-full bg-surface-card border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] mb-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
              ACTIVE DIAGNOSTIC QUERY
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight leading-snug">
              {questionNode.question}
            </h2>

            {questionNode.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {questionNode.description}
              </p>
            )}
          </div>

          {/* FIRMLY PINNED HYBRID INPUT SEARCH FILTER SYSTEM */}
          <div className="w-full space-y-1.5">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Describe your hardware symptom or search:
            </label>
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Describe your hardware symptom or search keywords..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-[#06B6D4] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 transition-all font-sans shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  <FilterX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* INDEPENDENTLY SCROLLABLE BENTO OPTIONS AREA (flex-1 overflow-y-auto) */}
        <div className="flex-1 w-full overflow-y-auto pt-4 pr-1 space-y-3">
          {filteredOptions.length > 0 ? (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onSelectOption(option.nextNodeId);
                    setSearchQuery("");
                  }}
                  className="group relative flex flex-col justify-between text-left p-6 rounded-xl bg-surface-card hover:bg-slate-900 border border-slate-800 hover:border-[#06B6D4] transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#06B6D4] transition-colors leading-snug">
                      {option.label}
                    </span>
                    <div className="p-1.5 rounded-lg bg-slate-900 group-hover:bg-cyan-950 border border-slate-800 group-hover:border-cyan-700/60 text-slate-400 group-hover:text-[#06B6D4] transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {option.description && (
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed pt-1">
                      {option.description}
                    </p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="w-full p-8 rounded-xl bg-surface-card border border-slate-800 text-center space-y-2">
              <FilterX className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-white">No matching option tiles found</p>
              <p className="text-xs text-slate-400">
                Try searching for keywords like "voltage", "MAC", "watchdog", "5V", or "antenna".
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-mono text-[#06B6D4] underline"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Context Container (40% Desktop) - Hardware Diagram & Telemetry (Scrollable) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col pl-0 lg:pl-6 pt-6 lg:pt-0 overflow-y-auto space-y-6 shrink-0 lg:shrink">
        {/* Interactive ESP32 Subsystem Diagram */}
        <ESP32Diagram
          category={currentNode.category}
          activeSubsystemTitle={questionNode.title}
        />

        {/* Live Mock Hardware Telemetry Panel */}
        <div className="w-full bg-surface-card border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Activity className="w-4 h-4 text-emerald-green animate-pulse" />
              LIVE HARDWARE TELEMETRY
            </span>
            <span className="text-[10px] text-slate-500">REFRESH: 100ms</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-400" /> VDD 3.3V Rail
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.vdd}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Radio className="w-3 h-3 text-purple-400" /> RSSI Power
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.rssi}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-green" /> Wi-Fi Channel
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.ch}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#06B6D4]" /> FreeRTOS Heap
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.heap}</span>
            </div>
          </div>
        </div>

        {/* Traversed Logical Decision Path Log */}
        <div className="w-full bg-surface-card border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold border-b border-slate-800 pb-2">
            <Layers className="w-4 h-4 text-[#06B6D4]" />
            TRAVERSED INFERENCE PATH
          </div>

          <div className="space-y-2">
            {history.map((nodeId, idx) => {
              const node = knowledgeBase.nodes[nodeId];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400"
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[9px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{node?.title || nodeId}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-[11px] text-[#06B6D4] font-bold">
              <span className="w-4 h-4 rounded-full bg-[#06B6D4] text-slate-950 flex items-center justify-center text-[9px] shrink-0">
                {history.length + 1}
              </span>
              <span className="truncate">{questionNode.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
