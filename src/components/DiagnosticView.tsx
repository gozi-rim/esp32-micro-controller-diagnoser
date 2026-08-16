"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  knowledgeBase,
  KnowledgeNode,
  QuestionNode,
  DiagnosisNode
} from "@/data/knowledgeBase";
import { ESP32Diagram } from "./ESP32Diagram";
import { OscilloscopeWaveform } from "./OscilloscopeWaveform";
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
  CornerDownLeft,
  X,
  Gauge
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
  onJumpToStep?: (nodeId: string, stepIndex: number) => void;
}

export function DiagnosticView({
  currentNodeId,
  history,
  customLogs = [],
  onAddCustomLog,
  onSelectOption,
  onCustomDiagnosis,
  onGoBack,
  onReset,
  onJumpToStep
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

  // Filter options based on search query
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

  // Live telemetry mock values based on active category
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
      case "i2c":
        return { vdd: "3.30 V", rssi: "-65 dBm", ch: "Ch 1", heap: "235 KB", loss: "0%" };
      case "spi":
        return { vdd: "3.30 V", rssi: "-65 dBm", ch: "Ch 1", heap: "228 KB", loss: "0%" };
      case "adc":
        return { vdd: "3.30 V", rssi: "-65 dBm (ACTIVE)", ch: "Ch 1", heap: "215 KB", loss: "0%" };
      case "strap":
        return { vdd: "3.30 V (BOOT TRAP)", rssi: "N/A", ch: "N/A", heap: "0 KB (BOOT)", loss: "100%" };
      default:
        return { vdd: "3.30 V (NOMINAL)", rssi: "-65 dBm", ch: "Ch 1", heap: "245 KB", loss: "0%" };
    }
  }, [currentNode]);

  // Contextual technical reason why this measurement matters
  const contextWhyItMatters = useMemo(() => {
    const cat = currentNode?.category;
    switch (cat) {
      case "brownout":
        return "Why this measurement matters: The ESP32 consumes 350mA–500mA in short bursts during RF calibration. Distinguishing between continuous resets versus transient inrush drops isolates linear regulator dropout from bad USB cable impedance.";
      case "espnow":
        return "Why this measurement matters: ESP-NOW transmits 802.11 Vendor-Specific Action Frames without handshake negotiation. Confirming transceiver MAC matching and 2.4GHz primary channel alignment prevents silent packet drops.";
      case "wifi":
        return "Why this measurement matters: FreeRTOS Task Watchdog Timer (TWDT) hangs occur when high-priority tasks starve core IDLE loops. Identifying the exact failure phase isolates RTOS starvation from 802.11 DHCP timeouts.";
      case "gpio":
        return "Why this measurement matters: ESP32 GPIO pins tolerate a strict 3.6V absolute maximum. Pinpointing high-level voltage excursions isolates gate oxide dielectric breakdown from inductive relay back-EMF spikes.";
      case "antenna":
        return "Why this measurement matters: 2.4GHz RF signals experience extreme attenuation (-30dB to -60dB) inside grounded enclosures or when 0402 zero-ohm RF selector jumpers are misaligned between PCB and u.FL paths.";
      case "i2c":
        return "Why this measurement matters: I2C is an open-drain protocol requiring 4.7kΩ pull-up resistors. Missing pull-ups hold SDA LOW, causing the Wire library to block the entire execution loop.";
      case "spi":
        return "Why this measurement matters: High SPI clock rates (>20MHz) suffer from breadboard trace capacitance. Selecting proper frequency and CS line pull-ups prevents SD card mount failures.";
      case "adc":
        return "Why this measurement matters: The ESP32 ADC2 SAR converter is internally locked by the Wi-Fi radio driver. Distinguishing ADC1 vs ADC2 prevents zero/garbage analog readings.";
      case "strap":
        return "Why this measurement matters: Strapping pins (GPIO 0, 2, 12, 15) determine whether the chip boots from SPI flash or enters serial ROM download mode.";
      default:
        return "Why this measurement matters: Establishing the initial failure domain narrows the forward-chaining search space, preventing redundant electrical probing and safeguarding microcontroller peripherals.";
    }
  }, [currentNode]);

  useEffect(() => {
    setIsCustomCardActive(false);
    setCardInputText("");
  }, [currentNodeId]);

  // Handle custom card input submit (directly triggering heuristic AI synthesis)
  const handleCustomCardSubmit = async () => {
    if (!cardInputText.trim()) return;

    const trimmed = cardInputText.trim();
    if (onAddCustomLog) {
      onAddCustomLog(trimmed);
    }

    setIsCustomCardActive(false);
    setCardInputText("");

    const combinedSymptoms = [...(customLogs || []), trimmed].join(" | ");
    setIsAnalyzing(true);
    setLoadingStage("Synthesizing Heuristic Inference Matrix for custom hardware symptom...");

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptom: combinedSymptoms,
          category: currentNode?.category || "custom",
          modelId: selectedModel
        })
      });

      let data: any = {};
      if (res.ok) {
        data = await res.json();
      }

      setIsAnalyzing(false);

      const customDiagnosisNode: DiagnosisNode = {
        id: `custom_diag_${Date.now()}`,
        ruleId: "RULE-HEURISTIC-CUSTOM",
        confidenceFactor: 0.88,
        formalRuleStatement: `IF (CustomSymptom == '${trimmed.slice(0, 40)}...') THEN HYPOTHESIS('${data.diagnosisTitle || "Custom Hardware Interface Anomaly"}', CF=0.88)`,
        antecedents: [
          `Technician reported: "${trimmed}"`,
          "Working memory evaluated against ESP32 Xtensa architecture rules",
          "Deep Heuristic Inference Engine synthesized hardware remediation"
        ],
        type: "diagnosis",
        category: "custom",
        title: data.diagnosisTitle || `Custom Diagnosis: ${trimmed.slice(0, 35)}`,
        diagnosis: data.diagnosisTitle || `Custom Symptom Analysis: ${trimmed}`,
        symptomSummary: combinedSymptoms,
        rootCause: data.rootCause || "Custom unmapped hardware condition detected across microcontroller interface pins or firmware loop.",
        severity: "WARNING",
        engineeringSolution: {
          summary: typeof data.engineeringSolution === "string" ? data.engineeringSolution.slice(0, 160) + "..." : "Perform systematic peripheral isolation and measure supply rails.",
          steps: typeof data.engineeringSolution === "string" && data.engineeringSolution.includes("\n")
            ? data.engineeringSolution.split("\n").filter((s: string) => s.trim().length > 0)
            : [
                "Disconnect all external sensors, displays, and relay modules from ESP32 GPIO pins.",
                "Measure VDD 3.3V rail voltage with an oscilloscope to check for transient dips during Wi-Fi activation.",
                "Reflash a minimal 'Blink' or basic serial output sketch to test core MCU sanity.",
                "Check that GPIO 0, 2, 12, 15 strapping pins are not held in improper states during boot."
              ],
          circuitDiagramNote: "Verify 3.3V power decoupling capacitance (100uF electrolytic + 0.1uF ceramic) near VDD header pins.",
          codeSnippet: "// Core Isolation Test Firmware\n#include <Arduino.h>\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(\"--- ESP32 Core Isolation Test ---\");\n}\nvoid loop() {\n  Serial.printf(\"Free Heap: %d bytes | Uptime: %lu ms\\n\", ESP.getFreeHeap(), millis());\n  delay(1000);\n}"
        }
      };

      onCustomDiagnosis(customDiagnosisNode);
    } catch (err) {
      setIsAnalyzing(false);
      // Fallback custom node
      const fallbackNode: DiagnosisNode = {
        id: `custom_diag_${Date.now()}`,
        ruleId: "RULE-HEURISTIC-FALLBACK",
        confidenceFactor: 0.85,
        formalRuleStatement: `IF (CustomSymptom == '${trimmed}') THEN HYPOTHESIS('Peripheral Isolation & Power Decoupling Required', CF=0.85)`,
        antecedents: [
          `Technician reported: "${trimmed}"`,
          "Heuristic fallback rules applied in offline mode"
        ],
        type: "diagnosis",
        category: "custom",
        title: `Custom Diagnosis: ${trimmed.slice(0, 35)}`,
        diagnosis: `Custom Hardware Symptom: ${trimmed}`,
        symptomSummary: combinedSymptoms,
        rootCause: "Unmapped hardware symptom. High likelihood of power rail sag, bus contention, or missing pull-up/pull-down resistors.",
        severity: "WARNING",
        engineeringSolution: {
          summary: "Perform bare-core isolation test and verify 3.3V power supply rail stability.",
          steps: [
            "Disconnect all external sensors and modules from ESP32 GPIO header pins.",
            "Verify 3.3V supply rail delivers at least 500mA continuous current.",
            "Ensure strapping pins (GPIO 0, 2, 12) are not pulled to conflicting logic levels."
          ],
          codeSnippet: "// Bare Core Sanity Test\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(\"Core OK\");\n}\nvoid loop() {\n  delay(1000);\n}"
        }
      };
      onCustomDiagnosis(fallbackNode);
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCustomCardSubmit();
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

  // Keyword matching form submission
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
        "No exact deterministic match found. Select from the cards below or launch Heuristic Analysis."
      );
    }
  };

  // Trigger Heuristic AI Analysis
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

      const qLower = symptomInput.toLowerCase();
      if (qLower.includes("heat") || qLower.includes("hot") || qLower.includes("burn")) {
        title = title || "Thermal Throttling & Power Rail Over-Voltage";
        cause = cause || "Excessive thermal dissipation detected on Vin/VDD. Input voltage exceeds LDO rating or short circuit is sinking excess current.";
      } else if (qLower.includes("drop") || qLower.includes("disconnect") || qLower.includes("fail")) {
        title = title || "RF Spectrum Noise / Transient Power Instability";
        cause = cause || "Severe 2.4GHz ISM band co-channel interference or momentary VDD supply drop during peak transmission.";
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

  // Format step number string (e.g., Step 01 / 04)
  const stepNumber = String(history.length + 1).padStart(2, "0");
  const estimatedTotalSteps = "04";

  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden bg-[#0a0c10] animate-fadeIn">
      {/* LEFT PANE: Interaction Container (60% Desktop) */}
      <div className="w-full lg:w-[60%] h-full flex flex-col pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/[0.08] overflow-hidden shrink-0 lg:shrink">
        {/* Pinned Top Header & Search Bar Section */}
        <div className="shrink-0 space-y-4 pb-4 border-b border-white/[0.08]">
          {/* Step Progression & Controls Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {history.length > 0 && (
                <button
                  onClick={onGoBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-slate-300 hover:text-[#00f2fe] border border-white/[0.08] hover:border-[#00f2fe]/40 transition-all text-xs font-mono cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}

              {/* Apple-style Segmented Step Pill Indicator */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b22] border border-white/[0.08] text-xs font-mono">
                <span className="text-[#00f2fe] font-bold">
                  Step {stepNumber}
                </span>
                <span className="text-slate-500">/</span>
                <span className="text-slate-400">{estimatedTotalSteps}</span>
                {currentNode.category !== "root" && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-600 mx-1" />
                    <span className="text-slate-300 font-medium capitalize">
                      Category: {currentNode.category}
                    </span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={onReset}
              className="text-xs font-mono text-slate-400 hover:text-[#00f2fe] transition-colors cursor-pointer"
            >
              Reset Session
            </button>
          </div>

          {/* Question Query Statement Card */}
          <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2fe]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 text-xs font-mono text-[#00f2fe] mb-2 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
              ACTIVE DIAGNOSTIC QUERY
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-2.5 tracking-tight leading-snug font-sans">
              {questionNode.question}
            </h2>

            {/* Contextual Technical Caption */}
            <div className="pt-2 border-t border-white/[0.06] text-xs sm:text-[13px] text-slate-400 leading-relaxed font-sans">
              {contextWhyItMatters}
            </div>
          </div>

          {/* Firmly Pinned Hybrid Search Filter System */}
          <form onSubmit={handleCustomInputSubmit} className="w-full space-y-1.5">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              Filter symptoms or describe custom behavior:
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
                placeholder="Type keywords (e.g., brownout, 3.3V, WDT timeout, MAC pairing, RSSI)..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0d1117] border border-white/[0.08] focus:border-[#00f2fe]/60 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00f2fe]/20 transition-all font-sans shadow-inner"
              />
              {symptomInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSymptomInput("");
                    setInputError("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <FilterX className="w-4 h-4" />
                </button>
              )}
            </div>
            {inputError && (
              <div className="text-rose-400 text-xs font-mono mt-1 transition-all animate-fadeIn">
                {inputError}
              </div>
            )}
          </form>
        </div>

        {/* Scrollable Bento Options Grid */}
        <div className="flex-1 w-full overflow-y-auto pt-4 pr-1 space-y-3">
          {/* Multi-Stage Loading Indicator for Heuristic Analysis */}
          {isAnalyzing ? (
            <div className="w-full p-8 rounded-2xl bg-[#161b22] border border-[#00f2fe]/40 text-center space-y-4 shadow-2xl animate-pulse">
              <div className="p-3 rounded-full bg-[#00f2fe]/10 text-[#00f2fe] w-12 h-12 mx-auto flex items-center justify-center border border-[#00f2fe]/30">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-mono">
                  Generative Heuristic Engine Active
                </h3>
                <p className="text-xs font-mono text-[#00f2fe] mt-1">
                  {loadingStage}
                </p>
              </div>
            </div>
          ) : isZeroMatch ? (
            /* Empty State & Heuristic CTA */
            <div className="w-full p-6 sm:p-8 rounded-2xl bg-[#161b22] border border-white/[0.12] hover:border-[#00f2fe]/40 transition-all text-center space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="p-3 rounded-2xl bg-[#00f2fe]/10 text-[#00f2fe] w-12 h-12 mx-auto flex items-center justify-center border border-[#00f2fe]/30 shadow-lg">
                <Bot className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-base font-semibold text-white">
                  No exact rule match in Knowledge Base
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  The deterministic tree does not have a static entry for &quot;
                  <span className="text-slate-200 font-semibold">{symptomInput}</span>
                  &quot;. Select an AI engine to synthesize an engineering diagnosis.
                </p>
              </div>

              {/* Model Selector Dropdown */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <label className="text-xs font-mono text-slate-400">
                  Select Engine:
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="bg-[#0d1117] border border-white/[0.12] text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#00f2fe] outline-none font-mono cursor-pointer"
                >
                  <option value="nvidia-llama">Llama 3.1 70B (NVIDIA)</option>
                  <option value="nvidia-deepseek">DeepSeek-R1 (NVIDIA)</option>
                </select>
              </div>

              <button
                onClick={handleRunHeuristicAnalysis}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00f2fe] hover:bg-[#00d8e4] text-slate-950 font-bold text-xs sm:text-sm font-mono transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                Run Heuristic Analysis on &apos;{symptomInput}&apos;
              </button>
            </div>
          ) : (
            /* Option Cards Grid (2-Column Responsive) */
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-4">
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className="group relative flex flex-col justify-between text-left p-5 rounded-2xl bg-[#161b22] hover:bg-[#21262d] border border-white/[0.08] hover:border-[#00f2fe]/40 transition-all duration-200 shadow-md hover:shadow-[0_4px_20px_rgba(0,242,254,0.08)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00f2fe]/30"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span className="text-sm font-semibold text-slate-100 group-hover:text-[#00f2fe] transition-colors leading-snug font-sans">
                      {option.label}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#0d1117] group-hover:bg-[#00f2fe]/10 border border-white/[0.08] group-hover:border-[#00f2fe]/30 text-slate-400 group-hover:text-[#00f2fe] transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {option.description && (
                    <p className="text-xs font-mono text-slate-400 group-hover:text-slate-300 leading-relaxed pt-1 border-t border-white/[0.04]">
                      {option.description}
                    </p>
                  )}
                </button>
              ))}

              {/* Dedicated Custom Technician Input Card */}
              {!isCustomCardActive ? (
                <button
                  type="button"
                  onClick={() => setIsCustomCardActive(true)}
                  className="group relative flex flex-col justify-between text-left p-5 rounded-2xl bg-[#161b22]/60 hover:bg-[#21262d] border border-dashed border-white/[0.14] hover:border-[#00f2fe]/60 transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-sm font-semibold text-[#00f2fe] leading-snug flex items-center gap-2 font-sans">
                      <PlusCircle className="w-4 h-4 text-[#00f2fe]" />
                      + Describe Custom Hardware Symptom
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] transition-all shrink-0">
                      <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed pt-1">
                    Trigger custom parameter capture and heuristic AI failure analysis for unlisted hardware faults.
                  </p>
                </button>
              ) : (
                <div className="sm:col-span-2 p-5 rounded-2xl bg-[#161b22] border-2 border-[#00f2fe] shadow-2xl space-y-3.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#00f2fe] font-bold uppercase tracking-wider flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" />
                      Describe Custom Symptom:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCardActive(false);
                        setCardInputText("");
                      }}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={cardInputText}
                    onChange={(e) => setCardInputText(e.target.value)}
                    onKeyDown={handleCustomKeyDown}
                    placeholder="Enter electrical/firmware observations (e.g., pin high impedance, 3.3V rail ripple, FreeRTOS stack overflow)..."
                    className="w-full p-3 rounded-xl bg-[#0a0c10] border border-white/[0.12] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00f2fe]/30 font-sans"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <CornerDownLeft className="w-3 h-3 text-slate-500" />
                      Press <kbd className="px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-300 text-[10px]">Enter ↵</kbd> to analyze
                    </span>
                    <button
                      type="button"
                      onClick={handleCustomCardSubmit}
                      disabled={!cardInputText.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00f2fe] hover:bg-[#00d8e4] disabled:opacity-50 text-slate-950 font-mono font-bold text-xs transition-all shadow-md cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      Analyze Symptom
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Context Container (40% Desktop) - Hardware Diagram, Oscilloscope & Telemetry */}
      <div className="w-full lg:w-[40%] h-full flex flex-col pl-0 lg:pl-6 pt-6 lg:pt-0 overflow-y-auto space-y-5 shrink-0 lg:shrink">
        {/* Interactive ESP32 Subsystem Diagram with Clickable 38-Pin HUD */}
        <ESP32Diagram
          category={currentNode.category}
          activeSubsystemTitle={questionNode.title}
        />

        {/* Live Real-Time Oscilloscope Waveform (3.3V Rail Droop Simulation) */}
        <OscilloscopeWaveform category={currentNode.category} />

        {/* Live Mock Hardware Telemetry Panel */}
        <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3.5 shrink-0">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Gauge className="w-4 h-4 text-[#10b981] animate-pulse" />
              LIVE HARDWARE TELEMETRY
            </span>
            <span className="text-[10px] text-[#00f2fe] font-mono font-bold">ACTIVE SAMPLING</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-400" /> VDD 3.3V Rail
              </span>
              <span className="font-bold text-slate-200 block text-[11px]">{telemetry.vdd}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Radio className="w-3 h-3 text-purple-400" /> RSSI Power
              </span>
              <span className="font-bold text-slate-200 block text-[11px]">{telemetry.rssi}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Wifi className="w-3 h-3 text-[#10b981]" /> Wi-Fi Channel
              </span>
              <span className="font-bold text-slate-200 block text-[11px]">{telemetry.ch}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0d1117] border border-white/[0.06] space-y-1">
              <span className="text-[10px] text-slate-400 uppercase flex items-center gap-1">
                <Cpu className="w-3 h-3 text-[#00f2fe]" /> FreeRTOS Heap
              </span>
              <span className="font-bold text-slate-200 block text-[11px]">{telemetry.heap}</span>
            </div>
          </div>
        </div>

        {/* Traversed Logical Decision Path Log (Interactive Jump Back) */}
        <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3 text-xs font-mono shrink-0">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Layers className="w-4 h-4 text-[#00f2fe]" />
              TRAVERSED INFERENCE PATH ({history.length + 1})
            </div>
            <span className="text-[10px] text-slate-500 font-mono">CLICK TO JUMP BACK</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {history.map((nodeId, idx) => {
              const node = knowledgeBase.nodes[nodeId];
              return (
                <button
                  key={idx}
                  onClick={() => onJumpToStep && onJumpToStep(nodeId, idx)}
                  className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-[#0d1117] hover:bg-[#21262d] border border-white/[0.06] hover:border-[#00f2fe]/40 text-[11px] text-slate-400 hover:text-white transition-all text-left cursor-pointer group"
                  title="Click to branch back to this question"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-4 h-4 rounded-full bg-white/[0.08] text-slate-300 flex items-center justify-center text-[9px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate font-sans">{node?.title || nodeId}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 group-hover:text-[#00f2fe] shrink-0">
                    Jump ↵
                  </span>
                </button>
              );
            })}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[11px] text-[#00f2fe] font-bold">
              <span className="w-4 h-4 rounded-full bg-[#00f2fe] text-slate-950 flex items-center justify-center text-[9px] font-bold shrink-0">
                {history.length + 1}
              </span>
              <span className="truncate font-sans">{questionNode.title} (Active)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
