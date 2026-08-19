# NetDiag Expert

### An AI-powered expert system for diagnosing ESP32 microcontroller problems

**NetDiag Expert** is an open-source web-based diagnostic system that helps developers, students, and electronics enthusiasts troubleshoot common problems with ESP32 microcontrollers.

Instead of searching through scattered documentation, guessing at possible causes, or repeatedly testing hardware, NetDiag Expert guides the user through a structured diagnostic process.

Describe the problem.
Answer a few targeted questions.
Follow the reasoning.
Get a diagnosis and actionable repair steps.

---

## The Problem

ESP32 boards are inexpensive, powerful, and widely used in IoT, robotics, embedded systems, education, and electronics projects.

But when something goes wrong, debugging can become surprisingly difficult.

A simple symptom such as:

> "My ESP32 keeps restarting."

could be caused by:

* Insufficient power
* Brownout conditions
* Incorrect GPIO configuration
* Peripheral conflicts
* Wi-Fi-related behavior
* Strapping-pin misuse
* Sensor communication problems
* Firmware configuration
* Hardware wiring

The challenge is not simply finding information.

**The challenge is knowing which information matters and what to check next.**

NetDiag Expert addresses this by encoding embedded-systems troubleshooting knowledge into an interactive expert system.

---

## How It Works

NetDiag Expert uses a **rule-based inference engine with forward chaining**.

The process is:

```text
User reports a symptom
        ↓
Select diagnostic category
        ↓
Answer targeted questions
        ↓
System evaluates diagnostic rules
        ↓
Possible causes are narrowed down
        ↓
Root cause is identified
        ↓
Repair / troubleshooting procedure
```

The system starts with known facts — the symptoms and answers provided by the user — and progressively applies rules until it reaches a diagnostic conclusion.

For example:

```text
IF
    ESP32 resets when Wi-Fi starts
AND
    power supply voltage is insufficient

THEN
    probable cause = brownout / power instability
```

This approach makes the reasoning explicit rather than treating the diagnosis as a black box.

---

# Diagnostic Knowledge Base

The current knowledge base covers **9 major ESP32 problem areas**:

| Category       | Examples                                    |
| -------------- | ------------------------------------------- |
| Power          | Brownouts, unstable power, voltage problems |
| Wi-Fi          | Connection and network problems             |
| GPIO           | Pin configuration and usage problems        |
| Antenna        | Wireless signal and antenna-related issues  |
| I2C            | Sensor and I2C communication failures       |
| SPI            | SPI peripheral communication problems       |
| ADC            | Analog-to-digital conversion issues         |
| Strapping Pins | Boot and pin-configuration conflicts        |
| ESP-NOW        | ESP-NOW communication problems              |

The system contains hundreds of diagnostic rules designed to connect observed symptoms with likely causes and recommended actions.

---

# Features

## 🔎 Diagnostic Console

The primary troubleshooting interface.

Users describe a hardware problem and answer a sequence of diagnostic questions. The system uses their responses to narrow down the possible causes.

---

## 🧠 Rule-Based Expert System

The diagnostic engine uses a custom rule-based system rather than relying on an external AI model for its core reasoning.

This makes the diagnostic logic:

* Explicit
* Inspectable
* Reproducible
* Deterministic
* Easy to extend with additional rules

The system uses **forward chaining** to move from observed facts toward conclusions.

---

## 📚 Knowledge Base

Browse the diagnostic knowledge encoded into the application.

The knowledge base organizes common ESP32 faults into understandable categories and provides the rules behind the diagnostic process.

---

## 📊 Diagnostic Dashboard

The dashboard provides an overview of system information and diagnostic context.

The current implementation includes simulated telemetry for demonstration purposes, allowing the interface and diagnostic workflow to be developed before deeper hardware integration.

---

## 📌 ESP32 Pinout Explorer

An interactive ESP32 pinout view helps users understand GPIO functionality and identify potential pin-related problems.

This is particularly useful for troubleshooting:

* GPIO conflicts
* Strapping-pin issues
* Peripheral assignments
* Incorrect pin usage

---

## 🖥️ Serial Monitor

A simulated serial-monitor environment provides a developer-oriented view of device logs and diagnostic information.

The long-term goal is to connect this workflow to real device output.

---

## 📝 Hardware Logs

Diagnostic sessions and system events can be represented as structured logs, creating a foundation for reviewing previous troubleshooting attempts.

---

## 💬 AI Chat

The application includes an optional conversational AI layer for follow-up questions.

The distinction is intentional:

**The expert system performs the core structured diagnosis.**

**The AI layer helps the user understand and explore the diagnosis conversationally.**

This prevents the diagnostic engine from becoming dependent on an opaque AI response.

---

## 📄 Diagnosis Reports

A completed diagnostic session can produce a structured result containing information such as:

* Probable root cause
* Confidence
* Severity
* Diagnostic reasoning
* Recommended fix
* Relevant hardware/wiring notes

The goal is to transform a troubleshooting session into something that can be understood and acted upon.

