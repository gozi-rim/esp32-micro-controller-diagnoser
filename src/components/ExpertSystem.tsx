"use client";

import React, { useState, useEffect } from "react";
import { knowledgeBase, KnowledgeNode, DiagnosisNode } from "@/data/knowledgeBase";
import { Header } from "./Header";
import { Sidebar, SidebarViewType } from "./Sidebar";
import { DashboardView } from "./DashboardView";
import { DiagnosticView } from "./DiagnosticView";
import { DiagnosisReportView } from "./DiagnosisReportView";
import { HardwareLogsView, LogEntry } from "./HardwareLogsView";
import { SerialMonitorView } from "./SerialMonitorView";
import { KnowledgeBaseView } from "./KnowledgeBaseView";
import { SystemSpecsView } from "./SystemSpecsView";
import { AboutView } from "./AboutView";

interface ExpertSystemProps {
  onSignOut?: () => void;
}

export function ExpertSystem({ onSignOut }: ExpertSystemProps) {
  const [activeView, setActiveView] = useState<SidebarViewType>("dashboard");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [currentNodeId, setCurrentNodeId] = useState<string>(
    knowledgeBase.initialQuestionId
  );
  const [history, setHistory] = useState<string[]>([]);
  const [customDiagnosisNode, setCustomDiagnosisNode] = useState<DiagnosisNode | null>(null);
  const [customLogs, setCustomLogs] = useState<string[]>([]);
  const [sessionLogs, setSessionLogs] = useState<LogEntry[]>([]);

  // Load persistent session logs on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("netdiag_session_logs");
      if (saved) {
        setSessionLogs(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load saved session logs:", e);
    }
  }, []);

  const currentNode: KnowledgeNode = knowledgeBase.nodes[currentNodeId];

  // Append user-entered custom symptom to customLogs state
  const handleAddCustomLog = (logText: string) => {
    if (logText.trim()) {
      setCustomLogs((prev) => [...prev, logText.trim()]);
    }
  };

  // Record completed diagnosis into persistent session logs
  const handleLogSession = (node: DiagnosisNode) => {
    const isCustom = node.id.startsWith("custom") || node.id.startsWith("heuristic");
    const newLog: LogEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      ruleId: node.ruleId || (isCustom ? "RULE-HEURISTIC" : "RULE-DET"),
      confidenceFactor: node.confidenceFactor || (isCustom ? 0.88 : 0.98),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      category: node.category.toUpperCase(),
      fault: node.title,
      diagnosisTitle: node.diagnosis || node.title,
      severity: node.severity,
      details: node.rootCause,
      remediation: node.engineeringSolution.summary,
      technicianInputs: customLogs
    };

    setSessionLogs((prev) => {
      // Avoid duplicate logs for identical diagnosis within same minute
      const exists = prev.some(
        (l) =>
          l.diagnosisTitle === newLog.diagnosisTitle &&
          l.timestamp.slice(0, 16) === newLog.timestamp.slice(0, 16)
      );
      if (exists) return prev;
      const updated = [newLog, ...prev];
      try {
        localStorage.setItem("netdiag_session_logs", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearLogs = () => {
    setSessionLogs([]);
    try {
      localStorage.removeItem("netdiag_session_logs");
    } catch (e) {}
  };

  const handleDeleteLog = (id: string) => {
    setSessionLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      try {
        localStorage.setItem("netdiag_session_logs", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Handle option click in wizard
  const handleSelectOption = (nextNodeId: string) => {
    setCustomDiagnosisNode(null);
    setHistory((prev) => [...prev, currentNodeId]);
    setCurrentNodeId(nextNodeId);
    setActiveView("diagnostic");
  };

  // Handle generative AI / heuristic custom diagnosis node injection
  const handleCustomDiagnosis = (customNode: DiagnosisNode) => {
    setCustomDiagnosisNode(customNode);
    setActiveView("diagnostic");
  };

  // Jump directly to any previous question step in history
  const handleJumpToStep = (nodeId: string, stepIndex: number) => {
    setCustomDiagnosisNode(null);
    setHistory((prev) => prev.slice(0, stepIndex));
    setCurrentNodeId(nodeId);
    setActiveView("diagnostic");
  };

  // Step back
  const handleGoBack = () => {
    if (customDiagnosisNode) {
      setCustomDiagnosisNode(null);
      return;
    }
    if (history.length > 0) {
      const previousNodeId = history[history.length - 1];
      setHistory((prev) => prev.slice(0, prev.length - 1));
      setCurrentNodeId(previousNodeId);
    }
  };

  // Reset wizard
  const handleReset = () => {
    setHistory([]);
    setCustomDiagnosisNode(null);
    setCustomLogs([]);
    setCurrentNodeId(knowledgeBase.initialQuestionId);
    setActiveView("diagnostic");
  };

  // Start diagnostic from dashboard across 9 domains
  const handleStartDiagnostic = (categoryKey?: string) => {
    setHistory([]);
    setCustomDiagnosisNode(null);
    setCustomLogs([]);
    if (categoryKey) {
      switch (categoryKey) {
        case "brownout":
          setCurrentNodeId("q_brownout_timing");
          break;
        case "espnow":
          setCurrentNodeId("q_espnow_error_type");
          break;
        case "wifi":
          setCurrentNodeId("q_wifi_symptom");
          break;
        case "gpio":
          setCurrentNodeId("q_gpio_voltage_level");
          break;
        case "antenna":
          setCurrentNodeId("q_antenna_type");
          break;
        case "i2c":
          setCurrentNodeId("q_i2c_symptom");
          break;
        case "spi":
          setCurrentNodeId("q_spi_symptom");
          break;
        case "adc":
          setCurrentNodeId("q_adc_wifi_conflict");
          break;
        case "strap":
          setCurrentNodeId("q_strapping_pins");
          break;
        default:
          setCurrentNodeId(knowledgeBase.initialQuestionId);
      }
    } else {
      setCurrentNodeId(knowledgeBase.initialQuestionId);
    }
    setActiveView("diagnostic");
  };

  // Auto-launch diagnosis directly from serial crash dump pattern match
  const handleAutoDiagnoseFromSerial = (targetNodeId: string) => {
    setCustomDiagnosisNode(null);
    setHistory([knowledgeBase.initialQuestionId, "serial_crash_pattern"]);
    setCurrentNodeId(targetNodeId);
    setActiveView("diagnostic");
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0a0c10] text-[#f0f6fc] font-sans selection:bg-[#00f2fe]/20 selection:text-[#00f2fe]">
      {/* Structural Collapsible Sidebar (Left Side) */}
      <Sidebar
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeView={activeView}
        onSelectView={(view) => {
          setActiveView(view);
          setMobileSidebarOpen(false);
        }}
        isDiagnosticActive={
          currentNodeId !== knowledgeBase.initialQuestionId || !!customDiagnosisNode
        }
      />

      {/* Main Workspace Column (Right Side - Full Height, Sticky Header, Scrollable Content) */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative">
        {/* Sticky Header inside Main Column */}
        <Header
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onResetDiagnostic={handleReset}
          historyLength={history.length}
          currentCategoryName={
            customDiagnosisNode
              ? customDiagnosisNode.category
              : currentNode?.category !== "root"
              ? currentNode?.category
              : undefined
          }
          activeView={activeView}
          onSignOut={onSignOut}
        />

        {/* Scrollable Main Workspace Area (Zero Dead Side Whitespace) */}
        <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 bg-[#0a0c10]">
          {/* 1. Dashboard View */}
          {activeView === "dashboard" && (
            <DashboardView
              onStartDiagnostic={handleStartDiagnostic}
              onViewLogs={() => setActiveView("logs")}
              recentLogs={sessionLogs}
            />
          )}

          {/* 2. Active Diagnostic View (Questions & Terminal Report) */}
          {activeView === "diagnostic" && (
            <>
              {customDiagnosisNode ? (
                <DiagnosisReportView
                  currentNode={customDiagnosisNode}
                  history={history}
                  customLogs={customLogs}
                  onReset={handleReset}
                  onLogSession={handleLogSession}
                />
              ) : (
                <>
                  {currentNode?.type === "question" && (
                    <DiagnosticView
                      currentNodeId={currentNodeId}
                      history={history}
                      customLogs={customLogs}
                      onAddCustomLog={handleAddCustomLog}
                      onSelectOption={handleSelectOption}
                      onCustomDiagnosis={handleCustomDiagnosis}
                      onGoBack={handleGoBack}
                      onReset={handleReset}
                      onJumpToStep={handleJumpToStep}
                    />
                  )}

                  {currentNode?.type === "diagnosis" && (
                    <DiagnosisReportView
                      currentNode={currentNode as DiagnosisNode}
                      history={history}
                      customLogs={customLogs}
                      onReset={handleReset}
                      onLogSession={handleLogSession}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* 3. USB Web Serial Monitor View */}
          {activeView === "serial_monitor" && (
            <SerialMonitorView onAutoDiagnoseRule={handleAutoDiagnoseFromSerial} />
          )}

          {/* 4. Hardware Logs View */}
          {activeView === "logs" && (
            <HardwareLogsView
              logs={sessionLogs}
              onClearLogs={handleClearLogs}
              onDeleteLog={handleDeleteLog}
            />
          )}

          {/* 4. Knowledge Base View */}
          {activeView === "knowledge_base" && <KnowledgeBaseView />}

          {/* 5. System Architecture / Specs View */}
          {activeView === "specs" && <SystemSpecsView />}

          {/* 6. About View */}
          {activeView === "about" && <AboutView />}
        </main>
      </div>
    </div>
  );
}
