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
  Users
} from "lucide-react";

export function AboutView() {
  const teamMembers = [
    {
      name: "Onyenaucheya Blessed Chimgozirim",
      matric: "U2021/3020046",
      role: "Group Leader",
      isHighlighted: true
    },
    {
      name: "Memena Emmanuel Chiedu",
      matric: "U2021/3020054",
      role: "Member",
      isHighlighted: true
    },
    {
      name: "Ordu ThankGod Meyi",
      matric: "U2021/3020045",
      role: "Member",
      isHighlighted: true
    },
    {
      name: "Paul Godwin",
      matric: "U2021/3020047",
      role: "Member",
      isHighlighted: true
    },
    {
      name: "Dickson Jessica Emem-Abasi",
      matric: "U2021/3020052",
      role: "Member",
      isHighlighted: true
    },
    {
      name: "[Full Name Pending]",
      matric: "U2021/3020048",
      role: "Member",
      isHighlighted: false
    },
    {
      name: "[Full Name Pending]",
      matric: "U2021/3020049",
      role: "Member",
      isHighlighted: false
    },
    {
      name: "[Full Name Pending]",
      matric: "U2021/3020050",
      role: "Member",
      isHighlighted: false
    },
    {
      name: "[Full Name Pending]",
      matric: "U2021/3020051",
      role: "Member",
      isHighlighted: false
    },
    {
      name: "[Full Name Pending]",
      matric: "U2021/3020053",
      role: "Member",
      isHighlighted: false
    },
    {
      name: "[Full Name Pending]",
      matric: "U2021/3020055",
      role: "Member",
      isHighlighted: false
    }
  ];

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      {/* Top Header Banner */}
      <div className="w-full relative overflow-hidden rounded-2xl bg-surface-card border border-card-border p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            ECE 515.2 Capstone Project
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            About NetDiag Expert
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            ECE 515.2 (Introduction to Artificial Intelligence) Capstone Application
          </p>
        </div>
      </div>

      {/* 3 Bento-Box Cards: System Overview, Project Goal, System Impact */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Overview */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              System Overview
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              NetDiag Expert is a deterministic, rule-based expert system engineered to diagnose localized hardware and communication faults in embedded IoT networks. Built as a Single Page Application (SPA) using Next.js and a forward-chaining inference engine, the system evaluates user-provided symptoms against a structured knowledge base covering five critical hardware domains: Power/Brownouts, ESP-NOW Protocol, Wi-Fi Stack, GPIO Logic, and RF Interference.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
            Domain: Embedded IoT &amp; Hardware Diagnostics
          </div>
        </div>

        {/* Project Goal */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-green font-mono text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4 text-emerald-green" />
              Project Goal
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              The primary objective of this project is to capture the domain expertise of embedded systems engineering into an automated, interactive software layer. By mapping complex hardware failure modes into a logical decision tree, the system allows users to troubleshoot ESP32 microcontrollers without needing to manually cross-reference datasheets or serial monitor memory dumps.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
            Architecture: Forward-Chaining Inference
          </div>
        </div>

        {/* System Impact */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-purple-400" />
              System Impact
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              This expert system drastically reduces diagnostic downtime for laboratory technicians, electronic engineering students, and IoT developers. By instantly identifying the root causes of fatal errors—such as 3.3V logic gate breakdowns or synchronous blocking loops—it bridges the gap between software state management and physical electronic realities, serving as a highly accessible virtual lab assistant.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
            Target Utility: Virtual Lab Assistant
          </div>
        </div>
      </div>

      {/* Project Team & Submission Details Section */}
      <div className="w-full bg-surface-card border border-card-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header Details */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase">
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
            <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <BookOpen className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
              Course: ECE 515.2 (Intro to AI)
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              <Users className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
              Group 11
            </span>
          </div>
        </div>

        {/* 2-Column Roster Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Project Team Roster (Group 11)
          </h3>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  member.isHighlighted
                    ? "bg-cyan-950/40 border-cyan-800/80 shadow-md shadow-cyan-950/20"
                    : "bg-slate-900/40 border-slate-800/80"
                }`}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold truncate ${
                        member.isHighlighted
                          ? "text-white font-sans"
                          : "text-slate-400 font-sans"
                      }`}
                    >
                      {member.name}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-mono block ${
                      member.isHighlighted
                        ? "text-cyan-400 font-semibold"
                        : "text-slate-500"
                    }`}
                  >
                    {member.matric}
                  </span>
                </div>

                {member.role === "Group Leader" ? (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-cyan-950 text-cyan-400 border border-cyan-700/80 shrink-0">
                    Leader
                  </span>
                ) : member.isHighlighted ? (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-900 text-cyan-400 border border-slate-800 shrink-0">
                    Member
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-900/80 text-slate-500 border border-slate-800 shrink-0">
                    Member
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
