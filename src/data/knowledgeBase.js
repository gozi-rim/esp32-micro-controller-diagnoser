/**
 * Localized Network & IoT Troubleshooter Knowledge Base
 * Rule-based decision tree object for ESP32 & ESP-NOW localized hardware & network failures.
 * 
 * Formal Production Rules & Expert System Schema (ECE 515.2 AI Standards)
 * Includes Formal Rule IDs, Confidence / Certainty Factors (CF: 0.0 - 1.0),
 * Antecedents, Root Cause Analysis, and Exact Hardware & Firmware Remediation.
 */

export const KNOWLEDGE_BASE_CATEGORIES = {
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

export const knowledgeBase = {
  initialQuestionId: "root_category_select",
  nodes: {
    // ==========================================
    // ROOT CATEGORY SELECTOR
    // ==========================================
    "root_category_select": {
      id: "root_category_select",
      ruleId: "RULE-ROOT-01",
      type: "question",
      category: "root",
      title: "Primary Symptom & Hardware Domain Selection",
      question: "What specific failure mode or symptom is your ESP32 / IoT hardware exhibiting?",
      description: "Select the primary observed anomaly from your physical circuit, multimeter measurements, or serial monitor logs.",
      options: [
        {
          id: "opt_brownout",
          label: "Spontaneous Reboots / 'Brownout detector was triggered'",
          description: "Device reboots unexpectedly during boot, Wi-Fi initialization, or high current RF packet transmit.",
          nextNodeId: "q_brownout_timing",
          keywords: ["brownout", "reboot", "restart", "trigger", "spontaneous", "power", "reset", "drop", "voltage", "2.5v"]
        },
        {
          id: "opt_espnow",
          label: "ESP-NOW Communication Failure / Delivery Error",
          description: "ESP-NOW packets fail to send, return status 1 (FAIL), ESP_ERR_ESPNOW_NOT_INIT, or peer fails to ACK.",
          nextNodeId: "q_espnow_error_type",
          keywords: ["espnow", "esp-now", "mac", "pairing", "peer", "delivery", "send", "packet", "fail", "callback"]
        },
        {
          id: "opt_wifi",
          label: "Wi-Fi Connection Timeout / FreeRTOS Watchdog Hangs",
          description: "ESP32 fails to connect to router, hangs in WiFi.begin loop, or triggers Task Watchdog Timer (TWDT).",
          nextNodeId: "q_wifi_symptom",
          keywords: ["wifi", "wi-fi", "connect", "timeout", "hang", "router", "ssid", "watchdog", "twdt", "freertos"]
        },
        {
          id: "opt_gpio",
          label: "GPIO Pin Failure / 5V Overvoltage Destruction",
          description: "Digital inputs read incorrect values, GPIO pin hot to touch, or board unresponsive after interfacing 5V sensor/relay.",
          nextNodeId: "q_gpio_voltage_level",
          keywords: ["gpio", "pin", "sensor", "voltage", "logic", "relay", "read", "digital", "5v", "hot", "latchup"]
        },
        {
          id: "opt_antenna",
          label: "High Packet Loss / Low RSSI / Signal Degradation",
          description: "Poor RF range, frequent packet drop, RSSI below -85dBm, or range drops sharply inside metal cabinets.",
          nextNodeId: "q_antenna_type",
          keywords: ["antenna", "rssi", "packet", "loss", "signal", "degradation", "range", "rf", "dbm", "faraday"]
        },
        {
          id: "opt_i2c",
          label: "I2C Bus Lockup / OLED Display & Sensor Freeze",
          description: "Microcontroller freezes during Wire.begin() or Wire.endTransmission(); SDA line stuck LOW.",
          nextNodeId: "q_i2c_symptom",
          keywords: ["i2c", "wire", "sda", "scl", "oled", "display", "freeze", "lockup", "pullup", "sensor"]
        },
        {
          id: "opt_spi",
          label: "SPI Bus Corruption / SD Card Read Failure",
          description: "SPI SD card fails to mount, MISO/MOSI frame CRC errors, or peripheral conflicts on shared SPI bus.",
          nextNodeId: "q_spi_symptom",
          keywords: ["spi", "sd", "card", "mount", "miso", "mosi", "sclk", "cs", "chip select", "flash"]
        },
        {
          id: "opt_adc",
          label: "ADC Analog Sensor Reads 0 or Garbage during Wi-Fi",
          description: "Analog readings on GPIO pins fluctuate wildly or read zero as soon as WiFi.begin() is called.",
          nextNodeId: "q_adc_wifi_conflict",
          keywords: ["adc", "analog", "analogread", "sensor", "noise", "zero", "conflict", "adc2"]
        },
        {
          id: "opt_strap",
          label: "Perpetual Boot Failure / Bootloader Mode Lockup",
          description: "ESP32 prints 'waiting for download' or crashes immediately on reset when external circuit is attached.",
          nextNodeId: "q_strapping_pins",
          keywords: ["strap", "strapping", "bootloader", "download", "boot", "gpio0", "gpio2", "gpio12", "mtdi"]
        }
      ]
    },

    // ==========================================
    // FAULT TREE 1: BROWNOUT RESETS
    // ==========================================
    "q_brownout_timing": {
      id: "q_brownout_timing",
      ruleId: "RULE-PWR-Q01",
      type: "question",
      category: "brownout",
      title: "Brownout Reset Timing & Manifestation",
      question: "When exactly does the ESP32 reset or print the brownout detector error on the Serial Monitor?",
      description: "Observing the exact moment of brownout helps pinpoint transient inrush current vs steady-state regulator saturation.",
      options: [
        {
          id: "opt_bo_wifi_init",
          label: "Immediately when WiFi.begin() or esp_now_init() is called",
          description: "Reset coincides precisely with RF power amplifier calibration turn-on.",
          nextNodeId: "q_brownout_power_source",
          keywords: ["wifi", "begin", "esp_now", "init", "transmit", "rf", "power", "amplifier", "turn-on"]
        },
        {
          id: "opt_bo_continuous",
          label: "Continuous boot loop before main setup() completes",
          description: "Board resets repeatedly even before Wi-Fi initialization code executes.",
          nextNodeId: "q_brownout_regulator_heat",
          keywords: ["boot", "loop", "continuous", "setup", "reset", "before", "perpetual"]
        }
      ]
    },

    "q_brownout_power_source": {
      id: "q_brownout_power_source",
      ruleId: "RULE-PWR-Q02",
      type: "question",
      category: "brownout",
      title: "Power Source & Decoupling Capacitance",
      question: "How is the ESP32 powered, and is there external decoupling capacitance on the 3.3V rail?",
      description: "ESP32 RF transmission generates 350mA–500mA current spikes lasting tens of microseconds.",
      options: [
        {
          id: "opt_bo_usb_thin",
          label: "Powered via PC USB port or long thin USB cable with NO extra capacitors",
          description: "Standard USB cable without bulk storage near the 3.3V header pins.",
          nextNodeId: "diag_brownout_transient_spike",
          keywords: ["usb", "pc", "cable", "thin", "capacitor", "capacitors", "no", "long"]
        },
        {
          id: "opt_bo_high_tx_power",
          label: "Powered via 5V Vin pin with max TX power setting (+20dBm)",
          description: "Linear LDO regulator (e.g. AMS1117-3.3) feeding ESP32 under maximum RF output.",
          nextNodeId: "diag_brownout_ldo_saturation",
          keywords: ["vin", "5v", "tx", "power", "maximum", "max", "ldo", "ams1117"]
        }
      ]
    },

    "q_brownout_regulator_heat": {
      id: "q_brownout_regulator_heat",
      ruleId: "RULE-PWR-Q03",
      type: "question",
      category: "brownout",
      title: "Regulator Thermal & Input Voltage Check",
      question: "Is the onboard 3.3V LDO regulator hot to touch, or is Vin powered by >9V DC?",
      description: "High input voltage across linear regulators creates extreme thermal dissipation (P = (Vin - 3.3V) * I).",
      options: [
        {
          id: "opt_bo_hot_reg",
          label: "Regulator is extremely hot, Vin is connected to 9V or 12V supply",
          description: "Excessive thermal dropout causing internal thermal shutdown on AMS1117.",
          nextNodeId: "diag_brownout_thermal_shutdown",
          keywords: ["hot", "regulator", "9v", "12v", "supply", "heat", "thermal"]
        },
        {
          id: "opt_bo_under_voltage",
          label: "Regulator is cool, but VDD 3.3V rail measures below 3.0V under multimeter test",
          description: "Input power supply cannot source required base current.",
          nextNodeId: "diag_brownout_insufficient_source",
          keywords: ["cool", "vdd", "3.3v", "3.0v", "rail", "multimeter", "measure", "undervoltage"]
        }
      ]
    },

    "diag_brownout_transient_spike": {
      id: "diag_brownout_transient_spike",
      ruleId: "RULE-PWR-01",
      type: "diagnosis",
      category: "brownout",
      confidenceFactor: 0.98,
      formalRuleStatement: "IF (Event == 'WiFi.begin() / esp_now_init()') ∧ (PowerSource == 'USB_No_Decoupling') ∧ (VDD_Dip < 2.80V) THEN HYPOTHESIS('Transient RF Inrush Current & Cable Impedance Dip', CF=0.98)",
      antecedents: [
        "Wi-Fi Power Amplifier (PA) turn-on triggers 450mA instantaneous inrush spike",
        "USB cable parasitic resistance and inductance causes transient voltage drop on 3.3V rail",
        "Internal ESP32 brownout detector triggers at 2.80V threshold"
      ],
      title: "Transient RF Inrush Current & Cable Impedance Dip",
      severity: "CRITICAL",
      symptomSummary: "ESP32 boots successfully in serial monitor, but resets immediately when WiFi.begin() or esp_now_init() is called with 'Brownout detector was triggered'.",
      diagnosis: "Transient Voltage Drop on 3.3V Rail during Wi-Fi RF Power Amplifier Turn-On.",
      rootCause: "When the ESP32 Wi-Fi radio activates, current consumption jumps from ~40mA to >400mA in under 100 microseconds. Thin USB cables or low-quality USB ports introduce resistance causing the VDD rail to dip below the 2.8V internal brownout comparator threshold.",
      engineeringSolution: {
        summary: "Solder a 470uF low-ESR electrolytic capacitor across 3V3 and GND pins, and reduce maximum Wi-Fi TX power.",
        steps: [
          "Connect a 470uF to 1000uF low-ESR electrolytic capacitor directly across the ESP32 3V3 and GND header pins.",
          "Add a 0.1uF ceramic capacitor in parallel to suppress high-frequency RF switching noise.",
          "Use a short, thick USB cable (24 AWG power conductors or better).",
          "Lower Wi-Fi TX power in code using esp_wifi_set_max_tx_power(52) (13dBm instead of default 20dBm)."
        ],
        circuitDiagramNote: "Place 470uF capacitor as physically close to the ESP32 module VDD pin as possible.",
        codeSnippet: "#include <esp_wifi.h>\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.mode(WIFI_STA);\n  // Lower TX power to reduce peak current inrush\n  esp_wifi_set_max_tx_power(52); // ~13 dBm\n  WiFi.begin(\"SSID\", \"PASS\");\n}"
      }
    },

    "diag_brownout_ldo_saturation": {
      id: "diag_brownout_ldo_saturation",
      ruleId: "RULE-PWR-02",
      type: "diagnosis",
      category: "brownout",
      confidenceFactor: 0.95,
      formalRuleStatement: "IF (PowerSupply == 'Vin_5V') ∧ (TX_Power == 'Max_20dBm') ∧ (LDO_Dropout_Exceeded == TRUE) THEN HYPOTHESIS('Linear Regulator LDO Dropout Saturation', CF=0.95)",
      antecedents: [
        "5V Vin supply line feeds onboard AMS1117-3.3 linear regulator",
        "Regulator dropout voltage (1.1V - 1.3V) requires minimum 4.6V Vin under 500mA load",
        "Weak 5V rail dips under load, starving regulator output below 3.0V"
      ],
      title: "Linear Regulator (LDO) Dropout Saturation",
      severity: "CRITICAL",
      symptomSummary: "ESP32 reboots intermittently under heavy transmission load or long ESP-NOW broadcast bursts.",
      diagnosis: "AMS1117 Linear Regulator Dropout Saturation under Sustained 500mA Load.",
      rootCause: "Standard AMS1117-3.3 regulators have a dropout voltage of 1.1V to 1.3V at 500mA. If the 5V input rail dips below 4.6V under load, the regulator output drops below 3.3V, triggering the brownout detector.",
      engineeringSolution: {
        summary: "Supply power via a high-efficiency DC-DC switching buck converter or high-current 3.3V regulated source.",
        steps: [
          "Verify the 5V power supply can source at least 1.5A continuous current.",
          "Replace linear AMS1117 with a high-efficiency DC-DC step-down buck converter (e.g. MP1584 or LM2596).",
          "Ensure input voltage to Vin pin remains above 4.75V at all times under peak load."
        ],
        circuitDiagramNote: "DC-DC Buck Converter output (3.3V) should connect directly to 3V3 pin, bypassing onboard LDO."
      }
    },

    "diag_brownout_thermal_shutdown": {
      id: "diag_brownout_thermal_shutdown",
      ruleId: "RULE-PWR-03",
      type: "diagnosis",
      category: "brownout",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (Vin >= 9.0V) ∧ (LDO_Temperature > 125C) THEN HYPOTHESIS('LDO Thermal Overload & Cyclic Thermal Shutdown', CF=0.99)",
      antecedents: [
        "Vin supply voltage is 9V - 12V DC into linear AMS1117 regulator",
        "Thermal dissipation P = (12V - 3.3V) * 0.25A = 2.175 Watts",
        "AMS1117 SOT-223 package thermal resistance exceeds limits, triggering thermal shutdown"
      ],
      title: "Onboard LDO Thermal Overload & Cyclic Thermal Shutdown",
      severity: "CRITICAL",
      symptomSummary: "ESP32 board runs for 10-30 seconds, gets extremely hot to touch, then resets continuously.",
      diagnosis: "Linear Regulator Thermal Shutdown due to Excessive Vin Differential.",
      rootCause: "Feeding 9V or 12V into Vin forces the AMS1117 linear regulator to dissipate (12V - 3.3V) * 0.25A = 2.175 Watts of pure heat into a tiny SOT-223 PCB copper footprint. The chip exceeds 125°C and shuts down safely, then restarts as it cools down, causing a continuous reboot loop.",
      engineeringSolution: {
        summary: "Step down 9V/12V supply to 5.0V using a DC-DC Buck Converter before connecting to ESP32 Vin.",
        steps: [
          "Disconnect the 9V/12V power supply immediately from the ESP32 Vin pin.",
          "Install a DC-DC Step-Down (Buck) Converter (e.g., MP1584EN, LM2596) between your 12V battery and ESP32.",
          "Adjust buck converter output voltage to exactly 5.0V before connecting to the ESP32 5V/Vin pin."
        ],
        circuitDiagramNote: "12V Battery -> [DC-DC Buck Converter: 5.0V Output] -> ESP32 5V Vin Pin."
      }
    },

    "diag_brownout_insufficient_source": {
      id: "diag_brownout_insufficient_source",
      ruleId: "RULE-PWR-04",
      type: "diagnosis",
      category: "brownout",
      confidenceFactor: 0.94,
      formalRuleStatement: "IF (PowerSupply_CurrentRating < 500mA) ∧ (VDD_SteadyState < 3.0V) THEN HYPOTHESIS('Insufficient Power Supply Current Rating', CF=0.94)",
      antecedents: [
        "Power source maximum current rating is under 500mA (e.g. 100mA USB port or 9V alkaline battery)",
        "Steady-state 3.3V rail measures below 3.0V under basic operating conditions"
      ],
      title: "Insufficient Power Supply Current Capacity (<500mA)",
      severity: "CRITICAL",
      symptomSummary: "ESP32 fails to boot or resets repeatedly; power LED on board is dim or flickering.",
      diagnosis: "Power Supply Current Limit Starvation (< 500mA rating).",
      rootCause: "The power source (e.g., 9V alkaline rectangular battery, unpowered USB hub, or small 100mA bench supply) cannot deliver the 250mA continuous and 500mA peak current demanded by the dual Xtensa cores and Wi-Fi subsystem.",
      engineeringSolution: {
        summary: "Upgrade power supply to a 5V/2A regulated adapter or high-discharge Li-Ion 18650 cell.",
        steps: [
          "Replace the power source with a dedicated 5V 2000mA (2A) USB wall adapter.",
          "If battery powered, use a 3.7V 18650 Li-Ion cell (with LDO) capable of >2A burst discharge.",
          "Avoid 9V rectangular alkaline batteries (PP3) as their internal resistance causes severe voltage collapse under 100mA+ loads."
        ]
      }
    },

    // ==========================================
    // FAULT TREE 2: ESP-NOW MAC & PEERS
    // ==========================================
    "q_espnow_error_type": {
      id: "q_espnow_error_type",
      ruleId: "RULE-ESPNOW-Q01",
      type: "question",
      category: "espnow",
      title: "ESP-NOW Error Code & Callback Status",
      question: "What specific error code or callback status is returned by the ESP-NOW transmission functions?",
      description: "ESP-NOW provides deterministic error returns from esp_now_init(), esp_now_send(), and onDataSent callbacks.",
      options: [
        {
          id: "opt_en_send_fail",
          label: "esp_now_send() returns ESP_OK, but OnDataSent callback returns status 1 (ESP_NOW_SEND_FAIL)",
          description: "Packet was transmitted over the air, but the receiver MAC node never acknowledged (ACK) reception.",
          nextNodeId: "q_espnow_channel_sync",
          keywords: ["callback", "status 1", "fail", "send", "esp_now_send_fail", "no ack", "ack"]
        },
        {
          id: "opt_en_not_init",
          label: "esp_now_init() returns ESP_ERR_ESPNOW_NOT_INIT or ESP_ERR_ESPNOW_INTERNAL",
          description: "ESP-NOW subsystem failed to initialize during setup().",
          nextNodeId: "diag_espnow_wifi_mode_missing",
          keywords: ["esp_now_init", "esp_err_espnow_not_init", "not init", "internal", "error"]
        },
        {
          id: "opt_en_peer_exist",
          label: "esp_now_add_peer() returns ESP_ERR_ESPNOW_EXIST or ESP_ERR_ESPNOW_FULL",
          description: "Peer table capacity exceeded or duplicate peer registration attempted.",
          nextNodeId: "diag_espnow_peer_capacity_exceeded",
          keywords: ["add_peer", "exist", "full", "peer", "capacity", "table"]
        }
      ]
    },

    "q_espnow_channel_sync": {
      id: "q_espnow_channel_sync",
      ruleId: "RULE-ESPNOW-Q02",
      type: "question",
      category: "espnow",
      title: "Wi-Fi Operating Channel Alignment",
      question: "Are both the Transmitter and Receiver ESP32 nodes locked to the exact same 2.4GHz Wi-Fi channel?",
      description: "ESP-NOW operates on the raw 802.11 MAC layer and requires identical primary RF channel numbers (1 to 14).",
      options: [
        {
          id: "opt_en_diff_channels",
          label: "One node is connected to home Wi-Fi router (Channel 6), while transmitter is on default Channel 1",
          description: "Transmitter and receiver are listening on different frequencies.",
          nextNodeId: "diag_espnow_channel_mismatch",
          keywords: ["channel", "router", "different", "mismatch", "ch 1", "ch 6", "frequency"]
        },
        {
          id: "opt_en_same_channel",
          label: "Both nodes are forced to the same channel, but MAC address was copied from STA instead of AP mode",
          description: "Target destination MAC address does not match active interface on receiver.",
          nextNodeId: "diag_espnow_mac_interface_mismatch",
          keywords: ["same channel", "mac", "sta", "ap", "station", "interface", "address"]
        }
      ]
    },

    "diag_espnow_channel_mismatch": {
      id: "diag_espnow_channel_mismatch",
      ruleId: "RULE-ESPNOW-01",
      type: "diagnosis",
      category: "espnow",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (CallbackStatus == ESP_NOW_SEND_FAIL) ∧ (Channel_TX != Channel_RX) THEN HYPOTHESIS('Wi-Fi Primary RF Channel Asynchrony', CF=0.99)",
      antecedents: [
        "Transmitter ESP32 operates on default Wi-Fi Channel 1",
        "Receiver ESP32 connects to an AP router which dynamically assigns Channel 6 or 11",
        "Receiver radio hardware cannot demodulate frames transmitted on a different 2.4GHz center frequency"
      ],
      title: "Wi-Fi Primary RF Channel Asynchrony",
      severity: "CRITICAL",
      symptomSummary: "esp_now_send() executes successfully, but OnDataSent callback always returns status = 1 (Delivery Failed).",
      diagnosis: "Wi-Fi Channel Mismatch between ESP-NOW Transmitter and Receiver.",
      rootCause: "ESP-NOW transmits raw 802.11 Vendor-Specific Action Frames. If Node A transmits on 2.412 GHz (Channel 1) and Node B is listening on 2.437 GHz (Channel 6), Node B's RF front-end physically filters out the transmission, resulting in missing MAC-layer 802.11 ACK frames.",
      engineeringSolution: {
        summary: "Explicitly set identical Wi-Fi channels on both nodes using esp_wifi_set_channel() before initializing ESP-NOW.",
        steps: [
          "Call WiFi.mode(WIFI_STA) on both nodes.",
          "Call esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE) on BOTH nodes to force them onto Channel 1.",
          "Ensure peerInfo.channel = 1 in the esp_now_peer_info_t struct.",
          "If the receiver must connect to a home Wi-Fi router, retrieve the router channel using WiFi.channel() and set the transmitter to that exact channel."
        ],
        codeSnippet: "#include <esp_now.h>\n#include <WiFi.h>\n#include <esp_wifi.h>\n\nvoid setup() {\n  WiFi.mode(WIFI_STA);\n  // Force primary channel sync before ESP-NOW init:\n  esp_wifi_set_channel(1, WIFI_SECOND_CHAN_NONE);\n  if (esp_now_init() != ESP_OK) {\n    Serial.println(\"ESP-NOW Init Failed\");\n  }\n}"
      }
    },

    "diag_espnow_mac_interface_mismatch": {
      id: "diag_espnow_mac_interface_mismatch",
      ruleId: "RULE-ESPNOW-02",
      type: "diagnosis",
      category: "espnow",
      confidenceFactor: 0.96,
      formalRuleStatement: "IF (PeerMAC == Receiver_STA_MAC) ∧ (Receiver_Active_Mode == WIFI_AP) THEN HYPOTHESIS('Station vs Access Point MAC Address Mismatch', CF=0.96)",
      antecedents: [
        "ESP32 hardware has two distinct MAC addresses: STA MAC (base MAC) and AP MAC (base MAC + 1)",
        "Transmitter registered peer using STA MAC address",
        "Receiver was initialized in WIFI_AP mode, causing hardware MAC filter to reject frame"
      ],
      title: "Station (STA) vs Access Point (AP) MAC Address Mismatch",
      severity: "CRITICAL",
      symptomSummary: "ESP-NOW delivery fails with status 1 even when both nodes are verified on Channel 1.",
      diagnosis: "Target MAC Address Belongs to Inactive Wi-Fi Interface.",
      rootCause: "An ESP32 has distinct MAC addresses for its Station (STA) and SoftAP (AP) interfaces (usually differing by the last byte by +1). If the transmitter sends packets to the receiver's STA MAC while the receiver is listening on its AP interface, the hardware MAC filter drops the packet.",
      engineeringSolution: {
        summary: "Print WiFi.macAddress() on the receiver in the exact mode used (STA vs AP) and register that exact 6-byte array.",
        steps: [
          "On the receiver, run: Serial.println(WiFi.macAddress()) immediately after calling WiFi.mode().",
          "If using WiFi.mode(WIFI_AP_STA), check whether your ESP-NOW peer is listening on WiFi.softAPmacAddress().",
          "Update the broadcast or peer array on the transmitter node with the exact verified bytes."
        ],
        codeSnippet: "// Verify active MAC on Receiver:\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.mode(WIFI_STA);\n  Serial.print(\"Active STA MAC Address: \");\n  Serial.println(WiFi.macAddress());\n}"
      }
    },

    "diag_espnow_wifi_mode_missing": {
      id: "diag_espnow_wifi_mode_missing",
      ruleId: "RULE-ESPNOW-03",
      type: "diagnosis",
      category: "espnow",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (esp_now_init() == ESP_ERR_ESPNOW_NOT_INIT) ∧ (WiFi_Mode_Initialized == FALSE) THEN HYPOTHESIS('Missing WiFi.mode() Initialization Call', CF=0.99)",
      antecedents: [
        "esp_now_init() was called without prior WiFi.mode(WIFI_STA) execution",
        "Underlying ESP-IDF 802.11 driver stack was uninitialized"
      ],
      title: "Missing WiFi.mode(WIFI_STA) Initialization Call",
      severity: "CRITICAL",
      symptomSummary: "esp_now_init() crashes or returns ESP_ERR_ESPNOW_NOT_INIT immediately in setup().",
      diagnosis: "Wi-Fi Driver Stack Uninitialized Prior to ESP-NOW Invocation.",
      rootCause: "ESP-NOW is a protocol layer built directly on top of the ESP32 Wi-Fi PHY/MAC driver. Calling esp_now_init() before calling WiFi.mode(WIFI_STA) or esp_wifi_init() causes the function to fail because the underlying radio driver state machine is disabled.",
      engineeringSolution: {
        summary: "Call WiFi.mode(WIFI_STA) before esp_now_init() in setup().",
        steps: [
          "Add WiFi.mode(WIFI_STA) as the very first line of networking setup.",
          "Verify return value: if (esp_now_init() != ESP_OK) { Serial.println('Init Failed'); return; }",
          "Ensure WiFi.disconnect() is not called afterwards as it de-initializes the Wi-Fi radio stack."
        ],
        codeSnippet: "void setup() {\n  Serial.begin(115200);\n  // MANDATORY: Must initialize Wi-Fi mode before ESP-NOW\n  WiFi.mode(WIFI_STA);\n  if (esp_now_init() == ESP_OK) {\n    Serial.println(\"ESP-NOW Initialized Successfully\");\n  }\n}"
      }
    },

    "diag_espnow_peer_capacity_exceeded": {
      id: "diag_espnow_peer_capacity_exceeded",
      ruleId: "RULE-ESPNOW-04",
      type: "diagnosis",
      category: "espnow",
      confidenceFactor: 0.97,
      formalRuleStatement: "IF (RegisteredPeersCount > 20) ∨ (esp_now_add_peer() == ESP_ERR_ESPNOW_FULL) THEN HYPOTHESIS('ESP-NOW Hardware Peer Table Overflow (Max 20)', CF=0.97)",
      antecedents: [
        "ESP32 hardware peer table reached maximum limit (20 total peers, max 6 encrypted)",
        "esp_now_add_peer() returned ESP_ERR_ESPNOW_FULL"
      ],
      title: "ESP-NOW Hardware Peer Table Overflow (Max 20 Peers)",
      severity: "WARNING",
      symptomSummary: "esp_now_add_peer() fails when pairing node #21 or node #7 in encrypted mode.",
      diagnosis: "ESP-NOW Hardware Internal Peer Table Exceeded.",
      rootCause: "The ESP32 ESP-NOW firmware implementation allocates a fixed internal peer storage table with a hard limit of 20 paired nodes (and a maximum of 6 encrypted peers). Attempting to add additional peers causes memory allocation failure.",
      engineeringSolution: {
        summary: "Use broadcast address (FF:FF:FF:FF:FF:FF) or dynamically delete inactive peers using esp_now_del_peer().",
        steps: [
          "For mesh or star topologies with >20 nodes, register a single Broadcast Peer with MAC FF:FF:FF:FF:FF:FF.",
          "Include target node ID inside the packet payload and filter in application firmware.",
          "If unicast is required, call esp_now_del_peer() on inactive nodes before calling esp_now_add_peer() for new nodes."
        ],
        codeSnippet: "// Broadcast peer registration for >20 nodes:\nuint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};\nesp_now_peer_info_t peerInfo = {};\nmemcpy(peerInfo.peer_addr, broadcastAddress, 6);\npeerInfo.channel = 0;\npeerInfo.encrypt = false;\nesp_now_add_peer(&peerInfo);"
      }
    },

    // ==========================================
    // FAULT TREE 3: WI-FI & FREERTOS WATCHDOG
    // ==========================================
    "q_wifi_symptom": {
      id: "q_wifi_symptom",
      ruleId: "RULE-WIFI-Q01",
      type: "question",
      category: "wifi",
      title: "Wi-Fi Connection Failure Manifestation",
      question: "How does the Wi-Fi connection fail, and what appears on the Serial Monitor?",
      description: "Distinguish between Task Watchdog resets, infinite connection loops, and DHCP timeout failures.",
      options: [
        {
          id: "opt_wifi_wdt_panic",
          label: "Serial Monitor prints 'Task watchdog got triggered' or 'Guru Meditation Error' inside while(WiFi.status() != WL_CONNECTED)",
          description: "FreeRTOS Task Watchdog Timer (TWDT) resets Core 1 after ~5 seconds of blocking loop.",
          nextNodeId: "diag_wifi_blocking_loop_twdt",
          keywords: ["watchdog", "twdt", "guru", "meditation", "panic", "loop", "wl_connected", "blocking"]
        },
        {
          id: "opt_wifi_5ghz_steering",
          label: "ESP32 connects intermittently or hangs forever on modern dual-band mesh Wi-Fi router",
          description: "Dual-band 2.4GHz / 5GHz router attempts band steering toward unsupported 5GHz radio.",
          nextNodeId: "diag_wifi_5ghz_band_steering",
          keywords: ["5ghz", "band", "steering", "mesh", "dual-band", "router", "hang", "intermittent"]
        },
        {
          id: "opt_wifi_dhcp_timeout",
          label: "WiFi.status() returns WL_NO_SSID_AVAIL or WL_CONNECT_FAILED after 30 seconds",
          description: "Access Point signal not found or DHCP server fails to assign local IP address.",
          nextNodeId: "diag_wifi_dhcp_exhaustion",
          keywords: ["wl_no_ssid_avail", "wl_connect_failed", "dhcp", "ip", "timeout", "exhaustion"]
        }
      ]
    },

    "diag_wifi_blocking_loop_twdt": {
      id: "diag_wifi_blocking_loop_twdt",
      ruleId: "RULE-WIFI-01",
      type: "diagnosis",
      category: "wifi",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (LoopPattern == 'while(WiFi.status() != WL_CONNECTED)') ∧ (YieldCall == NONE) ∧ (Runtime > 5000ms) THEN HYPOTHESIS('FreeRTOS Task Watchdog Starvation on Core 1', CF=0.99)",
      antecedents: [
        "Tight synchronous while() loop executed without delay() or yield()",
        "FreeRTOS IDLE task on Core 1 starved of execution time",
        "Task Watchdog Timer (TWDT) threshold (default 5000ms) exceeded, triggering hard core reset"
      ],
      title: "Synchronous Blocking Loop Starving FreeRTOS Task Watchdog (TWDT)",
      severity: "CRITICAL",
      symptomSummary: "ESP32 crashes and prints 'Task watchdog got triggered. The following tasks did not reset the watchdog in time: IDLE0 or loopTask' followed by a register dump.",
      diagnosis: "Synchronous Blocking Loop Starving FreeRTOS Task Watchdog on CPU Core 1.",
      rootCause: "In the Arduino-ESP32 framework, loop() runs inside a FreeRTOS task on Core 1. Writing while (WiFi.status() != WL_CONNECTED) {} without delay() starves the FreeRTOS IDLE task from executing. After 5 seconds, the Task Watchdog Timer (TWDT) triggers a hard core reset.",
      engineeringSolution: {
        summary: "Insert delay(10) or vTaskDelay(1) inside connection loops, or use non-blocking asynchronous Wi-Fi event callbacks.",
        steps: [
          "Add delay(10) inside the while loop to allow the FreeRTOS scheduler to feed the Task Watchdog.",
          "Implement a timeout counter to break out of the loop after 10-15 seconds if the router is offline.",
          "Better: Register event handlers using WiFi.onEvent() for fully asynchronous, non-blocking connection management."
        ],
        codeSnippet: "// Proper Non-Blocking Wi-Fi Connection Loop with Watchdog Yield:\nunsigned long startAttemptTime = millis();\nwhile (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 15000) {\n  delay(100); // YIELDS CPU TO FREERTOS IDLE TASK\n  Serial.print(\".\");\n}\nif (WiFi.status() != WL_CONNECTED) {\n  Serial.println(\"\\nConnection Timeout! Retrying later...\");\n}"
      }
    },

    "diag_wifi_5ghz_band_steering": {
      id: "diag_wifi_5ghz_band_steering",
      ruleId: "RULE-WIFI-02",
      type: "diagnosis",
      category: "wifi",
      confidenceFactor: 0.96,
      formalRuleStatement: "IF (Router_Type == 'DualBand_Unified_SSID') ∧ (ESP32_Radio == '2.4GHz_Only') ∧ (Handshake_Fails == TRUE) THEN HYPOTHESIS('Router 5GHz Band-Steering Probe Rejection', CF=0.96)",
      antecedents: [
        "Router broadcasts single unified SSID across both 2.4GHz and 5GHz bands",
        "Router 802.11k/v/r band steering engine attempts to steer ESP32 probe requests to 5GHz",
        "ESP32 hardware radio only supports 2.4GHz (802.11 b/g/n), causing association refusal"
      ],
      title: "Router 5GHz Band-Steering Probe Rejection",
      severity: "WARNING",
      symptomSummary: "ESP32 connects to mobile hotspot instantly, but fails to connect to home mesh router sharing a single SSID for 2.4GHz and 5GHz.",
      diagnosis: "Router Band-Steering Feature Blocking 2.4GHz-Only ESP32 PHY Association.",
      rootCause: "Modern Wi-Fi 6 / mesh routers use 'Band Steering' to force dual-band clients onto 5GHz by ignoring initial probe requests on 2.4GHz. Because the standard ESP32 is 2.4GHz-only, the router's band steering logic continuously delays or denies association frames.",
      engineeringSolution: {
        summary: "Split 2.4GHz and 5GHz SSIDs on router settings or create a dedicated 2.4GHz IoT Guest Network.",
        steps: [
          "Log into router management console (e.g. 192.168.1.1).",
          "Disable 'Band Steering' / 'Smart Connect' or separate SSIDs into 'Home_2.4G' and 'Home_5G'.",
          "Enable a dedicated 'IoT Network' locked to 2.4GHz with WPA2-PSK (AES) security.",
          "Ensure router Wi-Fi security is not set to WPA3-Only mode (ESP32 standard firmware requires WPA2-PSK)."
        ]
      }
    },

    "diag_wifi_dhcp_exhaustion": {
      id: "diag_wifi_dhcp_exhaustion",
      ruleId: "RULE-WIFI-03",
      type: "diagnosis",
      category: "wifi",
      confidenceFactor: 0.92,
      formalRuleStatement: "IF (WiFi.status() == WL_CONNECT_FAILED) ∧ (IP_Assigned == FALSE) THEN HYPOTHESIS('DHCP IP Pool Exhaustion / Static IP Misconfiguration', CF=0.92)",
      antecedents: [
        "ESP32 successfully authenticates with Wi-Fi Access Point (WPA2 4-Way Handshake OK)",
        "Router DHCP server pool is exhausted or fails to offer IP lease within timeout"
      ],
      title: "DHCP Pool Exhaustion / Router IP Lease Failure",
      severity: "WARNING",
      symptomSummary: "ESP32 connects to Wi-Fi network, but hangs indefinitely awaiting an IP address and prints IP: 0.0.0.0.",
      diagnosis: "DHCP Server Pool Exhaustion or Static IP Gateway Conflict.",
      rootCause: "The router's DHCP lease pool has run out of available addresses, or the DHCP request packet was lost due to network congestion, leaving the ESP32 stuck in the DHCP DISCOVER state.",
      engineeringSolution: {
        summary: "Assign a manual static IP address using WiFi.config() to bypass DHCP negotiation entirely.",
        steps: [
          "Define static IP, gateway, subnet mask, and DNS addresses outside the router's dynamic DHCP range.",
          "Call WiFi.config(local_IP, gateway, subnet, primaryDNS) before WiFi.begin().",
          "Reboot the router to clear stale DHCP leases."
        ],
        codeSnippet: "// Configure Static IP to bypass DHCP delays:\nIPAddress local_IP(192, 168, 1, 185);\nIPAddress gateway(192, 168, 1, 1);\nIPAddress subnet(255, 255, 255, 0);\nIPAddress primaryDNS(8, 8, 8, 8);\n\nvoid setup() {\n  WiFi.mode(WIFI_STA);\n  WiFi.config(local_IP, gateway, subnet, primaryDNS);\n  WiFi.begin(\"SSID\", \"PASS\");\n}"
      }
    },

    // ==========================================
    // FAULT TREE 4: GPIO VOLTAGE & LOGIC
    // ==========================================
    "q_gpio_voltage_level": {
      id: "q_gpio_voltage_level",
      ruleId: "RULE-GPIO-Q01",
      type: "question",
      category: "gpio",
      title: "External Sensor / Actuator Signal Voltage",
      question: "What logic voltage level is output by the external sensor, display, or relay module connected to the ESP32 GPIO pin?",
      description: "ESP32 GPIO pins operate at 3.3V LVCMOS logic levels with an absolute maximum rating of 3.6V.",
      options: [
        {
          id: "opt_gpio_5v_direct",
          label: "Connected directly to a 5V sensor (e.g. 5V Arduino, Ultrasonic HC-SR04, or 5V Relay module)",
          description: "5V logic high applied directly to ESP32 input pin without level shifting.",
          nextNodeId: "diag_gpio_overvoltage_latchup",
          keywords: ["5v", "hc-sr04", "relay", "direct", "arduino", "ultrasonic", "overvoltage"]
        },
        {
          id: "opt_gpio_inductive_spike",
          label: "Connected to a DC motor, solenoid, or inductive relay coil with NO flyback diode",
          description: "High-voltage inductive back-EMF spike (>50V) generated upon switch-off.",
          nextNodeId: "diag_gpio_inductive_back_emf",
          keywords: ["motor", "solenoid", "relay", "coil", "flyback", "diode", "inductive", "back-emf"]
        },
        {
          id: "opt_gpio_floating_pin",
          label: "Pushbutton or digital sensor connected with NO external or internal pull-up/pull-down resistor",
          description: "High-impedance floating pin picking up electrostatic noise.",
          nextNodeId: "diag_gpio_floating_input_noise",
          keywords: ["floating", "pull-up", "pull-down", "pushbutton", "button", "noise", "input_pullup"]
        }
      ]
    },

    "diag_gpio_overvoltage_latchup": {
      id: "diag_gpio_overvoltage_latchup",
      ruleId: "RULE-GPIO-01",
      type: "diagnosis",
      category: "gpio",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (GPIO_Input_Voltage >= 5.0V) ∧ (LevelShifter == NONE) THEN HYPOTHESIS('GPIO CMOS Gate Oxide Breakdown & Substrate Latch-up', CF=0.99)",
      antecedents: [
        "5.0V TTL logic level applied directly to 3.3V LVCMOS ESP32 GPIO pin",
        "Input voltage exceeds 3.6V absolute maximum rating in ESP32 datasheet",
        "Internal ESD clamping diodes forward-biased, dumping excess current into VDD rail and triggering substrate latch-up"
      ],
      title: "GPIO 5V Overvoltage Substrate Latch-up & Gate Destruction",
      severity: "CRITICAL",
      symptomSummary: "ESP32 becomes very hot; GPIO pin reads permanently HIGH or LOW; microcontroller fails to respond on serial monitor.",
      diagnosis: "CMOS Gate Oxide Breakdown & Substrate Latch-up from 5V Signal Injection.",
      rootCause: "ESP32 pins are NOT 5V tolerant. Applying 5V directly to a 3.3V LVCMOS pin causes the internal upper ESD protection diode to conduct continuously into the 3.3V rail. This causes catastrophic substrate latch-up, destroying the GPIO multiplexer and creating a permanent internal silicon short circuit.",
      engineeringSolution: {
        summary: "Replace destroyed ESP32 module and install bidirectional logic level shifters (BSS138/TXS0108E) or resistive voltage dividers.",
        steps: [
          "Disconnect the 5V sensor immediately (the damaged pin cannot be repaired in firmware).",
          "Use a 2-channel bidirectional logic level shifter (e.g. BSS138 MOSFET or TXS0108E) to step 5V signals down to 3.3V.",
          "For simple unidirectional signals, use a resistive voltage divider: 1kΩ in series and 2kΩ to GND (Vout = 5V * (2k / (1k + 2k)) = 3.33V)."
        ],
        circuitDiagramNote: "5V Signal -> [1kΩ Resistor] -> (ESP32 GPIO Pin) -> [2kΩ Resistor] -> GND."
      }
    },

    "diag_gpio_inductive_back_emf": {
      id: "diag_gpio_inductive_back_emf",
      ruleId: "RULE-GPIO-02",
      type: "diagnosis",
      category: "gpio",
      confidenceFactor: 0.98,
      formalRuleStatement: "IF (Load_Type == 'Inductive_Coil') ∧ (Flyback_Diode == NONE) THEN HYPOTHESIS('Inductive Back-EMF High Voltage Transient Spike', CF=0.98)",
      antecedents: [
        "Inductive coil (relay, solenoid, DC motor) switched by transistor/MOSFET from ESP32 pin",
        "Magnetic field collapses instantly on turn-off (V = -L * di/dt), generating >50V transient spike",
        "Absence of reverse flyback diode (1N4007 or 1N4148) across coil terminals"
      ],
      title: "Inductive Relay Coil Back-EMF High Voltage Spike",
      severity: "CRITICAL",
      symptomSummary: "ESP32 crashes or reboots with Guru Meditation Error every time a relay or motor switches OFF.",
      diagnosis: "Inductive Flyback Voltage Transient Spikes (>50V) Coupling into Power/Ground Planes.",
      rootCause: "When an inductive relay coil or motor is switched off, the collapsing magnetic field creates a high-voltage back-EMF transient spike (V = -L * di/dt) exceeding 50V. Without a reverse flyback diode, this high-voltage spike surges into the transistor collector/drain and grounds, causing core CPU latch-up.",
      engineeringSolution: {
        summary: "Install a 1N4007 or 1N4148 flyback diode in reverse parallel across the relay coil terminals, and use optoisolators.",
        steps: [
          "Solder a 1N4007 or 1N4148 diode across the relay coil terminals (cathode/stripe to +V supply, anode to switching transistor collector).",
          "Use optocoupler-isolated relay breakout boards (PC817) with separate JD-VCC power feeds.",
          "Add a 100nF snubber capacitor across motor terminals to suppress RF arcing noise."
        ],
        circuitDiagramNote: "Relay Coil (+) -> Cathode (Stripe) of 1N4007 | Relay Coil (-) -> Anode of 1N4007."
      }
    },

    "diag_gpio_floating_input_noise": {
      id: "diag_gpio_floating_input_noise",
      ruleId: "RULE-GPIO-03",
      type: "diagnosis",
      category: "gpio",
      confidenceFactor: 0.95,
      formalRuleStatement: "IF (PinMode == 'INPUT') ∧ (PullResistor == NONE) THEN HYPOTHESIS('High-Impedance Floating Input Electrostatic Noise', CF=0.95)",
      antecedents: [
        "Pin configured as basic pinMode(pin, INPUT) without pull-up or pull-down resistor",
        "High-impedance CMOS gate picks up capacitive 50/60Hz mains hum and RF noise"
      ],
      title: "High-Impedance Floating Input & Electrostatic Noise",
      severity: "INFO",
      symptomSummary: "digitalRead() returns random 0 and 1 values when a pushbutton is not pressed; reading changes when hands approach board.",
      diagnosis: "High-Impedance Floating CMOS Input Gate.",
      rootCause: "CMOS input pins have gigohm input impedance. When disconnected, the gate acts as an antenna, picking up 50Hz/60Hz electromagnetic hum and electrostatic charges, resulting in unpredictable digital readings.",
      engineeringSolution: {
        summary: "Configure internal pull-up resistor using pinMode(pin, INPUT_PULLUP) in setup().",
        steps: [
          "Change pinMode(pin, INPUT) to pinMode(pin, INPUT_PULLUP) in firmware.",
          "Wire the button between the GPIO pin and GND (reading will be LOW when pressed, HIGH when open).",
          "Note: GPIO 34-39 (Input-Only pins) do NOT have internal pull-up/pull-down resistors and require external 10kΩ resistors."
        ],
        codeSnippet: "const int BUTTON_PIN = 4;\n\nvoid setup() {\n  Serial.begin(115200);\n  // Enable internal 45k pull-up resistor:\n  pinMode(BUTTON_PIN, INPUT_PULLUP);\n}\n\nvoid loop() {\n  // Active LOW: Button pressed = LOW\n  if (digitalRead(BUTTON_PIN) == LOW) {\n    Serial.println(\"Button Pressed!\");\n    delay(200); // Debounce delay\n  }\n}"
      }
    },

    // ==========================================
    // FAULT TREE 5: ANTENNA & RF NOISE
    // ==========================================
    "q_antenna_type": {
      id: "q_antenna_type",
      ruleId: "RULE-ANT-Q01",
      type: "question",
      category: "antenna",
      title: "Antenna Hardware Configuration & Enclosure",
      question: "What physical antenna type and enclosure are used on the ESP32 node?",
      description: "ESP32 modules support onboard PCB trace antennas or external u.FL IPEX connectors.",
      options: [
        {
          id: "opt_ant_ufl_misconfigured",
          label: "External antenna connected to u.FL IPEX port, but zero-ohm selector resistor was NOT relocated",
          description: "Signal path remains routed to internal PCB trace antenna, leaving external antenna disconnected.",
          nextNodeId: "diag_antenna_jumper_mismatch",
          keywords: ["ufl", "u.fl", "ipex", "external", "resistor", "0402", "jumper", "resistor"]
        },
        {
          id: "opt_ant_metal_box",
          label: "ESP32 enclosed inside a solid metal junction box or aluminum project casing",
          description: "Faraday cage effect completely attenuating 2.4GHz RF signals.",
          nextNodeId: "diag_antenna_faraday_attenuation",
          keywords: ["metal", "aluminum", "box", "enclosure", "casing", "faraday", "shielding"]
        },
        {
          id: "opt_ant_noise_24ghz",
          label: "Plastic enclosure used, but packet drops surge near microwave ovens, USB 3.0 hubs, or dense Bluetooth beacons",
          description: "Severe 2.4GHz ISM spectrum noise and co-channel interference.",
          nextNodeId: "diag_antenna_24ghz_cochannel_noise",
          keywords: ["plastic", "microwave", "oven", "usb", "hub", "bluetooth", "beacon", "noise", "interference"]
        }
      ]
    },

    "diag_antenna_jumper_mismatch": {
      id: "diag_antenna_jumper_mismatch",
      ruleId: "RULE-ANT-01",
      type: "diagnosis",
      category: "antenna",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (AntennaPort == 'u.FL_External') ∧ (SMD_0402_Jumper == 'PCB_Trace_Position') THEN HYPOTHESIS('Zero-Ohm RF Path Jumper Selector Mismatch', CF=0.99)",
      antecedents: [
        "External omnidirectional antenna connected via u.FL IPEX connector",
        "Onboard 0402 zero-ohm RF SMD resistor left in factory default position connecting PCB trace antenna",
        "External antenna port remains un-driven and floating, causing high SWR RF reflection"
      ],
      title: "Zero-Ohm RF Path Jumper Selector Mismatch",
      severity: "CRITICAL",
      symptomSummary: "External antenna connected via u.FL yields zero range improvement or near 100% packet loss (RSSI < -90dBm).",
      diagnosis: "RF Signal Path Disconnected / Zero-Ohm Jumper Set to Internal PCB Antenna.",
      rootCause: "ESP32 modules with dual antenna options utilize a tiny 0402-size zero-ohm SMD resistor as an RF multiplexer jumper. If left in the default position, the u.FL connector remains floating and un-driven, causing high Standing Wave Ratio (SWR) reflections.",
      engineeringSolution: {
        summary: "Resolder 0402 0-ohm resistor toward the u.FL connector pad under a microscope.",
        steps: [
          "Examine the 0402 pads near the u.FL connector using a magnifying loupe or microscope.",
          "De-solder the zero-ohm SMD resistor (or bridge with solder) so the trace connects the ESP32 RF pin to the u.FL connector pad instead of the PCB trace antenna.",
          "Never run RF transmit without an antenna attached to an active RF port to prevent power amplifier degradation."
        ]
      }
    },

    "diag_antenna_faraday_attenuation": {
      id: "diag_antenna_faraday_attenuation",
      ruleId: "RULE-ANT-02",
      type: "diagnosis",
      category: "antenna",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (Enclosure_Material == 'Metal_Conductive') ∧ (Antenna == 'Internal_Inside_Box') THEN HYPOTHESIS('Faraday Shielding Attenuation by Metallic Enclosure', CF=0.99)",
      antecedents: [
        "ESP32 operates inside grounded conductive metal enclosure (steel/aluminum)",
        "2.4GHz RF electromagnetic waves attenuated by >40dB (10,000x signal power reduction)"
      ],
      title: "Faraday Shielding Attenuation by Metallic Enclosure",
      severity: "CRITICAL",
      symptomSummary: "ESP32 works on workbench, but loses connection immediately when cabinet door closes.",
      diagnosis: "RF Electromagnetic Attenuation / Faraday Cage Effect.",
      rootCause: "Conductive metal enclosures reflect and absorb 2.4GHz radio waves, attenuating signal strength by 30dB to 50dB (1,000x to 100,000x signal power reduction).",
      engineeringSolution: {
        summary: "Mount an external high-gain waterproof omni antenna outside the metal cabinet.",
        steps: [
          "Drill a hole in the metallic cabinet and install an IP67 SMA Female bulkhead connector.",
          "Connect an IPEX/u.FL to SMA pigtail cable from the ESP32 module to the SMA bulkhead.",
          "Attach a 2.4GHz 5dBi external omnidirectional antenna on the outside of the enclosure."
        ]
      }
    },

    "diag_antenna_24ghz_cochannel_noise": {
      id: "diag_antenna_24ghz_cochannel_noise",
      ruleId: "RULE-ANT-03",
      type: "diagnosis",
      category: "antenna",
      confidenceFactor: 0.94,
      formalRuleStatement: "IF (RF_Band == '2.4GHz_ISM') ∧ (NoiseSource == 'USB3_Microwave_Bluetooth') THEN HYPOTHESIS('2.4GHz ISM Band Co-Channel Spectrum Noise & Packet Loss', CF=0.94)",
      antecedents: [
        "Unshielded USB 3.0 cables or microwave ovens emitting wideband noise in 2.400–2.4835 GHz band",
        "MAC layer CSMA/CA backoff timers constantly triggered, dropping throughput"
      ],
      title: "2.4GHz ISM Band Co-Channel Spectrum Noise & Packet Loss",
      severity: "WARNING",
      symptomSummary: "Packet loss spikes periodically; RSSI fluctuates wildly despite fixed distance.",
      diagnosis: "2.4GHz ISM Band RF Noise & Co-Channel Interference.",
      rootCause: "Unshielded USB 3.0 cables/hubs generate wideband noise in the 2.4GHz spectrum. Microwave oven radiation leakage and dense Bluetooth/Zigbee networks cause frame collisions at the MAC layer.",
      engineeringSolution: {
        summary: "Enable ESP32 Long Range (LR) Mode or switch Wi-Fi channels to 1, 6, or 11.",
        steps: [
          "Use a Wi-Fi analyzer app to scan 2.4GHz channel utilization and lock your nodes to non-overlapping Channel 1, 6, or 11.",
          "Enable ESP32 Wi-Fi Long Range Mode (WIFI_PROTOCOL_LR) which uses 1/2 or 1/4 rate CCK modulation to boost sensitivity by up to +4dBm.",
          "Keep ESP32 antenna at least 1 meter away from USB 3.0 external hard drive cables and microwave ovens."
        ],
        codeSnippet: "#include <esp_wifi.h>\n\nvoid setup() {\n  WiFi.mode(WIFI_STA);\n  // Enable LR mode on STA interface for high noise immunity:\n  esp_wifi_set_protocol(WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N | WIFI_PROTOCOL_LR);\n}"
      }
    },

    // ==========================================
    // FAULT TREE 6: I2C BUS & DISPLAY LOCKUPS
    // ==========================================
    "q_i2c_symptom": {
      id: "q_i2c_symptom",
      ruleId: "RULE-I2C-Q01",
      type: "question",
      category: "i2c",
      title: "I2C Bus Wiring & Pull-Up Configuration",
      question: "Are external 4.7kΩ pull-up resistors present on SDA (GPIO 21) and SCL (GPIO 22), and does the bus hang in Wire.endTransmission()?",
      description: "I2C is an open-drain bus protocol requiring physical pull-up resistors to the 3.3V rail to pull lines HIGH.",
      options: [
        {
          id: "opt_i2c_no_pullups",
          label: "No external pull-up resistors installed; long jumper wires (>20cm) used",
          description: "Lines cannot rise to 3.3V logic HIGH, causing indefinite clock stretching bus hang.",
          nextNodeId: "diag_i2c_bus_lockup",
          keywords: ["i2c", "pullup", "pull-up", "4.7k", "sda", "scl", "hang", "lockup"]
        },
        {
          id: "opt_i2c_address_mismatch",
          label: "Pull-ups are present, but sensor returns 0xFF / NACK on initialization",
          description: "Slave address mismatch (e.g., 0x3C vs 0x3D on SSD1306 OLED displays).",
          nextNodeId: "diag_i2c_address_nack",
          keywords: ["address", "nack", "0x3c", "0x3d", "ssd1306", "scanner", "ack"]
        }
      ]
    },

    "diag_i2c_bus_lockup": {
      id: "diag_i2c_bus_lockup",
      ruleId: "RULE-I2C-01",
      type: "diagnosis",
      category: "i2c",
      confidenceFactor: 0.98,
      formalRuleStatement: "IF (I2C_PullUps == NONE) ∧ (Wire_Hang == TRUE) THEN HYPOTHESIS('I2C Open-Drain Bus Lockup & Missing 4.7kΩ Pull-Ups', CF=0.98)",
      antecedents: [
        "I2C SDA and SCL lines lack physical 4.7kΩ pull-up resistors to 3.3V rail",
        "Wire library execution blocks permanently waiting for SDA/SCL rise-time threshold"
      ],
      title: "I2C Open-Drain Bus Lockup & Missing 4.7kΩ Pull-Up Resistors",
      severity: "CRITICAL",
      symptomSummary: "ESP32 freezes permanently inside Wire.begin() or Wire.endTransmission() during OLED display or BME280 sensor read.",
      diagnosis: "Open-Drain Line Starvation Causing Hardware Bus Lockup.",
      rootCause: "I2C drivers operate with open-drain MOSFETs that only pull signals LOW. Without physical 4.7kΩ pull-up resistors to 3.3V, stray capacitance on jumper wires prevents lines from rising to logic HIGH. The hardware I2C state machine waits indefinitely for slave acknowledge (ACK).",
      engineeringSolution: {
        summary: "Add 4.7kΩ pull-up resistors on both SDA and SCL lines to 3.3V, and enable I2C bus timeout handling in firmware.",
        steps: [
          "Solder a 4.7kΩ (or 3.3kΩ) resistor between SDA (GPIO 21) and 3V3.",
          "Solder a 4.7kΩ resistor between SCL (GPIO 22) and 3V3.",
          "Call Wire.setTimeOut(3000) to ensure the driver aborts gracefully instead of hanging the entire FreeRTOS execution thread."
        ],
        codeSnippet: "#include <Wire.h>\n\nvoid setup() {\n  Serial.begin(115200);\n  Wire.begin(21, 22); // SDA=21, SCL=22\n  // Prevent synchronous freezing on missing I2C slave:\n  Wire.setTimeOut(3000); // 3-second timeout\n}"
      }
    },

    "diag_i2c_address_nack": {
      id: "diag_i2c_address_nack",
      ruleId: "RULE-I2C-02",
      type: "diagnosis",
      category: "i2c",
      confidenceFactor: 0.96,
      formalRuleStatement: "IF (Wire_ACK == NACK) ∧ (I2C_Address_Mismatch == TRUE) THEN HYPOTHESIS('I2C 7-Bit Slave Device Address Mismatch', CF=0.96)",
      antecedents: [
        "Slave sensor returns NACK (No Acknowledge) during address phase",
        "Common SSD1306/MPU6050 address jumper soldered to secondary address"
      ],
      title: "I2C 7-Bit Slave Device Address Mismatch",
      severity: "WARNING",
      symptomSummary: "Display or sensor library fails initialization check; sensor.begin() returns false.",
      diagnosis: "Incorrect 7-Bit I2C Slave Address Assigned in Code.",
      rootCause: "Many I2C breakout modules (e.g. SSD1306 OLED displays, MPU6050 gyros) have hardware address configuration pins (ADDR/AD0). If ADDR is pulled HIGH, the device address shifts (e.g. from 0x3C to 0x3D or 0x68 to 0x69).",
      engineeringSolution: {
        summary: "Run an I2C Scanner sketch to detect the exact 7-bit hexadecimal address ACKed by your connected slave device.",
        steps: [
          "Flash an I2C scanner sketch to output detected addresses in hex on the Serial Monitor.",
          "Update your display/sensor initialization call with the detected address (e.g. display.begin(SSD1306_SWITCHCAPVCC, 0x3C)).",
          "Verify ground connection between ESP32 and sensor module."
        ],
        codeSnippet: "// Basic I2C Scanner snippet:\n#include <Wire.h>\nvoid setup() {\n  Wire.begin(21, 22);\n  Serial.begin(115200);\n  for (byte i = 8; i < 120; i++) {\n    Wire.beginTransmission(i);\n    if (Wire.endTransmission() == 0) {\n      Serial.printf(\"Found I2C device at 0x%02X\\n\", i);\n    }\n  }\n}"
      }
    },

    // ==========================================
    // FAULT TREE 7: SPI BUS & CS CONTENTION
    // ==========================================
    "q_spi_symptom": {
      id: "q_spi_symptom",
      ruleId: "RULE-SPI-Q01",
      type: "question",
      category: "spi",
      title: "SPI Bus Peripheral Failure Mode",
      question: "Is an SPI SD card or TFT display failing to initialize or corrupting data on a shared SPI bus?",
      description: "SPI requires strict Chip Select (CS) line multiplexing and clean clock signal edges.",
      options: [
        {
          id: "opt_spi_clock_too_fast",
          label: "SPI SD card fails on breadboard with long jumper wires when clock frequency is >20 MHz",
          description: "Clock signal edge degradation and capacitive ringing on breadboard wires.",
          nextNodeId: "diag_spi_cs_contention",
          keywords: ["spi", "sd", "card", "clock", "frequency", "20mhz", "breadboard", "speed"]
        }
      ]
    },

    "diag_spi_cs_contention": {
      id: "diag_spi_cs_contention",
      ruleId: "RULE-SPI-01",
      type: "diagnosis",
      category: "spi",
      confidenceFactor: 0.95,
      formalRuleStatement: "IF (SPI_Clock > 20MHz) ∧ (WireLength > 10cm) THEN HYPOTHESIS('SPI High Frequency Signal Slew & CS Contention', CF=0.95)",
      antecedents: [
        "SPI bus clock frequency set to default 40MHz or 80MHz over breadboard jumper wires",
        "Trace capacitance and inductance causes MISO/MOSI bit framing corruption"
      ],
      title: "SPI High Frequency Slew Degradation & CS Contention",
      severity: "WARNING",
      symptomSummary: "SD.begin() returns false or SPI TFT display prints scrambled noise on breadboard.",
      diagnosis: "Excessive SPI Clock Frequency for Breadboard Capacitance.",
      rootCause: "High SPI clock frequencies (40MHz–80MHz) have rise times under 2 nanoseconds. Breadboard jumper wire capacitance (5–10pF per connection) rounds off clock edges, corrupting SPI data transmission.",
      engineeringSolution: {
        summary: "Lower SPI clock speed to 10MHz–14MHz and add 10kΩ pull-up resistors on CS lines.",
        steps: [
          "Lower SPI clock frequency in firmware: SD.begin(CS_PIN, SPI, 10000000) (10MHz).",
          "Add 10kΩ pull-up resistors on all Chip Select (CS) lines to 3.3V to prevent floating select states during boot.",
          "Keep SPI jumper wires shorter than 10cm."
        ],
        codeSnippet: "#include <SPI.h>\n#include <SD.h>\n\nconst int SD_CS = 5;\nvoid setup() {\n  Serial.begin(115200);\n  // Initialize SD card at conservative 10MHz clock speed:\n  if (!SD.begin(SD_CS, SPI, 10000000)) {\n    Serial.println(\"SD Card Mount Failed! Check wire lengths.\");\n  }\n}"
      }
    },

    // ==========================================
    // FAULT TREE 8: ADC2 & WI-FI PIN CONFLICT
    // ==========================================
    "q_adc_wifi_conflict": {
      id: "q_adc_wifi_conflict",
      ruleId: "RULE-ADC-Q01",
      type: "question",
      category: "adc",
      title: "ADC Analog Input Pin Assignment",
      question: "Which specific GPIO pins are configured for analogRead() while Wi-Fi or ESP-NOW is active?",
      description: "ESP32 has two separate SAR ADCs: ADC1 (GPIO 32-39) and ADC2 (GPIO 0, 2, 4, 12, 13, 14, 15, 25, 26, 27).",
      options: [
        {
          id: "opt_adc2_pins",
          label: "Analog sensor is connected to ADC2 pins (GPIO 0, 2, 4, 12, 13, 14, 15, 25, 26, 27)",
          description: "ADC2 hardware SAR is shared with the internal Wi-Fi radio driver.",
          nextNodeId: "diag_adc2_wifi_conflict",
          keywords: ["adc2", "gpio 2", "gpio 4", "gpio 12", "gpio 13", "gpio 14", "gpio 15", "gpio 25", "gpio 26", "gpio 27", "analogread"]
        }
      ]
    },

    "diag_adc2_wifi_conflict": {
      id: "diag_adc2_wifi_conflict",
      ruleId: "RULE-ADC-01",
      type: "diagnosis",
      category: "adc",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (ADC_Pin ∈ ADC2_GROUP) ∧ (WiFi_State == ACTIVE) THEN HYPOTHESIS('Hardware ADC2 Wi-Fi Radio Transceiver Conflict', CF=0.99)",
      antecedents: [
        "Analog input configured on GPIO 0, 2, 4, 12-15, 25-27 (ADC2)",
        "Wi-Fi driver is active (WiFi.begin or esp_now_init)",
        "Wi-Fi driver locks ADC2 hardware controller for RF calibration, causing analogRead() to fail"
      ],
      title: "Hardware ADC2 & Wi-Fi Radio Driver Pin Conflict",
      severity: "CRITICAL",
      symptomSummary: "analogRead() works initially, but returns 0, 4095, or freezes as soon as WiFi.begin() or esp_now_init() is called.",
      diagnosis: "ADC2 Hardware Controller Locked by Wi-Fi Radio Driver.",
      rootCause: "In the ESP32 silicon design, the ADC2 SAR controller is internally multiplexed with the Wi-Fi radio driver for RF power amplifier calibration. Whenever Wi-Fi is active, the Wi-Fi driver claims exclusive ownership of ADC2, causing any user analogRead() calls on ADC2 pins to fail completely.",
      engineeringSolution: {
        summary: "Move all analog sensor inputs to ADC1 pins (GPIO 32, 33, 34, 35, 36/VP, 39/VN).",
        steps: [
          "Move analog sensor wiring to ADC1 pins: GPIO 32, 33, 34, 35, 36 (VP), or 39 (VN).",
          "ADC1 operates completely independently of the Wi-Fi radio subsystem.",
          "Note: GPIO 34, 35, 36, 39 are input-only and have no internal pull-ups, which is ideal for analog sensors."
        ],
        codeSnippet: "// CORRECT: Use ADC1 pins when Wi-Fi is active\nconst int SENSOR_PIN = 34; // GPIO 34 is on ADC1 (Wi-Fi safe!)\n\nvoid setup() {\n  Serial.begin(115200);\n  WiFi.begin(\"SSID\", \"PASS\");\n}\nvoid loop() {\n  int val = analogRead(SENSOR_PIN); // Works 100% reliably with Wi-Fi on\n  Serial.printf(\"Sensor: %d\\n\", val);\n  delay(500);\n}"
      }
    },

    // ==========================================
    // FAULT TREE 9: STRAPPING PIN BOOT FAULTS
    // ==========================================
    "q_strapping_pins": {
      id: "q_strapping_pins",
      ruleId: "RULE-STRAP-Q01",
      type: "question",
      category: "strap",
      title: "Bootloader Strapping Pin Logic State",
      question: "Are external circuits, pull-ups, or sensor outputs connected to GPIO 0, GPIO 2, GPIO 12 (MTDI), or GPIO 15?",
      description: "Strapping pins sample their logic level during the first millisecond of chip reset to configure boot mode and flash voltage.",
      options: [
        {
          id: "opt_strap_gpio0_low",
          label: "External sensor or button pulls GPIO 0 LOW or GPIO 2 HIGH during chip power-on",
          description: "ESP32 enters UART serial flashing download mode instead of running SPI flash firmware.",
          nextNodeId: "diag_strapping_pin_failure",
          keywords: ["gpio0", "gpio2", "gpio12", "gpio15", "strapping", "download", "bootloader", "boot"]
        },
        {
          id: "opt_strap_gpio12_high",
          label: "External pull-up resistor or sensor on GPIO 12 (MTDI) pulls line HIGH at boot",
          description: "Forces internal LDO to supply 1.8V to 3.3V flash memory, causing instant flash read crash.",
          nextNodeId: "diag_flash_voltage_mismatch",
          keywords: ["gpio12", "mtdi", "1.8v", "3.3v", "flash", "voltage", "pullup"]
        }
      ]
    },

    "diag_strapping_pin_failure": {
      id: "diag_strapping_pin_failure",
      ruleId: "RULE-STRAP-01",
      type: "diagnosis",
      category: "strap",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (GPIO0_Level_At_Reset == LOW) THEN HYPOTHESIS('Bootloader UART Download Mode Trap via Strapping Pin', CF=0.99)",
      antecedents: [
        "GPIO 0 pulled LOW during reset button release or power-on ramp",
        "Hardware state machine enters ROM serial bootloader ('waiting for download') instead of executing user sketch from SPI Flash"
      ],
      title: "Bootloader Download Mode Trap via Strapping Pin (GPIO 0 / 2)",
      severity: "CRITICAL",
      symptomSummary: "ESP32 prints 'rst:0x1 (POWERON_RESET),boot:0x3 (DOWNLOAD_BOOT)' on 115200 baud and hangs; sketch never runs.",
      diagnosis: "Hardware Strapping Pin Pulled into ROM Bootloader Download Mode.",
      rootCause: "ESP32 samples GPIO 0, 2, 12, and 15 during the rising edge of the EN/Reset pin. If an external circuit holds GPIO 0 LOW during reset, the chip enters ROM bootloader mode for firmware flashing instead of executing user firmware from SPI flash.",
      engineeringSolution: {
        summary: "Move external switches and sensor outputs off GPIO 0 and GPIO 2 to non-strapping pins (e.g. GPIO 16, 17, 18, 19).",
        steps: [
          "Disconnect external sensors or buttons from GPIO 0 and GPIO 2.",
          "Ensure GPIO 0 has a 10kΩ pull-up resistor to 3.3V so it defaults HIGH at reset.",
          "Use safe general-purpose pins like GPIO 16, 17, 18, 19, 21, 22, 23 for user buttons and sensors."
        ]
      }
    },

    "diag_flash_voltage_mismatch": {
      id: "diag_flash_voltage_mismatch",
      ruleId: "RULE-FLASH-01",
      type: "diagnosis",
      category: "strap",
      confidenceFactor: 0.99,
      formalRuleStatement: "IF (GPIO12_Level_At_Reset == HIGH) THEN HYPOTHESIS('SPI Flash Voltage 1.8V/3.3V LDO Mismatch via MTDI Strapping', CF=0.99)",
      antecedents: [
        "GPIO 12 (MTDI) pulled HIGH during chip reset",
        "Internal VDD_SDIO LDO regulator switches to 1.8V output instead of standard 3.3V",
        "3.3V SPI Flash chip starves of operating voltage, causing instant crash"
      ],
      title: "SPI Flash Voltage 1.8V/3.3V LDO Mismatch (GPIO 12 MTDI)",
      severity: "CRITICAL",
      symptomSummary: "ESP32 prints 'flash read err, 1000' or crashes in continuous reboot loop after attaching a pull-up resistor to GPIO 12.",
      diagnosis: "MTDI (GPIO 12) Strapping Pin Selected 1.8V Flash Mode.",
      rootCause: "GPIO 12 (MTDI) controls the internal VDD_SDIO LDO regulator voltage for the SPI Flash memory. Standard ESP32-WROOM modules use 3.3V flash (requiring GPIO 12 to be LOW at boot). If an external circuit pulls GPIO 12 HIGH, the LDO outputs only 1.8V, starving the flash chip and causing continuous boot crashes.",
      engineeringSolution: {
        summary: "Never add external pull-up resistors to GPIO 12, or burn the flash voltage efuse to permanently lock 3.3V.",
        steps: [
          "Remove any external pull-up resistor from GPIO 12.",
          "Ensure GPIO 12 is left floating or pulled LOW at boot time.",
          "Permanent software fix: Burn the efuse using espefuse.py set_flash_voltage 3.3V to permanently ignore MTDI strapping."
        ]
      }
    },

    // ==========================================
    // FAULT TREE 10: UNIVERSAL CUSTOM FALLBACK
    // ==========================================
    "custom_step_2": {
      id: "custom_step_2",
      ruleId: "RULE-CUSTOM-Q01",
      type: "question",
      category: "custom",
      title: "Custom Issue Persistence & Repeatability",
      question: "Is this custom issue occurring consistently on every boot, or is it intermittent?",
      description: "Determine whether the symptom is tied to deterministic boot code initialization or transient environmental factors.",
      options: [
        {
          id: "opt_custom_consistent",
          label: "Consistently on every boot",
          description: "Issue recurs predictably every time power is applied or microcontroller resets.",
          nextNodeId: "custom_step_3",
          keywords: ["consistent", "consistently", "boot", "every", "always", "predictable"]
        },
        {
          id: "opt_custom_intermittent",
          label: "Intermittently / randomly",
          description: "Issue occurs sporadically after variable runtime or environmental changes.",
          nextNodeId: "custom_step_3",
          keywords: ["intermittent", "intermittently", "random", "randomly", "sporadic", "sometimes"]
        }
      ]
    },

    "custom_step_3": {
      id: "custom_step_3",
      ruleId: "RULE-CUSTOM-Q02",
      type: "question",
      category: "custom",
      title: "Hardware Peripheral Isolation Test",
      question: "Have you isolated the ESP32 from all external peripherals and sensors to verify the core board isn't damaged?",
      description: "Disconnecting all external sensors, displays, and relays helps distinguish internal microcontroller damage from external load faults.",
      options: [
        {
          id: "opt_custom_isolated_yes",
          label: "Yes, isolated core module tested in isolation",
          description: "All external GPIO connections, sensors, and actuators were removed.",
          nextNodeId: "custom_diag_final",
          keywords: ["isolated", "yes", "bare", "standalone", "disconnected"]
        },
        {
          id: "opt_custom_isolated_no",
          label: "No, peripherals and wiring are still attached",
          description: "External circuits remain connected to ESP32 GPIO pins.",
          nextNodeId: "custom_diag_final",
          keywords: ["no", "attached", "connected", "peripherals", "wiring"]
        }
      ]
    },

    "custom_diag_final": {
      id: "custom_diag_final",
      ruleId: "RULE-CUSTOM-FINAL",
      type: "diagnosis",
      category: "custom",
      confidenceFactor: 0.88,
      formalRuleStatement: "IF (Unmapped_Symptom_Set == TRUE) ∧ (Heuristic_Synthesis == ACTIVE) THEN HYPOTHESIS('Unmapped Hardware Failure Mode / Peripheral Overload', CF=0.88)",
      antecedents: [
        "Reported symptoms failed to match pre-programmed production rules",
        "Technician observation tags logged in working memory",
        "Deep heuristic domain analysis synthesized"
      ],
      title: "Custom Symptom Diagnostics & Hardware Isolation Analysis",
      severity: "WARNING",
      symptomSummary: "Custom user-reported hardware symptom captured during diagnostic traversal.",
      diagnosis: "User-Defined Custom Symptom & Peripheral Isolation Assessment",
      rootCause: "The reported issue does not match standard pre-programmed decision tree paths. Analysis of recorded technician logs indicates potential peripheral loading, signal bus contention, or unmapped firmware state.",
      engineeringSolution: {
        summary: "Perform methodical hardware isolation, review recorded technician logs, and run bare core isolation sketch.",
        steps: [
          "Disconnect all external sensors, displays, and relay modules from ESP32 GPIO pins.",
          "Reflash a minimal 'Blink' or basic serial output sketch to test core MCU sanity.",
          "Measure VDD 3.3V power rail using an oscilloscope under load to verify voltage stability.",
          "Review recorded custom technician logs with Senior Systems Engineer."
        ],
        circuitDiagramNote: "Verify 3.3V power decoupling (100uF electrolytic + 0.1uF ceramic) near VDD header pins.",
        codeSnippet: "// Core Isolation Test Firmware\n#include <Arduino.h>\nvoid setup() {\n  Serial.begin(115200);\n  Serial.println(\"--- ESP32 Core Isolation Sanity Test ---\");\n}\nvoid loop() {\n  Serial.printf(\"Free Heap: %d bytes | Uptime: %lu ms\\n\", ESP.getFreeHeap(), millis());\n  delay(1000);\n}"
      }
    }
  }
};
