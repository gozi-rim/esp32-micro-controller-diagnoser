"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Cpu,
  Activity,
  BookOpen,
  Zap,
  ArrowRight,
  ChevronRight,
  Shield,
  Wifi,
  Database,
  Terminal,
  Menu,
  X,
  Search,
  BarChart3,
  GitBranch,
  Layers,
} from "lucide-react";

/* ────────────────────────────────────────────
   Animated Counter Hook
   ──────────────────────────────────────────── */
function useCounter(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(id);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(id);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

/* ────────────────────────────────────────────
   Scroll Reveal Hook
   ──────────────────────────────────────────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ════════════════════════════════════════════
   LANDING PAGE
   ════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Metrics counters */
  const diag = useCounter(12847, 2200);
  const uptime = useCounter(99, 1800);
  const rules = useCounter(2400, 2000);
  const hardware = useCounter(48, 1400);

  /* Section reveals */
  const trustReveal = useScrollReveal();
  const featuresReveal = useScrollReveal();
  const howReveal = useScrollReveal();
  const metricsReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  /* Scroll handler for nav */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Metrics", href: "#metrics" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#f0f6fc] overflow-x-hidden">
      {/* ──── NAVIGATION ──── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-nav shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2fe] to-[#10b981] flex items-center justify-center">
                <Cpu className="w-4.5 h-4.5 text-[#0a0c10]" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-semibold tracking-tight">
                NetDiag<span className="text-[#00f2fe]">.</span>Expert
              </span>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[#94a3b8] hover:text-[#f0f6fc] transition-colors duration-200"
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm text-[#94a3b8] hover:text-[#f0f6fc] transition-colors duration-200 px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="btn-press text-sm font-medium bg-gradient-to-r from-[#00f2fe] to-[#10b981] text-[#0a0c10] px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-[#00f2fe]/20 transition-all duration-200 cursor-pointer"
              >
                Launch Console
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#94a3b8] hover:text-[#f0f6fc] cursor-pointer"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-nav border-t border-white/[0.06] animate-fadeIn">
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-[#94a3b8] hover:text-[#f0f6fc] py-2"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/[0.06] space-y-2">
                <Link
                  href="/signin"
                  className="block text-sm text-center text-[#94a3b8] hover:text-[#f0f6fc] py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-sm text-center font-medium bg-gradient-to-r from-[#00f2fe] to-[#10b981] text-[#0a0c10] py-2.5 rounded-full"
                >
                  Launch Console
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ──── HERO ──── */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 overflow-hidden">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-[#00f2fe]/8 blur-3xl animate-float-orb pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] rounded-full bg-[#10b981]/6 blur-3xl animate-float-orb-delayed pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#06b6d4]/5 blur-3xl animate-float-orb-slow pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-[#94a3b8] mb-8 animate-fade-in-up opacity-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse-subtle" />
            ECE 515.2 — Forward-Chaining Expert System
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6 animate-fade-in-up-d1 opacity-0">
            Hardware Diagnostics.{" "}
            <span className="text-gradient-animated">Perfected.</span>
          </h1>

          {/* Sub-headline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#94a3b8] leading-relaxed mb-10 animate-fade-in-up-d2 opacity-0">
            Professional-grade ESP32 fault isolation powered by a forward-chaining
            inference engine. Real-time telemetry, intelligent rule processing, and
            precision diagnostics — in one unified console.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up-d3 opacity-0">
            <Link
              href="/dashboard"
              className="btn-press group flex items-center gap-2 bg-gradient-to-r from-[#00f2fe] to-[#10b981] text-[#0a0c10] font-semibold px-8 py-3.5 rounded-full text-base hover:shadow-xl hover:shadow-[#00f2fe]/20 transition-all duration-300 cursor-pointer"
            >
              Open Diagnostic Console
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="#features"
              className="btn-press flex items-center gap-2 border border-white/[0.12] text-[#f0f6fc] px-8 py-3.5 rounded-full text-base hover:border-white/[0.25] hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
            >
              Explore Features
            </a>
          </div>

          {/* Dashboard preview */}
          <div className="relative max-w-3xl mx-auto animate-fade-in-up-d4 opacity-0">
            <div className="animate-dashboard-float">
              <div className="rounded-2xl border border-white/[0.08] bg-[#161b22]/80 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/40">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0d1117]/60">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ef4444]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#f59e0b]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#10b981]/70" />
                  </div>
                  <span className="text-xs text-[#94a3b8] ml-2 font-mono">
                    netdiag.expert/dashboard
                  </span>
                </div>
                {/* Preview content */}
                <div className="p-6 sm:p-8 bg-telemetry-grid">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
                    {[
                      { label: "CPU Temp", value: "42.3°C", color: "#10b981" },
                      { label: "WiFi RSSI", value: "-38 dBm", color: "#00f2fe" },
                      { label: "Heap Free", value: "184 KB", color: "#f59e0b" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl bg-[#0d1117]/60 border border-white/[0.06] p-3 sm:p-4"
                      >
                        <div className="text-[10px] sm:text-xs text-[#64748b] uppercase tracking-wider mb-1">
                          {m.label}
                        </div>
                        <div
                          className="text-base sm:text-xl font-bold font-mono"
                          style={{ color: m.color }}
                        >
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Fake waveform lines */}
                  <div className="rounded-lg bg-[#0d1117]/60 border border-white/[0.06] p-4 h-24 sm:h-32 flex items-end gap-[2px]">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const h = 20 + Math.sin(i * 0.4) * 30 + Math.random() * 20;
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-gradient-to-t from-[#00f2fe]/60 to-[#10b981]/40"
                          style={{ height: `${h}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom glow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#00f2fe]/10 blur-2xl rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ──── TRUST BAR ──── */}
      <section
        ref={trustReveal.ref}
        className={`py-12 border-y border-white/[0.04] transition-all duration-700 ${
          trustReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs sm:text-sm text-[#64748b]">
          {[
            { icon: Shield, label: "ECE 515 Certified" },
            { icon: Cpu, label: "ESP32 Optimized" },
            { icon: Wifi, label: "ESP-NOW Protocol" },
            { icon: Database, label: "Rule-Based Engine" },
            { icon: GitBranch, label: "Forward Chaining" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-2">
              <t.icon className="w-4 h-4 text-[#475569]" />
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ──── FEATURES ──── */}
      <section id="features" ref={featuresReveal.ref} className="py-24 sm:py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              featuresReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-sm text-[#00f2fe] font-medium tracking-wider uppercase mb-3">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need for hardware fault isolation
            </h2>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 transition-all duration-700 delay-200 ${
              featuresReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {[
              {
                icon: Search,
                title: "Intelligent Diagnostics",
                desc: "Forward-chaining inference engine processes 2,400+ rules to systematically isolate ESP32 hardware faults with surgical precision.",
                accent: "#00f2fe",
              },
              {
                icon: Activity,
                title: "Real-Time Telemetry",
                desc: "Live oscilloscope waveforms, serial monitor streaming, and GPIO state monitoring — all rendered at sub-millisecond refresh rates.",
                accent: "#10b981",
              },
              {
                icon: BookOpen,
                title: "Knowledge Base",
                desc: "Comprehensive library of hardware failure patterns, component datasheets, and diagnostic decision trees curated by ECE engineers.",
                accent: "#f59e0b",
              },
              {
                icon: Terminal,
                title: "Serial Console",
                desc: "Built-in serial monitor with ANSI color rendering, baud rate auto-detection, and intelligent log parsing for rapid debugging.",
                accent: "#8b5cf6",
              },
              {
                icon: BarChart3,
                title: "System Dashboard",
                desc: "Unified hardware health overview — CPU temperature, memory allocation, WiFi signal strength, and subsystem status at a glance.",
                accent: "#ec4899",
              },
              {
                icon: Layers,
                title: "ESP32 Pinout Mapping",
                desc: "Interactive block diagram with real-time GPIO state overlay. Click any pin to inspect its current configuration and signal path.",
                accent: "#06b6d4",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 sm:p-7 group cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${f.accent}15` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section id="how-it-works" ref={howReveal.ref} className="py-24 sm:py-32 px-4 relative">
        {/* Subtle bg glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00f2fe]/3 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            className={`text-center mb-20 transition-all duration-700 ${
              howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-sm text-[#10b981] font-medium tracking-wider uppercase mb-3">
              Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Three steps to resolution
            </h2>
          </div>

          <div className="space-y-16 sm:space-y-20">
            {[
              {
                step: "01",
                title: "Describe the Symptom",
                desc: "Enter a natural-language description of the hardware fault. The system parses keywords and maps them to diagnostic entry points in the rule base.",
                icon: Search,
              },
              {
                step: "02",
                title: "Engine Processes Rules",
                desc: "The forward-chaining inference engine fires matching rules, walks the decision tree, and collects telemetry data to narrow the fault domain.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Receive Diagnosis",
                desc: "Get a structured diagnosis report with root cause identification, confidence scores, remediation steps, and linked knowledge base articles.",
                icon: Activity,
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`flex flex-col sm:flex-row items-start gap-6 sm:gap-8 transition-all duration-700 ${
                  howReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 150 + 200}ms` }}
              >
                {/* Step number */}
                <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f2fe]/10 to-[#10b981]/10 border border-white/[0.08] flex items-center justify-center">
                  <span className="text-2xl font-bold text-gradient-animated">
                    {s.step}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <s.icon className="w-4 h-4 text-[#00f2fe]" />
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                  </div>
                  <p className="text-[#94a3b8] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── METRICS ──── */}
      <section id="metrics" ref={metricsReveal.ref} className="py-24 sm:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              metricsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <p className="text-sm text-[#f59e0b] font-medium tracking-wider uppercase mb-3">
              Performance
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for reliability
            </h2>
          </div>

          <div
            className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 transition-all duration-700 delay-200 ${
              metricsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {[
              { ref: diag.ref, count: diag.count, suffix: "+", label: "Diagnostics Run", color: "#00f2fe" },
              { ref: uptime.ref, count: uptime.count, suffix: ".9%", label: "System Uptime", color: "#10b981" },
              { ref: rules.ref, count: rules.count, suffix: "+", label: "Rules Processed", color: "#f59e0b" },
              { ref: hardware.ref, count: hardware.count, suffix: "+", label: "Hardware Profiles", color: "#8b5cf6" },
            ].map((m) => (
              <div
                key={m.label}
                ref={m.ref}
                className="glass-card rounded-2xl p-6 sm:p-8 text-center"
              >
                <div
                  className="text-3xl sm:text-4xl font-bold font-mono mb-2"
                  style={{ color: m.color }}
                >
                  {m.count.toLocaleString()}
                  <span className="text-xl sm:text-2xl">{m.suffix}</span>
                </div>
                <div className="text-xs sm:text-sm text-[#64748b]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── FINAL CTA ──── */}
      <section ref={ctaReveal.ref} className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-[#00f2fe]/6 to-transparent blur-3xl" />
        </div>

        <div
          className={`relative max-w-3xl mx-auto text-center transition-all duration-700 ${
            ctaReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to diagnose{" "}
            <span className="text-gradient-animated">smarter</span>?
          </h2>
          <p className="text-lg text-[#94a3b8] mb-10 max-w-xl mx-auto">
            Open the diagnostic console and let the expert system guide you through
            precision hardware fault isolation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="btn-press group flex items-center gap-2 bg-gradient-to-r from-[#00f2fe] to-[#10b981] text-[#0a0c10] font-semibold px-8 py-3.5 rounded-full text-base hover:shadow-xl hover:shadow-[#00f2fe]/20 transition-all duration-300 cursor-pointer"
            >
              Launch Console
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/signin"
              className="btn-press text-sm text-[#94a3b8] hover:text-[#f0f6fc] transition-colors duration-200 px-6 py-3.5 cursor-pointer"
            >
              Sign in to your account →
            </Link>
          </div>
        </div>
      </section>

      {/* ──── FOOTER ──── */}
      <footer className="border-t border-white/[0.04] py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00f2fe] to-[#10b981] flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-[#0a0c10]" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium">
              NetDiag<span className="text-[#00f2fe]">.</span>Expert
            </span>
          </div>
          <p className="text-xs text-[#475569] text-center">
            ECE 515.2 · Group 11 · University of Port Harcourt · {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xs text-[#64748b] hover:text-[#f0f6fc] transition-colors">
              Dashboard
            </Link>
            <Link href="/signin" className="text-xs text-[#64748b] hover:text-[#f0f6fc] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
