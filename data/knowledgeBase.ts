/**
 * Localized Network & IoT Troubleshooter Knowledge Base (TypeScript)
 * Comprehensive rule-based decision tree object covering all hardware fault trees with classical AI expert system properties.
 */

export interface Option {
  id: string;
  label: string;
  description?: string;
  nextNodeId: string;
  keywords?: string[];
}

export interface EngineeringSolution {
  summary: string;
  steps: string[];
  circuitDiagramNote?: string;
  codeSnippet?: string;
}

export interface QuestionNode {
  id: string;
  type: "question";
  category:
    | "root"
    | "brownout"
    | "espnow"
    | "wifi"
    | "gpio"
    | "antenna"
    | "i2c"
    | "spi"
    | "adc"
    | "strap"
    | "custom";
  ruleId?: string;
  title: string;
  question: string;
  description?: string;
  options: Option[];
}

export interface DiagnosisNode {
  id: string;
  type: "diagnosis";
  category:
    | "brownout"
    | "espnow"
    | "wifi"
    | "gpio"
    | "antenna"
    | "i2c"
    | "spi"
    | "adc"
    | "strap"
    | "custom";
  ruleId?: string;
  confidenceFactor?: number; // e.g. 0.98
  formalRuleStatement?: string; // e.g. "IF (Symptom == 'WiFi.begin() reset') ∧ (VDD < 2.97V) THEN ..."
  antecedents?: string[]; // e.g. ["WiFi.begin() triggered", "VDD drops below 2.97V"]
  title: string;
  symptomSummary: string;
  diagnosis: string;
  rootCause: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  engineeringSolution: EngineeringSolution;
}

export type KnowledgeNode = QuestionNode | DiagnosisNode;

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
}

export const KNOWLEDGE_BASE_CATEGORIES: Record<string, CategoryInfo> = {
  BROWNOUT: { id: "brownout", name: "Power Supply & Brownout Resets", icon: "Zap" },
  ESPNOW: { id: "espnow", name: "ESP-NOW MAC Pairing & Peer Sync", icon: "Share2" },
  WIFI: { id: "wifi", name: "Wi-Fi Connection & Stack Timeouts", icon: "Wifi" },
  GPIO: { id: "gpio", name: "GPIO Voltage & Logic Interfacing", icon: "Cpu" },
  ANTENNA: { id: "antenna", name: "Antenna, RSSI & 2.4GHz Noise", icon: "Radio" },
  I2C: { id: "i2c", name: "I2C Bus & Display Driver Lockup", icon: "Layers" },
  SPI: { id: "spi", name: "SPI Bus & CS Signal Integrity", icon: "Activity" },
  ADC: { id: "adc", name: "ADC2 & Wi-Fi Radio Pin Conflict", icon: "Gauge" },
  STRAP: { id: "strap", name: "Bootloader Strapping Pin Hangs", icon: "ShieldAlert" }
};

import { knowledgeBase as kbJs } from "../src/data/knowledgeBase.js";

export const knowledgeBase: {
  initialQuestionId: string;
  nodes: Record<string, KnowledgeNode>;
} = kbJs as any;
