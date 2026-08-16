/**
 * ESP32-WROOM-32 38-Pin Pinout Specification & Telemetry Matrix
 * Comprehensive pin multiplexing, ADC channels, strapping alerts & electrical limits.
 */

export interface ESP32PinSpec {
  pinIndex: number;
  label: string;
  gpioNum?: number;
  side: "left" | "right";
  type: "POWER" | "ADC1" | "ADC2" | "DIGITAL" | "STRAP" | "FLASH_INTERNAL" | "GND";
  functions: string[];
  voltageRating: string;
  maxCurrent: string;
  warning?: string;
  pullResistor?: string;
  strappingFunction?: string;
}

export { ESP32_PINOUT } from "../src/data/esp32PinoutData";
