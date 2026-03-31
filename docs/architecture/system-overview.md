# System Overview

**Project:** AH@ — Offline-First IoT Vehicle Telemetry & Control System
**Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

---

## Purpose

AH@ solves a common problem in fleet management: vehicles operate in the field all day, often with no reliable network connection, yet maintenance decisions and fault monitoring must happen in near-real-time. Traditional telematics systems require continuous connectivity, which is either impractical or cost-prohibitive for many operators.

AH@'s **Store and Forward** model decouples data collection from data transmission. The vehicle carries the data, and the network is only needed at the end of the day when the vehicle returns to base.

---

## System Layers

### Layer 1 — Hardware (ESP32 Firmware)

The ESP32 is the edge node. It:
- Polls the vehicle's CAN Bus (via MCP2515) for fault codes, odometer readings, and engine telemetry.
- Timestamps every record using the DS3231 RTC (accurate to ±2 ppm, maintained by battery backup).
- Appends records to a JSON array on the MicroSD card.
- At end of day, connects to the garage Wi-Fi and bulk-POSTs the accumulated records to the backend.
- On HTTP 200, clears the SD log. On failure, retains data for the next attempt.

### Layer 2 — Backend (REST API + Services)

The backend is a stateless HTTP API with the following responsibilities:
- **Ingestion:** Accept and validate bulk JSON payloads from ESP32 devices.
- **Persistence:** Store telemetry, DTC events, and derived state in PostgreSQL.
- **Notifications:** Evaluate business rules (DTC severity, KM thresholds) and dispatch FCM push notifications.
- **Calendar sync:** Create and maintain maintenance events in Google Calendar and Apple Calendar.
- **RBAC:** Enforce access control for all operations (Manager, Employee, User roles).

### Layer 3 — Frontend

Two clients consume the backend API:
- **Web Panel (React):** For Managers. Full operational visibility: fleet overview, DTC history, task board, gas test approval, maintenance calendar.
- **Mobile App (React Native):** For Users and Employees. Push notifications, vehicle status, maintenance calendar, task updates.

---

## Data Ownership

| Data Type | Primary Store | Cache/Copy |
|-----------|--------------|-----------|
| Telemetry records | PostgreSQL `telemetry_logs` | MicroSD (until acknowledged) |
| DTC events | PostgreSQL `dtc_events` | — |
| Tasks | PostgreSQL `tasks` | Client-side store (Zustand) |
| Maintenance schedules | PostgreSQL `maintenance_schedules` | Google/Apple Calendar |
| Notifications | PostgreSQL `notifications` | FCM delivery |

---

## Key Architectural Decisions

| Decision | Chosen Approach | Rationale |
|----------|----------------|-----------|
| Edge data format | JSON array, ISO 8601 timestamps | Human-readable, standard, easily debuggable |
| SD write strategy | Atomic (temp → rename) | Prevents partial-write corruption on power loss |
| API auth | JWT (access + refresh) for humans, API key for devices | Devices don't support OAuth flows |
| Database | PostgreSQL | ACID compliance, JSONB for raw payload, strong indexing |
| Notification delivery | Firebase FCM | Reliable cross-platform push, free tier sufficient |
| Calendar sync | Google Calendar OAuth2 + Apple CalDAV | Both protocols are open standard; covers the two dominant ecosystems |
| UI design | Brutalist (zero gradient, border-radius: 0) | Opinionated, accessible, avoids "AI slop" aesthetics |
