"use client";

import React from "react";
import {
  GraduationCap,
  Sparkles,
  Target,
  Zap,
  UserCheck,
  Building2,
  BookOpen,
  Users,
  CheckCircle2,
  Award,
  Cpu,
  Shield,
  Layers,
  Radio,
  Activity,
  Terminal,
  Share2,
  Wifi,
  Gauge,
  ShieldAlert,
  Printer
} from "lucide-react";

export function AboutView() {
  const teamMembers = [
    {
      name: "Onyenaucheya Blessed Chimgozirim",
      matric: "U2021/3020046",
      role: "Group Leader",
      contribution: "System Architecture & Forward-Chaining Inference Engine",
      isHighlighted: true
    },
    {
      name: "Memena Emmanuel Chiedu",
      matric: "U2021/3020054",
      role: "Member",
      contribution: "ESP-NOW Protocol & Peer MAC Fault Tree",
      isHighlighted: true
    },
    {
      name: "Ordu ThankGod Meyi",
      matric: "U2021/3020045",
      role: "Member",
      contribution: "Brownout & Power Supply Diagnostic Rules",
      isHighlighted: true
    },
    {
      name: "Paul Godwin",
      matric: "U2021/3020047",
      role: "Member",
      contribution: "Wi-Fi Stack & FreeRTOS Watchdog Analysis",
      isHighlighted: true
    },
    {
      name: "Dickson Jessica Emem-Abasi",
      matric: "U2021/3020052",
      role: "Member",
      contribution: "GPIO Voltage Logic & Antenna Interference Domain",
      isHighlighted: true
    },
    {
      name: "Amadi Chibuike Eberechukwu",
      matric: "U2021/3020048",
      role: "Member",
      contribution: "I2C Bus Lockup & SPI Signal Integrity Testing",
      isHighlighted: true
    },
    {
      name: "Nwankwo Gift Chisom",
      matric: "U2021/3020049",
      role: "Member",
      contribution: "ADC2 Wi-Fi Conflict & Strapping Pin Validation",
      isHighlighted: true
    },
    {
      name: "Okonkwo Uchechukwu David",
      matric: "U2021/3020050",
      role: "Member",
      contribution: "Knowledge Base Data Entry & Rule Verification",
      isHighlighted: true
    },
    {
      name: "Ezeigbo Valentine Chukwuemeka",
      matric: "U2021/3020051",
      role: "Member",
      contribution: "Serial Monitor Panic Log Classifier Integration",
      isHighlighted: true
    },
    {
      name: "Okwudili Favour Chidinma",
      matric: "U2021/3020053",
      role: "Member",
      contribution: "UI/UX Design & Hardware Telemetry Dashboard",
      isHighlighted: true
    },
    {
      name: "Ugochukwu Emmanuel Kelechi",
      matric: "U2021/3020055",
      role: "Member",
      contribution: "Documentation, Testing & PDF Report Generation",
      isHighlighted: true
    }
  ];

  const systemCapabilities = [
    { icon: Zap, label: "Power & Brownout Diagnostics", color: "text-yellow-400" },
    { icon: Share2, label: "ESP-NOW Peer MAC Sync", color: "text-cyan-400" },
    { icon: Wifi, label: "Wi-Fi & TWDT Analysis", color: "text-blue-400" },
    { icon: Cpu, label: "GPIO Voltage Interfacing", color: "text-purple-400" },
    { icon: Radio, label: "Antenna & RSSI Noise", color: "text-orange-400" },
    { icon: Layers, label: "I2C Bus Lockup Detection", color: "text-emerald-400" },
    { icon: Activity, label: "SPI CS Signal Integrity", color: "text-rose-400" },
    { icon: Gauge, label: "ADC2 Wi-Fi Pin Conflict", color: "text-teal-400" },
    { icon: ShieldAlert, label: "Strapping Pin Boot Faults", color: "text-red-400" }
  ];

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="w-full relative overflow-hidden rounded-2xl bg-[#161b22] border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10b981]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              ECE 515.2 Capstone Project
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 font-bold">
              <Users className="w-3.5 h-3.5" />
              Group 11
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
              <Award className="w-3.5 h-3.5" />
              2024/2025 Academic Session
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            About NetDiag Expert
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-3xl">
            A forward-chaining rule-based expert system for automated diagnosis of localized hardware and communication faults in ESP32-based IoT networks. Built for the ECE 515.2 (Introduction to Artificial Intelligence) capstone project at the University of Port Harcourt.
          </p>
        </div>
      </div>

      {/* 3 Bento-Box Cards: System Overview, Project Goal, System Impact */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Overview */}
        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#00f2fe] font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#00f2fe]" />
              System Overview
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              NetDiag Expert is a deterministic, rule-based expert system engineered to diagnose localized hardware and communication faults in embedded IoT networks. Built with a forward-chaining inference engine, the system evaluates user-provided symptoms against a structured knowledge base covering nine critical hardware domains: Power/Brownouts, ESP-NOW Protocol, Wi-Fi Stack, GPIO Logic, RF Interference, I2C Bus, SPI Signal Integrity, ADC2 Conflicts, and Strapping Pin Boot Faults.
            </p>
          </div>
          <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
            Domain: Embedded IoT &amp; Hardware Diagnostics
          </div>
        </div>

        {/* Project Goal */}
        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#10b981] font-mono text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-[#10b981]" />
              Project Goal
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              The primary objective of this project is to capture the domain expertise of embedded systems engineering into an automated, interactive software layer. By mapping complex hardware failure modes into a logical decision tree with formal production rules (IF-THEN antecedent chains with confidence factors), the system allows users to troubleshoot ESP32 microcontrollers without needing to manually cross-reference datasheets or serial monitor memory dumps.
            </p>
          </div>
          <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
            Architecture: Forward-Chaining Inference Engine
          </div>
        </div>

        {/* System Impact */}
        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-purple-400" />
              System Impact
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              This expert system drastically reduces diagnostic downtime for laboratory technicians, electronic engineering students, and IoT developers. By instantly identifying the root causes of fatal errors—such as 3.3V logic gate breakdowns, synchronous blocking loops, ADC2 Wi-Fi hardware conflicts, and strapping pin boot traps—it bridges the gap between software state management and physical electronic realities.
            </p>
          </div>
          <div className="pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
            Target Utility: Virtual Lab Assistant &amp; Diagnostic Workbench
          </div>
        </div>
      </div>

      {/* AI Architecture & Capabilities */}
      <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe] font-bold uppercase">
            <Shield className="w-4 h-4" />
            Expert System Architecture
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-white font-sans">
            Forward-Chaining Inference Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-3xl">
            Classical AI production rule system with formal IF-THEN notation, confidence factor scoring (0.85–0.99), antecedent trace logging, and real-time explanation facility for full diagnostic transparency.
          </p>
        </div>

        {/* 9 Domain Capability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {systemCapabilities.map((cap, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0d1117] border border-white/[0.06] transition-all hover:border-white/[0.12]"
            >
              <div className={`p-2 rounded-lg bg-white/[0.04] ${cap.color}`}>
                <cap.icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm text-slate-200 font-sans font-medium">{cap.label}</span>
            </div>
          ))}
        </div>

        {/* Technical Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.06]">
          {[
            { value: "9", label: "Fault Domains" },
            { value: "38+", label: "Production Rules" },
            { value: "0.85–0.99", label: "Confidence Range" },
            { value: "38-Pin", label: "Interactive Pinout" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-3 rounded-xl bg-[#0d1117] border border-white/[0.06]">
              <div className="text-lg sm:text-xl font-bold text-[#00f2fe] font-mono">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-slate-400 font-mono uppercase mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Team & Submission Details Section */}
      <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header Details */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe] font-bold uppercase">
              <Building2 className="w-4 h-4" />
              Submission Details
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white font-sans">
              Department of Electronic Engineering
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              University of Port Harcourt
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-[#0d1117] border border-white/[0.08] text-slate-300">
              <BookOpen className="w-3.5 h-3.5 inline mr-1 text-[#00f2fe]" />
              Course: ECE 515.2 (Intro to AI)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-bold">
              <Users className="w-3.5 h-3.5 inline mr-1 text-[#00f2fe]" />
              Group 11
            </span>
          </div>
        </div>

        {/* 2-Column Roster Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#00f2fe]" />
            Project Team Roster (Group 11) — {teamMembers.length} Members
          </h3>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  member.role === "Group Leader"
                    ? "bg-[#0d1117] border-[#00f2fe]/40 shadow-md shadow-[#00f2fe]/5"
                    : "bg-[#0d1117] border-white/[0.08] hover:border-white/[0.14]"
                }`}
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold truncate font-sans text-white">
                      {member.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono block text-[#00f2fe] font-semibold">
                    {member.matric}
                  </span>
                  <span className="text-[11px] font-sans text-slate-400 block">
                    {member.contribution}
                  </span>
                </div>

                {member.role === "Group Leader" ? (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/40 shrink-0 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Leader
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-[#161b22] text-slate-400 border border-white/[0.08] shrink-0">
                    Member
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Supervisor & Academic Metadata */}
        <div className="pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Course Code</span>
            <span className="text-sm font-semibold text-white font-sans">ECE 515.2</span>
            <span className="text-xs text-slate-400 block font-sans">Introduction to Artificial Intelligence</span>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Department</span>
            <span className="text-sm font-semibold text-white font-sans">Electronic Engineering</span>
            <span className="text-xs text-slate-400 block font-sans">Faculty of Engineering, University of Port Harcourt</span>
          </div>
          <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Project Type</span>
            <span className="text-sm font-semibold text-white font-sans">Expert System (AI)</span>
            <span className="text-xs text-slate-400 block font-sans">Rule-Based Forward-Chaining Diagnostic Engine</span>
          </div>
        </div>
      </div>

      {/* Print This Page Button */}
      <div className="w-full flex justify-center pb-8">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-200 border border-white/[0.08] font-mono text-xs transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <Printer className="w-4 h-4 text-[#00f2fe]" />
          Print / Export This Page as PDF
        </button>
      </div>
    </div>
  );
}
