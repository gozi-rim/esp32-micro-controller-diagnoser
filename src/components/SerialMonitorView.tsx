"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Usb,
  Play,
  Square,
  Trash2,
  Download,
  Copy,
  AlertTriangle,
  Zap,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Activity,
  Check,
  Cpu
} from "lucide-react";
import { knowledgeBase } from "@/data/knowledgeBase";

interface SerialMonitorViewProps {
  onAutoDiagnoseRule?: (nodeId: string) => void;
}

interface CrashPattern {
  pattern: RegExp;
  title: string;
  ruleId: string;
  targetNodeId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  explanation: string;
}

const ESP32_CRASH_PATTERNS: CrashPattern[] = [
  {
    pattern: /Brownout detector was triggered/i,
    title: "Brownout Detector Voltage Droop",
    ruleId: "RULE-PWR-01",
    targetNodeId: "diag_brownout_transient_spike",
    severity: "CRITICAL",
    explanation: "3.3V power rail dropped below 2.80V during RF power amplifier transmission inrush."
  },
  {
    pattern: /(Task watchdog got triggered|RTCWDT_RTC_RESET|TG0WDT_SYS_RESET|Interrupt wdt timeout)/i,
    title: "FreeRTOS Task Watchdog Timer (TWDT) Hang",
    ruleId: "RULE-WIFI-01",
    targetNodeId: "diag_wifi_blocking_loop_twdt",
    severity: "CRITICAL",
    explanation: "CPU Core blocked in tight non-yielding loop or while() wait without vTaskDelay()."
  },
  {
    pattern: /(Guru Meditation Error|LoadProhibited|ESP_ERR_ESPNOW_NOT_INIT)/i,
    title: "ESP-NOW Uninitialized Driver / Memory Fault",
    ruleId: "RULE-ESPNOW-03",
    targetNodeId: "diag_espnow_wifi_mode_missing",
    severity: "HIGH",
    explanation: "Underlying ESP-IDF 802.11 driver stack was uninitialized prior to ESP-NOW invocation."
  },
  {
    pattern: /(flash read err, 1000|boot:0x13 \(SPI_FAST_FLASH_BOOT\)|boot:0x33)/i,
    title: "GPIO 12 Flash Voltage Mismatch",
    ruleId: "RULE-FLASH-01",
    targetNodeId: "diag_flash_voltage_mismatch",
    severity: "CRITICAL",
    explanation: "Strapping pin GPIO 12 pulled HIGH at boot, switching internal LDO to 1.8V instead of 3.3V."
  },
  {
    pattern: /boot:0x3 \(DOWNLOAD_BOOT\(UART\)\)/i,
    title: "Bootloader ROM Download Mode Trap",
    ruleId: "RULE-STRAP-01",
    targetNodeId: "diag_strapping_pin_failure",
    severity: "HIGH",
    explanation: "GPIO 0 held LOW during reset; ESP32 is trapped waiting for UART flash tool."
  },
  {
    pattern: /(ESP_ERR_ESPNOW_NOT_FOUND|ESP_ERR_ESPNOW_FULL)/i,
    title: "ESP-NOW Peer MAC Table Overflow",
    ruleId: "RULE-ESPNOW-04",
    targetNodeId: "diag_espnow_peer_capacity_exceeded",
    severity: "HIGH",
    explanation: "Transmission attempted to an unregistered peer MAC or 20-peer table is full."
  },
  {
    pattern: /(i2c_master_cmd_begin|I2C bus lockup|ESP_ERR_TIMEOUT)/i,
    title: "I2C Open-Drain Bus Lockup",
    ruleId: "RULE-I2C-01",
    targetNodeId: "diag_i2c_bus_lockup",
    severity: "HIGH",
    explanation: "Missing 4.7kΩ pull-up resistors on SDA/SCL or slave device holding line LOW."
  },
  {
    pattern: /(ADC2 is used by Wi-Fi|adc2_get_raw)/i,
    title: "ADC2 & Wi-Fi Radio Hardware Conflict",
    ruleId: "RULE-ADC-01",
    targetNodeId: "diag_adc2_wifi_conflict",
    severity: "MEDIUM",
    explanation: "ADC2 SAR controller is locked by the 2.4GHz Wi-Fi radio calibration routine."
  }
];

