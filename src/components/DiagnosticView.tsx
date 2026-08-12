"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  knowledgeBase,
  KnowledgeNode,
  QuestionNode,
  DiagnosisNode
} from "@/data/knowledgeBase";
import { ESP32Diagram } from "./ESP32Diagram";
import {
  Search,
  ArrowLeft,
  ChevronRight,
  Layers,
  Activity,
  Zap,
  Radio,
  Wifi,
  Cpu,
  FilterX,
  Sparkles,
  Bot,
  Loader2,
  PlusCircle,
  Edit3
} from "lucide-react";

interface DiagnosticViewProps {
  currentNodeId: string;
  history: string[];
  customLogs?: string[];
  onAddCustomLog?: (logText: string) => void;
  onSelectOption: (nextNodeId: string) => void;
  onCustomDiagnosis: (customNode: DiagnosisNode) => void;
  onGoBack: () => void;
  onReset: () => void;
}

export function DiagnosticView({
  currentNodeId,
  history,
  customLogs = [],
  onAddCustomLog,
  onSelectOption,
  onCustomDiagnosis,
  onGoBack,
  onReset
}: DiagnosticViewProps) {
  const [symptomInput, setSymptomInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [isCustomCardActive, setIsCustomCardActive] = useState(false);
  const [cardInputText, setCardInputText] = useState("");
  const [selectedModel, setSelectedModel] = useState<"nvidia-llama" | "nvidia-deepseek">("nvidia-llama");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(
    "Extracting hardware parameters..."
  );

  const currentNode: KnowledgeNode = knowledgeBase.nodes[currentNodeId];
  const isQuestion = currentNode?.type === "question";

  // Filter options based on hybrid text input
  const filteredOptions = useMemo(() => {
    if (!isQuestion) return [];
    const options = (currentNode as QuestionNode).options;

    if (!symptomInput.trim()) return options;

    const query = symptomInput.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.description && opt.description.toLowerCase().includes(query))
    );
  }, [currentNode, isQuestion, symptomInput]);

  // Generate live telemetry mock values based on active category
  const telemetry = useMemo(() => {
    const cat = currentNode?.category;
    switch (cat) {
      case "brownout":
        return { vdd: "2.54 V (CRITICAL DIP)", rssi: "-68 dBm", ch: "Ch 6", heap: "184 KB", loss: "35%" };
      case "espnow":
        return { vdd: "3.28 V (STABLE)", rssi: "-72 dBm", ch: "Ch 1 (UNSYNCED)", heap: "210 KB", loss: "100%" };
      case "wifi":
        return { vdd: "3.31 V (STABLE)", rssi: "-81 dBm", ch: "Ch 6 (DFS)", heap: "112 KB (WDT)", loss: "65%" };
      case "gpio":
        return { vdd: "3.30 V (OVERVOLT)", rssi: "-70 dBm", ch: "Ch 1", heap: "220 KB", loss: "0%" };
      case "antenna":
        return { vdd: "3.29 V (STABLE)", rssi: "-94 dBm (WEAK)", ch: "Ch 11", heap: "240 KB", loss: "82%" };
      default:
        return { vdd: "3.30 V", rssi: "-65 dBm", ch: "Ch 1", heap: "245 KB", loss: "0%" };
    }
  }, [currentNode]);

  useEffect(() => {
    setIsCustomCardActive(false);
    setCardInputText("");
  }, [currentNodeId]);

  // Handle custom card input submit (routing through fallback tree or triggering heuristic AI)
  const handleCustomCardSubmit = async () => {
    if (!cardInputText.trim()) return;

    const trimmed = cardInputText.trim();
    if (onAddCustomLog) {
      onAddCustomLog(trimmed);
    }

    setIsCustomCardActive(false);
    setCardInputText("");

    // Determine target fallback route step
    let nextStep = "custom_step_2";
    if (currentNodeId === "custom_step_2") {
      nextStep = "custom_step_3";
    } else if (currentNodeId === "custom_step_3") {
      nextStep = "custom_diag_final";
    }

    if (nextStep === "custom_diag_final") {
      // Trigger issue-specific AI heuristic analysis for final custom diagnosis
      const combinedSymptoms = [...(customLogs || []), trimmed].join(" | ");
      setIsAnalyzing(true);
      setLoadingStage("Cross-referencing custom hardware symptoms with heuristic engine...");

      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symptom: combinedSymptoms,
            category: "custom",
            modelId: selectedModel
          })
        });

        const data = await res.json();
        setIsAnalyzing(false);

        const customDiagnosisNode: DiagnosisNode = {
          id: `custom_diag_${Date.now()}`,
          type: "diagnosis",
          category: "custom",
          title: data.diagnosisTitle || `Custom Diagnosis: ${trimmed.slice(0, 30)}`,
          diagnosis: data.diagnosisTitle || `Custom Diagnosis: ${trimmed}`,
          symptomSummary: combinedSymptoms,
          rootCause: data.rootCause || "Custom unmapped hardware fault detected across microcontroller interface pins.",
          severity: "WARNING",
          engineeringSolution: {
            summary: typeof data.engineeringSolution === "string" ? data.engineeringSolution.slice(0, 150) + "..." : "Perform custom hardware isolation.",
            steps: typeof data.engineeringSolution === "string" && data.engineeringSolution.includes("\n")
              ? data.engineeringSolution.split("\n").filter((s: string) => s.trim().length > 0)
              : [
                  "Disconnect all external sensors, displays, and relays from ESP32 GPIO pins.",
                  "Reflash a minimal 'Blink' or basic serial output sketch to test core MCU sanity.",
                  "Measure VDD 3.3V rail voltage under load."
                ],
            circuitDiagramNote: "Verify decoupling capacitance (100uF + 0.1uF) near VDD pins.",
            codeSnippet: "// Core Isolation Test Firmware\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(\"--- Custom Fault Sanity Test ---\");\n}\nvoid loop() {\n  Serial.printf(\"Free Heap: %d bytes\\n\", ESP.getFreeHeap());\n  delay(1000);\n}"
          }
        };

        onCustomDiagnosis(customDiagnosisNode);
      } catch (err) {
        setIsAnalyzing(false);
        onSelectOption("custom_diag_final");
      }
    } else {
      onSelectOption(nextStep);
    }
  };

  // Handle deterministic progression trigger
  const handleOptionSelect = (optionId: string) => {
    const option = (currentNode as QuestionNode).options.find(
      (opt) => opt.id === optionId
    );
    if (option) {
      onSelectOption(option.nextNodeId);
      setSymptomInput("");
      setInputError("");
    }
  };

  // Parsing logic for keyword-matching algorithm
  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    const userInputLower = symptomInput.toLowerCase();
    const matchedOption = (currentNode as QuestionNode).options.find((option) => {
      const keywords: string[] = (option as any).keywords || [];
      return keywords.some((keyword) =>
        userInputLower.includes(keyword.toLowerCase())
      );
    });

    if (matchedOption) {
      handleOptionSelect(matchedOption.id);
    } else {
      setInputError(
        "No exact deterministic match found in the hardware knowledge base. Please select from the predefined options below."
      );
    }
  };

  // Trigger Heuristic AI Analysis with selected model
  const handleRunHeuristicAnalysis = async () => {
    setIsAnalyzing(true);
    setLoadingStage("Extracting hardware parameters...");

    const stageTimer = setTimeout(() => {
      setLoadingStage(
        `Cross-referencing domain vectors via ${
          selectedModel === "nvidia-deepseek" ? "DeepSeek-R1" : "Llama-3.1-70B"
        }...`
      );
    }, 800);

    try {
      // Call backend /api/diagnose route with modelId payload
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptom: symptomInput,
          category: currentNode?.category,
          modelId: selectedModel
        })
      });

      const data = await res.json();
      clearTimeout(stageTimer);

      let title = data.diagnosisTitle;
      let cause = data.rootCause;
      let solutionText = data.engineeringSolution;

      // Intelligent Keyword Parser Fallback logic
      const qLower = symptomInput.toLowerCase();
      if (qLower.includes("heat") || qLower.includes("hot") || qLower.includes("burn")) {
        title = title || "Thermal Throttling & Power Rail Over-Voltage";
        cause = cause || `Excessive thermal dissipation detected on Vin/VDD. Input voltage exceeds LDO rating or short circuit is sinking excess current.`;
      } else if (qLower.includes("drop") || qLower.includes("disconnect") || qLower.includes("fail")) {
        title = title || "RF Spectrum Noise / Transient Power Instability";
        cause = cause || `Severe 2.4GHz ISM band co-channel interference or momentary VDD supply drop during peak transmission.`;
      } else if (!title) {
        title = "General Hardware Fault & Signal Anomaly";
        cause = `Symptom '${symptomInput}' does not match standard deterministic trees. Unstable clocking, high-impedance floating pin, or power ripple suspected.`;
      }

      const steps = typeof solutionText === "string" && solutionText.includes("\n")
        ? solutionText.split("\n").filter((s) => s.trim().length > 0)
        : [
            typeof solutionText === "string" ? solutionText : "Verify 3.3V power supply rail stability under load using an oscilloscope.",
            "Inspect all 5V signal inputs for necessary logic level shifters.",
            "Monitor serial output at 115200 baud for bootloader crash codes."
          ];

      const customDiagnosisNode: DiagnosisNode = {
        id: `heuristic_${Date.now()}`,
        type: "diagnosis",
        category: currentNode?.category !== "root" ? (currentNode?.category as any) : "brownout",
        title: title,
        diagnosis: title,
        symptomSummary: symptomInput,
        rootCause: cause,
        severity: "WARNING",
        engineeringSolution: {
          summary: typeof solutionText === "string" ? solutionText.slice(0, 150) + "..." : "Heuristic remediation generated.",
          steps: steps,
          circuitDiagramNote: "Submit symptom to Database for Review if issue persists across hardware revisions.",
          codeSnippet: "// Heuristic Analysis Firmware Fix\n// Ensure non-blocking delay and power stability\n#include <esp_wifi.h>\nvoid setup() {\n  WiFi.mode(WIFI_STA);\n  esp_wifi_set_max_tx_power(52); // Reduce peak current spikes\n}"
        }
      };

      setIsAnalyzing(false);
      onCustomDiagnosis(customDiagnosisNode);
    } catch (err) {
      console.error("Heuristic analysis failed:", err);
      setIsAnalyzing(false);
      // Fallback custom node
      const fallbackNode: DiagnosisNode = {
        id: `heuristic_fallback_${Date.now()}`,
        type: "diagnosis",
        category: "brownout",
        title: `Heuristic Analysis: ${symptomInput.slice(0, 30)}`,
        diagnosis: `Heuristic Diagnosis for ${symptomInput}`,
        symptomSummary: symptomInput,
        rootCause: "Unmapped hardware symptom. Voltage rail transient or logic level discrepancy suspected.",
        severity: "WARNING",
        engineeringSolution: {
          summary: "Check power rails, decoupling capacitors, and serial monitor dumps.",
          steps: [
            "Measure VDD 3.3V rail voltage under load.",
            "Verify logic level conversion on external signal pins.",
            "Submit symptom to database for review."
          ]
        }
      };
      onCustomDiagnosis(fallbackNode);
    }
  };

  if (!currentNode || !isQuestion) return null;

  const questionNode = currentNode as QuestionNode;
  const isZeroMatch = symptomInput.trim().length > 3 && filteredOptions.length === 0;

  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950 animate-fadeIn">
      {/* LEFT PANE: Interaction Container (60% Desktop) - Pinned Search + Independently Scrollable Bento Options */}
      <div className="w-full lg:w-[60%] h-full flex flex-col pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden shrink-0 lg:shrink">
        {/* Pinned Top Header & Search Bar Section */}
        <div className="shrink-0 space-y-4 pb-4 border-b border-slate-800">
          {/* Controls & Step Indicator */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={onGoBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-[#06B6D4] border border-slate-800 transition-all text-xs font-mono"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-surface-card border border-slate-800 text-slate-200">
                  Step {history.length + 1}
                </span>
                {currentNode.category !== "root" && (
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-[#06B6D4] capitalize font-bold">
                    Category: {currentNode.category}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={onReset}
              className="text-xs font-mono text-slate-400 hover:text-[#06B6D4] transition-colors"
            >
              Reset Session
            </button>
          </div>

          {/* Question Query Card */}
          <div className="w-full bg-surface-card border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2 text-xs font-mono text-[#06B6D4] mb-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-pulse" />
              ACTIVE DIAGNOSTIC QUERY
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight leading-snug">
              {questionNode.question}
            </h2>

            {questionNode.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {questionNode.description}
              </p>
            )}
          </div>

          {/* FIRMLY PINNED HYBRID INPUT SEARCH FILTER SYSTEM */}
          <form onSubmit={handleCustomInputSubmit} className="w-full space-y-1.5">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
              Describe your hardware symptom or search:
            </label>
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => {
                  setSymptomInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                placeholder="Describe your hardware symptom or search keywords..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-[#06B6D4] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 transition-all font-sans shadow-inner"
              />
              {symptomInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSymptomInput("");
                    setInputError("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                >
                  <FilterX className="w-4 h-4" />
                </button>
              )}
            </div>
            {inputError && (
              <div className="text-red-400 text-xs font-mono mt-1 transition-all animate-fadeIn">
                {inputError}
              </div>
            )}
          </form>
        </div>

        {/* INDEPENDENTLY SCROLLABLE BENTO OPTIONS AREA (flex-1 overflow-y-auto) */}
        <div className="flex-1 w-full overflow-y-auto pt-4 pr-1 space-y-3">
          {/* Multi-Stage Loading Indicator for Heuristic Analysis */}
          {isAnalyzing ? (
            <div className="w-full p-8 rounded-2xl bg-slate-900/90 border border-cyan-800/80 text-center space-y-4 shadow-2xl animate-pulse">
              <div className="p-3 rounded-full bg-cyan-950 text-[#06B6D4] w-12 h-12 mx-auto flex items-center justify-center border border-cyan-800">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-mono">
                  Generative Heuristic Engine Active
                </h3>
                <p className="text-xs font-mono text-[#06B6D4] mt-1">
                  {loadingStage}
                </p>
              </div>
            </div>
          ) : isZeroMatch ? (
            /* EMPTY STATE & CUSTOM HEURISTIC ANALYSIS CTA CARD WITH MODEL SELECTOR */
            <div className="w-full p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-950 hover:border-cyan-800/80 transition-all text-center space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="p-3 rounded-2xl bg-cyan-950/80 text-[#06B6D4] w-12 h-12 mx-auto flex items-center justify-center border border-cyan-800/60 shadow-lg">
                <Bot className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-bold text-white">
                  No exact rule match found in the Knowledge Base
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The rule engine does not have a hardcoded match for &quot;
                  <span className="text-slate-200 font-semibold">{symptomInput}</span>
                  &quot;. Select an LLM engine and launch Generative AI Heuristic Analysis.
                </p>
              </div>

              {/* Model Selector Dropdown above CTA Button */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <label className="text-xs font-mono text-slate-400">
                  Select Engine:
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-md px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-400 outline-none font-mono cursor-pointer"
                >
                  <option value="nvidia-llama">Llama 3.1 70B (NVIDIA)</option>
                  <option value="nvidia-deepseek">DeepSeek-R1 (NVIDIA)</option>
                </select>
              </div>

              <button
                onClick={handleRunHeuristicAnalysis}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#06B6D4] hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                Run Heuristic Analysis on &apos;{symptomInput}&apos;
              </button>
            </div>
          ) : (
            /* Bento Options List */
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    handleOptionSelect(option.id);
                  }}
                  className="group relative flex flex-col justify-between text-left p-6 rounded-xl bg-surface-card hover:bg-slate-900 border border-slate-800 hover:border-[#06B6D4] transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-sm sm:text-base font-semibold text-white group-hover:text-[#06B6D4] transition-colors leading-snug">
                      {option.label}
                    </span>
                    <div className="p-1.5 rounded-lg bg-slate-900 group-hover:bg-cyan-950 border border-slate-800 group-hover:border-cyan-700/60 text-slate-400 group-hover:text-[#06B6D4] transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {option.description && (
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed pt-1">
                      {option.description}
                    </p>
                  )}
                </button>
              ))}

              {/* Morphing "Other / Custom Issue" Card */}
              {!isCustomCardActive ? (
                <button
                  type="button"
                  onClick={() => setIsCustomCardActive(true)}
                  className="group relative flex flex-col justify-between text-left p-6 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-dashed border-cyan-800/80 hover:border-cyan-400 transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] focus:outline-none cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-sm sm:text-base font-bold text-neon-cyan leading-snug flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-neon-cyan" />
                      Other / Custom Issue
                    </span>
                    <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-neon-cyan transition-all shrink-0">
                      <Edit3 className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    Describe your unlisted hardware symptom to trigger the fallback isolation flow &amp; custom AI diagnosis.
                  </p>
                </button>
              ) : (
                <div className="sm:col-span-2 p-6 rounded-xl bg-slate-900 border-2 border-cyan-500 shadow-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-neon-cyan font-bold uppercase tracking-wider flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      Describe Custom Symptom:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCardActive(false);
                        setCardInputText("");
                      }}
                      className="text-xs font-mono text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={cardInputText}
                    onChange={(e) => setCardInputText(e.target.value)}
                    placeholder="Enter details about the unlisted hardware fault or symptom..."
                    className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 font-sans"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCustomCardSubmit}
                      disabled={!cardInputText.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-cyan hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-mono font-bold text-xs transition-all shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 fill-current" />
                      Submit Custom Issue
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Context Container (40% Desktop) - Hardware Diagram & Telemetry (Scrollable) */}
      <div className="w-full lg:w-[40%] h-full flex flex-col pl-0 lg:pl-6 pt-6 lg:pt-0 overflow-y-auto space-y-6 shrink-0 lg:shrink">
        {/* Interactive ESP32 Subsystem Diagram */}
        <ESP32Diagram
          category={currentNode.category}
          activeSubsystemTitle={questionNode.title}
        />

        {/* Live Mock Hardware Telemetry Panel */}
        <div className="w-full bg-surface-card border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Activity className="w-4 h-4 text-emerald-green animate-pulse" />
              LIVE HARDWARE TELEMETRY
            </span>
            <span className="text-[10px] text-slate-500">REFRESH: 100ms</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-400" /> VDD 3.3V Rail
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.vdd}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Radio className="w-3 h-3 text-purple-400" /> RSSI Power
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.rssi}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-green" /> Wi-Fi Channel
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.ch}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#06B6D4]" /> FreeRTOS Heap
              </span>
              <span className="font-bold text-slate-200 block">{telemetry.heap}</span>
            </div>
          </div>
        </div>

        {/* Traversed Logical Decision Path Log */}
        <div className="w-full bg-surface-card border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold border-b border-slate-800 pb-2">
            <Layers className="w-4 h-4 text-[#06B6D4]" />
            TRAVERSED INFERENCE PATH
          </div>

          <div className="space-y-2">
            {history.map((nodeId, idx) => {
              const node = knowledgeBase.nodes[nodeId];
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400"
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[9px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="truncate">{node?.title || nodeId}</span>
                </div>
              );
            })}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-[11px] text-[#06B6D4] font-bold">
              <span className="w-4 h-4 rounded-full bg-[#06B6D4] text-slate-950 flex items-center justify-center text-[9px] shrink-0">
                {history.length + 1}
              </span>
              <span className="truncate">{questionNode.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
