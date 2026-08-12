"use client";

import React, { useState } from "react";
import { knowledgeBase, KnowledgeNode, DiagnosisNode } from "@/data/knowledgeBase";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./DashboardView";
import { DiagnosticView } from "./DiagnosticView";
import { DiagnosisReportView } from "./DiagnosisReportView";
import { HardwareLogsView } from "./HardwareLogsView";
import { KnowledgeBaseView } from "./KnowledgeBaseView";
import { AboutView } from "./AboutView";

export function ExpertSystem() {
  const [activeView, setActiveView] = useState<
    "dashboard" | "diagnostic" | "logs" | "knowledge_base" | "about"
  >("dashboard");

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [currentNodeId, setCurrentNodeId] = useState<string>(
    knowledgeBase.initialQuestionId
  );
  const [history, setHistory] = useState<string[]>([]);
  const [customDiagnosisNode, setCustomDiagnosisNode] = useState<DiagnosisNode | null>(null);
  const [customLogs, setCustomLogs] = useState<string[]>([]);

  const currentNode: KnowledgeNode = knowledgeBase.nodes[currentNodeId];

  // Append user-entered custom symptom to customLogs state
  const handleAddCustomLog = (logText: string) => {
    if (logText.trim()) {
      setCustomLogs((prev) => [...prev, logText.trim()]);
    }
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
    setActiveView("dashboard");
  };

  // Start diagnostic from dashboard
  const handleStartDiagnostic = (categoryKey?: string) => {
    setHistory([]);
    setCustomDiagnosisNode(null);
    setCustomLogs([]);
    if (categoryKey) {
      // Map category to starting question
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
        default:
          setCurrentNodeId(knowledgeBase.initialQuestionId);
      }
    } else {
      setCurrentNodeId(knowledgeBase.initialQuestionId);
    }
    setActiveView("diagnostic");
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-deep-slate text-white font-sans selection:bg-neon-cyan selection:text-slate-950">
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
        />

        {/* Scrollable Main Workspace Area (Zero Dead Side Whitespace) */}
        <main className="flex-1 w-full overflow-y-auto p-6 sm:p-8 min-w-0">
          {/* 1. Dashboard View */}
          {activeView === "dashboard" && (
            <DashboardView
              onStartDiagnostic={handleStartDiagnostic}
              onViewLogs={() => setActiveView("logs")}
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
                    />
                  )}

                  {currentNode?.type === "diagnosis" && (
                    <DiagnosisReportView
                      currentNode={currentNode as DiagnosisNode}
                      history={history}
                      customLogs={customLogs}
                      onReset={handleReset}
                    />
                  )}
                </>
              )}
            </>
          )}

          {/* 3. Hardware Logs View */}
          {activeView === "logs" && <HardwareLogsView />}

          {/* 4. Knowledge Base View */}
          {activeView === "knowledge_base" && <KnowledgeBaseView />}

          {/* 5. About View */}
          {activeView === "about" && <AboutView />}
        </main>
      </div>
    </div>
  );
}
