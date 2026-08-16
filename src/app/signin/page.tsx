"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cpu, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; password?: string; general?: string }>({});

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const validate = () => {
    const errs: { name?: string; password?: string } = {};
    if (!name.trim()) errs.name = "Please enter your full name";
    if (!password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);

    // Simulate brief auth delay for feel
    setTimeout(() => {
      const result = signIn(name, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setLoading(false);
        setErrors({ general: result.error });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#f0f6fc] flex">
      {/* ──── LEFT PANEL: Brand Showcase ──── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#00f2fe]/10 blur-3xl animate-orb-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-[#10b981]/8 blur-3xl animate-orb-pulse" style={{ animationDelay: "5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#8b5cf6]/5 blur-3xl animate-orb-pulse" style={{ animationDelay: "10s" }} />
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-telemetry-grid opacity-30" />

        {/* Content */}
        <div className="relative z-10 px-12 max-w-md text-center">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f2fe] to-[#10b981] flex items-center justify-center shadow-lg shadow-[#00f2fe]/20">
              <Cpu className="w-6 h-6 text-[#0a0c10]" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              NetDiag<span className="text-[#00f2fe]">.</span>Expert
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-4 tracking-tight">
            Precision hardware diagnostics,{" "}
            <span className="text-gradient-animated">redefined.</span>
          </h2>

          <p className="text-[#94a3b8] leading-relaxed mb-8">
            The forward-chaining expert system trusted by ECE engineers for
            ESP32 fault isolation, real-time telemetry, and intelligent
            hardware analysis.
          </p>

          {/* Mini feature cards */}
          <div className="space-y-3">
            {[
              { label: "2,400+ diagnostic rules", color: "#00f2fe" },
              { label: "Real-time serial monitoring", color: "#10b981" },
              { label: "Interactive ESP32 pinout", color: "#f59e0b" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: f.color }}
                />
                <span className="text-sm text-[#94a3b8]">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──── RIGHT PANEL: Sign-In Form ──── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 sm:px-12 py-12 relative">
        {/* Mobile-only brand header */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2fe] to-[#10b981] flex items-center justify-center">
            <Cpu className="w-4.5 h-4.5 text-[#0a0c10]" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            NetDiag<span className="text-[#00f2fe]">.</span>Expert
          </span>
        </div>

        {/* Back link */}
        <div className="w-full max-w-sm mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f0f6fc] transition-colors duration-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-[#64748b] mb-8">
            Sign in with your name and matriculation number.
          </p>

          {/* General error */}
          {errors.general && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 text-sm text-[#ef4444] animate-fadeIn">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#94a3b8] mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined, general: undefined }));
                }}
                className={`input-focus-glow w-full px-4 py-3 rounded-xl bg-[#161b22] border text-sm text-[#f0f6fc] placeholder-[#475569] transition-all duration-200 ${
                  errors.name
                    ? "border-[#ef4444]/60 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                    : "border-white/[0.08] hover:border-white/[0.14]"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-[#ef4444]">{errors.name}</p>
              )}
            </div>

            {/* Password (Matriculation Number) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#94a3b8]"
                >
                  Matriculation Number
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: undefined, general: undefined }));
                  }}
                  className={`input-focus-glow w-full px-4 py-3 pr-11 rounded-xl bg-[#161b22] border text-sm text-[#f0f6fc] placeholder-[#475569] transition-all duration-200 ${
                    errors.password
                      ? "border-[#ef4444]/60 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
                      : "border-white/[0.08] hover:border-white/[0.14]"
                  }`}
                  placeholder="U2021/3020xxx"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-[#ef4444]">{errors.password}</p>
              )}
              <p className="mt-1.5 text-xs text-[#475569]">
                Your password is your matriculation number (e.g. U2021/3020xxx)
              </p>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={remember}
                onClick={() => setRemember(!remember)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  remember
                    ? "bg-[#00f2fe] border-[#00f2fe]"
                    : "border-white/[0.15] hover:border-white/[0.25]"
                }`}
              >
                {remember && (
                  <svg
                    className="w-2.5 h-2.5 text-[#0a0c10]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span className="text-sm text-[#94a3b8]">Remember me</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00f2fe] to-[#10b981] text-[#0a0c10] font-semibold py-3 rounded-xl text-sm hover:shadow-lg hover:shadow-[#00f2fe]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin-fast" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Info note */}
          <div className="mt-6 px-4 py-3 rounded-xl bg-[#161b22] border border-white/[0.06] text-xs text-[#64748b] leading-relaxed">
            <span className="text-[#00f2fe] font-medium">Note:</span> Only ECE 515.2 Group 11 members
            are authorized to access the diagnostic console. Enter your full name and
            matriculation number.
          </div>

          {/* Bottom link */}
          <p className="text-center text-sm text-[#64748b] mt-8">
            Back to the{" "}
            <Link
              href="/"
              className="text-[#00f2fe] hover:text-[#06b6d4] transition-colors font-medium"
            >
              landing page
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-[#333d4b]">
          ECE 515.2 · University of Port Harcourt
        </p>
      </div>
    </div>
  );
}
