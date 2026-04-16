# Data Flow

**Project:** AH@
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

## Phase 1 — In-Vehicle Data Collection (Offline)

```
Vehicle CAN Bus
    │
    │  OBD-II PIDs (km, DTCs, RPM, coolant temp, fuel trim, O2 sensor)
    ▼
MCP2515 CAN Controller (SPI → ESP32 GPIO 5 CS)
    │
    │  Raw CAN frame bytes
    ▼
ESP32 CAN Parser  (can_bus.cpp)
    │
    │  OBD2Snapshot: { rpm, coolantTempC, fuelTrim, o2Mv, speed }
    │  DTC list:     ["P0300", "P0171", ...]
    ▼
DS3231 RTC (I2C → ESP32 GPIO 21/22)
    │
    │  ISO 8601 UTC timestamp
    ▼
State Machine  (state_machine.cpp)
    │
    │  LOGGING state    → poll every DIAG_IDLE_POLL_INTERVAL_MS (5s)
    │  DIAGNOSTIC state → poll every DIAG_POLL_INTERVAL_MS (500ms)
    │                     sets diagnostic_active = true in record
    ▼
JSON Record Builder
    │
    │  {
    │    vehicle_id, timestamp, km,
    │    engine_rpm, coolant_temp_c,
    │    diagnostic_active,           ← true when mechanic session is running
    │    dtcs: ["P0300", ...]
    │  }
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
    ├── Insert records into telemetry_logs (diagnostic_active flag preserved)
    ├── Parse DTCs → insert/update dtc_events
    └── Evaluate notification rules:
         │
         ├── DTC detected?
         │     └── NotificationService.Send(type=DTC_DETECTED, users=[MANAGER, EMPLOYEE])
         │
         └── KM crosses threshold?
               ├── NotificationService.Send(type=KM_THRESHOLD, users=[MANAGER])
               └── CalendarService.CreateEvent(type=MAINTENANCE, vehicle, date)
```

---

## Phase 4 — Diagnostic Session Flow

```
Manager / Employee (Web or Mobile)
    │
    │  POST /api/v1/diagnostics
    │  { vehicle_id, mechanic_id, driver_complaint }
    ▼
Backend creates DiagnosticSession (status=PENDING)
    │
    ▼
Mechanic starts session in panel
    │  POST /api/v1/diagnostics/:id/start
    ▼
Backend sets status=ACTIVE
    │  (ESP32 will read diagnostic_active flag on next poll
    │   and switch to DIAGNOSTIC state → 500ms poll rate)
    │
    ▼
ESP32 in DIAGNOSTIC state
    │  Reads OBD-II snapshot + DTC list every 500ms
    │  Logs records with diagnostic_active=true to SD
    │  (transmitted to backend with next bulk upload)
    │
    ▼
Mechanic closes session in panel
    │  POST /api/v1/diagnostics/:id/close
    │  { findings: [{code, description, severity}], repair_cost_estimate, notes, create_repair_task }
    ▼
Backend sets status=COMPLETED
    │
    ├── If create_repair_task=true
    │     └── Auto-creates Task (priority based on highest finding severity)
    │           linked via linked_task_id
    │
    └── NotificationService.Send(type=DIAGNOSTIC_COMPLETED, users=[MANAGER])
```

---

## Phase 5 — Client Data Flow

```
Backend API
    │
    ├── Web Panel (React, Manager)
    │     │  polling for live updates
    │     ├── GET /api/v1/vehicles          → VehicleStore (Zustand)
    │     ├── GET /api/v1/tasks             → TaskStore
    │     ├── GET /api/v1/diagnostics       → diagnostic session list
    │     └── GET /api/v1/maintenance       → maintenance calendar
    │
    └── Mobile App (React Native, Employee/User)
          │  FCM push notification delivered
          ├── DIAGNOSTIC_STARTED  → employee alerted to assigned session
          ├── DIAGNOSTIC_COMPLETED → manager notified, repair task auto-assigned
          ├── DTC_DETECTED        → manager + employee notified immediately
          └── MAINTENANCE_DUE     → manager notified, calendar event created
```
