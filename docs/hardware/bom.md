# Bill of Materials (BOM)

**Project:** AH@ — Offline-First IoT Vehicle Telemetry & Control System
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

| # | Component | Specification | Purpose | Approx. Unit Cost |
|---|-----------|--------------|---------|-------------------|
| 1 | **ESP32 DevKit v1** | Dual-core 240MHz, Wi-Fi 802.11 b/g/n, Bluetooth 4.2, 4MB Flash | Main microcontroller — runs firmware, manages all peripherals, handles Wi-Fi transmission | $5–8 |
| 2 | **MCP2515 CAN Bus Module** | SPI interface, 1 Mbps max speed, onboard TJA1050 transceiver | CAN Bus communication with vehicle OBD-II port | $3–5 |
| 3 | **LM2596 Step-Down Buck Converter** | IN: 4–40V, OUT: 1.23–37V adjustable, 3A max | Regulate vehicle 12V to 5V for ESP32 and peripherals | $1–3 |
| 4 | **MicroSD Card Module (SPI)** | 3.3V / 5V compatible, SPI interface, supports SDSC/SDHC | Offline telemetry data storage | $1–2 |
| 5 | **DS3231 RTC Module** | I2C interface, ±2 ppm accuracy, integrated TCXO, EEPROM | Accurate timestamping independent of network | $2–4 |
| 6 | **MicroSD Card** | ≥ 8GB capacity, Class 10 (UHS-I recommended) | Storage medium for SD module | $5–10 |
| 7 | **CR2032 Button Cell Battery** | 3V, 220mAh | DS3231 backup power for timekeeping when main power off | $0.50 |
| 8 | **OBD-II Male Connector + Cable** | 16-pin OBD-II J1962 male, with bare wire leads | Physical connection to vehicle diagnostic port | $5–10 |
| 9 | **2A Blade Fuse + Holder** | Automotive mini blade fuse | Protect LM2596 input from overcurrent | $0.50–1 |
| 10 | **Prototype PCB** | 7×9 cm double-sided, 2.54mm pitch | Mount all components permanently | $1–2 |
| 11 | **ABS Project Enclosure** | ~100×60×25mm, IP54 rated preferred | Protect circuit from moisture and vibration | $3–5 |
| 12 | **Jumper Wires / Dupont Cables** | Male-to-male and male-to-female, 10cm | Prototyping connections | $2–3 |
| 13 | **120Ω Resistor** | 1/4W, 5% tolerance | CAN Bus termination (if device is end-of-bus node) | $0.10 |
| 14 | **100µF / 16V Electrolytic Capacitor** | Radial, 2.5mm pitch | Input smoothing capacitor for LM2596 | $0.20 |

---

## Total Estimated BOM Cost

| Tier | Description | Approx. Cost |
|------|-------------|-------------|
| Prototype (1 unit) | All components from above | $30–55 USD |
| Small fleet (10 units) | Bulk pricing estimate | $200–350 USD |

---

## Notes

- The **MCP2515 module** typically includes the MCP2515 IC + TJA1050 transceiver on a single PCB. The `INT` pin must be connected to an ESP32 GPIO that supports interrupts (GPIO 4 recommended).
- The **DS3231** module includes a CR2032 battery holder on the PCB. Replace the battery annually.
- Verify the **LM2596** output voltage (5.0V ± 0.1V) with a multimeter before connecting to the ESP32.
- Use the **OBD-II male connector** for testing only. For permanent installation, a female port pass-through is recommended so the vehicle's diagnostic port remains accessible.
