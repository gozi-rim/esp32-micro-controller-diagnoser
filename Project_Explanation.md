# NetDiag Expert — Project Explanation (In Simple Terms)

---

## What Is This Project?

**NetDiag Expert** is a website (web application) that helps people figure out what's wrong with a small computer chip called the **ESP32**. Think of it like a "doctor for hardware" — you tell it what problem you're seeing, and it walks you through a series of questions until it finds the exact cause and tells you how to fix it.

Instead of spending hours guessing and testing wires, you open the app, describe your issue (like "my board keeps restarting" or "the Wi-Fi won't connect"), and the system guides you step-by-step to a solution.

---

## What Is an ESP32?

The ESP32 is a tiny, affordable computer chip (called a microcontroller) that's widely used in electronics projects, university labs, and real-world products like smart home devices, sensors, and IoT (Internet of Things) gadgets. It can connect to Wi-Fi, Bluetooth, and other devices — but it's also known for being tricky to debug when things go wrong.

---

## What Course Assignment Led to This Project?

This project was built as a **group assignment** for the course:

- **Course Code:** ECE 515.2
- **Course Title:** Introduction to Artificial Intelligence
- **Department:** Electronic Engineering
- **University:** University of Port Harcourt
- **Group:** 11 (11 members)
- **Academic Session:** 2024/2025

### The Assignment Brief

The assignment required students to build an **Expert System** — a type of Artificial Intelligence program that mimics how a human expert thinks and solves problems. Specifically, the system had to:

1. **Use rules** (IF this symptom, THEN this might be the cause) to make decisions — just like a doctor uses symptoms to diagnose a disease.
2. **Be interactive** — the user answers questions, and the system narrows down the problem.
3. **Provide a clear diagnosis** — at the end, the system tells you what went wrong and how to fix it.

The group chose to apply this concept to **hardware troubleshooting for the ESP32 microcontroller**, since that's a real problem students face in their electronics labs every day.

---

## How Does It Work? (In Plain English)

1. **You open the app** in your web browser (like Chrome or Edge).
2. **You pick a problem category** — for example: power issues, Wi-Fi problems, sensor errors, pin configuration mistakes, etc. There are 9 categories in total.
3. **The system asks you questions** — simple yes/no or multiple-choice questions like: "Is the board resetting when Wi-Fi starts?" or "Are you using GPIO pin 12?"
4. **Behind the scenes**, the system follows a decision tree (a branching map of questions and answers) to narrow down the problem. This is called **forward chaining** — it starts with what you know (the symptoms) and moves forward to find the answer.
5. **You get a diagnosis** — the system tells you:
   - What the root cause is
   - How confident it is in the answer
   - Step-by-step instructions to fix it
   - Notes about circuit wiring if relevant

---

## What Does "Expert System" Mean?

An Expert System is one of the oldest and most practical forms of AI. It works by capturing the knowledge of a human expert (in this case, an experienced electronics engineer) and encoding it as a set of **rules**.

For example:
- **IF** the ESP32 resets when Wi-Fi starts **AND** the power supply is under 3.3V, **THEN** the cause is a brownout (not enough power).

The system has hundreds of rules like this, covering 9 different problem areas. When you use the app, it checks your answers against these rules and follows the logic to reach a conclusion — just like an expert engineer would, but instantly and without needing that expert to be in the room.

---

## What Does "Forward Chaining" Mean?

Forward chaining is a simple idea:

- **Start with facts** (the symptoms the user reports).
- **Check rules** one by one to see which ones match those facts.
- **When a rule matches**, it produces new facts (narrows down the problem).
- **Keep going** until you reach a final diagnosis.

It's like a flowchart: you start at the top, answer questions at each step, and follow the arrows until you reach the answer at the bottom.

---

## What Features Does the App Have?

| Feature | What It Does |
|---|---|
| **Diagnostic Console** | The main screen where you describe symptoms and answer questions to get a diagnosis. |
| **Knowledge Base** | A library of all 9 fault categories (power, Wi-Fi, GPIO, antenna, I2C, SPI, ADC, strapping pins, ESP-NOW) that you can browse. |
| **Dashboard** | Shows a summary of system health — things like CPU temperature, Wi-Fi signal strength, and memory usage (simulated for demonstration). |
| **ESP32 Pinout Diagram** | An interactive picture of the ESP32 chip showing all 38 pins and what each one does. |
| **Serial Monitor** | A simulated terminal screen showing log messages from the chip. |
| **Hardware Logs** | A record of past diagnostic sessions and system events. |
| **AI Chat** | An optional chat feature that lets you ask follow-up questions in plain English, powered by a language model. |
| **Diagnosis Reports** | Structured reports with the root cause, confidence score, severity level, and step-by-step fix. |

---

## What Technologies Were Used to Build It?

For those curious (but this isn't needed to understand the project):

- **Next.js & React** — The framework used to build the website interface.
- **TypeScript** — The programming language used.
- **Tailwind CSS** — Used to style and design the interface.
- **Rule-based engine** — Custom-built logic in JavaScript/TypeScript that processes the diagnostic rules.

No external AI model is required for the core diagnostics — the rules are all built into the app itself. The optional AI chat feature uses an external language model for conversational follow-ups.

---

## In One Sentence

**NetDiag Expert is a web-based AI tool that uses a rule-based expert system to help students and engineers quickly diagnose and fix hardware problems on ESP32 microcontroller boards, built as a group project for the ECE 515.2 (Intro to AI) course at the University of Port Harcourt.**

---

*Document generated for project reference — Group 11, ECE 515.2, University of Port Harcourt.*
