/**
 * Localized Network & IoT Troubleshooter Knowledge Base
 * Rule-based decision tree object for ESP32 & ESP-NOW localized hardware & network failures.
 * 
 * Fault Trees Covered:
 * 1. Brownout Resets (RF Transmit Power & Voltage Drops)
 * 2. ESP-NOW MAC Pairing & Peer Registration
 * 3. Wi-Fi Connection Timeouts (Band Steering, Watchdog & Non-blocking code)
 * 4. GPIO Voltage Mismatches (3.3V LVCMOS vs 5V TTL destruction)
 * 5. Antenna / 2.4GHz Spectrum Noise & Packet Loss
 */

export const KNOWLEDGE_BASE_CATEGORIES = {
  BROWNOUT: { id: "brownout", name: "Power Supply & Brownout Resets", icon: "Zap" },
  ESPNOW: { id: "espnow", name: "ESP-NOW MAC Pairing & Peer Sync", icon: "Share2" },
  WIFI: { id: "wifi", name: "Wi-Fi Connection & Stack Timeouts", icon: "Wifi" },
  GPIO: { id: "gpio", name: "GPIO Voltage & Logic Interfacing", icon: "Cpu" },
  ANTENNA: { id: "antenna", name: "Antenna, RSSI & 2.4GHz Noise", icon: "Radio" }
};

