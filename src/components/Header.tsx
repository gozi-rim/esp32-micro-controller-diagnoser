"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  RotateCcw,
  Cpu,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Activity,
  Radio,
  X,
  Check,
  Lock,
  Unlock,
  ShieldCheck,
  BookOpen,
  Terminal,
  Save,
  Key
} from "lucide-react";

import { useAuth } from "@/components/AuthContext";

export interface HardwareConfig {
  targetMcu: string;
  supplyRail: string;
  rfProtocol: string;
  baudRate: number;
}

export interface TechnicianProfile {
  name: string;
  matricNo: string;
  labStation: string;
  institution: string;
}

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onResetDiagnostic: () => void;
  historyLength: number;
  currentCategoryName?: string;
  activeView: string;
  onHardwareConfigChange?: (config: HardwareConfig) => void;
  onSignOut?: () => void;
}

export function Header({
  onToggleMobileSidebar,
  onResetDiagnostic,
  historyLength,
  currentCategoryName,
  activeView,
  onHardwareConfigChange,
  onSignOut
}: HeaderProps) {
  const { user } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Modals state
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSessionLocked, setIsSessionLocked] = useState(false);
  const [unlockPin, setUnlockPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Hardware Config State
  const [hardwareConfig, setHardwareConfig] = useState<HardwareConfig>({
    targetMcu: "ESP32-WROOM-32",
    supplyRail: "3.3V (AMS1117 LDO)",
    rfProtocol: "ESP-NOW (802.11 Action Frames)",
    baudRate: 115200
  });

  // Technician Profile State
  const [technicianProfile, setTechnicianProfile] = useState<TechnicianProfile>({
    name: user?.name || "Onyenaucheya Blessed Chimgozirim",
    matricNo: user?.matric || "U2021/3020046",
    labStation: "Hardware Lab 3, Bench 7",
    institution: "University of Port Harcourt"
  });

  // Sync profile when authenticated user changes
  useEffect(() => {
    if (user) {
      setTechnicianProfile((prev) => ({
        ...prev,
        name: user.name,
        matricNo: user.matric,
      }));
    }
  }, [user]);

  const [isSavedToast, setIsSavedToast] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    try {
      const savedHw = localStorage.getItem("netdiag_hardware_config");
      if (savedHw) setHardwareConfig(JSON.parse(savedHw));

      if (!user) {
        const savedProf = localStorage.getItem("netdiag_technician_profile");
        if (savedProf) setTechnicianProfile(JSON.parse(savedProf));
      }
    } catch (e) {
      console.error("Failed to load local settings:", e);
    }
  }, [user]);

  const saveHardwareConfig = (config: HardwareConfig) => {
    setHardwareConfig(config);
    localStorage.setItem("netdiag_hardware_config", JSON.stringify(config));
    if (onHardwareConfigChange) onHardwareConfigChange(config);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      setIsHardwareModalOpen(false);
    }, 1200);
  };

  const saveTechnicianProfile = (profile: TechnicianProfile) => {
    setTechnicianProfile(profile);
    localStorage.setItem("netdiag_technician_profile", JSON.stringify(profile));
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      setIsProfileModalOpen(false);
    }, 1200);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockPin.trim() === "5152" || unlockPin.trim() === "1234" || unlockPin.trim() === "") {
      setIsSessionLocked(false);
      setUnlockPin("");
      setPinError(false);
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const isDiagnosticActive =
    activeView === "diagnostic" || (historyLength > 0 && activeView === "diagnostic");

  // Derive clean view label
  const viewLabel = (() => {
    switch (activeView) {
      case "dashboard": return "Dashboard";
      case "serial_monitor": return "Serial Monitor";
      case "logs": return "Session Logs";
      case "knowledge_base": return "Knowledge Base";
      case "specs": return "System Architecture";
      case "about": return "About";
      case "diagnostic":
        if (currentCategoryName && currentCategoryName !== "root") {
          return currentCategoryName.charAt(0).toUpperCase() + currentCategoryName.slice(1);
        }
        return "Diagnostic";
      default: return "Diagnostic";
    }
  })();

  return (
    <>
      <header data-header className="sticky top-0 z-30 w-full h-14 bg-[#0a0c10]/80 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-5 flex items-center justify-between shrink-0 select-none">
        {/* Left: Hamburger (mobile) + Wordmark */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 -ml-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          <div className="hidden sm:flex items-center gap-0 leading-none">
            <span className="text-[13px] font-semibold tracking-tight text-slate-200 font-sans">
              NetDiag
            </span>
            <span className="text-[13px] font-semibold tracking-tight text-[#00f2fe] font-sans">
              .Expert
            </span>
          </div>
        </div>

        {/* Center: Clean breadcrumb */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1.5 text-[13px] font-sans text-slate-500">
          <span className="text-slate-500">ECE 515</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-medium">{viewLabel}</span>
          {activeView === "diagnostic" && historyLength > 0 && (
            <>
              <span className="text-slate-600 ml-0.5">·</span>
              <span className="text-slate-400 text-xs tabular-nums">Step {historyLength + 1}</span>
            </>
          )}
        </div>

        {/* Right: Reset + Avatar */}
        <div className="flex items-center gap-1.5">
          {/* Reset — icon-only, appears only during active diagnostic */}
          {isDiagnosticActive && (
            <button
              onClick={onResetDiagnostic}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
              title="Reset diagnostic session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* User avatar */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 py-1.5 pl-1.5 pr-2.5 rounded-full hover:bg-white/[0.04] transition-colors text-[13px] font-sans text-slate-300 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/25 flex items-center justify-center text-[#00f2fe] text-[11px] font-semibold">
                {technicianProfile.name.charAt(0) || "T"}
              </div>
              <span className="hidden lg:inline font-medium text-slate-300 truncate max-w-[100px]">
                {technicianProfile.name.split(" ")[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* Dropdown */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#161b22] border border-white/[0.1] shadow-2xl p-1.5 z-50 text-[13px] font-sans space-y-0.5 animate-fadeIn">
                <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                  <p className="font-medium text-white text-[13px] truncate">{technicianProfile.name}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{technicianProfile.matricNo}</p>
                </div>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.04] text-slate-300 text-left transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setIsHardwareModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.04] text-slate-300 text-left transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  Hardware Config
                </button>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    setIsDocsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/[0.04] text-slate-300 text-left transition-colors cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Documentation
                </button>

                <div className="pt-1 mt-0.5 border-t border-white/[0.06] space-y-0.5">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      setIsSessionLocked(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400/80 hover:text-rose-400 text-left transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Lock Terminal
                  </button>
                  {onSignOut && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400/80 hover:text-rose-400 text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 1. HARDWARE CONFIGURATION MODAL */}
      {isHardwareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#161b22] border border-white/[0.12] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe]">
                <Settings className="w-4 h-4" />
                HARDWARE TARGET CONFIGURATION
              </div>
              <button
                onClick={() => setIsHardwareModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1.5">Target Microcontroller</label>
                <select
                  value={hardwareConfig.targetMcu}
                  onChange={(e) => setHardwareConfig({ ...hardwareConfig, targetMcu: e.target.value })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                >
                  <option value="ESP32-WROOM-32">ESP32-WROOM-32 (Xtensa Dual-Core 240MHz)</option>
                  <option value="ESP32-S3">ESP32-S3 (Dual-Core LX7 + AI Vector)</option>
                  <option value="ESP32-C3">ESP32-C3 (RISC-V 32-bit 160MHz)</option>
                  <option value="ESP32-CAM">ESP32-CAM (AI-Thinker OV2640)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1.5">Power Supply Rail</label>
                <select
                  value={hardwareConfig.supplyRail}
                  onChange={(e) => setHardwareConfig({ ...hardwareConfig, supplyRail: e.target.value })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                >
                  <option value="3.3V (AMS1117 LDO)">3.3V (Onboard AMS1117 Linear Regulator)</option>
                  <option value="5.0V (USB VBUS)">5.0V (Direct USB Power Rail)</option>
                  <option value="3.7V (18650 Li-Ion)">3.7V (18650 Li-Ion Cell with LDO)</option>
                  <option value="DC-DC Buck (MP1584)">3.3V (External High-Efficiency DC-DC Buck)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1.5">Active RF Protocol</label>
                <select
                  value={hardwareConfig.rfProtocol}
                  onChange={(e) => setHardwareConfig({ ...hardwareConfig, rfProtocol: e.target.value })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                >
                  <option value="ESP-NOW (802.11 Action Frames)">ESP-NOW (802.11 Vendor-Specific Action Frames)</option>
                  <option value="Wi-Fi Station (802.11 b/g/n)">Wi-Fi Station Mode (STA 2.4GHz)</option>
                  <option value="Wi-Fi SoftAP">Wi-Fi Access Point Mode (SoftAP)</option>
                  <option value="BLE 4.2 / 5.0">Bluetooth Low Energy (BLE)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1.5">Serial Baud Rate</label>
                <select
                  value={hardwareConfig.baudRate}
                  onChange={(e) => setHardwareConfig({ ...hardwareConfig, baudRate: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                >
                  <option value={115200}>115200 (Standard Diagnostic Monitor)</option>
                  <option value={921600}>921600 (High-Speed Flashing & Core Dump)</option>
                  <option value={74880}>74880 (ESP Bootloader ROM Baud)</option>
                  <option value={9600}>9600 (Legacy UART)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-3">
              <button
                onClick={() => setIsHardwareModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0d1117] hover:bg-[#21262d] text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => saveHardwareConfig(hardwareConfig)}
                className="px-5 py-2 rounded-xl bg-[#00f2fe] text-slate-950 font-bold text-xs font-mono hover:bg-[#00f2fe]/90 flex items-center gap-1.5"
              >
                {isSavedToast ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {isSavedToast ? "Saved!" : "Save Configuration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AI EXPERT SYSTEM DOCS MODAL */}
      {isDocsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#161b22] border border-white/[0.12] rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe]">
                <BookOpen className="w-4 h-4" />
                ECE 515.2 EXPERT SYSTEM ARCHITECTURE SPECIFICATION
              </div>
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-2">
                <h4 className="font-mono font-bold text-white text-xs uppercase text-[#00f2fe]">
                  1. Forward-Chaining Inference Engine
                </h4>
                <p>
                  NetDiag.Expert employs a data-driven forward-chaining inference mechanism. The system begins with observed hardware telemetry facts (symptoms, electrical voltage levels, serial monitor crash codes) and applies formal production rules (<code className="text-emerald-400 font-mono">IF &lt;Antecedents&gt; THEN &lt;Hypothesis&gt;</code>) to infer the root cause failure state.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-2">
                <h4 className="font-mono font-bold text-white text-xs uppercase text-[#10b981]">
                  2. Certainty Factor (CF) Uncertainty Handling
                </h4>
                <p>
                  In accordance with MYCIN-style certainty factor theory, each terminal diagnosis node carries an explicit Confidence Factor (<code className="text-emerald-400 font-mono">CF: 0.0 – 1.0</code>). Deterministic electrical rule matches score <code className="text-[#10b981] font-mono">0.95 – 0.99</code>, while heuristic machine-learning syntheses score <code className="text-[#00f2fe] font-mono">0.85 – 0.88</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-2">
                <h4 className="font-mono font-bold text-white text-xs uppercase text-[#f59e0b]">
                  3. Explanation Facility (WHY / HOW Trace)
                </h4>
                <p>
                  Classical expert systems must justify their conclusions. This engine provides a dynamic <em>Explanation Trace</em> presenting all satisfied antecedent conditions and the exact physical reasoning why each measurement was requested.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setIsDocsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#00f2fe] text-slate-950 font-bold text-xs font-mono hover:bg-[#00f2fe]/90"
              >
                Close Documentation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TECHNICIAN PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#161b22] border border-white/[0.12] rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe]">
                <User className="w-4 h-4" />
                TECHNICIAN PROFILE SETTINGS
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Technician Full Name</label>
                <input
                  type="text"
                  value={technicianProfile.name}
                  onChange={(e) => setTechnicianProfile({ ...technicianProfile, name: e.target.value })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Matriculation / ID Number</label>
                <input
                  type="text"
                  value={technicianProfile.matricNo}
                  onChange={(e) => setTechnicianProfile({ ...technicianProfile, matricNo: e.target.value })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Laboratory / Station ID</label>
                <input
                  type="text"
                  value={technicianProfile.labStation}
                  onChange={(e) => setTechnicianProfile({ ...technicianProfile, labStation: e.target.value })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                />
              </div>

              <div>
                <label className="text-slate-400 uppercase text-[10px] block mb-1">Academic Institution</label>
                <input
                  type="text"
                  value={technicianProfile.institution}
                  onChange={(e) => setTechnicianProfile({ ...technicianProfile, institution: e.target.value })}
                  className="w-full p-2.5 bg-[#0d1117] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-[#00f2fe]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-3">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#0d1117] hover:bg-[#21262d] text-slate-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => saveTechnicianProfile(technicianProfile)}
                className="px-5 py-2 rounded-xl bg-[#00f2fe] text-slate-950 font-bold text-xs font-mono hover:bg-[#00f2fe]/90 flex items-center gap-1.5"
              >
                {isSavedToast ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {isSavedToast ? "Saved!" : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. LAB TERMINAL LOCK SCREEN OVERLAY */}
      {isSessionLocked && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#0a0c10] backdrop-blur-3xl animate-fadeIn text-center space-y-6 select-none">
          <div className="p-4 rounded-3xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-pulse">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-1.5 max-w-md">
            <h2 className="text-2xl font-bold text-white font-sans">Lab Terminal Locked</h2>
            <p className="text-xs text-slate-400 font-mono">
              Diagnostic session secured for {technicianProfile.name} ({technicianProfile.matricNo}).
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Enter PIN <span className="text-[#00f2fe]">5152</span> or leave empty and click Unlock to resume.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-3">
            <div className="relative">
              <input
                type="password"
                value={unlockPin}
                onChange={(e) => setUnlockPin(e.target.value)}
                placeholder="Enter PIN (Default: 5152)..."
                className={`w-full p-3 bg-[#161b22] border rounded-xl text-center text-white font-mono text-sm tracking-widest focus:outline-none ${
                  pinError ? "border-rose-500" : "border-white/[0.12] focus:border-[#00f2fe]"
                }`}
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-rose-400 text-xs font-mono animate-bounce">
                Invalid PIN code. Try 5152 or empty PIN.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#00f2fe] hover:bg-[#00f2fe]/90 text-slate-950 font-bold font-mono text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              Unlock Diagnostic Core
            </button>
          </form>
        </div>
      )}
    </>
  );
}
