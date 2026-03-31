# Wiring Guide & Pinout Tables

**Project:** AH@
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

## 1. Overview

All peripherals connect to the ESP32 DevKit v1.
Two SPI devices (MCP2515 and MicroSD) share the hardware SPI bus; they are distinguished by separate Chip Select (CS) pins.
The DS3231 RTC uses the I2C bus.
Power is supplied by the LM2596 from the vehicle's 12V rail.

---

## 2. SPI Bus — Shared Pins

| Signal | ESP32 Pin | GPIO | Used By |
|--------|-----------|------|---------|
| MOSI   | D23       | GPIO 23 | MCP2515 + MicroSD |
| MISO   | D19       | GPIO 19 | MCP2515 + MicroSD |
| SCK    | D18       | GPIO 18 | MCP2515 + MicroSD |

> Only one CS pin should be LOW at any time. The firmware ensures exclusive bus access per device.

---

## 3. ESP32 → MCP2515 (CAN Bus Module)

| MCP2515 Pin | ESP32 Pin | GPIO | Notes |
|-------------|-----------|------|-------|
| VCC         | 5V rail   | —    | Most MCP2515 modules accept 5V; check your module datasheet |
| GND         | GND       | —    | Common ground |
| CS          | D5        | GPIO 5 | Chip Select |
| SO (MISO)   | D19       | GPIO 19 | Shared SPI MISO |
| SI (MOSI)   | D23       | GPIO 23 | Shared SPI MOSI |
| SCK         | D18       | GPIO 18 | Shared SPI Clock |
| INT         | D4        | GPIO 4 | Interrupt — low when CAN frame is received |

---

## 4. ESP32 → MicroSD Card Module

| SD Module Pin | ESP32 Pin | GPIO | Notes |
|---------------|-----------|------|-------|
| VCC           | 5V rail   | —    | |
| GND           | GND       | —    | Common ground |
| CS            | D15       | GPIO 15 | Chip Select (unique, separate from MCP2515) |
| MOSI          | D23       | GPIO 23 | Shared SPI MOSI |
| CLK           | D18       | GPIO 18 | Shared SPI Clock |
| MISO          | D19       | GPIO 19 | Shared SPI MISO |

---

## 5. ESP32 → DS3231 RTC Module

| DS3231 Pin | ESP32 Pin | GPIO | Notes |
|------------|-----------|------|-------|
| VCC        | 3.3V      | —    | DS3231 runs on 3.3V; do NOT connect to 5V |
| GND        | GND       | —    | Common ground |
| SDA        | D21       | GPIO 21 | I2C Data (pull-up resistor included on most modules) |
| SCL        | D22       | GPIO 22 | I2C Clock |

> The DS3231 I2C address is `0x68` by default.

---

## 6. LM2596 Buck Converter → Power Rail

| LM2596 Terminal | Connects To | Notes |
|-----------------|-------------|-------|
| VIN+            | Vehicle 12V+ (after ignition fuse) | Protected with 2A blade fuse |
| VIN-            | Vehicle chassis GND | |
| VOUT+           | ESP32 VIN (5V pin) | Adjust trimmer pot to exactly 5.0V ± 0.1V before connecting |
| VOUT-           | GND (common) | |

---

## 7. MCP2515 → OBD-II Connector

| MCP2515 Terminal | OBD-II Pin | Signal Name | Notes |
|------------------|------------|-------------|-------|
| CANH             | Pin 6      | CAN High    | Add 120Ω termination resistor if ESP32 unit is the last node on the bus |
| CANL             | Pin 14     | CAN Low     | |
| GND              | Pin 4 or 5 | Signal Ground / Chassis Ground | |

> **OBD-II Pin Reference:**
> - Pin 4: Chassis Ground
> - Pin 5: Signal Ground
> - Pin 6: CAN Bus High (ISO 15765-4)
> - Pin 14: CAN Bus Low (ISO 15765-4)
> - Pin 16: Battery Positive (12V) — use for LM2596 input

---

## 8. Complete Power Diagram

```
OBD-II Pin 16 (12V) ──── [2A FUSE] ──── LM2596 VIN+
OBD-II Pin 4/5 (GND) ─────────────────── LM2596 VIN-

LM2596 VOUT+ (5.0V) ──── ESP32 VIN
LM2596 VOUT-  (GND) ──── ESP32 GND ──── MCP2515 GND ──── SD GND
                                    └─── DS3231 GND (3.3V reg on ESP32 → DS3231 VCC)
```

---

## 9. Safety Checklist

- [ ] LM2596 output measured at 5.0V ± 0.1V before connecting ESP32
- [ ] All GND connections share a common ground point
- [ ] 2A fuse installed between vehicle 12V and LM2596 input
- [ ] MCP2515 CS (GPIO 5) and SD CS (GPIO 15) confirmed as separate pins
- [ ] DS3231 powered from 3.3V (not 5V)
- [ ] CAN bus termination resistor decision made (120Ω only at bus endpoints)
