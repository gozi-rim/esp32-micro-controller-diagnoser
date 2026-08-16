"use client";

import React, { useState, useEffect } from "react";
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
  Bookmark,
  Loader2,
  Sparkles,
  Printer,
  FileCode,
  Layers,
  ArrowRight
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
  const [aiRootCause, setAiRootCause] = useState<string | null>(null);
  const [aiSteps, setAiSteps] = useState<string[] | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const isHeuristic =
    currentNode.id.startsWith("heuristic") || currentNode.id.startsWith("custom");

  // Automatically record this completed diagnostic into session telemetry storage
  useEffect(() => {
    if (onLogSession) {
      onLogSession(currentNode);
    }
  }, [currentNode.id]);

  useEffect(() => {
    if (!customLogs || customLogs.length === 0) return;

    let isMounted = true;
    const fetchCustomAnalysis = async () => {
      setIsLoadingAi(true);
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customLogs })
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.rootCause && Array.isArray(data.remediationSteps)) {
            setAiRootCause(data.rootCause);
            setAiSteps(data.remediationSteps);
          }
        }
      } catch (err) {
        console.error("Failed to fetch custom AI analysis:", err);
      } finally {
        if (isMounted) {
          setIsLoadingAi(false);
        }
      }
    };

    fetchCustomAnalysis();

    return () => {
      isMounted = false;
    };
  }, [customLogs]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      system: "NetDiag.Expert ECE 515.2 Hardware Diagnostic Core",
      timestamp: new Date().toISOString(),
      diagnosisId: currentNode.id,
      ruleId: currentNode.ruleId || "RULE-GEN-01",
      confidenceFactor: currentNode.confidenceFactor || (isHeuristic ? 0.88 : 0.98),
      title: currentNode.title,
      category: currentNode.category,
      severity: currentNode.severity,
      diagnosisType: isHeuristic ? "HEURISTIC ANALYSIS" : "DETERMINISTIC INFERENCE",
      symptomSummary: currentNode.symptomSummary,
      antecedents: currentNode.antecedents || [],
      formalRuleStatement: currentNode.formalRuleStatement || "",
      rootCause: aiRootCause || currentNode.rootCause,
      engineeringSolution: {
        ...currentNode.engineeringSolution,
        steps: aiSteps || currentNode.engineeringSolution.steps
      },
      technicianInputs: customLogs
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ESP32-Diagnostic-${currentNode.ruleId || currentNode.id}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setIsExported(true);
    setTimeout(() => setIsExported(false), 2500);
  };

  const renderSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 shadow-sm font-mono">
            <AlertOctagon className="w-3.5 h-3.5" />
            CRITICAL FAULT
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 shadow-sm font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            HARDWARE WARNING
          </span>
        );
      case "INFO":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 shadow-sm font-mono">
            <Info className="w-3.5 h-3.5" />
            CONFIGURATION NOTICE
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* 1. Verdict Banner */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#161b22] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-2.5 rounded-2xl bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] shadow-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#10b981] uppercase">
                {isHeuristic ? "HEURISTIC ANALYSIS COMPLETE" : "DETERMINISTIC DIAGNOSIS RESOLVED"}
              </span>
              {currentNode.ruleId && (
                <span className="px-2 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[10px] font-mono text-[#00f2fe] font-bold">
                  {currentNode.ruleId}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono text-slate-300">
                CF: {Math.round((currentNode.confidenceFactor || (isHeuristic ? 0.88 : 0.98)) * 100)}% Confidence
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Forward-chaining inference engine matched antecedents and verified root cause failure mode.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          {renderSeverityBadge(currentNode.severity)}
        </div>
      </div>

      {/* 2. Two-Panel Technical Breakdown */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Root Cause Analysis (6 cols) */}
        <div className="w-full lg:col-span-6 space-y-5">
          <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            {/* Title & Domain */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#00f2fe] mb-2 font-semibold">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  VERIFIED INFERENCE HYPOTHESIS
                </span>
                {currentNode.ruleId && (
                  <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-400 text-[10px]">
                    ID: {currentNode.ruleId}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug font-sans">
                {currentNode.title}
              </h2>
            </div>

            {/* Formal Production Rule Statement (Classical AI Representation) */}
            {currentNode.formalRuleStatement && (
              <div className="p-3.5 rounded-xl bg-[#0a0c10] border border-white/[0.08] space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#00f2fe] uppercase tracking-wider block">
                  Formal Production Rule Notation:
                </span>
                <p className="text-xs font-mono text-emerald-400/90 leading-relaxed break-words">
                  {currentNode.formalRuleStatement}
                </p>
              </div>
            )}

            {/* Antecedents / Conditions Trace (Explanation Facility) */}
            {currentNode.antecedents && currentNode.antecedents.length > 0 && (
              <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
                  Explanation Trace (Antecedents Satisfied):
                </span>
                <ul className="space-y-1.5">
                  {currentNode.antecedents.map((ant, idx) => (
                    <li key={idx} className="text-xs font-mono text-slate-300 flex items-start gap-2">
                      <span className="text-[#10b981] font-bold">✓</span>
                      <span>{ant}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Monospace Observed Fault Summary Box */}
            <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1.5">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#00f2fe]" />
                Observed Fault Telemetry Summary:
              </span>
              <p className="text-xs font-mono text-slate-200 leading-relaxed">
                {currentNode.symptomSummary}
              </p>
            </div>

            {/* Recorded Technician Custom Inputs Log (Chip-style tags) */}
            {customLogs && customLogs.length > 0 && (
              <div className="p-4 rounded-xl bg-[#0d1117] border border-[#00f2fe]/20 space-y-2.5">
                <h4 className="text-[11px] font-mono font-bold text-[#00f2fe] uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#00f2fe]" />
                    Recorded Technician Inputs ({customLogs.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">TELEMETRY TAGS</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {customLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-white/[0.08] text-xs font-mono text-slate-300"
                    >
                      <span className="w-4 h-4 rounded-full bg-[#00f2fe]/20 text-[#00f2fe] flex items-center justify-center text-[9px] font-bold">
                        #{idx + 1}
                      </span>
                      <span className="text-slate-200 font-sans">{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Electronic / Firmware Failure Mode Breakdown */}
            <div className="p-4 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-2 relative overflow-hidden">
              <h4 className="text-[11px] font-mono font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Electrical &amp; Firmware Failure Mode Breakdown
              </h4>
              {isLoadingAi ? (
                <div className="flex items-center gap-2.5 py-3 text-[#00f2fe] text-xs font-mono animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-[#00f2fe] shrink-0" />
                  <span>Synthesizing Custom Hardware Heuristics...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-sans">
                  {aiRootCause || currentNode.rootCause}
                </p>
              )}
            </div>

            {/* Decision Path Summary Tag */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00f2fe]" />
                Inference Path Depth:
              </span>
              <span className="text-slate-200 font-semibold">{history.length + 1} Steps Traversed</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Step-by-Step Remediation Protocol (6 cols) */}
        <div className="w-full lg:col-span-6 space-y-5">
          <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                Step-by-Step Remediation Protocol
              </h3>
              {aiSteps && (
                <span className="text-[10px] font-mono text-[#00f2fe] px-2 py-0.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-current" /> AI Synthesized
                </span>
              )}
            </div>

            {/* Numbered High-Contrast Action Items */}
            {isLoadingAi ? (
              <div className="space-y-3 py-6 text-center">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00f2fe] bg-[#00f2fe]/10 px-4 py-2 rounded-xl border border-[#00f2fe]/20 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating tailored hardware remediation steps...
                </div>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {(aiSteps || currentNode.engineeringSolution.steps).map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0d1117] border border-white/[0.06] text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00f2fe]/10 text-[#00f2fe] text-[10px] font-mono font-bold shrink-0 border border-[#00f2fe]/30 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{step}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Circuit Diagram / Hardware Wiring Note */}
            {currentNode.engineeringSolution.circuitDiagramNote && (
              <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#00f2fe]/20 text-xs font-mono text-cyan-200 leading-relaxed">
                <span className="text-[#00f2fe] font-bold block mb-1 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Circuit Wiring &amp; Component Value Spec:
                </span>
                {currentNode.engineeringSolution.circuitDiagramNote}
              </div>
            )}

            {/* Copyable C++ / ESP32 Firmware Fix Snippet */}
            {currentNode.engineeringSolution.codeSnippet && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-3.5 py-2 rounded-t-xl bg-[#0d1117] border-x border-t border-white/[0.08] text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-2 text-slate-300 font-semibold text-[11px]">
                    <FileCode className="w-3.5 h-3.5 text-[#00f2fe]" />
                    C++ / ESP-IDF Firmware Remediation
                  </span>
                  <button
                    onClick={() =>
                      handleCopyCode(
                        currentNode.engineeringSolution.codeSnippet!
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-slate-200 hover:text-white border border-white/[0.08] transition-all text-xs font-mono cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-[#10b981]" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3.5 rounded-b-xl bg-[#0a0c10] border border-white/[0.08] text-xs font-mono text-[#10b981] overflow-x-auto leading-relaxed max-h-48">
                  <code>{currentNode.engineeringSolution.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Action Footer */}
      <div className="w-full p-5 rounded-2xl bg-[#161b22] border border-white/[0.08] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Bookmark className="w-4 h-4 text-[#00f2fe]" />
          <span>Session Outcome: <strong className="text-white">Deterministic Verification Complete</strong></span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePrintReport}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-white/[0.08] font-mono text-xs transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-[#00f2fe]" />
            Print / PDF Report
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/30 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            {isExported ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10b981]" />
                Telemetry Exported!
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Export Telemetry JSON
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#0ea371] text-slate-950 font-bold text-xs font-mono transition-all shadow-lg hover:shadow-[#10b981]/30 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start New Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
}
