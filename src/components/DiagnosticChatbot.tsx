"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  Cpu,
  Trash2
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface DiagnosticChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DiagnosticChatbot({ isOpen, onClose }: DiagnosticChatbotProps) {
  const [selectedModel, setSelectedModel] = useState<"nvidia-llama" | "nvidia-deepseek">("nvidia-llama");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-greeting",
      role: "assistant",
      content:
        "Hello! I am your ECE 515.2 AI Co-Pilot. Ask me anything about ESP32 pinouts, power rail brownouts, ESP-NOW Action Frames, or FreeRTOS watchdog timeouts."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat history on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input.trim()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const assistantMsgId = `assistant_${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: "assistant",
      content: ""
    };

    setMessages((prev) => [...prev, initialAssistantMsg]);

    try {
      // Send message history + modelId to /api/chat streaming endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to connect to AI Co-Pilot stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const textChunk = decoder.decode(value, { stream: true });
        streamedContent += textChunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: streamedContent }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  "I encountered a network communication error contacting the NVIDIA NIM model. Please verify your connection or VDD supply rails."
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `greeting_${Date.now()}`,
        role: "assistant",
        content:
          "Chat history reset. How can I assist you with your ESP32 hardware diagnostics?"
      }
    ]);
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

                {/* Sleek Model Selector Dropdown */}
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-300 rounded-md px-2 py-1 focus:ring-1 focus:ring-cyan-400 outline-none cursor-pointer"
                >
                  <option value="nvidia-llama">Llama 3.1 70B (NVIDIA)</option>
                  <option value="nvidia-deepseek">DeepSeek-R1 (NVIDIA)</option>
                </select>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                NVIDIA NIM Universal Engine
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
          {messages.map((msg) => (
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
                        : "Llama 3.1 70B AI"}
                    </span>
                  </>
                ) : (
                  <span>Technician Prompt</span>
                )}
              </div>

              <div
                className={`max-w-[88%] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#06B6D4] text-slate-950 font-semibold p-3.5 rounded-2xl rounded-tr-xs shadow-lg"
                    : "bg-slate-950/90 text-slate-200 border border-slate-800 p-3.5 rounded-2xl rounded-tl-xs font-mono shadow-inner whitespace-pre-wrap"
                }`}
              >
                {msg.content || (
                  <span className="flex items-center gap-2 text-slate-400 italic">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#06B6D4]" />
                    Synthesizing response...
                  </span>
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Pinned Input Form at Bottom */}
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
              {selectedModel === "nvidia-deepseek" ? "DeepSeek-R1" : "Llama-3.1-70B"}
            </span>
          </div>
        </form>
      </div>
    </>
  );
}
