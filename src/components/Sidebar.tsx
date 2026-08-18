"use client";

import React from "react";
import {
  Activity,
  History,
  BookOpen,
  Cpu,
  Layers,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Usb,
  Presentation
} from "lucide-react";
import Link from "next/link";

export type SidebarViewType =
  | "dashboard"
  | "diagnostic"
  | "serial_monitor"
  | "logs"
  | "knowledge_base"
  | "specs"
  | "about";

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeView: SidebarViewType;
  onSelectView: (view: SidebarViewType) => void;
  isDiagnosticActive: boolean;
}

export function Sidebar({
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  activeView,
  onSelectView,
  isDiagnosticActive
}: SidebarProps) {
  const navItems = [
    {
      id: "diagnostic" as SidebarViewType,
      label: "Active Diagnostic",
      icon: Activity,
      badge: isDiagnosticActive ? "RUNNING" : "READY",
      badgeColor: isDiagnosticActive
        ? "bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/30 animate-pulse"
        : "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30"
    },
    {
      id: "serial_monitor" as SidebarViewType,
      label: "USB Serial Monitor",
      icon: Usb,
      badge: "HARDWARE",
      badgeColor: "bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/30"
    },
    {
      id: "logs" as SidebarViewType,
      label: "Hardware Telemetry Logs",
      icon: History,
      badge: "LIVE LOGS",
      badgeColor: "bg-white/[0.06] text-slate-400 border-white/[0.08]"
    },
    {
      id: "knowledge_base" as SidebarViewType,
      label: "Knowledge Base Rules",
      icon: BookOpen,
      badge: "20+ Trees",
      badgeColor: "bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/20"
    },
    {
      id: "specs" as SidebarViewType,
      label: "System Architecture / Specs",
      icon: Layers,
      badge: "ESP32",
      badgeColor: "bg-white/[0.06] text-slate-400 border-white/[0.08]"
    },
    {
      id: "dashboard" as SidebarViewType,
      label: "Diagnostic Dashboard",
      icon: LayoutDashboard,
      badge: null,
      badgeColor: ""
    },
    {
      id: "about" as SidebarViewType,
      label: "Team & Academic Specs",
      icon: GraduationCap,
      badge: "ECE 515.2",
      badgeColor: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
    }
  ];

  const showLabels = !isCollapsed || isOpenMobile;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Structural Vertical Dock */}
      <aside
        data-sidebar
        className={`fixed lg:static top-0 left-0 z-50 h-full bg-[#0d1117]/95 backdrop-blur-xl border-r border-white/[0.08] flex flex-col justify-between p-3 select-none transition-all duration-200 shrink-0 ${
          isCollapsed ? "lg:w-16" : "lg:w-64"
        } ${
          isOpenMobile ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Navigation Block */}
        <div className="space-y-4">
          {/* Header & Dock Controls */}
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.08]">
            {(!isCollapsed || isOpenMobile) && (
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase">
                DIAGNOSTIC DOCK
              </span>
            )}

            {/* Desktop Structural Collapse Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-400 hover:text-[#00f2fe] border border-white/[0.08] transition-all ml-auto cursor-pointer"
              title={isCollapsed ? "Expand Dock" : "Collapse Dock"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[#00f2fe]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl hover:bg-[#21262d] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const showLabels = !isCollapsed || isOpenMobile;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  title={!showLabels ? item.label : undefined}
                  className={`w-full flex items-center ${
                    showLabels ? "justify-between px-3" : "justify-center px-0"
                  } py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-semibold shadow-[0_0_20px_rgba(0,242,254,0.1)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#161b22] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-[#00f2fe]" : "text-slate-400"
                      }`}
                    />
                    {showLabels && (
                      <span className="truncate font-sans tracking-tight text-left">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {showLabels && item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Defense Deck Quick Launch */}
            <Link
              href="/defense"
              title={!showLabels ? "Defense Presentation Deck" : undefined}
              className={`w-full flex items-center ${
                showLabels ? "justify-between px-3" : "justify-center px-0"
              } py-2.5 rounded-xl text-xs font-medium transition-all bg-gradient-to-r from-[#00f2fe]/10 to-[#10b981]/10 text-slate-200 hover:text-white border border-[#00f2fe]/20 hover:border-[#00f2fe]/40 mt-2`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Presentation className="w-4 h-4 text-[#00f2fe] shrink-0" />
                {showLabels && (
                  <span className="truncate font-sans font-semibold tracking-tight text-left">
                    Defense Deck
                  </span>
                )}
              </div>

              {showLabels && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/40 shrink-0">
                  8 SLIDES
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Footer Hardware Status Telemetry Card */}
        {!isCollapsed || isOpenMobile ? (
          <div className="p-3.5 rounded-2xl bg-[#161b22]/90 border border-white/[0.08] space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-[#00f2fe]" />
                Target IC
              </span>
              <span className="text-white font-semibold">ESP32-D0WD</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-[#10b981]" />
                Protocol
              </span>
              <span className="text-[#10b981] font-semibold">ESP-NOW / 2.4G</span>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                Forward-Chaining
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-2 py-2 border-t border-white/[0.08]"
            title="ESP32 Target Nominal"
          >
            <Cpu className="w-4 h-4 text-[#00f2fe]" />
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          </div>
        )}
      </aside>
    </>
  );
}
