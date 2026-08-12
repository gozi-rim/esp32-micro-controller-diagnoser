"use client";

import React, { useState } from "react";
import { DiagnosisNode } from "@/data/knowledgeBase";
import {
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  Copy,
  Check,
  RotateCcw,
  Download,
  Terminal,
  ShieldCheck,
  Cpu,
  Bookmark
} from "lucide-react";

interface DiagnosisReportViewProps {
  currentNode: DiagnosisNode;
  history: string[];
  customLogs?: string[];
  onReset: () => void;
  onLogSession?: (diagnosis: DiagnosisNode) => void;
}

export function DiagnosisReportView({
  currentNode,
  history,
  customLogs = [],
  onReset,
  onLogSession
}: DiagnosisReportViewProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportJSON = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      diagnosisId: currentNode.id,
      title: currentNode.title,
      category: currentNode.category,
      severity: currentNode.severity,
      symptomSummary: currentNode.symptomSummary,
      rootCause: currentNode.rootCause,
      engineeringSolution: currentNode.engineeringSolution,
      recordedTechnicianCustomLogs: customLogs,
      decisionPathHistory: history
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NetDiag-Report-${currentNode.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 2500);

    if (onLogSession) {
      onLogSession(currentNode);
    }
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-800/60 shadow-sm font-mono">
            <AlertOctagon className="w-3.5 h-3.5" />
            CRITICAL FAULT
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-800/60 shadow-sm font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            HARDWARE WARNING
          </span>
        );
      case "INFO":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-neon-cyan border border-cyan-800/60 shadow-sm font-mono">
            <Info className="w-3.5 h-3.5" />
            CONFIGURATION NOTICE
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Terminal Banner Header */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-green">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-green shrink-0 animate-bounce" />
          <div>
            <h3 className="text-sm font-bold font-mono tracking-wide uppercase">
              DETERMINISTIC DIAGNOSIS RESOLVED
            </h3>
            <p className="text-xs text-emerald-300/80">
              Rule-based inference engine identified root cause and remediation.
            </p>
          </div>
        </div>
        {renderSeverityBadge(currentNode.severity)}
      </div>

      {/* Main Bento Dashboard Grid */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Title, Symptom & Root Cause */}
        <div className="w-full lg:col-span-8 space-y-6">
          <div className="w-full bg-surface-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-green mb-2">
                <ShieldCheck className="w-4 h-4" />
                VERIFIED DIAGNOSIS
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-4">
                {currentNode.title}
              </h2>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300">
                <span className="font-semibold text-slate-200 block mb-1 font-mono text-xs uppercase text-slate-400">
                  Observed Symptom Summary:
                </span>
                {currentNode.symptomSummary}
              </div>
            </div>

            {/* Technician Custom Inputs Log Display */}
            {customLogs && customLogs.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-800/80 space-y-3">
                <h4 className="text-xs font-bold font-mono text-neon-cyan uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-neon-cyan" />
                  Recorded Technician Manual Inputs ({customLogs.length})
                </h4>
                <div className="space-y-2">
                  {customLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-neon-cyan text-[10px] font-bold border border-cyan-800 shrink-0">
                        Input #{idx + 1}
                      </span>
                      <span className="leading-relaxed font-sans">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Root Cause Breakdown */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-card-border space-y-2">
              <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Electronic Engineering Root Cause Analysis
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentNode.rootCause}
              </p>
            </div>
          </div>

          {/* Action Steps Checklist & Wiring / Code Fix */}
          <div className="w-full bg-surface-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-5 h-5 text-emerald-green" />
              Step-by-Step Engineering Remediation
            </h3>

            {/* Checklist */}
            <ul className="space-y-3">
              {currentNode.engineeringSolution.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-sm text-slate-200"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 text-neon-cyan text-xs font-mono font-bold shrink-0 border border-cyan-800/60">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ul>

            {/* Circuit Diagram Note */}
            {currentNode.engineeringSolution.circuitDiagramNote && (
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-900/50 text-xs sm:text-sm text-cyan-200 font-mono leading-relaxed">
                <span className="text-neon-cyan font-bold block mb-1 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Circuit Wiring &amp; Hardware Note:
                </span>
                {currentNode.engineeringSolution.circuitDiagramNote}
              </div>
            )}

            {/* Code Fix Snippet */}
            {currentNode.engineeringSolution.codeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-slate-900 border-x border-t border-card-border text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-2 text-slate-300 font-bold">
                    <Terminal className="w-4 h-4 text-neon-cyan" />
                    C++ / Arduino ESP32 Firmware Fix
                  </span>
                  <button
                    onClick={() =>
                      handleCopyCode(
                        currentNode.engineeringSolution.codeSnippet!
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-xs font-mono"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-green" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-b-xl bg-slate-950 border border-card-border text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{currentNode.engineeringSolution.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Summary Card & Actions */}
        <div className="w-full lg:col-span-4 space-y-6">
          <div className="w-full bg-surface-card border border-card-border rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-neon-cyan mb-2">
                <Bookmark className="w-4 h-4" />
                SOLUTION SUMMARY
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Action Plan Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentNode.engineeringSolution.summary}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                onClick={handleExportJSON}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-neon-cyan border border-cyan-800/80 font-mono text-xs font-bold transition-all shadow-md"
              >
                {isExported ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-green" />
                    Report Exported!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export Diagnostic JSON
                  </>
                )}
              </button>

              <button
                onClick={onReset}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-emerald-900/40"
              >
                <RotateCcw className="w-4 h-4" />
                Start New Diagnosis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