const PRESET_CRASH_DUMPS = [
  {
    name: "⚡ 3.3V Brownout Inrush Reset",
    text: `rst:0xc (SW_CPU_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)
configsip: 0, SPIWP:0xee
clk_drv:0x00,q_drv:0x00,d_drv:0x00,cs0_drv:0x00,hd_drv:0x00,wp_drv:0x00
mode:DIO, clock div:2
load:0x3fff0018,len:4
load:0x3fff001c,len:1044
load:0x40078000,len:8896
load:0x40080400,len:5816
entry 0x400806ac
I (412) wifi:wifi driver task: 3ffaffb4, prio:23, stack:3584, core=0
I (414) wifi:Init success
I (416) wifi:Connecting to SSID: 'LAB_BENCH_5G'...
Brownout detector was triggered
ets Jun  8 2016 00:22:57,rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)`
  },
  {
    name: "⏱️ FreeRTOS Task Watchdog Panic",
    text: `E (10542) task_wdt: Task watchdog got triggered. The following tasks did not reset the watchdog in 5000ms:
E (10542) task_wdt:  - loopTask (CPU 1)
E (10542) task_wdt: Tasks currently running:
E (10542) task_wdt: CPU 0: IDLE0
E (10542) task_wdt: CPU 1: loopTask
E (10542) task_wdt: Print CPU 1 (current core) backtrace
Backtrace:0x40081bb5:0x3ffb1fa0 0x40082987:0x3ffb1fc0 0x400d11f8:0x3ffb2000
Guru Meditation Error: Core 1 panic'ed (Interrupt wdt timeout on CPU1)`
  },
  {
    name: "💥 Guru Meditation (LoadProhibited)",
    text: `Guru Meditation Error: Core 0 panic'ed (LoadProhibited). Exception was unhandled.
Core 0 register dump:
PC      : 0x400d14b8  PS      : 0x00060030  A0      : 0x800d15ec  A1      : 0x3ffaff20  
A2      : 0x00000000  A3      : 0x3ffb2344  A4      : 0x00000014  A5      : 0x00000001  
A6      : 0x00000000  A7      : 0x3ffaff80  A8      : 0x800d14b0  A9      : 0x3ffaff00  
A10     : 0x00000000  A11     : 0x3ffaff60  A12     : 0x00000008  A13     : 0x3ffb2360  
A14     : 0x00000000  A15     : 0x3ffb0000  SAR     : 0x00000010  EXCCAUSE: 0x0000001c  
EXCVADDR: 0x00000004  LBEG    : 0x4000c2e0  LEND    : 0x4000c2f6  LCOUNT  : 0xffffffff  
ELF file SHA256: 3c9b748281d7f8d6`
  },
  {
    name: "⚠️ GPIO 12 Flash Voltage 1.8V Mismatch",
    text: `rst:0x10 (RTCWDT_RTC_RESET),boot:0x33 (SPI_FAST_FLASH_BOOT)
flash read err, 1000
ets_main.c 371 
ets Jun  8 2016 00:22:57,rst:0x10 (RTCWDT_RTC_RESET),boot:0x33 (SPI_FAST_FLASH_BOOT)
flash read err, 1000
ets_main.c 371`
  },
  {
    name: "🔌 I2C Open-Drain Bus Lockup",
    text: `[I2C] Scanning bus on SDA=GPIO21, SCL=GPIO22...
E (1250) i2c: i2c_master_cmd_begin(): I2C bus lockup - SCL held LOW by target or missing pull-up
E (1252) wire: ESP_ERR_TIMEOUT in endTransmission(true)
I2C Device probe failed at address 0x3C (OLED Display)`
  },
  {
    name: "🎯 ADC2 & Wi-Fi Radio Conflict",
    text: `[ADC] Initializing ADC2 Channel 8 on GPIO 25...
[WIFI] Wi-Fi STA starting connection...
W (4512) adc: adc2_get_raw(): ADC2 is used by Wi-Fi! Returned 0.
Sensor read failed: ADC value = 0 (SAR controller locked)`
  }
];

