# Hardware Test Procedures

**Project:** AH@
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

## Test 1 — Power Circuit Validation

**Goal:** Confirm LM2596 provides stable 5.0V before connecting ESP32.

**Steps:**
1. Connect LM2596 input to a 12V DC supply (bench PSU or vehicle battery).
2. Do NOT connect any load to VOUT yet.
3. Measure VOUT+ with a multimeter.
4. Adjust the LM2596 trimmer potentiometer until VOUT+ reads 5.0V ± 0.05V.
5. Connect a 100mA dummy load and re-measure. Voltage should remain stable.

**Pass criteria:** VOUT+ = 4.95V – 5.05V under 100mA load.

---

## Test 2 — ESP32 Boot

**Goal:** Confirm ESP32 boots from regulated 5V supply.

**Steps:**
1. With LM2596 output confirmed at 5V, connect ESP32 VIN and GND.
2. Open serial monitor at 115200 baud.
3. Observe boot log — should see "ESP-IDF" or Arduino boot messages.

**Pass criteria:** No reset loops. Serial output visible within 3 seconds.

---

## Test 3 — DS3231 RTC Read

**Goal:** Confirm I2C communication with DS3231.

**Steps:**
1. Flash `test_rtc` firmware (see `hardware/test/test_rtc/`).
2. Open serial monitor.
3. Firmware reads current time from DS3231 and prints it.

**Pass criteria:** Time string in format `YYYY-MM-DDTHH:MM:SSZ` printed every second.

---

## Test 4 — MicroSD Card Write/Read

**Goal:** Confirm SPI communication with SD module and filesystem operations.

**Steps:**
1. Insert a formatted (FAT32) MicroSD card.
2. Flash `test_sd_write` firmware.
3. Firmware writes a JSON test record to `/logs/test.json`.
4. Power off, remove card, inspect file on a PC.

**Pass criteria:** `/logs/test.json` exists and contains valid JSON matching the `sd-log-record` schema.

---

## Test 5 — MCP2515 CAN Bus Loopback

**Goal:** Confirm SPI communication with MCP2515 in loopback mode (no vehicle required).

**Steps:**
1. Flash `test_can_parsing` firmware (loopback mode enabled in code).
2. Firmware sends a test CAN frame and reads it back via internal loopback.
3. Observe serial output confirming frame sent and received.

**Pass criteria:** "CAN loopback OK: Frame ID=0x7DF Data=0200010000000000" (or similar) printed.

---

## Test 6 — Full Day Cycle Simulation

**Goal:** End-to-end smoke test of Store and Forward workflow.

**Steps:**
1. Configure `config.h` with valid Wi-Fi SSID and backend URL.
2. Start backend locally (`make dev`).
3. Flash production firmware.
4. Power the device. Observe:
   a. Boot → RTC sync.
   b. CAN scan (with vehicle connected, or use loopback test mode).
   c. Record written to SD card (`/logs/YYYY-MM-DD.json`).
5. Connect device to the configured Wi-Fi network.
6. Observe:
   a. Wi-Fi connection in serial log.
   b. "Bulk POST to /api/v1/telemetry/bulk" message.
   c. "HTTP 200 — clearing SD log" message.
7. Verify record in backend database.

**Pass criteria:**
- SD log file created and populated with valid JSON records.
- Backend receives the bulk payload (HTTP 200 returned).
- SD log cleared after successful transmission.
- Telemetry records visible in backend database.

---

## Test 7 — Gas Test Trigger

**Goal:** Confirm 20-minute gas test sequence activates on Manager command.

**Steps:**
1. Via web panel or API (`POST /api/v1/tests/trigger`), approve a gas test for the test vehicle.
2. Backend writes a test-flag record to a command file on next sync (or via real-time flag).
3. Confirm ESP32 activates test mode and logs `"test_active": true` records.
4. After 20 minutes, confirm `"test_result"` field is populated.

**Pass criteria:** `test_active=true` records in SD log for 20-minute window; `test_result` set at end.
