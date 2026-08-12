"use client";

import React, { useState } from "react";
import {
  knowledgeBase,
  DiagnosisNode
} from "@/data/knowledgeBase";
import {
  BookOpen,
  Zap,
  Share2,
  Wifi,
  Cpu,
  Radio,
  Search,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export function KnowledgeBaseView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { key: "all", name: "All Fault Trees", icon: BookOpen },
    { key: "brownout", name: "Power & Brownout", icon: Zap },
    { key: "espnow", name: "ESP-NOW MAC Sync", icon: Share2 },
    { key: "wifi", name: "Wi-Fi & WDT Timeouts", icon: Wifi },
    { key: "gpio", name: "GPIO Voltage & Logic", icon: Cpu },
    { key: "antenna", name: "Antenna & 2.4GHz Noise", icon: Radio }
  ];

  // Extract all terminal diagnosis nodes
  const allDiagnoses = Object.values(knowledgeBase.nodes).filter(
    (node) => node.type === "diagnosis"
  ) as DiagnosisNode[];

  const filteredDiagnoses = allDiagnoses.filter((diag) => {
    const matchesCategory =
      selectedCategory === "all" || diag.category === selectedCategory;

    const matchesSearch =
      diag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diag.symptomSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diag.rootCause.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-card-border">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neon-cyan" />
            Knowledge Base Rule Explorer
          </h2>
          <p className="text-xs text-slate-400">
            Browse all 5 fault trees and electronic engineering diagnostic paths.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-surface-card border border-card-border text-neon-cyan font-bold">
            {allDiagnoses.length} Terminal Diagnoses
          </span>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-cyan-950 text-neon-cyan border border-cyan-800 font-bold shadow-lg"
                    : "bg-surface-card text-slate-400 hover:text-slate-200 border border-card-border"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter knowledge base by symptom, root cause, or diagnosis title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-card-border text-white text-xs placeholder-slate-500 focus:outline-none focus:border-neon-cyan font-sans"
          />
        </div>
      </div>

      {/* Full-Width Cards Grid (1 col on mobile, up to 4 cols on XL screens) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDiagnoses.map((diag) => (
          <div
            key={diag.id}
            className="p-5 rounded-2xl bg-surface-card border border-card-border hover:border-neon-cyan/60 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-900 border border-slate-800 text-neon-cyan">
                  {diag.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    diag.severity === "CRITICAL"
                      ? "bg-rose-950 text-rose-400 border border-rose-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  {diag.severity}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {diag.title}
              </h3>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-slate-400 block mb-1 font-mono text-[10px] uppercase">
                  Symptom Summary:
                </span>
                {diag.symptomSummary}
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400">
                <span className="font-bold text-amber-400 block mb-1 font-mono text-[10px] uppercase">
                  Root Cause:
                </span>
                {diag.rootCause}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-neon-cyan">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {diag.engineeringSolution.steps.length} Remediation Steps
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
