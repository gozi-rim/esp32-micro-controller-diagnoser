"use client";

import React from "react";
import {
  LayoutDashboard,
  Activity,
  History,
  BookOpen,
  GraduationCap,
  Cpu,
  ShieldCheck,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from "lucide-react";

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeView: "dashboard" | "diagnostic" | "logs" | "knowledge_base" | "about";
  onSelectView: (view: "dashboard" | "diagnostic" | "logs" | "knowledge_base" | "about") => void;
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
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "diagnostic",
      label: "Active Diagnostic",
      icon: Activity,
      badge: isDiagnosticActive ? "RUNNING" : "READY"
    },
    {
      id: "logs",
      label: "Hardware Logs",
      icon: History,
      badge: "5 Logs"
    },
    {
      id: "knowledge_base",
      label: "Knowledge Base",
      icon: BookOpen,
      badge: "5 Trees"
    },
    {
      id: "about",
      label: "About System",
      icon: GraduationCap,
      badge: "ECE 515.2"
    }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Structural Collapsible Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full bg-slate-950/95 lg:bg-slate-950/80 backdrop-blur-md border-r border-card-border flex flex-col justify-between p-3 select-none transition-all duration-300 shrink-0 ${
          // Desktop width handling: w-64 when expanded, w-16 when collapsed
          isCollapsed ? "lg:w-16" : "lg:w-64"
        } ${
          // Mobile slide-over position
          isOpenMobile ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Section: Navigation Header & Collapse Toggle */}
        <div className="space-y-4">
          {/* Header & Toggle Controls */}
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-card-border/60">
            {/* Expanded Title / Logo Label */}
            {(!isCollapsed || isOpenMobile) && (
              <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                MAIN NAVIGATION
              </span>
            )}

            {/* Desktop Structural Collapse Toggle Button */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg bg-surface-card hover:bg-slate-800 text-slate-400 hover:text-neon-cyan border border-card-border transition-colors ml-auto"
              title={isCollapsed ? "Expand Sidebar (Ctrl+B)" : "Collapse Sidebar (Ctrl+B)"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-neon-cyan" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              const showLabels = !isCollapsed || isOpenMobile;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id as any);
                    onCloseMobile();
                  }}
                  title={!showLabels ? item.label : undefined}
                  className={`w-full flex items-center ${
                    showLabels ? "justify-between px-3" : "justify-center px-0"
                  } py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? "bg-cyan-950/80 text-neon-cyan border border-cyan-800/80 shadow-lg shadow-cyan-950/40 font-bold"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-neon-cyan" : "text-slate-400"}`} />
                    {showLabels && <span>{item.label}</span>}
                  </div>

                  {showLabels && item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.badge === "RUNNING"
                          ? "bg-emerald-950 text-emerald-green border border-emerald-800 animate-pulse"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Section: Hardware Status Telemetry Card */}
        {(!isCollapsed || isOpenMobile) ? (
          <div className="p-3 rounded-xl bg-surface-card border border-card-border space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-neon-cyan" />
                Target Micro
              </span>
              <span className="text-neon-cyan font-bold">ESP32-D0WD</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-emerald-green" />
                Protocol
              </span>
              <span className="text-emerald-green font-bold">ESP-NOW / 802.11</span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Forward-Chaining</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-green" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2 border-t border-slate-800/60" title="ESP32-D0WD Target Active">
            <Cpu className="w-4 h-4 text-neon-cyan" />
            <span className="w-2 h-2 rounded-full bg-emerald-green animate-pulse" />
          </div>
        )}
      </aside>
    </>
  );
}
