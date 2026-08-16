"use client";

import React, { useRef, useEffect, useState } from "react";
import { Activity, Play, Pause, AlertTriangle, Zap, RefreshCw } from "lucide-react";
import { ESP32SubsystemCategory } from "./ESP32Diagram";

interface OscilloscopeWaveformProps {
  category: ESP32SubsystemCategory;
  isSimulating?: boolean;
}

export function OscilloscopeWaveform({
  category,
  isSimulating = true
}: OscilloscopeWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [timebase, setTimebase] = useState<number>(5); // ms per division
  const [vMin, setVMin] = useState<string>("3.30 V");
  const [vMax, setVMax] = useState<string>("3.32 V");
  const [vRms, setVRms] = useState<string>("3.29 V");
  const [isBrownoutTriggered, setIsBrownoutTriggered] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let offset = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (!isRunning) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark oscilloscope canvas background
      ctx.fillStyle = "#080a0f";
      ctx.fillRect(0, 0, width, height);

      // Draw Oscilloscope Reticle Grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";

      // Vertical division lines (10 divisions)
      const xDiv = width / 10;
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo(i * xDiv, 0);
        ctx.lineTo(i * xDiv, height);
        ctx.stroke();
      }

      // Horizontal division lines (6 divisions)
      const yDiv = height / 6;
      for (let j = 1; j < 6; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * yDiv);
        ctx.lineTo(width, j * yDiv);
        ctx.stroke();
      }

      // Center crosshair axis
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();

      // 2.80V ESP32 Brownout Threshold Line (Red Dashed Line)
      // Height map: 0V at bottom (y = height - 20), 4.0V at top (y = 20)
      const vToY = (volts: number) => {
        const minV = 0.0;
        const maxV = 4.2;
        const normalized = (volts - minV) / (maxV - minV);
        return height - 20 - normalized * (height - 40);
      };

      const thresholdY = vToY(2.80);
      ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, thresholdY);
      ctx.lineTo(width, thresholdY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Threshold Label
      ctx.fillStyle = "#ef4444";
      ctx.font = "9px monospace";
      ctx.fillText("2.80V BROWNOUT THRESHOLD", 10, thresholdY - 4);

      // Draw 3.3V Nominal Reference Line
      const nominalY = vToY(3.30);
      ctx.fillStyle = "rgba(0, 242, 254, 0.6)";
      ctx.fillText("3.30V VDD NOMINAL", width - 110, nominalY - 4);

      // Waveform trace generator
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00f2fe";
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 8;

      ctx.beginPath();
      let localMin = 3.30;
      let localMax = 3.30;
      let sumSq = 0;
      let sampleCount = 0;
      let triggered = false;

      offset += 2.5;

      for (let x = 0; x < width; x++) {
        const t = (x + offset) * 0.04;
        let v = 3.30;

        if (category === "brownout") {
          // Simulated 450mA RF power amplifier inrush dip
          const burst = Math.sin(t * 0.4);
          if (burst > 0.85) {
            // Voltage drops sharply to ~2.54V during RF burst
            v = 3.30 - (burst - 0.85) * 5.2 + (Math.random() - 0.5) * 0.08;
            if (v < 2.80) triggered = true;
          } else {
            v = 3.30 + (Math.random() - 0.5) * 0.03;
          }
        } else if (category === "wifi" || category === "espnow") {
          // Small RF ripples during MAC frame bursts (3.25V - 3.32V)
          v = 3.28 + Math.sin(t * 1.5) * 0.03 + (Math.random() - 0.5) * 0.02;
        } else if (category === "gpio") {
          // 3.3V Digital square wave with 5V overvoltage inductive spike
          const sq = Math.sin(t * 0.8) > 0 ? 3.3 : 0.0;
          const spike = Math.sin(t * 0.8) > 0.95 ? 1.6 : 0.0;
          v = sq + spike + (Math.random() - 0.5) * 0.02;
        } else if (category === "i2c") {
          // I2C Open drain rising curve
          const phase = (t * 0.6) % Math.PI;
          v = phase > 1.5 ? 3.30 * (1 - Math.exp(-(phase - 1.5) * 2.5)) : 0.1;
        } else if (category === "spi") {
          // 20MHz SPI clock trace with capacitive slew
          v = 1.65 + Math.sin(t * 3.0) * 1.55 + (Math.random() - 0.5) * 0.04;
        } else {
          // Clean 3.3V nominal rail
          v = 3.30 + (Math.random() - 0.5) * 0.02;
        }

        if (v < localMin) localMin = v;
        if (v > localMax) localMax = v;
        sumSq += v * v;
        sampleCount++;

        const y = vToY(v);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Update HUD metrics
      const rms = Math.sqrt(sumSq / sampleCount);
      setVMin(`${localMin.toFixed(2)} V`);
      setVMax(`${localMax.toFixed(2)} V`);
      setVRms(`${rms.toFixed(2)} V`);
      setIsBrownoutTriggered(triggered);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [category, isRunning, timebase]);

  return (
    <div className="w-full bg-[#161b22] border border-white/[0.08] rounded-2xl p-4 shadow-2xl relative overflow-hidden space-y-3">
      {/* Top Scope Header */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00f2fe] animate-pulse" />
          <span className="text-white font-bold tracking-wider">
            LIVE OSCILLOSCOPE (3.3V RAIL TELEMETRY)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              isBrownoutTriggered
                ? "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 animate-pulse"
                : "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30"
            }`}
          >
            {isBrownoutTriggered ? "⚠️ BROWNOUT TRIP" : "TRIG: AUTO (OK)"}
          </span>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-slate-300 border border-white/[0.08] transition-colors"
            title={isRunning ? "Freeze Scope" : "Run Scope"}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Scope Canvas Screen */}
      <div className="w-full relative rounded-xl overflow-hidden border border-white/[0.08] shadow-inner bg-[#080a0f]">
        <canvas
          ref={canvasRef}
          width={560}
          height={160}
          className="w-full h-36 block"
        />

        {/* Floating Scope Corner Badges */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-[#00f2fe] bg-black/60 px-2 py-0.5 rounded border border-white/[0.08] backdrop-blur-sm">
          CH1: 1.00V / DIV
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/[0.08] backdrop-blur-sm">
          TB: {timebase}ms / DIV
        </div>
      </div>

      {/* Scope Live Measurements Strip */}
      <div className="grid grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2 rounded-xl bg-[#0d1117] border border-white/[0.06] text-center">
          <span className="text-[9px] text-slate-500 block uppercase">V_RMS</span>
          <span className="text-white font-bold text-xs">{vRms}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#0d1117] border border-white/[0.06] text-center">
          <span className="text-[9px] text-slate-500 block uppercase">V_MIN (DIP)</span>
          <span
            className={`font-bold text-xs ${
              isBrownoutTriggered ? "text-[#ef4444]" : "text-[#10b981]"
            }`}
          >
            {vMin}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-[#0d1117] border border-white/[0.06] text-center">
          <span className="text-[9px] text-slate-500 block uppercase">V_MAX (PEAK)</span>
          <span className="text-white font-bold text-xs">{vMax}</span>
        </div>
        <div className="p-2 rounded-xl bg-[#0d1117] border border-white/[0.06] text-center">
          <span className="text-[9px] text-slate-500 block uppercase">SAMPLING</span>
          <span className="text-[#00f2fe] font-bold text-xs">100 kS/s</span>
        </div>
      </div>
    </div>
  );
}
