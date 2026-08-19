# ESP32 Micro-Controller Diagnoser

> An open-source diagnostic platform for understanding, monitoring, and troubleshooting ESP32-based embedded systems.

The **ESP32 Micro-Controller Diagnoser** is an open-source project exploring a more intelligent way to diagnose problems in ESP32 devices.

Instead of relying entirely on raw serial logs, manual inspection, and trial-and-error debugging, the project aims to bring together **device telemetry, diagnostic checks, system state, and AI-assisted reasoning** into a single developer-friendly workflow.

The goal is simple:

**Make embedded-system debugging easier to understand, reproduce, and act on.**

---

## Why This Exists

Debugging embedded systems is fundamentally different from debugging ordinary software.

A problem can originate from firmware, hardware, power, sensors, communication protocols, timing, memory, peripherals, or an interaction between several of these layers.

When something goes wrong, developers often have to:

* Inspect serial output
* Reproduce the failure manually
* Check sensor and peripheral values
* Examine firmware behavior
* Compare expected and actual system states
* Search documentation and previous issues
* Form hypotheses and test them one by one

This project explores whether much of that process can be **structured and assisted by software**.

The long-term vision is an open-source diagnostic workflow where an ESP32 can provide evidence about its own state and developers can use that evidence to understand what is happening and why.

---

## Core Idea

```text
             ┌──────────────────────┐
             │      ESP32 Device    │
             │                      │
             │ Sensors / GPIO /     │
             │ peripherals / state  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Diagnostic Layer     │
             │                      │
             │ Telemetry            │
             │ Health checks        │
             │ Error detection      │
             │ System state         │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ Diagnostic Interface │
             │                      │
             │ Logs                │
             │ Metrics             │
             │ Device information  │
             │ Diagnostic results  │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ AI-Assisted Analysis │
             │                      │
             │ Evidence → Reasoning │
             │ → Possible causes    │
             │ → Next steps         │
             └──────────────────────┘
```

The important principle is that **AI should reason from actual device evidence**, rather than simply guessing what might be wrong.

---

## What the Project Is Exploring

The project is being developed around several complementary areas:

### 🔌 Embedded Diagnostics

Collect useful information from an ESP32 and expose the state of the device in a way that is easier to inspect and understand.

### 📊 System Observability

Turn low-level device information into useful diagnostic signals instead of forcing developers to interpret raw output manually.

### 🧪 Fault Investigation

Provide a structured way to investigate potential failures and distinguish observations from assumptions.

### 🤖 AI-Assisted Reasoning

Explore how an AI system can help developers interpret diagnostic evidence, identify possible causes, and suggest useful next steps.

### 🧑‍💻 Developer Experience

Make the system understandable and useful not only to experienced embedded engineers, but also to students, makers, and developers learning embedded systems.

---

## Project Structure

The repository contains both the diagnostic application and the supporting project infrastructure.

```text
.
├── app/                  # Next.js application
├── components/           # Reusable UI components
├── src/                  # Application/source logic
├── data/                 # Diagnostic/project data
├── public/                # Static assets
├── .agents/               # Agent/AI development resources
├── CLAUDE.md              # Claude-assisted development context
├── package.json
└── ...
```

The web application provides the interface for interacting with and visualizing diagnostic information, while the broader project is designed to evolve toward deeper ESP32 integration.

---

## Getting Started

### Prerequisites

You will need:

* Node.js
* npm, pnpm, yarn, or Bun
* An ESP32 development board for hardware-related functionality

### Install

Clone the repository:

```bash
git clone https://github.com/gozi-rim/esp32-micro-controller-diagnoser.git

cd esp32-micro-controller-diagnoser
```

Install dependencies:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

The application will automatically reload as you make changes.

---

## Development

The project uses **Next.js** and **TypeScript** for the diagnostic interface.

The architecture is intentionally being developed to allow the web application, diagnostic logic, embedded firmware, and AI-assisted analysis to evolve independently while remaining connected through clearly defined interfaces.

As the project matures, these boundaries will become increasingly important for testing and community contributions.

---

## Roadmap

The project is still under active development.

### Current direction

* [x] Establish the diagnostic application foundation
* [x] Build the initial project architecture
* [x] Establish reusable interface components
* [x] Begin defining the diagnostic workflow
* [ ] Expand ESP32 device integration
* [ ] Add richer device telemetry
* [ ] Build automated health checks
* [ ] Develop structured fault detection
* [ ] Improve diagnostic visualization
* [ ] Add stronger test coverage
* [ ] Develop AI-assisted diagnostic reasoning
* [ ] Create reproducible diagnostic reports
* [ ] Improve contributor documentation
* [ ] Add examples for common ESP32 failures

---

## Vision

The long-term goal is not to build another dashboard.

It is to build an **open diagnostic layer for embedded systems**.

Imagine connecting an ESP32, reproducing a problem, and receiving a structured explanation such as:

```text
Observed:
• Sensor communication stopped responding
• I2C bus activity is present
• Device firmware is still running
• Error rate increased immediately before failure

Possible causes:
1. Peripheral communication failure
2. Sensor power instability
3. Incorrect bus configuration

Recommended next checks:
→ Verify sensor power
→ Inspect I2C address/configuration
→ Compare bus behavior before and after failure
```

The system should make it easier for developers to go from:

**"Something is broken."**

to:

**"Here is what the device observed, here are the most likely causes, and here is what I should investigate next."**

---

## Open Source

This project is intentionally open source because embedded debugging is a problem that benefits from shared knowledge.

Different boards, sensors, firmware architectures, and hardware configurations produce different failure modes. A community-driven diagnostic system could eventually build a much richer collection of troubleshooting knowledge than any single developer could create alone.

Contributions, ideas, experiments, bug reports, and discussions are welcome.

If you work with ESP32, embedded systems, IoT, robotics, firmware, developer tooling, or AI-assisted development, there is an opportunity to contribute.

---

## Why AI?

AI is not intended to replace the developer or hide the underlying evidence.

The goal is the opposite.

The diagnostic system should expose the evidence first and use AI to help developers **reason about that evidence**.

That means separating:

* **Observed facts**
* **Detected anomalies**
* **Possible explanations**
* **Confidence**
* **Recommended next actions**

This distinction is important because an AI-generated explanation is only useful when developers can understand *why* the system reached that conclusion.

---

## Contributing

Contributions are welcome.

Potential areas include:

* ESP32 firmware
* Diagnostic algorithms
* Hardware integrations
* Sensor support
* UI/UX
* TypeScript/Next.js development
* Testing
* Documentation
* AI-assisted diagnostics
* Embedded debugging workflows

If you find a bug or have an idea for improving the diagnostic workflow, open an issue or submit a pull request.

---

## Status

🚧 **Early development**

This project is currently evolving from its initial foundation toward a more complete ESP32 diagnostic platform.

The architecture, diagnostic methodology, and AI-assisted components are expected to evolve as the project is tested against real embedded-system problems.

---

## Author

Built and maintained by **Gozi Rim**.

GitHub:
https://github.com/gozi-rim

Project:
https://github.com/gozi-rim/esp32-micro-controller-diagnoser

---

## License

See the repository license for usage and contribution terms.
