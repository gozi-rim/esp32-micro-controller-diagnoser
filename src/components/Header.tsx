"use client";

import React, { useState } from "react";
import {
  Terminal,
  Menu,
  RotateCcw,
  User,
  ChevronRight,
  Sliders,
  Sparkles,
  BookOpen
} from "lucide-react";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onResetDiagnostic: () => void;
  historyLength: number;
  currentCategoryName?: string;
  activeView: string;
}

export function Header({
  onToggleMobileSidebar,
  onResetDiagnostic,
  historyLength,
  currentCategoryName,
  activeView
}: HeaderProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="w-full shrink-0 sticky top-0 z-30 backdrop-blur-md bg-slate-950/80 border-b border-card-border px-6 py-3.5 flex items-center justify-between gap-4 transition-colors select-none">
      {/* Left Section: Mobile Menu Button, Logo & Breadcrumb Trail */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white border border-card-border transition-colors lg:hidden shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo & Online Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 rounded-xl bg-surface-card border border-card-border text-neon-cyan shadow-inner">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                NetDiag<span className="text-neon-cyan">.Expert</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-emerald-950/60 text-emerald-green border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-green animate-pulse" />
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Breadcrumbs */}
        <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-400 truncate pl-4 border-l border-slate-800">
          <span className="capitalize text-slate-300 font-medium">
            {activeView.replace("_", " ")}
          </span>

          {activeView === "diagnostic" && historyLength > 0 && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-neon-cyan border border-cyan-800/60 font-bold shrink-0">
                Depth: {historyLength}
              </span>
            </>
          )}

          {currentCategoryName && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="text-emerald-green font-semibold capitalize truncate">
                {currentCategoryName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right Section: Course Badge, Quick Reset & User Dropdown */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
          ECE 515.2 AI
        </span>

        {/* Reset Diagnostic Trigger */}
        <button
          onClick={onResetDiagnostic}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white border border-card-border hover:border-neon-cyan transition-all text-xs font-mono font-medium"
          title="Reset active diagnostic session"
        >
          <RotateCcw className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* User Profile & Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-card hover:bg-slate-800 border border-card-border text-slate-300 hover:text-white transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-950 text-neon-cyan flex items-center justify-center font-mono font-bold text-xs border border-cyan-800/60">
              AI
            </div>
            <User className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-card-border shadow-2xl p-2 z-50 text-xs font-sans animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-semibold text-white">Lead Engineer</p>
                <p className="text-[11px] text-slate-400 font-mono">
                  ECE 515.2 Researcher
                </p>
              </div>
              <div className="py-1">
                <div className="px-3 py-1.5 text-slate-300 flex items-center gap-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                  <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
                  System Settings
                </div>
                <div className="px-3 py-1.5 text-slate-300 flex items-center gap-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-green" />
                  Inference Engine v2.4
                </div>
                <div className="px-3 py-1.5 text-slate-300 flex items-center gap-2 hover:bg-slate-800 rounded-lg cursor-pointer">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  Documentation &amp; PRD
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
