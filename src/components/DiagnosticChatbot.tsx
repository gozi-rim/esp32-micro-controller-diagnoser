"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  Cpu,
  Trash2,
  AlertOctagon
} from "lucide-react";

interface DiagnosticChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticChatbot({ isOpen, onClose }: DiagnosticChatbotProps) {
  const [selectedModel, setSelectedModel] = useState<"nvidia-llama" | "nvidia-deepseek">("nvidia-llama");
  const [input, setInput] = useState("");

  // Vercel AI SDK (@ai-sdk/react) useChat Hook with Error Extraction
  const { messages, status, sendMessage, setMessages, error } = useChat();

  const isLoading = status === "submitted" || status === "streaming";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat history on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage(
      { text: input.trim() },
      { body: { modelId: selectedModel } }
    );
    setInput("");
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  // Helper to extract display text from UIMessage
  const getMessageContent = (msg: any): string => {
    if (typeof msg.content === "string" && msg.content) return msg.content;
    if (Array.isArray(msg.parts)) {
      return msg.parts
        .map((p: any) => (p.type === "text" ? p.text : p.content || ""))
        .join("");
    }
    return "";
  };

  return (
    <>
      {/* Semi-transparent Backdrop when drawer is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col select-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header with Model Selector */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-[#06B6D4] border border-cyan-800/80 shadow-md">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-sans">
                  AI Co-Pilot
                </h3>

                {/* OpenRouter Model Selector Dropdown */}
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-cyan-400 outline-none cursor-pointer"
                >
                  <option value="nvidia-llama">Llama 3.3 70B (OpenRouter)</option>
                  <option value="nvidia-deepseek">DeepSeek-R1 (OpenRouter)</option>
                </select>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                OpenRouter Free Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              title="Close Drawer"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Message History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
          {messages.length === 0 && (
            <div className="flex flex-col items-start space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 px-1">
                <Sparkles className="w-3 h-3 text-[#06B6D4]" />
                <span>ESP32 AI Co-Pilot</span>
              </div>
              <div className="bg-slate-950/90 text-slate-200 border border-slate-800 p-3.5 rounded-2xl rounded-tl-xs font-mono leading-relaxed">
                Hello! I am your ECE 515.2 AI Co-Pilot. Ask me anything about ESP32 pinouts, power rail brownouts, ESP-NOW Action Frames, or FreeRTOS watchdog timeouts.
              </div>
            </div>
          )}

          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              } space-y-1`}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 px-1">
                {msg.role === "assistant" ? (
                  <>
                    <Sparkles className="w-3 h-3 text-[#06B6D4]" />
                    <span>
                      {selectedModel === "nvidia-deepseek"
                        ? "DeepSeek-R1 AI"
                        : "Llama 3.3 70B AI"}
                    </span>
                  </>
                ) : (
                  <span>Technician Prompt</span>
                )}
              </div>

              {/* Reasoning Block for Chain-of-Thought Models (DeepSeek-R1) */}
              {msg.reasoning && (
                <div className="w-full max-w-[95%] mb-2 p-3 bg-slate-950/90 rounded-xl border border-cyan-800/50 text-slate-400 text-[11px] italic font-mono whitespace-pre-wrap shadow-inner">
                  <span className="text-[#06B6D4] font-bold not-italic flex items-center gap-1.5 mb-1 text-[10px] uppercase">
                    <Cpu className="w-3.5 h-3.5" />
                    System Diagnostics (Internal Reasoning Stream):
                  </span>
                  {msg.reasoning}
                </div>
              )}

              <div
                className={`max-w-[88%] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#06B6D4] text-slate-950 font-semibold p-3.5 rounded-2xl rounded-tr-xs shadow-lg"
                    : "bg-slate-950/90 text-slate-200 border border-slate-800 p-3.5 rounded-2xl rounded-tl-xs font-mono shadow-inner whitespace-pre-wrap"
                }`}
              >
                {getMessageContent(msg)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 px-1">
                <Sparkles className="w-3 h-3 text-[#06B6D4]" />
                <span>ESP32 AI Co-Pilot</span>
              </div>
              <div className="bg-slate-950/90 text-slate-400 border border-slate-800 p-3.5 rounded-2xl rounded-tl-xs font-mono text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#06B6D4]" />
                <span>Synthesizing response stream...</span>
              </div>
            </div>
          )}

          {/* Dedicated System Error UI Block */}
          {error && (
            <div className="text-red-400 p-3 bg-red-950/50 mt-2 font-mono text-xs border border-red-700 rounded-xl flex items-start gap-2 shadow-lg">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">API CRASH:</span> {error?.message || "Communication failure with LLM gateway."}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Pinned Input Form at Bottom Wired to sendMessage */}
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 space-y-2"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Co-Pilot about ESP32 hardware..."
              disabled={isLoading}
              className="w-full pl-3.5 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-[#06B6D4] text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 transition-all font-sans disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 rounded-lg bg-[#06B6D4] hover:bg-cyan-400 text-slate-950 disabled:opacity-40 disabled:hover:bg-[#06B6D4] transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4 fill-current" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-[#06B6D4]" /> ECE 515.2 Heuristic Agent
            </span>
            <span>
              {selectedModel === "nvidia-deepseek" ? "DeepSeek-R1" : "Llama-3.3-70B"}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
