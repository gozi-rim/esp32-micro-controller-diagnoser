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

export const ESP32_PINOUT: ESP32PinSpec[] = [
  // LEFT HEADER PINS (Top to Bottom: Pins 1 to 19)
  {
    pinIndex: 1,
    label: "3V3",
    side: "left",
    type: "POWER",
    functions: ["3.3V Output from Onboard LDO", "Can accept 3.3V Input if Vin is disconnected"],
    voltageRating: "3.3V Regulated (±5%)",
    maxCurrent: "600mA (AMS1117 Max)",
    warning: "Transient RF current spikes (450mA) will drop this rail if decoupling capacitors (<470uF) are missing."
  },
  {
    pinIndex: 2,
    label: "EN / RST",
    side: "left",
    type: "DIGITAL",
    functions: ["Chip Enable / Hardware Reset", "Active HIGH (Pull LOW to reset chip)"],
    voltageRating: "3.3V",
    maxCurrent: "N/A (High Impedance)",
    warning: "Requires a 10kΩ pull-up resistor to 3.3V and 0.1uF/10uF capacitor to GND for reliable power-on reset (RC delay).",
    pullResistor: "10kΩ Pull-Up to 3V3 required"
  },
  {
    pinIndex: 3,
    label: "GPIO 36 (VP)",
    gpioNum: 36,
    side: "left",
    type: "ADC1",
    functions: ["ADC1_CH0", "RTC_GPIO0", "SENS_VP", "Input-Only"],
    voltageRating: "0V to 3.3V",
    maxCurrent: "Input Only (0mA output sink)",
    warning: "Input-Only pin. Has NO internal software pull-up or pull-down resistors.",
    pullResistor: "External resistor required if used as digital input"
  },
  {
    pinIndex: 4,
    label: "GPIO 39 (VN)",
    gpioNum: 39,
    side: "left",
    type: "ADC1",
    functions: ["ADC1_CH3", "RTC_GPIO3", "SENS_VN", "Input-Only"],
    voltageRating: "0V to 3.3V",
    maxCurrent: "Input Only (0mA output sink)",
    warning: "Input-Only pin. ADC1 works 100% reliably with Wi-Fi active."
  },
  {
    pinIndex: 5,
    label: "GPIO 34",
    gpioNum: 34,
    side: "left",
    type: "ADC1",
    functions: ["ADC1_CH6", "RTC_GPIO4", "Input-Only"],
    voltageRating: "0V to 3.3V",
    maxCurrent: "Input Only (0mA output sink)",
    warning: "Input-Only pin. Ideal for analog sensors; immune to Wi-Fi driver lockout."
  },
  {
    pinIndex: 6,
    label: "GPIO 35",
    gpioNum: 35,
    side: "left",
    type: "ADC1",
    functions: ["ADC1_CH7", "RTC_GPIO5", "Input-Only"],
    voltageRating: "0V to 3.3V",
    maxCurrent: "Input Only (0mA output sink)",
    warning: "Input-Only pin. No internal pull-ups."
  },
  {
    pinIndex: 7,
    label: "GPIO 32",
    gpioNum: 32,
    side: "left",
    type: "ADC1",
    functions: ["ADC1_CH4", "TOUCH9", "RTC_GPIO9", "XTAL32_P"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    pullResistor: "Internal 45kΩ Pull-Up / Pull-Down available"
  },
  {
    pinIndex: 8,
    label: "GPIO 33",
    gpioNum: 33,
    side: "left",
    type: "ADC1",
    functions: ["ADC1_CH5", "TOUCH8", "RTC_GPIO8", "XTAL32_N"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    pullResistor: "Internal 45kΩ Pull-Up / Pull-Down available"
  },
  {
    pinIndex: 9,
    label: "GPIO 25",
    gpioNum: 25,
    side: "left",
    type: "ADC2",
    functions: ["ADC2_CH8", "DAC1", "RTC_GPIO6", "EMAC_RXD0"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "⚠️ ADC2 CONFLICT: analogRead() will return 0 or garbage if Wi-Fi/ESP-NOW is active. Use DAC1 or migrate analog sensor to ADC1."
  },
  {
    pinIndex: 10,
    label: "GPIO 26",
    gpioNum: 26,
    side: "left",
    type: "ADC2",
    functions: ["ADC2_CH9", "DAC2", "RTC_GPIO7", "EMAC_RXD1"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "⚠️ ADC2 CONFLICT: Locked by Wi-Fi radio calibration."
  },
  {
    pinIndex: 11,
    label: "GPIO 27",
    gpioNum: 27,
    side: "left",
    type: "ADC2",
    functions: ["ADC2_CH7", "TOUCH7", "RTC_GPIO17", "EMAC_RX_DV"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "⚠️ ADC2 CONFLICT: Wi-Fi driver lockout."
  },
  {
    pinIndex: 12,
    label: "GPIO 14",
    gpioNum: 14,
    side: "left",
    type: "ADC2",
    functions: ["ADC2_CH6", "TOUCH6", "RTC_GPIO16", "HSPI_CLK", "SD_CLK"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "Outputs PWM clock bursts during boot."
  },
  {
    pinIndex: 13,
    label: "GPIO 12 (MTDI)",
    gpioNum: 12,
    side: "left",
    type: "STRAP",
    functions: ["MTDI (JTAG)", "ADC2_CH5", "TOUCH5", "HSPI_Q", "Strapping Pin"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "⚠️ CRITICAL STRAPPING PIN: Selects SPI Flash Voltage at boot. If pulled HIGH externally at reset, LDO switches to 1.8V, crashing 3.3V flash modules ('flash read err'). MUST BE LOW AT BOOT.",
    strappingFunction: "LOW = 3.3V Flash Voltage (Correct) | HIGH = 1.8V Flash (Destructive Boot Loop)"
  },
  {
    pinIndex: 14,
    label: "GND",
    side: "left",
    type: "GND",
    functions: ["Ground Power Reference (0V)"],
    voltageRating: "0V Ground",
    maxCurrent: "Common Ground Return"
  },
  {
    pinIndex: 15,
    label: "GPIO 13",
    gpioNum: 13,
    side: "left",
    type: "ADC2",
    functions: ["ADC2_CH4", "TOUCH4", "RTC_GPIO14", "HSPI_ID", "SD_DATA2"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max"
  },
  {
    pinIndex: 16,
    label: "GPIO 9 (D2)",
    gpioNum: 9,
    side: "left",
    type: "FLASH_INTERNAL",
    functions: ["SPIHD (SPI Flash Data 2)"],
    voltageRating: "3.3V SPI Flash",
    maxCurrent: "Internal Bus Only",
    warning: "⚠️ DO NOT USE: Hardwired directly to internal SPI flash chip inside the RF shield. Connecting external circuit will crash firmware."
  },
  {
    pinIndex: 17,
    label: "GPIO 10 (D3)",
    gpioNum: 10,
    side: "left",
    type: "FLASH_INTERNAL",
    functions: ["SPIWP (SPI Flash Write Protect)"],
    voltageRating: "3.3V SPI Flash",
    maxCurrent: "Internal Bus Only",
    warning: "⚠️ DO NOT USE: Hardwired to internal SPI flash memory."
  },
  {
    pinIndex: 18,
    label: "GPIO 11 (CMD)",
    gpioNum: 11,
    side: "left",
    type: "FLASH_INTERNAL",
    functions: ["SPICS0 (SPI Flash Chip Select)"],
    voltageRating: "3.3V SPI Flash",
    maxCurrent: "Internal Bus Only",
    warning: "⚠️ DO NOT USE: Hardwired to internal SPI flash memory."
  },
  {
    pinIndex: 19,
    label: "VIN / 5V",
    side: "left",
    type: "POWER",
    functions: ["5V Power Input to Onboard AMS1117 LDO Regulator"],
    voltageRating: "4.75V to 6.0V (Nominal 5.0V)",
    maxCurrent: "1.5A Input Rating",
    warning: "Never apply >7V DC directly to Vin as AMS1117 will overheat and enter cyclic thermal shutdown."
  },

  // RIGHT HEADER PINS (Top to Bottom: Pins 20 to 38)
  {
    pinIndex: 20,
    label: "GND",
    side: "right",
    type: "GND",
    functions: ["Ground Power Reference (0V)"],
    voltageRating: "0V Ground",
    maxCurrent: "Common Ground Return"
  },
  {
    pinIndex: 21,
    label: "GPIO 23",
    gpioNum: 23,
    side: "right",
    type: "DIGITAL",
    functions: ["VSPI_MOSI", "SPI Master Out Slave In"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max"
  },
  {
    pinIndex: 22,
    label: "GPIO 22",
    gpioNum: 22,
    side: "right",
    type: "DIGITAL",
    functions: ["I2C_SCL (Hardware Default)", "EMAC_TXD1"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    pullResistor: "Requires external 4.7kΩ pull-up resistor to 3.3V for I2C bus stability"
  },
  {
    pinIndex: 23,
    label: "GPIO 1 (TX0)",
    gpioNum: 1,
    side: "right",
    type: "DIGITAL",
    functions: ["U0TXD (Debug Serial Transmit)", "CLK_OUT3"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "Transmits bootloader diagnostic log stream at 115200 baud on power-on."
  },
  {
    pinIndex: 24,
    label: "GPIO 3 (RX0)",
    gpioNum: 3,
    side: "right",
    type: "DIGITAL",
    functions: ["U0RXD (Debug Serial Receive)", "CLK_OUT2"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "Used for firmware flashing via USB-to-UART bridge."
  },
  {
    pinIndex: 25,
    label: "GPIO 21",
    gpioNum: 21,
    side: "right",
    type: "DIGITAL",
    functions: ["I2C_SDA (Hardware Default)", "EMAC_TX_EN"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    pullResistor: "Requires external 4.7kΩ pull-up resistor to 3.3V to prevent Wire library hangs"
  },
  {
    pinIndex: 26,
    label: "GND",
    side: "right",
    type: "GND",
    functions: ["Ground Power Reference (0V)"],
    voltageRating: "0V Ground",
    maxCurrent: "Common Ground Return"
  },
  {
    pinIndex: 27,
    label: "GPIO 19",
    gpioNum: 19,
    side: "right",
    type: "DIGITAL",
    functions: ["VSPI_MISO", "EMAC_TXD0"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max"
  },
  {
    pinIndex: 28,
    label: "GPIO 18",
    gpioNum: 18,
    side: "right",
    type: "DIGITAL",
    functions: ["VSPI_CLK", "SD_CLK"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max"
  },
  {
    pinIndex: 29,
    label: "GPIO 5",
    gpioNum: 5,
    side: "right",
    type: "STRAP",
    functions: ["VSPI_CS", "Strapping Pin (SDIO Timing / Boot Log Output)"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "Strapping Pin: Outputs PWM signals during reset. Pull HIGH for normal boot."
  },
  {
    pinIndex: 30,
    label: "GPIO 17",
    gpioNum: 17,
    side: "right",
    type: "DIGITAL",
    functions: ["U2TXD (UART2 TX)", "EMAC_CLK_OUT_180"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max"
  },
  {
    pinIndex: 31,
    label: "GPIO 16",
    gpioNum: 16,
    side: "right",
    type: "DIGITAL",
    functions: ["U2RXD (UART2 RX)", "EMAC_CLK_OUT"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max"
  },
  {
    pinIndex: 32,
    label: "GPIO 4",
    gpioNum: 4,
    side: "right",
    type: "ADC2",
    functions: ["ADC2_CH0", "TOUCH0", "RTC_GPIO10", "HSPI_HD"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "⚠️ ADC2 CONFLICT: Wi-Fi driver lockout."
  },
  {
    pinIndex: 33,
    label: "GPIO 0",
    gpioNum: 0,
    side: "right",
    type: "STRAP",
    functions: ["BOOT Button", "ADC2_CH1", "TOUCH1", "RTC_GPIO11", "CLK_OUT1"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "⚠️ CRITICAL STRAPPING PIN: Sampled at reset to select bootloader flashing vs normal SPI flash execution. LOW = ROM Download Mode (Flash) | HIGH = SPI Flash Run Mode. Do NOT pull LOW externally during boot.",
    strappingFunction: "LOW = Bootloader Download Mode | HIGH = Normal SPI Flash Execution"
  },
  {
    pinIndex: 34,
    label: "GPIO 2",
    gpioNum: 2,
    side: "right",
    type: "STRAP",
    functions: ["Onboard Blue LED", "ADC2_CH2", "TOUCH2", "RTC_GPIO12", "HSPI_WP"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "⚠️ STRAPPING PIN: Must be left FLOATING or LOW during serial flashing. Connected to onboard blue LED."
  },
  {
    pinIndex: 35,
    label: "GPIO 15 (MTDO)",
    gpioNum: 15,
    side: "right",
    type: "STRAP",
    functions: ["MTDO (JTAG)", "ADC2_CH3", "TOUCH3", "RTC_GPIO13", "HSPI_CSO"],
    voltageRating: "3.3V LVCMOS",
    maxCurrent: "12mA Sink / 40mA Absolute Max",
    warning: "Strapping Pin: Controls silent boot debugging output."
  },
  {
    pinIndex: 36,
    label: "GPIO 8 (D1)",
    gpioNum: 8,
    side: "right",
    type: "FLASH_INTERNAL",
    functions: ["SPID (SPI Flash Data 1)"],
    voltageRating: "3.3V SPI Flash",
    maxCurrent: "Internal Bus Only",
    warning: "⚠️ DO NOT USE: Internal SPI flash memory connection."
  },
  {
    pinIndex: 37,
    label: "GPIO 7 (D0)",
    gpioNum: 7,
    side: "right",
    type: "FLASH_INTERNAL",
    functions: ["SPIQ (SPI Flash Data 0)"],
    voltageRating: "3.3V SPI Flash",
    maxCurrent: "Internal Bus Only",
    warning: "⚠️ DO NOT USE: Internal SPI flash memory connection."
  },
  {
    pinIndex: 38,
    label: "GPIO 6 (CLK)",
    gpioNum: 6,
    side: "right",
    type: "FLASH_INTERNAL",
    functions: ["SPICLK (SPI Flash Clock)"],
    voltageRating: "3.3V SPI Flash",
    maxCurrent: "Internal Bus Only",
    warning: "⚠️ DO NOT USE: Internal SPI flash 80MHz clock line."
  }
];
