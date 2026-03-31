# Data Flow

**Project:** AH@
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

## Phase 1 — In-Vehicle Data Collection (Offline)

```
Vehicle CAN Bus
    │
    │  OBD-II PIDs (km, DTCs, RPM, coolant temp)
    ▼
MCP2515 CAN Controller (SPI → ESP32 GPIO 5 CS)
    │
    │  Raw CAN frame bytes
    ▼
ESP32 CAN Parser
    │
    │  Decoded struct: { km, dtcs[], rpm, coolant_temp }
    ▼
DS3231 RTC (I2C → ESP32 GPIO 21/22)
    │
    │  ISO 8601 UTC timestamp
    ▼
JSON Record Builder
    │
    │  { vehicle_id, timestamp, km, dtcs, engine_rpm, coolant_temp_c, test_active }
    ▼
SD Card Module (SPI → ESP32 GPIO 15 CS)
    │
    │  Append to /logs/YYYY-MM-DD.json (atomic write)
    ▼
MicroSD Card (FAT32 filesystem)
```

---

## Phase 2 — End-of-Day Transmission (Garage)

```
Garage Wi-Fi Network detected
    │
    ▼
ESP32 Wi-Fi Manager
    │  Connect → DHCP → IP assigned
    ▼
SD Card Reader
    │  Load /logs/YYYY-MM-DD.json (JSON array)
    ▼
HTTP Client (ESP32)
    │  POST /api/v1/telemetry/bulk
    │  Headers: X-Device-Api-Key, Content-Type: application/json
    │  Body: { device_id, firmware_version, transmitted_at, records: [...] }
    ▼
Backend REST API
    │
    ├── HTTP 200 OK ──▶ ESP32 deletes SD log file
    └── HTTP 4xx/5xx ──▶ ESP32 keeps file, retries with exponential backoff
```

---

## Phase 3 — Backend Processing

```
POST /api/v1/telemetry/bulk received
    │
    ▼
RBAC Middleware → validate X-Device-Api-Key
    │
    ▼
Telemetry Handler
    │
    ▼
Telemetry Service
    │
    ├── Validate payload against JSON Schema
    ├── Upsert vehicle last_km and last_sync_at
    ├── Insert records into telemetry_logs
    ├── Parse DTCs → insert/update dtc_events
    └── Evaluate notification rules:
         │
         ├── DTC detected?
         │     └── NotificationService.Send(type=DTC_DETECTED, users=[MANAGER, EMPLOYEE])
         │
         ├── KM crosses threshold?
         │     ├── NotificationService.Send(type=KM_THRESHOLD, users=[MANAGER])
         │     └── CalendarService.CreateEvent(type=MAINTENANCE, vehicle, date)
         │
         └── Test result logged?
               └── NotificationService.Send(type=TEST_RESULT, users=[MANAGER])
    │
    ▼
Return HTTP 200 { success: true, data: { records_ingested: N } }
```

---

## Phase 4 — Client Data Flow

```
Backend API
    │
    ├── Web Panel (React)
    │     │  polling or WebSocket for live updates
    │     ├── GET /api/v1/vehicles     → VehicleStore (Zustand)
    │     ├── GET /api/v1/tasks        → TaskStore
    │     └── GET /api/v1/maintenance  → displayed in calendar
    │
    └── Mobile App (React Native)
          │  FCM push notification delivered
          ├── Notification received → NotificationsScreen update
          ├── GET /api/v1/vehicles/:id → HomeScreen vehicle card
          └── Calendar events synced via native OS calendar integration
```