---

# Architecture

The project is currently built around a web application architecture:

```text
┌─────────────────────────────────────┐
│           NetDiag Expert UI         │
│                                     │
│  Diagnostic Console                 │
│  Dashboard                          │
│  Knowledge Base                     │
│  Pinout Explorer                    │
│  Hardware Logs                      │
│  Serial Monitor                     │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│       Diagnostic / Rule Engine      │
│                                     │
│  Facts → Rules → Inference → Result │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│          Diagnosis Report           │
│                                     │
│  Cause                              │
│  Confidence                         │
│  Severity                           │
│  Recommended Actions                │
└─────────────────────────────────────┘
                  │
                  ▼
       Optional AI Conversation
```

The architecture is designed so that the deterministic diagnostic engine can remain separate from conversational AI.

---

# Technology

The project currently uses:

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* Custom rule-based diagnostic engine
* Forward-chaining inference
* Optional external language-model integration

The core diagnostic functionality does **not** require an external AI model.

---

# Project Background

NetDiag Expert originated as a group project for:

**ECE 515.2 — Introduction to Artificial Intelligence**
**Department of Electronic Engineering**
**University of Port Harcourt**
**Academic Session: 2024/2025**

The project was created to demonstrate the practical application of an **Expert System** — an AI approach that captures domain knowledge as rules and uses those rules to solve problems.

Rather than building a generic example such as a medical or financial expert system, the project applies the concept to a practical engineering problem:

> **How can an intelligent system help someone troubleshoot an ESP32?**

This became the foundation for NetDiag Expert.

---

# Why a Rule-Based Expert System?

Modern AI often relies on large language models, but not every problem benefits from an opaque generative approach.

Hardware diagnosis is an interesting case.

A useful diagnostic system should be able to distinguish between:

**Observed fact**

> The board resets when Wi-Fi starts.

and:

**Hypothesis**

> The power supply may be insufficient.

and:

**Recommended investigation**

> Check the supply voltage and current capability under Wi-Fi load.

A rule-based system makes these relationships explicit.

This creates an important foundation for future AI-assisted diagnostics where a language model can explain or interact with the diagnostic process without replacing the underlying evidence and rules.

---

# Future Direction

NetDiag Expert is currently a software-based diagnostic prototype.

The longer-term vision is to move from **simulated diagnostic context toward real ESP32 device integration**.

Potential future directions include:

* Real serial communication with ESP32 hardware
* Live telemetry collection
* Automatic device health checks
* Real-time sensor diagnostics
* Firmware/log analysis
* Automated fault detection
* Persistent diagnostic histories
* Hardware-aware AI reasoning
* Expanded knowledge bases
* Community-contributed diagnostic rules
* Support for additional ESP32 variants and peripherals

The ultimate goal is to create a diagnostic system where the user does not have to manually translate raw hardware information into a troubleshooting strategy.

Instead:

```text
ESP32
  ↓
Evidence
  ↓
Diagnostic Engine
  ↓
Reasoning
  ↓
Explanation
  ↓
Recommended Action
```

---

# Current Status

🚧 **Active development / prototype**

The current version demonstrates the expert-system concept, diagnostic workflow, knowledge base, and developer interface.

Some hardware telemetry and serial-monitor functionality is currently simulated for demonstration purposes.

The next stage of the project is deeper integration between the diagnostic software and real ESP32 hardware.

---

# Contributing

Contributions and ideas are welcome.

Areas where contributors can help include:

* ESP32 troubleshooting rules
* Embedded systems knowledge
* Diagnostic algorithms
* TypeScript / React development
* UI/UX
* Testing
* Documentation
* ESP32 hardware integration
* AI-assisted diagnostics
* Additional fault categories

If you have encountered an ESP32 problem that should be represented in the knowledge base, an issue or pull request is welcome.

---

# Development

Clone the repository:

```bash
git clone https://github.com/gozi-rim/esp32-micro-controller-diagnoser.git

cd esp32-micro-controller-diagnoser
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Project Structure

```text
.
├── .agents/
│   └── skills/
├── components/
├── data/
├── src/
├── AGENTS.md
├── CLAUDE.md
├── Project_Explanation.md
├── Final_Project_Defence.pptx
├── generate_pptx.py
├── prd.md
├── package.json
└── README.md
```

---

# Vision

**NetDiag Expert is an experiment in making embedded troubleshooting more intelligent, explainable, and accessible.**

The project starts with a simple idea:

> An ESP32 problem should not require an expert sitting beside you to begin diagnosing it.

By combining structured engineering knowledge, deterministic inference, interactive troubleshooting, and eventually real hardware telemetry and AI-assisted reasoning, NetDiag Expert aims to make embedded debugging easier to understand and easier to perform.

---

## Author

**Gozi Rim**

GitHub:
https://github.com/gozi-rim

Repository:
https://github.com/gozi-rim/esp32-micro-controller-diagnoser

---

## License

See the repository license for the applicable terms.
