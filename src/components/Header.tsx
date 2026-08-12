"use client";

import React, { useState } from "react";
import {
  Menu,
  RotateCcw,
  Cpu,
  ChevronRight,
  User,
  Settings,
  Bot,
  Sparkles,
  HelpCircle,
  LogOut,
  ChevronDown
} from "lucide-react";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onResetDiagnostic: () => void;
  historyLength: number;
  currentCategoryName?: string;
  activeView: string;
  onToggleChatbot?: () => void;
}

export function Header({
  onToggleMobileSidebar,
  onResetDiagnostic,
  historyLength,
  currentCategoryName,
  activeView,
  onToggleChatbot
}: HeaderProps) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-slate-950/80 backdrop-blur-md border-b border-card-border px-4 sm:px-6 flex items-center justify-between shrink-0 select-none">
      {/* Left Section: Mobile Menu Trigger & Logo / Depth Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 border border-card-border transition-colors"
          title="Open Mobile Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo Icon & Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-neon-cyan shadow-lg shadow-cyan-950/50">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-white tracking-tight leading-none font-sans">
              NetDiag <span className="text-neon-cyan font-mono text-xs">EXPERT</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400 leading-tight">
              ESP32 &amp; ESP-NOW Fault Tree
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-slate-800 mx-1 shrink-0" />

        {/* Breadcrumb Trail */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-400 truncate">
          <span className="text-slate-300">ECE 515.2</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          {activeView === "dashboard" && <span className="text-neon-cyan font-bold">Dashboard</span>}
          {activeView === "logs" && <span className="text-neon-cyan font-bold">Hardware Logs</span>}
          {activeView === "knowledge_base" && (
            <span className="text-neon-cyan font-bold">Knowledge Base</span>
          )}
          {activeView === "about" && <span className="text-neon-cyan font-bold">About System</span>}

          {activeView === "diagnostic" && (
            <>
              <span className="text-slate-300">Diagnostic</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-neon-cyan font-bold uppercase">
                {currentCategoryName || "General Fault"}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300 shrink-0">
                Depth: {historyLength + 1}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right Section: AI Co-Pilot Button, Reset Button, ECE 515.2 Badge & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Interactive AI Co-Pilot Drawer Toggle Button */}
        {onToggleChatbot && (
          <button
            onClick={onToggleChatbot}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 text-[#06B6D4] border border-cyan-800/80 transition-all font-mono text-xs font-bold shadow-lg shadow-cyan-950/40"
          >
            <Bot className="w-4 h-4 text-[#06B6D4] animate-pulse" />
            <span className="hidden sm:inline">AI Co-Pilot</span>
            <Sparkles className="w-3 h-3 text-amber-400 fill-current" />
          </button>
        )}

        {/* Reset Diagnostic Button */}
        <button
          onClick={onResetDiagnostic}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-rose-400 border border-card-border transition-colors font-mono text-xs"
          title="Reset Active Session"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Session</span>
        </button>

        {/* ECE 515.2 Context Badge */}
        <span className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
          ECE 515.2 AI
        </span>

        {/* User Profile / Settings Dropdown Placeholder */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-surface-card hover:bg-slate-800 border border-card-border transition-colors text-xs font-mono text-slate-200"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-neon-cyan font-bold text-xs">
              U
            </div>
            <span className="hidden md:inline font-bold text-slate-200">Engineer</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Settings Dropdown Modal */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 text-xs font-mono space-y-1">
              <div className="px-3 py-2 border-b border-slate-800 text-slate-400">
                <p className="font-bold text-white text-xs">Logged Technician</p>
                <p className="text-[10px] text-slate-500 truncate">tech@ece515.edu</p>
              </div>

              <button
                onClick={() => setUserDropdownOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-left"
              >
                <User className="w-3.5 h-3.5 text-neon-cyan" />
                Profile Settings
              </button>

              <button
                onClick={() => setUserDropdownOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-left"
              >
                <Settings className="w-3.5 h-3.5 text-neon-cyan" />
                Hardware Config
              </button>

              <button
                onClick={() => setUserDropdownOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 text-left"
              >
                <HelpCircle className="w-3.5 h-3.5 text-neon-cyan" />
                Documentation
              </button>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => setUserDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-950/60 text-rose-400 text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Lock Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
