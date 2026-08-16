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
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export function KnowledgeBaseView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { key: "all", name: "All Rules (20+ Trees)", icon: BookOpen },
    { key: "brownout", name: "Power & Brownouts", icon: Zap },
    { key: "espnow", name: "ESP-NOW Protocols", icon: Share2 },
    { key: "wifi", name: "Wi-Fi & WDT Hangs", icon: Wifi },
    { key: "gpio", name: "GPIO & 5V Interfacing", icon: Cpu },
    { key: "antenna", name: "Antenna & RF Paths", icon: Radio }
  ];

  const allDiagnoses = Object.values(knowledgeBase.nodes).filter(
    (node) => node.type === "diagnosis"
  ) as DiagnosisNode[];

  const filteredDiagnoses = allDiagnoses.filter((diag) => {
    const matchesCategory =
      selectedCategory === "all" || diag.category === selectedCategory;

    const matchesSearch =
      diag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diag.symptomSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diag.rootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      diag.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00f2fe]" />
            Knowledge Base Rule Explorer (20+ Trees)
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Explore 20+ forward-chaining diagnostic paths and electronic failure mode remediations.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span className="px-3 py-1 rounded-full bg-[#161b22] border border-white/[0.08] text-[#00f2fe] font-semibold">
            {allDiagnoses.length} Terminal Diagnoses
          </span>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="w-full space-y-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-bold shadow-md shadow-[#00f2fe]/10"
                    : "bg-[#161b22] text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:bg-[#21262d]"
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
            placeholder="Search rules by symptom, root cause, or diagnosis title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-white/[0.08] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]/60 font-sans shadow-inner"
          />
        </div>
      </div>

      {/* Grid of Diagnosis Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDiagnoses.map((diag) => (
          <div
            key={diag.id}
            className="p-5 rounded-2xl bg-[#161b22] border border-white/[0.08] hover:border-[#00f2fe]/40 transition-all space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#0d1117] border border-white/[0.08] text-[#00f2fe]">
                  {diag.category}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    diag.severity === "CRITICAL"
                      ? "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30"
                      : "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30"
                  }`}
                >
                  {diag.severity}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-white leading-snug font-sans">
                {diag.title}
              </h3>

              <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] text-xs text-slate-300">
                <span className="font-bold text-slate-400 block mb-1 font-mono text-[10px] uppercase">
                  Symptom:
                </span>
                <p className="font-sans line-clamp-2">{diag.symptomSummary}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#0d1117]/60 border border-white/[0.04] text-xs text-slate-400">
                <span className="font-bold text-[#f59e0b] block mb-1 font-mono text-[10px] uppercase">
                  Root Cause:
                </span>
                <p className="font-sans line-clamp-2">{diag.rootCause}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#00f2fe]">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                {diag.engineeringSolution.steps.length} Actions
              </span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