export function SerialMonitorView({ onAutoDiagnoseRule }: SerialMonitorViewProps) {
  const [logs, setLogs] = useState<string[]>([
    "--- NetDiag.Expert USB Serial Monitor Initialized ---",
    "--- Select a baud rate and connect to USB COM port or inject a test dump ---"
  ]);
  const [baudRate, setBaudRate] = useState<number>(115200);
  const [isConnected, setIsConnected] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [detectedCrash, setDetectedCrash] = useState<CrashPattern | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isWebSerialSupported, setIsWebSerialSupported] = useState(true);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const portRef = useRef<any>(null);
  const readerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsWebSerialSupported("serial" in navigator);
    }
  }, []);

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  // Scan incoming lines for ESP32 panic patterns
  const inspectLineForPanics = (text: string) => {
    for (const pattern of ESP32_CRASH_PATTERNS) {
      if (pattern.pattern.test(text)) {
        setDetectedCrash(pattern);
        break;
      }
    }
  };

  // Real USB Web Serial connection
  const handleConnectUsb = async () => {
    if (!("serial" in navigator)) {
      alert("Web Serial API is not supported in this browser. Please use Chrome, Edge, or Opera.");
      return;
    }

    try {
      const serial = (navigator as any).serial;
      const port = await serial.requestPort();
      await port.open({ baudRate });

      portRef.current = port;
      setIsConnected(true);
      setLogs((prev) => [
        ...prev,
        `[USB] Connected to ESP32 Serial Port at ${baudRate} baud (8-N-1)...`
      ]);

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const reader = textDecoder.readable.getReader();
      readerRef.current = reader;

      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          reader.releaseLock();
          break;
        }
        if (value) {
          buffer += value;
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.replace(/\r/g, "");
            setLogs((prev) => [...prev, cleanLine]);
            inspectLineForPanics(cleanLine);
          }
        }
      }
    } catch (err: any) {
      console.error("Web Serial Error:", err);
      setLogs((prev) => [...prev, `[USB ERROR] ${err.message || err}`]);
      setIsConnected(false);
    }
  };

  const handleDisconnectUsb = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      setIsConnected(false);
      setLogs((prev) => [...prev, "[USB] Port disconnected."]);
    } catch (err: any) {
      console.error("Disconnect error:", err);
    }
  };

  // Inject Simulated Hardware Crash Stream
  const handleInjectDump = (dump: typeof PRESET_CRASH_DUMPS[0]) => {
    const timestamp = new Date().toLocaleTimeString();
    const dumpLines = dump.text.split("\n");

    setLogs((prev) => [
      ...prev,
      `\n--- [${timestamp}] INJECTED HARDWARE TELEMETRY STREAM: ${dump.name} ---`
    ]);

    dumpLines.forEach((line, i) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, line]);
        inspectLineForPanics(line);
      }, i * 75);
    });
  };

  const handleClear = () => {
    setLogs([]);
    setDetectedCrash(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([logs.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `esp32_serial_dump_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn font-mono text-xs">
      {/* Top Header & Hardware Controls */}
      <div className="w-full p-5 rounded-2xl bg-[#161b22] border border-white/[0.08] shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.15)]">
            <Usb className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-sans">
                Web Serial USB Hardware Monitor
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isConnected
                    ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40"
                    : "bg-white/[0.06] text-slate-400 border border-white/[0.08]"
                }`}
              >
                {isConnected ? "CONNECTED (LIVE RX)" : "OFFLINE / READY"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
              Direct physical UART serial capture &amp; real-time ESP-IDF Guru Meditation / Panic classifier.
            </p>
          </div>
        </div>

        {/* USB Connect & Baud Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#0d1117] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <span className="text-[10px] text-slate-500 uppercase">BAUD:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              disabled={isConnected}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value={115200} className="bg-[#161b22]">115200 (Default)</option>
              <option value={921600} className="bg-[#161b22]">921600 (High Speed)</option>
              <option value={74880} className="bg-[#161b22]">74880 (ESP ROM Boot)</option>
              <option value={9600} className="bg-[#161b22]">9600 (Standard)</option>
            </select>
          </div>

          {isConnected ? (
            <button
              onClick={handleDisconnectUsb}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 font-bold transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              Disconnect USB
            </button>
          ) : (
            <button
              onClick={handleConnectUsb}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00f2fe] hover:bg-[#00d8e4] text-slate-950 font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,242,254,0.25)] cursor-pointer"
            >
              <Usb className="w-3.5 h-3.5" />
              Connect USB Device
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Crash Pattern Detection Alert Banner */}
      {detectedCrash && (
        <div className="w-full p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)] animate-fadeIn flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm font-sans">
                  {detectedCrash.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500 text-slate-950 font-extrabold text-[10px]">
                  {detectedCrash.ruleId}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] border border-rose-500/30">
                  {detectedCrash.severity}
                </span>
              </div>
              <p className="text-[11px] text-rose-200/90 font-sans">
                {detectedCrash.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={() => onAutoDiagnoseRule && onAutoDiagnoseRule(detectedCrash.targetNodeId)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f2fe] hover:bg-[#00d8e4] text-slate-950 font-bold text-xs transition-all shadow-lg hover:shadow-[0_0_20px_rgba(0,242,254,0.3)] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            Auto-Launch Diagnostic Rule &amp; Solution
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Preset Hardware Crash Injectors Strip */}
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#00f2fe]" />
            Hardware Panic Test Injectors (Simulated Crash Dumps)
          </span>
          <span className="text-[10px] text-slate-500">
            Click any button to inject serial crash stream
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_CRASH_DUMPS.map((dump, idx) => (
            <button
              key={idx}
              onClick={() => handleInjectDump(dump)}
              className="p-2.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-white/[0.08] hover:border-[#00f2fe]/40 text-slate-300 hover:text-white transition-all text-left text-[11px] font-sans font-medium cursor-pointer truncate"
              title={dump.name}
            >
              {dump.name}
            </button>
          ))}
        </div>
      </div>

      {/* Serial Terminal Output Window */}
      <div className="w-full rounded-2xl bg-[#080a0f] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col">
        {/* Terminal Header Bar */}
        <div className="px-4 py-2.5 bg-[#161b22] border-b border-white/[0.08] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00f2fe]" />
            <span className="text-white font-bold tracking-wider">
              ESP32 SERIAL OUTPUT STREAM
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ({logs.length} lines)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScroll}
                onChange={(e) => setAutoScroll(e.target.checked)}
                className="rounded border-white/[0.2] bg-[#0d1117] text-[#00f2fe]"
              />
              Auto-Scroll
            </label>

            <div className="w-px h-4 bg-white/[0.08] mx-1" />

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-slate-400 hover:text-white transition-colors"
              title="Copy Output"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-[#21262d] text-slate-400 hover:text-white transition-colors"
              title="Export Log File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-[#0d1117] hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear Terminal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Screen Text Area */}
        <div className="p-4 h-80 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-0.5 text-slate-300 select-text">
          {logs.map((line, idx) => {
            const isError =
              line.includes("Guru Meditation") ||
              line.includes("Brownout detector") ||
              line.includes("flash read err") ||
              line.includes("E (") ||
              line.includes("panic");
            const isWarning = line.includes("W (") || line.includes("warning");
            const isHeader = line.startsWith("---");

            return (
              <div
                key={idx}
                className={`${
                  isError
                    ? "text-[#ef4444] font-bold bg-rose-950/20 px-1 rounded"
                    : isWarning
                    ? "text-[#f59e0b]"
                    : isHeader
                    ? "text-[#00f2fe] font-semibold pt-1"
                    : "text-slate-300"
                }`}
              >
                {line}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