export const knowledgeBase = {
  initialQuestionId: "root_category_select",
  nodes: {
    // ==========================================
    // ROOT CATEGORY SELECTOR
    // ==========================================
    "root_category_select": {
      id: "root_category_select",
      type: "question",
      category: "root",
      title: "Primary Symptom Selection",
      question: "What specific failure mode or symptom is your ESP32 / IoT node exhibiting?",
      description: "Select the primary issue observed on your hardware or serial monitor logs.",
      options: [
        {
          id: "opt_brownout",
          label: "Spontaneous Reboots / 'Brownout detector was triggered'",
          description: "Device reboots unexpectedly during boot, Wi-Fi initialization, or packet transmit.",
          nextNodeId: "q_brownout_timing"
        },
        {
          id: "opt_espnow",
          label: "ESP-NOW Communication Failure / Delivery Error",
          description: "ESP-NOW packets fail to send, return ESP_ERR_ESPNOW_NOT_INIT, or peer fails to respond.",
          nextNodeId: "q_espnow_error_type"
        },
        {
          id: "opt_wifi",
          label: "Wi-Fi Connection Timeout / Router Hangs",
          description: "ESP32 fails to connect to router, hangs in WiFi.begin loop, or triggers Task Watchdog Timer (WDT).",
          nextNodeId: "q_wifi_symptom"
        },
        {
          id: "opt_gpio",
          label: "GPIO Pin Failure / Sensor Reading Anomaly",
          description: "Digital inputs read incorrect values, GPIO hot to touch, or board unresponsive after interfacing 5V sensor/relay.",
          nextNodeId: "q_gpio_voltage_level"
        },
        {
          id: "opt_antenna",
          label: "High Packet Loss / Low RSSI / Signal Degradation",
          description: "Poor RF range, frequent packet drop, RSSI below -85dBm, or range drops sharply indoors.",
          nextNodeId: "q_antenna_type"
        }
      ]
    },

    // ==========================================
    // FAULT TREE 1: BROWNOUT RESETS
    // ==========================================
    "q_brownout_timing": {
      id: "q_brownout_timing",
      type: "question",
      category: "brownout",
      title: "Brownout Reset Timing",
      question: "When exactly does the ESP32 reset or print the brownout error on the Serial Monitor?",
      description: "Observing the exact moment of brownout helps pinpoint transient current vs steady-state regulator saturation.",
      options: [
        {
          id: "opt_bo_wifi_init",
          label: "Immediately when WiFi.begin() or esp_now_init() is called",
          description: "Reset coincides precisely with RF power amplifier turn-on.",
          nextNodeId: "q_brownout_power_source"
        },
        {
          id: "opt_bo_continuous",
          label: "Continuous boot loop before main setup() completes",
          description: "Board resets repeatedly even before Wi-Fi code is executed.",
          nextNodeId: "q_brownout_regulator_heat"
        }
      ]
    },

    "q_brownout_power_source": {
      id: "q_brownout_power_source",
      type: "question",
      category: "brownout",
      title: "Power Source & Decoupling",
      question: "How is the ESP32 powered, and is there external decoupling capacitance on the 3.3V rail?",
      description: "ESP32 RF transmission causes 350mA - 500mA current spikes lasting tens of microseconds.",
      options: [
        {
          id: "opt_bo_usb_thin",
          label: "Powered via PC USB port or thin long USB cable with NO extra capacitors",
          description: "Standard USB cable without bulk storage near the 3.3V header.",
          nextNodeId: "diag_brownout_transient_spike"
        },
        {
          id: "opt_bo_high_tx_power",
          label: "Powered via 5V Vin pin with max TX power setting (+20dBm)",
          description: "Linear LDO regulator (e.g. AMS1117-3.3) feeding ESP32 under maximum RF output.",
          nextNodeId: "diag_brownout_ldo_saturation"
        }
      ]
    },

    "q_brownout_regulator_heat": {
      id: "q_brownout_regulator_heat",
      type: "question",
      category: "brownout",
      title: "Regulator Thermal & Input Voltage Check",
      question: "Is the onboard 3.3V LDO regulator hot to touch, or is Vin powered by >9V DC?",
      description: "High input voltage across linear regulators creates extreme thermal dissipation (P = (Vin - 3.3) * I).",
      options: [
        {
          id: "opt_bo_hot_reg",
          label: "Regulator is extremely hot, Vin is connected to 9V or 12V supply",
          description: "Excessive thermal dropout causing thermal shutdown on AMS1117.",
          nextNodeId: "diag_brownout_thermal_shutdown"
        },
        {
          id: "opt_bo_under_voltage",
          label: "Regulator is cool, but VDD 3.3V rail measures below 3.0V under multimeter test",
          description: "Input supply cannot source required base current.",
          nextNodeId: "diag_brownout_insufficient_source"
        }
      ]
    },

    "diag_brownout_transient_spike": {
      id: "diag_brownout_transient_spike",
      type: "diagnosis",
      category: "brownout",
      title: "Transient RF Inrush Current & Cable Impedance Dip",
      severity: "CRITICAL",
      symptomSummary: "ESP32 resets with 'Brownout detector was triggered' when RF synthesizer and power amplifier (PA) calibrate during Wi-Fi or ESP-NOW startup.",
      diagnosis: "Transient VDD Voltage Dip caused by high USB cable resistance and lack of bulk decoupling capacitors.",
      rootCause: "When the ESP32 Wi-Fi radio activates, current consumption instantly surges from ~40mA to >400mA within microseconds. Thin USB conductors or high-ESR linear regulators experience an IR voltage drop, pulling the VDD 3.3V rail below the internal RTC brownout threshold (~2.43V - 2.8V).",
      engineeringSolution: {
        summary: "Install bulk low-ESR capacitance at the ESP32 power pins and upgrade the power delivery path.",
        steps: [
          "Solder a 100µF to 470µF low-ESR electrolytic or tantalum capacitor directly across the ESP32 3V3 and GND header pins.",
          "Add a 0.1µF ceramic capacitor in parallel with the bulk capacitor to filter high-frequency switching noise.",
          "Replace long/thin USB charging cables with a short 22AWG high-current rated USB cable.",
          "Ensure power supply can deliver at least 500mA continuous (1A peak) at 5V."
        ],
        circuitDiagramNote: "Connect 470uF Electrolytic (+) to ESP32 3V3 pin and (-) to GND pin, positioned within 10mm of module pins.",
        codeSnippet: "// Optional software workaround: reduce Wi-Fi TX power if power source cannot be upgraded immediately\n#include <esp_wifi.h>\n\nvoid setup() {\n  WiFi.mode(WIFI_STA);\n  WiFi.begin(ssid, password);\n  // Lower maximum RF TX power from +20dBm (80) to +13dBm (52) to reduce current spikes\n  esp_wifi_set_max_tx_power(52);\n}"
      }
    },

    "diag_brownout_ldo_saturation": {
      id: "diag_brownout_ldo_saturation",
      type: "diagnosis",
      category: "brownout",
      title: "LDO Voltage Dropout & High TX Power Draw",
      severity: "WARNING",
      symptomSummary: "ESP32 resets intermittently during heavy packet transmit bursts while powered via Vin.",
      diagnosis: "AMS1117 / LDO Dropout Saturation under peak RF transmission (+20dBm output power).",
      rootCause: "The onboard AMS1117 LDO regulator has a high dropout voltage (~1.1V to 1.3V at 800mA). If Vin drops below 4.5V under load, the 3.3V output rail collapses during max transmit power bursts.",
      engineeringSolution: {
        summary: "Supply minimum 5.0V to Vin or lower RF transmit power in software.",
        steps: [
          "Verify Vin voltage with an oscilloscope or fast multimeter during packet transmission to ensure Vin does not dip below 4.75V.",
          "If using a battery supply, replace AMS1117 linear regulator with a high-efficiency 5V buck/boost converter (e.g. MP2307 or TPS63020).",
          "Lower max TX power setting in firmware using esp_wifi_set_max_tx_power()."
        ],
        codeSnippet: "// Adjusting WiFi TX Power in ESP-IDF / Arduino ESP32\n#include <esp_wifi.h>\n// Set TX power to +15dBm (60 = 15dBm * 4)\nesp_wifi_set_max_tx_power(60);"
      }
    },

    "diag_brownout_thermal_shutdown": {
      id: "diag_brownout_thermal_shutdown",
      type: "diagnosis",
      category: "brownout",
      title: "LDO Thermal Over-temperature Protection Shutdown",
      severity: "CRITICAL",
      symptomSummary: "ESP32 reboots continuously after 1-2 minutes of operation; onboard regulator is extremely hot.",
      diagnosis: "Linear Regulator Thermal Shutdown due to excessive Vin to VDD voltage differential.",
      rootCause: "Powering Vin with 9V or 12V forces the AMS1117 LDO to drop 5.7V to 8.7V as heat: P = (12V - 3.3V) * 0.2A = 1.74 Watts. The SOT-223 package thermal resistance causes junction temperature to exceed 125°C, triggering internal thermal shutdown.",
      engineeringSolution: {
        summary: "Step down input voltage using a DC-DC Buck Converter before feeding Vin/ESP32.",
        steps: [
          "Do NOT connect 9V or 12V directly to Vin pin of ESP32 dev boards.",
          "Place an external DC-DC Buck Converter (e.g. LM2596 or mini MP1584EN) between 12V supply and ESP32 Vin pin, stepping voltage down to 5.0V.",
          "Ensure common ground connection between buck converter and ESP32."
        ],
        circuitDiagramNote: "[12V DC Supply] ---> [MP1584 Buck Converter IN] ==> [5.0V OUT] ---> [ESP32 Vin Pin] & [GND] ---> [ESP32 GND]"
      }
    },

    "diag_brownout_insufficient_source": {
      id: "diag_brownout_insufficient_source",
      type: "diagnosis",
      category: "brownout",
      title: "Insufficient DC Current Capacity at Power Source",
      severity: "CRITICAL",
      symptomSummary: "Multimeter reads 3.3V rail dropping below 3.0V under load; board resets repeatedly.",
      diagnosis: "Power supply or battery internal resistance is too high to support ESP32 peak currents.",
      rootCause: "Using weak power sources such as standard 9V alkaline transistor batteries (high internal resistance), unpowered USB hubs, or 100mA rated power adapters.",
      engineeringSolution: {
        summary: "Switch to a dedicated 5V 2A regulated power supply or high-drain LiFePO4 / Li-ion 18650 cell with BMS.",
        steps: [
          "Replace 9V alkaline batteries or weak USB ports with a dedicated 5V 2.0A AC-to-DC wall adapter.",
          "If battery powered, use 18650 Li-ion batteries paired with a high-current TP4056 + protection circuit and a low-dropout regulator (e.g., HT7333 / AP2112K)."
        ]
      }
    },

    // ==========================================
    // FAULT TREE 2: ESP-NOW MAC PAIRING
    // ==========================================
    "q_espnow_error_type": {
      id: "q_espnow_error_type",
      type: "question",
      category: "espnow",
      title: "ESP-NOW API Return Code & Behavior",
      question: "What error code or transmission behavior is observed when calling esp_now_send() or esp_now_add_peer()?",
      description: "ESP-NOW uses raw 802.11 Action frames. Proper peer state and channel binding are required.",
      options: [
        {
          id: "opt_en_fail_callback",
          label: "esp_now_send() returns ESP_OK, but Send Callback status is ESP_NOW_SEND_FAIL",
          description: "Frame is transmitted over the air, but receiver fails to acknowledge (ACK) receipt.",
          nextNodeId: "q_espnow_channel_sync"
        },
        {
          id: "opt_en_init_fail",
          label: "esp_now_init() returns ESP_ERR_ESPNOW_NOT_INIT or ESP_ERR_ESPNOW_ARG",
          description: "Initialization API fails immediately upon boot.",
          nextNodeId: "q_espnow_wifi_mode"
        },
        {
          id: "opt_en_exist",
          label: "esp_now_add_peer() returns ESP_ERR_ESPNOW_EXIST or peer count exceeds limit",
          description: "Adding peer fails due to duplicate MAC or exceeding peer table capacity.",
          nextNodeId: "diag_espnow_peer_table_overflow"
        }
      ]
    },

    "q_espnow_channel_sync": {
      id: "q_espnow_channel_sync",
      type: "question",
      category: "espnow",
      title: "Primary Wi-Fi Channel Synchronization",
      question: "Are both ESP-NOW transmitter and receiver operating on the EXACT same primary Wi-Fi channel?",
      description: "ESP-NOW cannot transmit cross-channel. Receiver on Ch 6 will never hear a packet sent on Ch 1.",
      options: [
        {
          id: "opt_en_chan_diff",
          label: "Transmitter and receiver channels are not explicitly fixed, or one node is connected to Wi-Fi router",
          description: "Connecting to a Wi-Fi router forces channel to match router's dynamic channel.",
          nextNodeId: "diag_espnow_channel_mismatch"
        },
        {
          id: "opt_en_mac_diff",
          label: "Channels are identical, but target MAC address was obtained via WiFi.macAddress() while operating in AP mode",
          description: "Station MAC and SoftAP MAC on ESP32 differ by 1 byte in LSB.",
          nextNodeId: "diag_espnow_mac_interface_mismatch"
        }
      ]
    },

    "q_espnow_wifi_mode": {
      id: "q_espnow_wifi_mode",
      type: "question",
      category: "espnow",
      title: "Wi-Fi Mode & Stack State",
      question: "Is WiFi.mode(WIFI_STA) or WiFi.mode(WIFI_AP) initialized BEFORE calling esp_now_init()?",
      description: "The ESP32 Wi-Fi stack driver must be started before registering ESP-NOW callbacks.",
      options: [
        {
          id: "opt_en_no_wifi_mode",
          label: "esp_now_init() called without setting WiFi.mode() first",
          description: "Wi-Fi subsystem RF hardware is uninitialized.",
          nextNodeId: "diag_espnow_uninitialized_stack"
        },
        {
          id: "opt_en_encryption_mismatch",
          label: "Encryption key (LMK/PMK) mismatch or peer registered without setting encrypt=false",
          description: "Peer struct encryption parameters mismatched between nodes.",
          nextNodeId: "diag_espnow_encryption_mismatch"
        }
      ]
    },

    "diag_espnow_channel_mismatch": {
      id: "diag_espnow_channel_mismatch",
      type: "diagnosis",
      category: "espnow",
      title: "Wi-Fi Primary Channel Asynchrony",
      severity: "CRITICAL",
      symptomSummary: "esp_now_send() returns status ESP_NOW_SEND_FAIL in the send callback despite peer MAC being added.",
      diagnosis: "Transmitter and Receiver Wi-Fi Channel Mismatch.",
      rootCause: "ESP-NOW action frames are transmitted on the primary channel of the sender's radio. If Node A is on Channel 1 and Node B is on Channel 6 (or dynamically changed by connecting to a Wi-Fi router), Node B's receiver hardware is tuned to another frequency and misses all raw frames.",
      engineeringSolution: {
        summary: "Explicitly set matching Wi-Fi channel on both nodes prior to ESP-NOW operation.",
        steps: [
          "Call WiFi.mode(WIFI_STA) and esp_wifi_set_channel(CHANNEL, WIFI_SECOND_CHAN_NONE) on both nodes.",
          "If one node must connect to a Wi-Fi router, set the router's 2.4GHz channel to a fixed channel (e.g. Ch 6) and force the ESP-NOW peer to Ch 6."
        ],
        codeSnippet: "#include <esp_now.h>\n#include <WiFi.h>\n#include <esp_wifi.h>\n\n#define PRIMARY_CHANNEL 6\n\nvoid setup() {\n  WiFi.mode(WIFI_STA);\n  // Force primary Wi-Fi channel\n  esp_wifi_set_channel(PRIMARY_CHANNEL, WIFI_SECOND_CHAN_NONE);\n  \n  if (esp_now_init() != ESP_OK) {\n    Serial.println(\"Error initializing ESP-NOW\");\n    return;\n  }\n}"
      }
    },

    "diag_espnow_mac_interface_mismatch": {
      id: "diag_espnow_mac_interface_mismatch",
      type: "diagnosis",
      category: "espnow",
      title: "Station vs SoftAP MAC Address Discrepancy",
      severity: "WARNING",
      symptomSummary: "ESP-NOW delivery fails reliably; peer MAC address double-checked but packet rejected.",
      diagnosis: "Hardcoded Station MAC address used while Receiver Node operates on SoftAP interface.",
      rootCause: "The ESP32 has separate MAC addresses for Station (STA) and SoftAP (AP) interfaces (typically STA MAC + 1 at the last octet). If receiver is configured in WIFI_AP mode, packets addressed to its STA MAC are dropped by MAC layer filtering.",
      engineeringSolution: {
        summary: "Ensure destination MAC corresponds to the active interface mode of receiver.",
        steps: [
          "Print receiver's MAC using WiFi.macAddress() for STA mode or WiFi.softAPmacAddress() for AP mode.",
          "Use the exact 6-byte array matching receiver's active mode in peer.peer_addr."
        ],
        codeSnippet: "// Print both MAC addresses on Receiver to verify target MAC:\nSerial.print(\"STA MAC: \"); Serial.println(WiFi.macAddress());\nSerial.print(\"AP MAC:  \"); Serial.println(WiFi.softAPmacAddress());"
      }
    },

    "diag_espnow_peer_table_overflow": {
      id: "diag_espnow_peer_table_overflow",
      type: "diagnosis",
      category: "espnow",
      title: "ESP-NOW Peer Table Memory Capacity Exceeded",
      severity: "WARNING",
      symptomSummary: "esp_now_add_peer() fails with ESP_ERR_ESPNOW_EXIST or ESP_ERR_ESPNOW_FULL.",
      diagnosis: "Maximum Peer Count Limit Exceeded (20 unencrypted / 6 encrypted peers max).",
      rootCause: "The ESP-NOW driver maintains an internal peer table allocated in RAM. ESP32 supports a maximum of 20 total registered peers in unencrypted mode or 6 in encrypted mode.",
      engineeringSolution: {
        summary: "Use Broadcast address (FF:FF:FF:FF:FF:FF) or dynamically manage peer registration.",
        steps: [
          "For one-to-many sensor broadcasting, register a single broadcast peer MAC {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF}.",
          "If communicating with >20 nodes, dynamically remove idle peers using esp_now_del_peer(mac) before adding a new peer."
        ],
        codeSnippet: "// Broadcast peer setup snippet:\nesp_now_peer_info_t peerInfo = {};\nmemset(peerInfo.peer_addr, 0xFF, 6); // Broadcast MAC\npeerInfo.channel = 0; // Current channel\npeerInfo.encrypt = false;\n\nif (!esp_now_is_peer_exist(peerInfo.peer_addr)) {\n  esp_now_add_peer(&peerInfo);\n}"
      }
    },

    "diag_espnow_uninitialized_stack": {
      id: "diag_espnow_uninitialized_stack",
      type: "diagnosis",
      category: "espnow",
      title: "Wi-Fi Driver Subsystem Uninitialized",
      severity: "CRITICAL",
      symptomSummary: "esp_now_init() returns ESP_ERR_ESPNOW_NOT_INIT.",
      diagnosis: "ESP32 Wi-Fi stack driver not started before ESP-NOW invocation.",
      rootCause: "Calling esp_now_init() requires the underlying low-level Wi-Fi driver to be active and allocated in RAM.",
      engineeringSolution: {
        summary: "Set Wi-Fi mode explicitly prior to initializing ESP-NOW.",
        steps: [
          "Call WiFi.mode(WIFI_STA) or WiFi.mode(WIFI_AP_STA) before calling esp_now_init().",
          "Verify esp_now_init() return code equals ESP_OK before registering send/receive callbacks."
        ]
      }
    },

    "diag_espnow_encryption_mismatch": {
      id: "diag_espnow_encryption_mismatch",
      type: "diagnosis",
      category: "espnow",
      title: "Local Master Key (LMK) / Primary Master Key (PMK) Mismatch",
      severity: "WARNING",
      symptomSummary: "Packets delivered encrypted but receiver callback never triggers.",
      diagnosis: "ESP-NOW Peer Encryption Key Configuration Mismatch.",
      rootCause: "When encrypt = true is set in esp_now_peer_info_t, both nodes must have identical PMK (Primary Master Key) and LMK (Local Master Key) set via esp_now_set_pmk() and peerInfo.lmk.",
      engineeringSolution: {
        summary: "Set matching 16-byte LMK and PMK keys or set encrypt = false for plain transmission.",
        steps: [
          "Ensure peerInfo.encrypt = false if encryption is not required.",
          "If encryption is required, configure matching 16-byte PMK using esp_now_set_pmk((uint8_t*)\"PMK1234567890123\") on both devices."
        ]
      }
    },

    // ==========================================
    // FAULT TREE 3: WI-FI CONNECTION TIMEOUTS
    // ==========================================
    "q_wifi_symptom": {
      id: "q_wifi_symptom",
      type: "question",
      category: "wifi",
      title: "Wi-Fi Connection Hang Symptom",
      question: "What occurs when the ESP32 attempts to connect to your Wi-Fi access point?",
      description: "Differentiating between authentication rejects, blocking code loops, and router channel issues.",
      options: [
        {
          id: "opt_wf_wdt_reset",
          label: "Serial monitor shows 'Task watchdog got triggered' or 'TG1WDT_SYS_RESET'",
          description: "Device reboots while executing while(WiFi.status() != WL_CONNECTED).",
          nextNodeId: "diag_wifi_blocking_loop_wdt"
        },
        {
          id: "opt_wf_dual_band",
          label: "Connection times out endlessly; router uses unified single SSID for 2.4GHz & 5GHz",
          description: "Dual-band mesh routers attempting band steering.",
          nextNodeId: "diag_wifi_5ghz_band_steering"
        },
        {
          id: "opt_wf_dhcp_fail",
          label: "WiFi.status() remains WL_DISCONNECTED or WL_NO_SSID_AVAIL despite correct credentials",
          description: "DHCP server lease exhaustion or dynamic channel switching (DFS).",
          nextNodeId: "q_wifi_security_type"
        }
      ]
    },

    "q_wifi_security_type": {
      id: "q_wifi_security_type",
      type: "question",
      category: "wifi",
      title: "Access Point Security & IP Configuration",
      question: "What security protocol does the Wi-Fi router use, and is DHCP enabled?",
      description: "ESP32 non-H2/C6 variants do NOT support 5GHz or WPA3 Enterprise / PMF required mode.",
      options: [
        {
          id: "opt_wf_wpa3",
          label: "Router is set to WPA3-Only mode or Enterprise (802.1X)",
          description: "Legacy ESP32 base chip supports WPA2-Personal (AES/TKIP).",
          nextNodeId: "diag_wifi_wpa3_incompatibility"
        },
        {
          id: "opt_wf_static_ip",
          label: "Standard WPA2-PSK router, but DHCP takes over 15 seconds to respond",
          description: "DHCP DISCOVER timeout or IP address pool exhaustion.",
          nextNodeId: "diag_wifi_dhcp_timeout_static_ip"
        }
      ]
    },

    "diag_wifi_blocking_loop_wdt": {
      id: "diag_wifi_blocking_loop_wdt",
      type: "diagnosis",
      category: "wifi",
      title: "Synchronous Blocking Loop Starving FreeRTOS Task Watchdog",
      severity: "CRITICAL",
      symptomSummary: "ESP32 crashes and prints 'Task watchdog got triggered' (TWDT) during Wi-Fi connection loop.",
      diagnosis: "FreeRTOS IDLE Task Starvation in Synchronous while() Connection Loop.",
      rootCause: "Writing while(WiFi.status() != WL_CONNECTED) {} without a delay() or yield() traps Core 1 in a tight loop. This prevents the FreeRTOS IDLE task from running and feeding the Task Watchdog Timer (TWDT), triggering a watchdog reset after 5 seconds.",
      engineeringSolution: {
        summary: "Add non-blocking delay/yield or implement asynchronous Wi-Fi event handling.",
        steps: [
          "Add delay(100) or vTaskDelay(pdMS_TO_TICKS(100)) inside connection polling loops to yield CPU control.",
          "Implement async connection events using WiFi.onEvent() for robust production firmware."
        ],
        codeSnippet: "// Correct non-blocking Wi-Fi connection loop:\nint timeout = 0;\nWiFi.begin(ssid, password);\nwhile (WiFi.status() != WL_CONNECTED && timeout < 30) {\n  delay(500); // YIELDS CPU to prevent Task Watchdog reset\n  Serial.print(\".\");\n  timeout++;\n}\nif (WiFi.status() != WL_CONNECTED) {\n  Serial.println(\"\\nConnection failed! Proceeding to fallback...\");\n}"
      }
    },

    "diag_wifi_5ghz_band_steering": {
      id: "diag_wifi_5ghz_band_steering",
      type: "diagnosis",
      category: "wifi",
      title: "5GHz Band Steering Rejection by Dual-Band Routers",
      severity: "WARNING",
      symptomSummary: "ESP32 fails to connect to home Wi-Fi network; phone and laptop connect without issue.",
      diagnosis: "Incompatibility with 5GHz Wi-Fi / Router Band Steering.",
      rootCause: "Standard ESP32 (ESP32-D0WD, ESP32-S3, ESP32-C3) contain only a 2.4GHz IEEE 802.11b/g/n physical layer (PHY). Modern dual-band routers with 'Smart Connect' / Band Steering attempt to negotiate 5GHz connections, rejecting ESP32 2.4GHz auth frames.",
      engineeringSolution: {
        summary: "Separate 2.4GHz SSID or create a dedicated 2.4GHz IoT Guest Network.",
        steps: [
          "Log into router settings and disable 'Smart Connect' / Band Steering.",
          "Create a dedicated 2.4GHz SSID (e.g. 'MyNetwork_2.4G') with WPA2-PSK (AES) security.",
          "Ensure router 2.4GHz channel width is set to 20MHz (not 40MHz)."
        ]
      }
    },

    "diag_wifi_wpa3_incompatibility": {
      id: "diag_wifi_wpa3_incompatibility",
      type: "diagnosis",
      category: "wifi",
      title: "WPA3 SAE / PMF (Protected Management Frames) Mode Incompatibility",
      severity: "CRITICAL",
      symptomSummary: "ESP32 fails authentication immediately; return status WL_CONNECT_FAILED.",
      diagnosis: "WPA3 Security Mode / PMF Mandatory Rejection.",
      rootCause: "Original ESP32 SDK firmware does not support WPA3-SAE mandatory mode. Routers set strictly to WPA3-Personal reject ESP32 association requests during 4-way handshake.",
      engineeringSolution: {
        summary: "Reconfigure router security mode to WPA2/WPA3 Mixed Mode (WPA2-PSK Fallback).",
        steps: [
          "Change Wi-Fi AP security setting from 'WPA3-Only' to 'WPA2/WPA3 Personal Mixed'.",
          "Set Protected Management Frames (PMF) setting to 'Optional' / 'Capable' rather than 'Required'."
        ]
      }
    },

    "diag_wifi_dhcp_timeout_static_ip": {
      id: "diag_wifi_dhcp_timeout_static_ip",
      type: "diagnosis",
      category: "wifi",
      title: "DHCP IP Lease Timeout & Network Pool Exhaustion",
      severity: "WARNING",
      symptomSummary: "ESP32 connects to AP (AUTH SUCCESS), but hangs indefinitely waiting for IP address.",
      diagnosis: "DHCP DISCOVER Response Timeout.",
      rootCause: "Router DHCP server fails to assign IP lease within 15 seconds due to IP pool exhaustion or aggressive router sleep/multicast filtering.",
      engineeringSolution: {
        summary: "Assign static IP configuration on ESP32 outside router DHCP range.",
        steps: [
          "Configure static IP using WiFi.config(local_IP, gateway, subnet, primaryDNS).",
          "Ensure assigned static IP is outside router's dynamic DHCP pool range to prevent IP collisions."
        ],
        codeSnippet: "IPAddress local_IP(192, 168, 1, 200);\nIPAddress gateway(192, 168, 1, 1);\nIPAddress subnet(255, 255, 255, 0);\nIPAddress primaryDNS(8, 8, 8, 8);\n\nvoid setup() {\n  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS)) {\n    Serial.println(\"STA Failed to configure Static IP\");\n  }\n  WiFi.begin(ssid, password);\n}"
      }
    },

    // ==========================================
    // FAULT TREE 4: GPIO VOLTAGE MISMATCHES
    // ==========================================
    "q_gpio_voltage_level": {
      id: "q_gpio_voltage_level",
      type: "question",
      category: "gpio",
      title: "GPIO Interfacing & External Sensor Power Rail",
      question: "What signal voltage is being fed directly into the ESP32 GPIO input pin?",
      description: "ESP32 GPIO pins use 3.3V LVCMOS logic and are NOT 5V tolerant.",
      options: [
        {
          id: "opt_gpio_5v_direct",
          label: "5V signal directly connected from 5V sensor (e.g. HC-SR04, 5V Arduino, 5V Relay)",
          description: "Signal line exceeds VDD + 0.3V (3.6V max absolute limit).",
          nextNodeId: "q_gpio_physical_symptom"
        },
        {
          id: "opt_gpio_inductive_relay",
          label: "Relay coil connected directly to GPIO pin without transistor or flyback diode",
          description: "Driving inductive loads directly from micro-controller pin.",
          nextNodeId: "diag_gpio_inductive_kickback"
        },
        {
          id: "opt_gpio_floating",
          label: "Button switch or sensor output reads random fluctuating values (0 and 1)",
          description: "Input pin left in high-impedance floating state.",
          nextNodeId: "diag_gpio_floating_input"
        }
      ]
    },

    "q_gpio_physical_symptom": {
      id: "q_gpio_physical_symptom",
      type: "question",
      category: "gpio",
      title: "Physical State & Multimeter Diagnostics",
      question: "What is the physical condition of the ESP32 chip or the specific GPIO pin?",
      description: "Over-voltage induces gate-oxide breakdown or internal ESD substrate diode shorting.",
      options: [
        {
          id: "opt_gpio_hot_shorted",
          label: "ESP32 main chip is hot to touch, or pin measures shorted (0 ohms) to GND",
          description: "Internal ESD clamping diode latched up and melted internal silicon bond wire.",
          nextNodeId: "diag_gpio_hardware_destruction"
        },
        {
          id: "opt_gpio_no_read",
          label: "ESP32 works normally, but pin always reads 1 (HIGH) or fails digitalRead()",
          description: "Internal input buffer gate damaged due to 5V overvoltage exposure.",
          nextNodeId: "diag_gpio_level_shifter_required"
        }
      ]
    },

    "diag_gpio_hardware_destruction": {
      id: "diag_gpio_hardware_destruction",
      type: "diagnosis",
      category: "gpio",
      title: "GPIO Overvoltage Substrate Latch-up & Permanent Chip Destruction",
      severity: "CRITICAL",
      symptomSummary: "ESP32 main IC becomes scorching hot; board fails to boot or draw excess 300mA idle current.",
      diagnosis: "Permanent Silicon Gate-Oxide Breakdown & Substrate Diode Latch-Up.",
      rootCause: "Connecting a 5V signal (e.g. 5V UART, 5V HC-SR04 Echo) directly into an ESP32 GPIO pin forces current through the internal ESD protection diode to VDD. When current exceeds diode ratings, it triggers a parasitic SCR latch-up between VDD and GND, short-circuiting the internal power rail and burning silicon substrate.",
      engineeringSolution: {
        summary: "Replace fried ESP32 board and install hardware level shifting on all 5V inputs.",
        steps: [
          "Discard damaged ESP32 module (internal short-circuit cannot be repaired).",
          "Install a Bidirectional Logic Level Converter (e.g. BSS138 N-channel MOSFET shifter) on all 5V signal lines.",
          "Alternatively, use a resistor voltage divider ($R_1 = 1.8k\\Omega, R_2 = 3.3k\\Omega$) to drop $5\\text{V} \\rightarrow 3.23\\text{V}$."
        ],
        circuitDiagramNote: "Resistor Voltage Divider Formula: Vout = Vin * (R2 / (R1 + R2))\nConnect 5V Signal ---> [R1: 1.8k] ---> [GPIO Node] ---> [R2: 3.3k] ---> GND",
        codeSnippet: "// Example calculation for 5V to 3.3V resistor divider:\n// R1 = 2000 ohms (2k)\n// R2 = 3300 ohms (3.3k)\n// Vout = 5.0V * (3300 / (2000 + 3300)) = 3.11V (Safe LVCMOS HIGH for ESP32)"
      }
    },

    "diag_gpio_level_shifter_required": {
      id: "diag_gpio_level_shifter_required",
      type: "diagnosis",
      category: "gpio",
      title: "5V TTL Logic Level Incompatibility",
      severity: "WARNING",
      symptomSummary: "ESP32 pin reads corrupted data or stuck HIGH when reading 5V sensors.",
      diagnosis: "LVCMOS 3.3V Input Buffer Over-Stress & Invalid High Logic Level Threshold.",
      rootCause: "ESP32 I/O pins operate at 3.3V logic. Feeding 5V into input pins stresses the internal CMOS gates and risks premature hardware failure.",
      engineeringSolution: {
        summary: "Use high-speed Optocoupler or MOSFET Logic Shifter module.",
        steps: [
          "Use a 4-channel BSS138-based logic level shifter board (TXS0108E / TXB0104).",
          "Connect High Voltage side (HV) to 5V rail, Low Voltage side (LV) to ESP32 3.3V rail."
        ]
      }
    },

    "diag_gpio_inductive_kickback": {
      id: "diag_gpio_inductive_kickback",
      type: "diagnosis",
      category: "gpio",
      title: "Inductive Voltage Flyback Spike from Relay Coil",
      severity: "CRITICAL",
      symptomSummary: "ESP32 resets or freezes immediately whenever relay turns OFF.",
      diagnosis: "Inductive Back-EMF Voltage Kickback Spike.",
      rootCause: "When current through an inductive relay coil is abruptly switched OFF by a GPIO, the collapsing magnetic field generates a reverse voltage spike (Back-EMF: $V = -L \\frac{di}{dt}$) exceeding tens or hundreds of volts, spiking the ground plane and resetting the ESP32 core.",
      engineeringSolution: {
        summary: "Drive relays using Transistors/MOSFETs with a Flyback Anti-Parallel Diode.",
        steps: [
          "Never power or drive relay coils directly from ESP32 GPIO pins (max safe GPIO current is 12mA).",
          "Use an optocoupler-isolated relay module powered by an external 5V power supply with JD-VCC jumper removed.",
          "Place a flyback diode (e.g. 1N4007 or 1N4148) across relay coil terminals (cathode to +5V, anode to transistor collector)."
        ],
        circuitDiagramNote: "ESP32 GPIO ---> [1k resistor] ---> [Base of 2N2222 NPN Transistor]\nCollector ---> [Relay Coil (-)] & [Anode of 1N4007 Diode]\nEmitter ---> GND\n[Relay Coil (+)] & [Cathode of 1N4007 Diode] ---> External 5V Power"
      }
    },

    "diag_gpio_floating_input": {
      id: "diag_gpio_floating_input",
      type: "diagnosis",
      category: "gpio",
      title: "High-Impedance Floating Input Noise Sensitivity",
      severity: "INFO",
      symptomSummary: "Digital pin reads random toggle states (0 and 1) when no button is pressed or sensor is idle.",
      diagnosis: "Floating High-Impedance GPIO Input.",
      rootCause: "When configured as a standard INPUT, ESP32 GPIO pins have extremely high impedance (>100MΩ) and act as miniature antennas picking up ambient electromagnetic 50/60Hz noise.",
      engineeringSolution: {
        summary: "Enable internal pull-up / pull-down resistors or add external 10kΩ resistor.",
        steps: [
          "In software, configure pinMode(pin, INPUT_PULLUP) or pinMode(pin, INPUT_PULLDOWN).",
          "If using long external wires, place a physical 10kΩ pull-up resistor between the GPIO pin and 3.3V."
        ],
        codeSnippet: "void setup() {\n  // Enable internal 45k-ohm pull-up resistor to pull pin HIGH when unpressed\n  pinMode(BUTTON_PIN, INPUT_PULLUP);\n}"
      }
    },

    // ==========================================
    // FAULT TREE 5: ANTENNA / 2.4GHz NOISE
    // ==========================================
    "q_antenna_type": {
      id: "q_antenna_type",
      type: "question",
      category: "antenna",
      title: "Antenna Hardware Configuration",
      question: "Which type of antenna is installed on your ESP32 module?",
      description: "Determining RF path selection, impedance matching, and physical enclosure effects.",
      options: [
        {
          id: "opt_ant_ipex_whip",
          label: "External Whip/Omni Antenna connected via IPEX / u.FL connector",
          description: "ESP32-WROOM-32U or board with u.FL connector.",
          nextNodeId: "q_antenna_resistor_selector"
        },
        {
          id: "opt_ant_pcb_trace",
          label: "Onboard On-PCB Meandering Inverted-F (MIFA) Trace Antenna",
          description: "Standard ESP32-WROOM-32 module with printed antenna.",
          nextNodeId: "q_antenna_enclosure_metal"
        }
      ]
    },

    "q_antenna_resistor_selector": {
      id: "q_antenna_resistor_selector",
      type: "question",
      category: "antenna",
      title: "u.FL / IPEX Zero-Ohm SMD Jumper Position",
      question: "On dev boards with both PCB trace & u.FL connector, has the 0-ohm selector resistor been moved to the u.FL position?",
      description: "Many ESP32 dev boards route RF signals to the PCB antenna by default using a 0402 0-ohm jumper.",
      options: [
        {
          id: "opt_ant_jumper_wrong",
          label: "External antenna plugged in, but 0-ohm SMD resistor is still soldered toward the PCB trace antenna",
          description: "RF signal is disconnected from u.FL connector.",
          nextNodeId: "diag_antenna_jumper_mismatch"
        },
        {
          id: "opt_ant_jumper_ok",
          label: "Resistor is placed correctly or board has u.FL only, but RSSI is still below -85dBm",
          description: "Co-channel interference or physical barrier issue.",
          nextNodeId: "q_antenna_enclosure_metal"
        }
      ]
    },

    "q_antenna_enclosure_metal": {
      id: "q_antenna_enclosure_metal",
      type: "question",
      category: "antenna",
      title: "Physical Environment & Enclosure Shielding",
      question: "Is the ESP32 installed inside a metal / aluminum box, or near large ground planes / copper traces?",
      description: "Metals create a Faraday cage, attenuating RF electromagnetic wave propagation.",
      options: [
        {
          id: "opt_ant_metal_box",
          label: "Mounted inside a metal electrical junction box, metal chassis, or metal foil shield",
          description: "Faraday cage shielding RF signals.",
          nextNodeId: "diag_antenna_faraday_attenuation"
        },
        {
          id: "opt_ant_noise_24ghz",
          label: "Enclosure is plastic, but packet drops surge near microwave ovens, USB 3.0 hubs, or Bluetooth beacons",
          description: "Severe 2.4GHz ISM spectrum noise and co-channel interference.",
          nextNodeId: "diag_antenna_24ghz_cochannel_noise"
        }
      ]
    },

    "diag_antenna_jumper_mismatch": {
      id: "diag_antenna_jumper_mismatch",
      type: "diagnosis",
      category: "antenna",
      title: "Zero-Ohm RF Path Jumper Selector Mismatch",
      severity: "CRITICAL",
      symptomSummary: "External antenna connected via u.FL yields zero range improvement or near 100% packet loss (RSSI < -90dBm).",
      diagnosis: "RF Signal Path Disconnected / Zero-Ohm Jumper Set to Internal PCB Antenna.",
      rootCause: "ESP32 modules with dual antenna options utilize a 0402-size zero-ohm SMD resistor as an RF multiplexer jumper. If left in the default position, the u.FL connector remains floating and un-driven, causing high Standing Wave Ratio (SWR) reflections.",
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
      type: "diagnosis",
      category: "antenna",
      title: "Faraday Shielding Attenuation by Metallic Enclosure",
      severity: "CRITICAL",
      symptomSummary: "ESP32 works on workbench, but loses connection immediately when cabinet door closes.",
      diagnosis: "RF Electromagnetic Attenuation / Faraday Cage Effect.",
      rootCause: "Conductive metal enclosures (aluminum, steel, carbon fiber) reflect and absorb 2.4GHz radio waves, attenuating signal strength by 30dB to 50dB (1000x - 100000x signal power reduction).",
      engineeringSolution: {
        summary: "Mount an external high-gain waterproof omni antenna outside the metal cabinet.",
        steps: [
          "Drill a hole in the metallic cabinet and install an IP67 SMA Female bulkhead connector.",
          "Connect an IPEX/u.FL to SMA pigtail cable from the ESP32 module to the SMA bulkhead.",
          "Attach a 2.4GHz 5dBi external rubber duck / omnidirectional antenna on the outside of the enclosure."
        ]
      }
    },

    "diag_antenna_24ghz_cochannel_noise": {
      id: "diag_antenna_24ghz_cochannel_noise",
      type: "diagnosis",
      category: "antenna",
      title: "2.4GHz ISM Band Co-Channel Spectrum Noise & Packet Loss",
      severity: "WARNING",
      symptomSummary: "Packet loss spikes periodically; RSSI fluctuates wildly despite fixed distance.",
      diagnosis: "2.4GHz ISM Band RF Noise & Co-Channel Interference.",
      rootCause: "Unshielded USB 3.0 cables/hubs generate wideband noise in the 2.4GHz spectrum (2.400 - 2.4835 GHz). Microwave ovens leakage and dense Bluetooth / Zigbee networks cause frame collisions at the MAC layer.",
      engineeringSolution: {
        summary: "Enable ESP32 Long Range (LR) Mode or switch Wi-Fi channels to 1, 6, or 11.",
        steps: [
          "Use a Wi-Fi analyzer app to scan 2.4GHz channel utilization and lock your ESP32 / ESP-NOW nodes to non-overlapping Channel 1, 6, or 11.",
          "Enable ESP32 Wi-Fi Long Range Mode (WIFI_PROTOCOL_LR) which uses 1/2 or 1/4 rate CCK modulation to boost sensitivity by up to +4dBm.",
          "Keep ESP32 antenna at least 1 meter away from USB 3.0 external hard drive cables and microwave ovens."
        ],
        codeSnippet: "// Enable ESP32 Wi-Fi Long Range Mode for enhanced noise immunity:\n#include <esp_wifi.h>\n\nvoid setup() {\n  WiFi.mode(WIFI_STA);\n  // Enable LR mode on STA interface\n  esp_wifi_set_protocol(WIFI_IF_STA, WIFI_PROTOCOL_11B | WIFI_PROTOCOL_11G | WIFI_PROTOCOL_11N | WIFI_PROTOCOL_LR);\n}"
      }
    }
  }
};
