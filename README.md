# AH@ — Offline-First IoT Vehicle Telemetry & Control System

> **Authors:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
> **License:** MIT
> **Status:** In Development

---

<!-- LANGUAGE NAVIGATION -->
> [🇬🇧 English](#english) · [🇹🇷 Türkçe](#turkish)

---

<a name="english"></a>

---

# 🇬🇧 ENGLISH DOCUMENTATION

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Hardware Layer](#3-hardware-layer)
   - [Bill of Materials](#31-bill-of-materials)
   - [Wiring & Pinout Table](#32-wiring--pinout-table)
   - [Power Circuit](#33-power-circuit)
4. [System Flow Diagram](#4-system-flow-diagram)
5. [Backend Layer](#5-backend-layer)
   - [API Endpoint Summary](#51-api-endpoint-summary)
   - [RBAC Role Matrix](#52-rbac-role-matrix)
6. [Frontend Layer](#6-frontend-layer)
7. [Design System](#7-design-system)
8. [Setup & Installation](#8-setup--installation)
   - [Prerequisites](#81-prerequisites)
   - [Hardware Setup](#82-hardware-setup)
   - [Backend Setup](#83-backend-setup)
   - [Web Panel Setup](#84-web-panel-setup)
   - [Mobile App Setup](#85-mobile-app-setup)
9. [Environment Variables](#9-environment-variables)
10. [Contributing](#10-contributing)
11. [License](#11-license)

---

## 1. Project Overview

**AH@** is an offline-first IoT vehicle telemetry and control platform built for fleet management environments such as garages, service centers, and logistics operations.

The system revolves around a **Store and Forward** architecture: an ESP32 microcontroller rides in the vehicle during the day, collecting CAN Bus data (fault codes, odometer readings, engine telemetry) and writing it to a local MicroSD card with RTC timestamps — completely offline. When the vehicle returns to the garage at the end of the day, the ESP32 connects to the garage Wi-Fi network and transmits the accumulated data in bulk to the backend REST API. Upon a successful acknowledgement, the SD card log is cleared and the cycle repeats.

The backend processes this data, stores it in a relational database, and dispatches push notifications (via FCM) and calendar events (via Google/Apple Calendar) to maintenance staff and managers. A web panel gives Managers full operational visibility, while a mobile app keeps Users informed in real time.

### Key Design Principles

- **Offline-First:** No data is lost if Wi-Fi is unavailable. The ESP32 buffers days of data on the SD card.
- **Brutalist UI:** Zero gradients. Zero rounded corners. Yellow (`#FFD700`) and Navy Blue (`#001F5B`) palette. Functional, readable, and opinionated.
- **RBAC:** Every API endpoint and UI action is gated by role — Manager, Employee, or User.
- **Open Standard Protocols:** CAN Bus (OBD-II PIDs), REST/JSON, OAuth2, CalDAV.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          VEHICLE (In-Field)                         │
│                                                                     │
│  ┌─────────────┐    SPI     ┌───────────┐    SPI    ┌───────────┐  │
│  │  MCP2515    │──────────▶│   ESP32   │──────────▶│  MicroSD  │  │
│  │  CAN Bus    │            │ (Main MCU)│            │  Module   │  │
│  └─────────────┘            └─────┬─────┘            └───────────┘  │
│         │                        │ I2C                               │
│   CAN H/L                   ┌────▼──────┐                           │
│   (OBD-II)                  │  DS3231   │                           │
│                             │    RTC    │                           │
│                             └───────────┘                           │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  LM2596 Buck Converter  │  12V Vehicle → 5V regulated       │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                          END OF DAY │ Wi-Fi bulk POST
                          (Garage)   │ JSON Array
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Cloud / On-Prem)                   │
│                                                                     │
│   REST API  ──▶  RBAC Middleware  ──▶  Business Logic Services      │
│       │                                      │                      │
│       ▼                                      ▼                      │
│   PostgreSQL DB                    ┌─────────────────┐             │
│                                    │  FCM (Firebase) │             │
│                                    │  Push Notif.    │             │
│                                    └────────┬────────┘             │
│                                             │                      │
│                              ┌──────────────┴──────────────┐       │
│                              │  Google Calendar / Apple    │       │
│                              │  Calendar (Maintenance Sync)│       │
│                              └─────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                          │                         │
                ┌─────────▼──────────┐   ┌──────────▼─────────┐
                │   WEB PANEL        │   │   MOBILE APP        │
                │   (Manager)        │   │   (User / Employee) │
                │                    │   │                     │
                │  - Fleet overview  │   │  - Notifications    │
                │  - Task board      │   │  - Vehicle status   │
                │  - DTC history     │   │  - Calendar events  │
                │  - Test approval   │   │  - Task updates     │
                └────────────────────┘   └─────────────────────┘
```

---

## 3. Hardware Layer

### 3.1 Bill of Materials

| # | Component | Purpose | Quantity |
|---|-----------|---------|----------|
| 1 | ESP32 DevKit v1 | Main microcontroller (Wi-Fi + SPI + I2C) | 1 |
| 2 | MCP2515 CAN Bus Module | Vehicle CAN Bus interface (OBD-II) | 1 |
| 3 | LM2596 Step-Down Buck Converter | Power regulation: 12V → 5V | 1 |
| 4 | MicroSD Card Module (SPI) | Offline data storage (Store & Forward) | 1 |
| 5 | DS3231 RTC Module | Accurate timestamps with battery backup | 1 |
| 6 | MicroSD Card (≥ 8GB, Class 10) | Storage medium | 1 |
| 7 | CR2032 Battery | DS3231 backup power | 1 |
| 8 | OBD-II Connector / Cable | Physical CAN Bus connection to vehicle | 1 |
| 9 | Prototype PCB / Enclosure | Mounting and protection | 1 |
| 10 | Jumper Wires / Connectors | Wiring | As needed |

---

### 3.2 Wiring & Pinout Table

#### ESP32 → MCP2515 (CAN Bus Module) — SPI Bus

| MCP2515 Pin | ESP32 Pin | GPIO | Notes |
|-------------|-----------|------|-------|
| VCC | 3.3V / 5V | — | Check module voltage; most accept 5V |
| GND | GND | — | Common ground |
| CS | D5 | GPIO 5 | Chip Select (SPI) |
| SO (MISO) | D19 | GPIO 19 | SPI MISO |
| SI (MOSI) | D23 | GPIO 23 | SPI MOSI |
| SCK | D18 | GPIO 18 | SPI Clock |
| INT | D4 | GPIO 4 | Interrupt pin (CAN message received) |

#### ESP32 → MicroSD Card Module — SPI Bus (shared bus, unique CS)

| SD Module Pin | ESP32 Pin | GPIO | Notes |
|---------------|-----------|------|-------|
| VCC | 5V | — | |
| GND | GND | — | Common ground |
| CS | D15 | GPIO 15 | Dedicated CS (different from MCP2515) |
| MOSI | D23 | GPIO 23 | Shared SPI MOSI |
| CLK | D18 | GPIO 18 | Shared SPI Clock |
| MISO | D19 | GPIO 19 | Shared SPI MISO |

#### ESP32 → DS3231 RTC Module — I2C Bus

| DS3231 Pin | ESP32 Pin | GPIO | Notes |
|------------|-----------|------|-------|
| VCC | 3.3V | — | |
| GND | GND | — | Common ground |
| SDA | D21 | GPIO 21 | I2C Data |
| SCL | D22 | GPIO 22 | I2C Clock |

#### LM2596 Buck Converter → ESP32 Power

| LM2596 Terminal | Connects To | Notes |
|-----------------|-------------|-------|
| VIN+ | Vehicle 12V+ | Fused with 2A fuse |
| VIN- | Vehicle GND | Common ground |
| VOUT+ | ESP32 VIN (5V pin) | Output adjusted to 5V |
| VOUT- | ESP32 GND | Common ground |

#### MCP2515 → Vehicle OBD-II / CAN Bus

| MCP2515 Terminal | OBD-II Pin | Notes |
|------------------|------------|-------|
| CANH | Pin 6 (CAN High) | 120Ω termination resistor if end-of-bus |
| CANL | Pin 14 (CAN Low) | |

---

### 3.3 Power Circuit

```
Vehicle Battery (12V)
        │
    [2A Fuse]
        │
    ┌───▼────────────────┐
    │  LM2596 Buck Conv. │  Output: 5V regulated
    │  IN+  OUT+         ├──────────────────▶ ESP32 VIN
    │  IN-   OUT-        ├──────────────────▶ GND (common)
    └────────────────────┘
```

> **Warning:** Always verify the LM2596 output voltage with a multimeter before connecting to the ESP32. Overvoltage will permanently damage the microcontroller.

---

## 4. System Flow Diagram

```
╔═══════════════════════════════════════════════════════════════════╗
║                    DAILY OPERATIONAL CYCLE                        ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  [BOOT]                                                           ║
║     │                                                             ║
║     ▼                                                             ║
║  [SYNC_TIME] ──▶ DS3231 RTC provides timestamp                    ║
║     │             (NTP sync performed once on first boot)         ║
║     ▼                                                             ║
║  [SCAN CAN BUS]                                                   ║
║     │  Read DTCs, KM, engine vitals from MCP2515                  ║
║     │  If gas test flag set: trigger 20-min test sequence         ║
║     ▼                                                             ║
║  [BUILD JSON RECORD]                                              ║
║     │  {                                                          ║
║     │    "vehicle_id": "...",                                     ║
║     │    "timestamp": "2025-10-15T08:32:00Z",                    ║
║     │    "km": 142350,                                           ║
║     │    "dtcs": ["P0300", "P0171"],                             ║
║     │    "engine_rpm": 820,                                      ║
║     │    "coolant_temp_c": 91,                                   ║
║     │    "test_active": false                                     ║
║     │  }                                                          ║
║     ▼                                                             ║
║  [APPEND TO SD CARD]                                              ║
║     │  File: /logs/YYYY-MM-DD.json  (JSON array)                  ║
║     │  Atomic write: temp file → rename                           ║
║     ▼                                                             ║
║  [REPEAT THROUGHOUT DAY]                                          ║
║     │  (Vehicle offline; no network required)                     ║
║     │                                                             ║
╠═══════════════════════════════════════════════════════════════════╣
║                    END OF DAY — GARAGE SYNC                       ║
╠═══════════════════════════════════════════════════════════════════╣
║     │                                                             ║
║     ▼                                                             ║
║  [GARAGE ARRIVAL DETECTED] ──▶ Wi-Fi SSID in range               ║
║     ▼                                                             ║
║  [WIFI_CONNECT]                                                   ║
║     │  Connect to garage SSID                                     ║
║     │  Obtain IP via DHCP                                         ║
║     ▼                                                             ║
║  [READ SD CARD] ──▶ Load all pending JSON log files               ║
║     ▼                                                             ║
║  [BULK POST]                                                      ║
║     │  POST /api/v1/telemetry/bulk                                ║
║     │  Content-Type: application/json                             ║
║     │  Body: [ {record1}, {record2}, ... {recordN} ]              ║
║     │                                                             ║
║     ├── HTTP 200 OK ──▶ [CLEAR SD LOG] ──▶ [IDLE / SLEEP]        ║
║     │                                                             ║
║     └── HTTP Error  ──▶ [RETRY x3 with backoff]                  ║
║                              │                                    ║
║                              └── All retries failed ──▶           ║
║                                  Keep SD data; retry tomorrow     ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                    BACKEND PROCESSING                             ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Receive bulk payload                                             ║
║     ▼                                                             ║
║  Validate + Persist to PostgreSQL                                 ║
║     ▼                                                             ║
║  Evaluate rules:                                                  ║
║     ├── DTC detected?        ──▶ FCM push to Manager + Employee  ║
║     ├── KM threshold reached? ──▶ FCM push + Calendar event      ║
║     └── Test result logged?   ──▶ FCM push to Manager            ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 5. Backend Layer

### 5.1 API Endpoint Summary

All endpoints are prefixed with `/api/v1`. Authentication is via Bearer JWT token.

#### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/auth/login` | Obtain JWT access + refresh tokens | Public |
| `POST` | `/auth/refresh` | Refresh access token | Authenticated |
| `POST` | `/auth/logout` | Invalidate refresh token | Authenticated |

#### Telemetry (ESP32 → Backend)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/telemetry/bulk` | Ingest bulk JSON array from ESP32 | Device API Key |
| `GET` | `/telemetry/:vehicle_id` | Query telemetry history for a vehicle | Manager, Employee |

#### Vehicles

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/vehicles` | List all vehicles with last-known status | Manager, Employee |
| `GET` | `/vehicles/:id` | Get single vehicle detail | Manager, Employee, User |
| `GET` | `/vehicles/:id/dtcs` | Get DTC event history | Manager, Employee |
| `POST` | `/vehicles` | Register new vehicle | Manager |
| `DELETE` | `/vehicles/:id` | Deregister vehicle | Manager |

#### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/tasks` | List all tasks (filterable by status, assignee) | Manager, Employee |
| `POST` | `/tasks` | Create and assign a task | Manager |
| `PUT` | `/tasks/:id` | Update task status or notes | Manager, Employee |
| `DELETE` | `/tasks/:id` | Delete a task | Manager |

#### Test Sessions

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/tests` | List all test sessions | Manager |
| `POST` | `/tests/trigger` | Approve and schedule a gas test | Manager |
| `GET` | `/tests/:id` | Get test session result | Manager, Employee |

#### Maintenance

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/maintenance` | List maintenance schedules | Manager, Employee, User |
| `POST` | `/maintenance` | Create maintenance record | Manager |
| `PUT` | `/maintenance/:id` | Update maintenance record | Manager, Employee |

#### Notifications

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/notifications/register` | Register FCM device token | Authenticated |
| `GET` | `/notifications` | List notification history for user | Authenticated |

---

### 5.2 RBAC Role Matrix

| Resource / Action | MANAGER | EMPLOYEE | USER |
|-------------------|:-------:|:--------:|:----:|
| View all vehicles | ✅ | ✅ | Own only |
| View DTC history | ✅ | ✅ | ❌ |
| Create/assign tasks | ✅ | ❌ | ❌ |
| Update task status | ✅ | ✅ | ❌ |
| Trigger gas test | ✅ | ❌ | ❌ |
| View maintenance schedule | ✅ | ✅ | ✅ |
| Create maintenance record | ✅ | ❌ | ❌ |
| Receive push notifications | ✅ | ✅ | ✅ |
| Manage users | ✅ | ❌ | ❌ |
| Ingest telemetry (device) | Device Key | ❌ | ❌ |

---

## 6. Frontend Layer

### Web Panel (Manager)

Built with **React + TypeScript + Vite**. Communicates with the backend via REST. Key screens:

- **Dashboard** — Fleet health overview; vehicles with active DTCs are highlighted in Yellow with a thick Navy border
- **Vehicle Detail** — Full DTC history, KM chart, last sync timestamp
- **Task Board** — Kanban: `TODO → IN PROGRESS → DONE`. Manager creates tasks; Employees advance them.
- **Test Management** — Pending test requests table; Manager clicks `APPROVE` to trigger the gas test via API
- **Maintenance Calendar** — Grid-based calendar; events synced to Google/Apple Calendar

### Mobile App (User / Employee)

Built with **React Native** or **Flutter**. Key screens:

- **Home** — Vehicle status card (KM, last sync, active DTC count)
- **Notifications** — FCM push notification history
- **Calendar** — Native calendar integration for maintenance reminders
- **Tasks** — Employee task list and status updates (Employee role)

---

## 7. Design System

AH@ enforces a **Brutalist** design language. This is non-negotiable.

```
╔══════════════════════════════════════════════════════╗
║            DESIGN TOKENS                             ║
╠══════════════════════════════════════════════════════╣
║  Primary Color    │  #FFD700  (Yellow)               ║
║  Secondary Color  │  #001F5B  (Navy Blue)             ║
║  Background       │  #FFFFFF  (White)                 ║
║  Surface          │  #F0F0F0  (Light Gray)            ║
║  Text Primary     │  #0A0A0A  (Near Black)            ║
║  Text Inverse     │  #FFFFFF  (White)                 ║
║  Danger           │  #D00000  (Red)                   ║
║  Success          │  #006400  (Dark Green)            ║
╠══════════════════════════════════════════════════════╣
║            RULES (STRICTLY ENFORCED)                 ║
╠══════════════════════════════════════════════════════╣
║  border-radius    │  0px  — everywhere               ║
║  Gradients        │  FORBIDDEN                       ║
║  Box Shadow       │  4px 4px 0px #001F5B (offset)    ║
║  Typography       │  IBM Plex Mono / Space Grotesk   ║
║  Hover State      │  Invert: bg #001F5B, text #FFD700 ║
║  Active State     │  bg #FFD700, text #001F5B         ║
╚══════════════════════════════════════════════════════╝
```

---

## 8. Setup & Installation

### 8.1 Prerequisites

- [PlatformIO CLI](https://platformio.org/install/cli) or PlatformIO IDE extension
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) v20+ and npm/pnpm
- [Go](https://go.dev/) v1.22+ (if using Go backend)
- [React Native CLI](https://reactnative.dev/docs/environment-setup) or [Flutter SDK](https://flutter.dev/)
- A Firebase project with FCM enabled
- A Google Cloud project with Calendar API enabled (for calendar sync)

---

### 8.2 Hardware Setup

1. **Assemble the circuit** according to the [Wiring & Pinout Table](#32-wiring--pinout-table).
2. **Verify power rail:** Adjust the LM2596 trimmer potentiometer until `VOUT+` reads 5.0V ± 0.1V on a multimeter before connecting the ESP32.
3. **Flash the firmware:**
   ```bash
   cd hardware/
   cp include/config.h.example include/config.h
   # Edit config.h: fill in your Wi-Fi SSID, password, API endpoint, vehicle ID, API key
   pio run --target upload
   ```
4. **Monitor serial output:**
   ```bash
   pio device monitor --baud 115200
   ```
5. **First boot:** The ESP32 will connect to Wi-Fi and perform an NTP time sync. The DS3231 will be set from this time. Subsequent boots use the DS3231 directly (no Wi-Fi required for timekeeping).
6. **Connect to OBD-II port** using the OBD-II cable wired to MCP2515 CANH/CANL terminals.

---

### 8.3 Backend Setup

1. **Clone the repository and navigate to backend:**
   ```bash
   git clone https://github.com/your-username/ahet.git
   cd ahet/backend
   ```
2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL, JWT secret, FCM credentials, etc.
   ```
3. **Start services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
4. **Run database migrations:**
   ```bash
   make migrate-up
   ```
5. **Seed development data (optional):**
   ```bash
   cd ../scripts && bash seed-db.sh
   ```
6. The API will be available at `http://localhost:8080/api/v1`.
7. **Simulate an ESP32 payload** for testing:
   ```bash
   bash scripts/simulate-esp32-payload.sh
   ```

---

### 8.4 Web Panel Setup

```bash
cd ahet/web
cp .env.example .env.local
# Set VITE_API_BASE_URL=http://localhost:8080/api/v1
npm install
npm run dev
```

The web panel will be available at `http://localhost:5173`.

---

### 8.5 Mobile App Setup

```bash
cd ahet/mobile
npm install
# iOS
npx pod-install ios
npx react-native run-ios
# Android
npx react-native run-android
```

Configure `src/services/api.ts` with your backend API base URL.

---

## 9. Environment Variables

### Backend `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@localhost:5432/ahet` |
| `JWT_SECRET` | Secret for signing JWT tokens | `a-long-random-secret` |
| `JWT_EXPIRY` | Access token TTL | `15m` |
| `FCM_CREDENTIALS_JSON` | Path to Firebase service account JSON | `/secrets/firebase.json` |
| `GOOGLE_CALENDAR_CREDENTIALS` | Path to Google OAuth2 service account | `/secrets/google.json` |
| `DEVICE_API_KEY` | Shared API key used by ESP32 for bulk ingest | `esp32-device-key-xxxx` |
| `SERVER_PORT` | HTTP server port | `8080` |
| `ENVIRONMENT` | `development` or `production` | `development` |

---

## 10. Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with clear, imperative commit messages
4. Open a Pull Request against the `dev` branch
5. Ensure all CI checks pass before requesting review

Please read `docs/architecture/system-overview.md` before contributing to understand the data flow and component boundaries.

---

## 11. License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---
---

<a name="turkish"></a>

---

# 🇹🇷 TÜRKÇE DOKÜMANTASYON

---

## İçindekiler

1. [Proje Genel Bakış](#1-proje-genel-bakış)
2. [Sistem Mimarisi](#2-sistem-mimarisi)
3. [Donanım Katmanı](#3-donanım-katmanı)
   - [Malzeme Listesi](#31-malzeme-listesi)
   - [Kablolama ve Pinout Tablosu](#32-kablolama-ve-pinout-tablosu)
   - [Güç Devresi](#33-güç-devresi)
4. [Sistem Akış Diyagramı](#4-sistem-akış-diyagramı)
5. [Backend Katmanı](#5-backend-katmanı)
   - [API Endpoint Özeti](#51-api-endpoint-özeti)
   - [RBAC Rol Matrisi](#52-rbac-rol-matrisi)
6. [Frontend Katmanı](#6-frontend-katmanı)
7. [Tasarım Sistemi](#7-tasarım-sistemi)
8. [Kurulum ve Çalıştırma](#8-kurulum-ve-çalıştırma)
   - [Ön Koşullar](#81-ön-koşullar)
   - [Donanım Kurulumu](#82-donanım-kurulumu)
   - [Backend Kurulumu](#83-backend-kurulumu)
   - [Web Panel Kurulumu](#84-web-panel-kurulumu)
   - [Mobil Uygulama Kurulumu](#85-mobil-uygulama-kurulumu)
9. [Ortam Değişkenleri](#9-ortam-değişkenleri)
10. [Katkıda Bulunma](#10-katkıda-bulunma)
11. [Lisans](#11-lisans)

---

## 1. Proje Genel Bakış

**AH@**, garaj, servis merkezi ve lojistik operasyonları gibi filo yönetimi ortamları için geliştirilmiş, **çevrimdışı öncelikli** (offline-first) bir IoT araç telemetri ve kontrol platformudur.

Sistem, **Depola ve İlet** (Store and Forward) mimarisi üzerine kuruludur: Bir ESP32 mikrodenetleyicisi gün boyunca araçta bulunur, CAN Bus üzerinden veri toplar (hata kodları, kilometre okumaları, motor telemetrisi) ve bu verileri RTC zaman damgaları ile birlikte yerel bir MicroSD karta yazar — tamamen çevrimdışı olarak. Araç gün sonunda garaja döndüğünde, ESP32 garaj Wi-Fi ağına bağlanır ve birikmiş verileri toplu olarak backend REST API'sine gönderir. Başarılı bir onay alındığında SD kart günlüğü temizlenir ve döngü yeniden başlar.

Backend bu verileri işler, ilişkisel bir veritabanında saklar ve bakım personeli ile yöneticilere push bildirimleri (FCM aracılığıyla) ve takvim etkinlikleri (Google/Apple Takvim aracılığıyla) gönderir. Bir web paneli Yöneticilere tam operasyonel görünürlük sağlarken, bir mobil uygulama Kullanıcıları gerçek zamanlı olarak bilgilendirir.

### Temel Tasarım Prensipleri

- **Çevrimdışı Öncelikli:** Wi-Fi mevcut olmasa bile hiçbir veri kaybolmaz. ESP32, günlerce veriyi SD kartta tamponlar.
- **Brutalist Arayüz:** Sıfır degrade. Sıfır yuvarlatılmış köşe. Sarı (`#FFD700`) ve Lacivert (`#001F5B`) renk paleti. İşlevsel, okunabilir ve özgün.
- **RBAC:** Her API endpoint'i ve arayüz eylemi role göre kısıtlanmıştır — Yönetici, Çalışan veya Kullanıcı.
- **Açık Standart Protokoller:** CAN Bus (OBD-II PID'leri), REST/JSON, OAuth2, CalDAV.

---

## 2. Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ARAÇ (Saha / Çevrimdışı)                        │
│                                                                     │
│  ┌─────────────┐    SPI     ┌───────────┐    SPI    ┌───────────┐  │
│  │  MCP2515    │──────────▶│   ESP32   │──────────▶│  MicroSD  │  │
│  │  CAN Bus    │            │ (Ana MCU) │            │  Modülü   │  │
│  └─────────────┘            └─────┬─────┘            └───────────┘  │
│         │                        │ I2C                               │
│   CAN H/L                   ┌────▼──────┐                           │
│   (OBD-II)                  │  DS3231   │                           │
│                             │    RTC    │                           │
│                             └───────────┘                           │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  LM2596 Düşürücü Dönüştürücü  │  12V → 5V regüle           │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                     GÜN SONU │ Wi-Fi toplu POST
                     (Garaj)  │ JSON Dizisi
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Bulut / Yerinde)                      │
│                                                                     │
│   REST API  ──▶  RBAC Middleware  ──▶  İş Mantığı Servisleri        │
│       │                                      │                      │
│       ▼                                      ▼                      │
│   PostgreSQL DB                    ┌─────────────────┐             │
│                                    │  FCM (Firebase) │             │
│                                    │  Push Bildirim  │             │
│                                    └────────┬────────┘             │
│                                             │                      │
│                              ┌──────────────┴──────────────┐       │
│                              │  Google Takvim / Apple      │       │
│                              │  Takvim (Bakım Senkronizas.)│       │
│                              └─────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
                          │                         │
                ┌─────────▼──────────┐   ┌──────────▼─────────┐
                │   WEB PANELİ       │   │   MOBİL UYGULAMA    │
                │   (Yönetici)       │   │   (Kullanıcı/Çalışan│
                │                    │   │                     │
                │  - Filo özeti      │   │  - Bildirimler      │
                │  - Görev panosu    │   │  - Araç durumu      │
                │  - DTC geçmişi     │   │  - Takvim etkinlikleri│
                │  - Test onayı      │   │  - Görev güncellemeleri│
                └────────────────────┘   └─────────────────────┘
```

---

## 3. Donanım Katmanı

### 3.1 Malzeme Listesi

| # | Bileşen | Amaç | Adet |
|---|---------|------|------|
| 1 | ESP32 DevKit v1 | Ana mikrodenetleyici (Wi-Fi + SPI + I2C) | 1 |
| 2 | MCP2515 CAN Bus Modülü | Araç CAN Bus arayüzü (OBD-II) | 1 |
| 3 | LM2596 Düşürücü Dönüştürücü | Güç regülasyonu: 12V → 5V | 1 |
| 4 | MicroSD Kart Modülü (SPI) | Çevrimdışı veri depolama | 1 |
| 5 | DS3231 RTC Modülü | Pil destekli hassas zaman damgası | 1 |
| 6 | MicroSD Kart (≥ 8GB, Class 10) | Depolama ortamı | 1 |
| 7 | CR2032 Pil | DS3231 yedek gücü | 1 |
| 8 | OBD-II Konektörü / Kablosu | Araca fiziksel CAN Bus bağlantısı | 1 |
| 9 | Prototip PCB / Muhafaza | Montaj ve koruma | 1 |
| 10 | Jumper Kablo / Konektörler | Kablolama | Gerektiği kadar |

---

### 3.2 Kablolama ve Pinout Tablosu

#### ESP32 → MCP2515 (CAN Bus Modülü) — SPI Veri Yolu

| MCP2515 Pini | ESP32 Pini | GPIO | Notlar |
|--------------|------------|------|--------|
| VCC | 3.3V / 5V | — | Modül voltajını kontrol edin; çoğu 5V kabul eder |
| GND | GND | — | Ortak toprak |
| CS | D5 | GPIO 5 | Chip Select (SPI) |
| SO (MISO) | D19 | GPIO 19 | SPI MISO |
| SI (MOSI) | D23 | GPIO 23 | SPI MOSI |
| SCK | D18 | GPIO 18 | SPI Saat |
| INT | D4 | GPIO 4 | Kesme pini (CAN mesajı alındı) |

#### ESP32 → MicroSD Kart Modülü — SPI Veri Yolu (paylaşımlı, ayrı CS)

| SD Modülü Pini | ESP32 Pini | GPIO | Notlar |
|----------------|------------|------|--------|
| VCC | 5V | — | |
| GND | GND | — | Ortak toprak |
| CS | D15 | GPIO 15 | Özel CS (MCP2515'ten farklı) |
| MOSI | D23 | GPIO 23 | Paylaşımlı SPI MOSI |
| CLK | D18 | GPIO 18 | Paylaşımlı SPI Saat |
| MISO | D19 | GPIO 19 | Paylaşımlı SPI MISO |

#### ESP32 → DS3231 RTC Modülü — I2C Veri Yolu

| DS3231 Pini | ESP32 Pini | GPIO | Notlar |
|-------------|------------|------|--------|
| VCC | 3.3V | — | |
| GND | GND | — | Ortak toprak |
| SDA | D21 | GPIO 21 | I2C Veri |
| SCL | D22 | GPIO 22 | I2C Saat |

#### LM2596 Düşürücü Dönüştürücü → ESP32 Güç Bağlantısı

| LM2596 Terminali | Bağlantı | Notlar |
|------------------|---------|--------|
| VIN+ | Araç 12V+ | 2A sigorta ile korunmalı |
| VIN- | Araç GND | Ortak toprak |
| VOUT+ | ESP32 VIN (5V pini) | Çıkış 5V'a ayarlanmalı |
| VOUT- | ESP32 GND | Ortak toprak |

#### MCP2515 → Araç OBD-II / CAN Bus

| MCP2515 Terminali | OBD-II Pini | Notlar |
|-------------------|-------------|--------|
| CANH | Pin 6 (CAN High) | Hat sonu ise 120Ω sonlandırma direnci ekleyin |
| CANL | Pin 14 (CAN Low) | |

---

### 3.3 Güç Devresi

```
Araç Aküsü (12V)
        │
    [2A Sigorta]
        │
    ┌───▼────────────────┐
    │  LM2596 Dönüştürücü│  Çıkış: 5V regüle
    │  IN+  OUT+         ├──────────────────▶ ESP32 VIN
    │  IN-   OUT-        ├──────────────────▶ GND (ortak)
    └────────────────────┘
```

> **Uyarı:** ESP32'ye bağlamadan önce LM2596 çıkış voltajını multimetre ile doğrulayın. Aşırı voltaj mikrodenetleyiciye kalıcı zarar verir.

---

## 4. Sistem Akış Diyagramı

```
╔═══════════════════════════════════════════════════════════════════╗
║                       GÜNLÜK OPERASYON DÖNGÜSÜ                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  [BAŞLATMA / BOOT]                                                ║
║     │                                                             ║
║     ▼                                                             ║
║  [ZAMAN SENKRON]  ──▶ DS3231 RTC zaman damgası sağlar             ║
║     │               (NTP senkronu ilk açılışta Wi-Fi ile yapılır) ║
║     ▼                                                             ║
║  [CAN BUS TARAMA]                                                 ║
║     │  MCP2515'ten DTC, KM, motor verileri okunur                 ║
║     │  Gaz testi bayrağı varsa: 20 dakikalık test başlatılır      ║
║     ▼                                                             ║
║  [JSON KAYDI OLUŞTURMA]                                           ║
║     │  {                                                          ║
║     │    "vehicle_id": "...",                                     ║
║     │    "timestamp": "2025-10-15T08:32:00Z",                    ║
║     │    "km": 142350,                                           ║
║     │    "dtcs": ["P0300", "P0171"],                             ║
║     │    "engine_rpm": 820,                                      ║
║     │    "coolant_temp_c": 91,                                   ║
║     │    "test_active": false                                     ║
║     │  }                                                          ║
║     ▼                                                             ║
║  [SD KARTA YAZMA]                                                 ║
║     │  Dosya: /logs/YYYY-MM-DD.json  (JSON dizisi)                ║
║     │  Atomik yazma: geçici dosya → yeniden adlandır              ║
║     ▼                                                             ║
║  [GÜN BOYUNCA TEKRAR]                                             ║
║     │  (Araç çevrimdışı; ağ bağlantısı gerekmez)                  ║
║     │                                                             ║
╠═══════════════════════════════════════════════════════════════════╣
║                   GÜN SONU — GARAJ SENKRONİZASYONU               ║
╠═══════════════════════════════════════════════════════════════════╣
║     │                                                             ║
║     ▼                                                             ║
║  [GARAJA DÖNÜŞ]  ──▶ Wi-Fi SSID kapsama alanına girdi            ║
║     ▼                                                             ║
║  [WI-FI BAĞLANTISI]                                               ║
║     │  Garaj SSID'sine bağlan                                     ║
║     │  DHCP ile IP al                                             ║
║     ▼                                                             ║
║  [SD KART OKU]  ──▶ Bekleyen tüm JSON log dosyaları yüklenir     ║
║     ▼                                                             ║
║  [TOPLU GÖNDERIM]                                                 ║
║     │  POST /api/v1/telemetry/bulk                                ║
║     │  Content-Type: application/json                             ║
║     │  Body: [ {kayıt1}, {kayıt2}, ... {kayıtN} ]                 ║
║     │                                                             ║
║     ├── HTTP 200 OK ──▶ [SD LOG TEMİZLE] ──▶ [BEKLEME / UYKU]   ║
║     │                                                             ║
║     └── HTTP Hata  ──▶ [3 DENEME, artan bekleme süresiyle]       ║
║                              │                                    ║
║                              └── Tüm denemeler başarısız ──▶      ║
║                                  SD verisi korunur; yarın dene    ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                     BACKEND İŞLEME                                ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Toplu yük alındı                                                 ║
║     ▼                                                             ║
║  Doğrula + PostgreSQL'e kaydet                                    ║
║     ▼                                                             ║
║  Kuralları değerlendir:                                           ║
║     ├── DTC tespit edildi?       ──▶ Yönetici+Çalışana FCM bildirim║
║     ├── KM eşiğine ulaşıldı?    ──▶ FCM bildirimi + Takvim etkinliği║
║     └── Test sonucu kaydedildi? ──▶ Yöneticiye FCM bildirimi     ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 5. Backend Katmanı

### 5.1 API Endpoint Özeti

Tüm endpoint'ler `/api/v1` ön eki ile başlar. Kimlik doğrulama Bearer JWT token ile yapılır.

#### Kimlik Doğrulama

| Yöntem | Endpoint | Açıklama | Erişim |
|--------|----------|----------|--------|
| `POST` | `/auth/login` | JWT erişim + yenileme tokeni al | Herkese Açık |
| `POST` | `/auth/refresh` | Erişim tokenini yenile | Kimliği Doğrulanmış |
| `POST` | `/auth/logout` | Yenileme tokenini geçersiz kıl | Kimliği Doğrulanmış |

#### Telemetri (ESP32 → Backend)

| Yöntem | Endpoint | Açıklama | Erişim |
|--------|----------|----------|--------|
| `POST` | `/telemetry/bulk` | ESP32'den toplu JSON dizisi al | Cihaz API Anahtarı |
| `GET` | `/telemetry/:vehicle_id` | Araç telemetri geçmişini sorgula | Yönetici, Çalışan |

#### Araçlar

| Yöntem | Endpoint | Açıklama | Erişim |
|--------|----------|----------|--------|
| `GET` | `/vehicles` | Son bilinen durumla tüm araçları listele | Yönetici, Çalışan |
| `GET` | `/vehicles/:id` | Tek araç detayını getir | Yönetici, Çalışan, Kullanıcı |
| `GET` | `/vehicles/:id/dtcs` | DTC etkinlik geçmişini getir | Yönetici, Çalışan |
| `POST` | `/vehicles` | Yeni araç kaydet | Yönetici |
| `DELETE` | `/vehicles/:id` | Araç kaydını sil | Yönetici |

#### Görevler

| Yöntem | Endpoint | Açıklama | Erişim |
|--------|----------|----------|--------|
| `GET` | `/tasks` | Tüm görevleri listele (durum, atanan kişiye göre filtrele) | Yönetici, Çalışan |
| `POST` | `/tasks` | Görev oluştur ve ata | Yönetici |
| `PUT` | `/tasks/:id` | Görev durumunu veya notlarını güncelle | Yönetici, Çalışan |
| `DELETE` | `/tasks/:id` | Görevi sil | Yönetici |

#### Test Oturumları

| Yöntem | Endpoint | Açıklama | Erişim |
|--------|----------|----------|--------|
| `GET` | `/tests` | Tüm test oturumlarını listele | Yönetici |
| `POST` | `/tests/trigger` | Gaz testini onayla ve planla | Yönetici |
| `GET` | `/tests/:id` | Test oturumu sonucunu getir | Yönetici, Çalışan |

#### Bakım

| Yöntem | Endpoint | Açıklama | Erişim |
|--------|----------|----------|--------|
| `GET` | `/maintenance` | Bakım planlarını listele | Yönetici, Çalışan, Kullanıcı |
| `POST` | `/maintenance` | Bakım kaydı oluştur | Yönetici |
| `PUT` | `/maintenance/:id` | Bakım kaydını güncelle | Yönetici, Çalışan |

#### Bildirimler

| Yöntem | Endpoint | Açıklama | Erişim |
|--------|----------|----------|--------|
| `POST` | `/notifications/register` | FCM cihaz tokenını kaydet | Kimliği Doğrulanmış |
| `GET` | `/notifications` | Kullanıcı bildirim geçmişini listele | Kimliği Doğrulanmış |

---

### 5.2 RBAC Rol Matrisi

| Kaynak / Eylem | YÖNETİCİ | ÇALIŞAN | KULLANICI |
|----------------|:--------:|:-------:|:---------:|
| Tüm araçları görüntüle | ✅ | ✅ | Yalnızca kendi |
| DTC geçmişini görüntüle | ✅ | ✅ | ❌ |
| Görev oluştur/ata | ✅ | ❌ | ❌ |
| Görev durumunu güncelle | ✅ | ✅ | ❌ |
| Gaz testini tetikle | ✅ | ❌ | ❌ |
| Bakım planını görüntüle | ✅ | ✅ | ✅ |
| Bakım kaydı oluştur | ✅ | ❌ | ❌ |
| Push bildirimi al | ✅ | ✅ | ✅ |
| Kullanıcı yönetimi | ✅ | ❌ | ❌ |
| Telemetri al (cihaz) | Cihaz Anahtarı | ❌ | ❌ |

---

## 6. Frontend Katmanı

### Web Paneli (Yönetici)

**React + TypeScript + Vite** ile geliştirilmiştir. Backend ile REST üzerinden iletişim kurar. Temel ekranlar:

- **Gösterge Paneli** — Filo sağlığı özeti; aktif DTC'si olan araçlar Sarı renk ve kalın Lacivert kenarlık ile vurgulanır
- **Araç Detayı** — Tam DTC geçmişi, KM grafiği, son senkronizasyon zaman damgası
- **Görev Panosu** — Kanban: `YAPILACAK → DEVAM EDİYOR → TAMAMLANDI`. Yönetici görev oluşturur; Çalışanlar ilerletir.
- **Test Yönetimi** — Bekleyen test istekleri tablosu; Yönetici API aracılığıyla gaz testini tetiklemek için `ONAYLA` düğmesine tıklar
- **Bakım Takvimi** — Grid tabanlı takvim; Google/Apple Takvim ile senkronize edilmiş etkinlikler

### Mobil Uygulama (Kullanıcı / Çalışan)

**React Native** veya **Flutter** ile geliştirilmiştir. Temel ekranlar:

- **Ana Ekran** — Araç durum kartı (KM, son senkronizasyon, aktif DTC sayısı)
- **Bildirimler** — FCM push bildirim geçmişi
- **Takvim** — Bakım hatırlatıcıları için yerel takvim entegrasyonu
- **Görevler** — Çalışan görev listesi ve durum güncellemeleri (Çalışan rolü)

---

## 7. Tasarım Sistemi

AH@, **Brutalist** tasarım dilini zorunlu kılar. Bu konuda esneklik yoktur.

```
╔══════════════════════════════════════════════════════╗
║             TASARIM TOKENLERİ                        ║
╠══════════════════════════════════════════════════════╣
║  Birincil Renk       │  #FFD700  (Sarı)              ║
║  İkincil Renk        │  #001F5B  (Lacivert)           ║
║  Arkaplan            │  #FFFFFF  (Beyaz)              ║
║  Yüzey               │  #F0F0F0  (Açık Gri)          ║
║  Birincil Metin      │  #0A0A0A  (Siyaha Yakın)      ║
║  Ters Metin          │  #FFFFFF  (Beyaz)              ║
║  Tehlike             │  #D00000  (Kırmızı)           ║
║  Başarı              │  #006400  (Koyu Yeşil)         ║
╠══════════════════════════════════════════════════════╣
║             KURALLAR (KESİNLİKLE UYGULANIR)          ║
╠══════════════════════════════════════════════════════╣
║  border-radius       │  0px  — her yerde             ║
║  Degradeler          │  YASAK                        ║
║  Kutu Gölgesi        │  4px 4px 0px #001F5B (ofset) ║
║  Tipografi           │  IBM Plex Mono / Space Grotesk║
║  Hover Durumu        │  Ters çevir: bg #001F5B, metin #FFD700 ║
║  Aktif Durum         │  bg #FFD700, metin #001F5B    ║
╚══════════════════════════════════════════════════════╝
```

---

## 8. Kurulum ve Çalıştırma

### 8.1 Ön Koşullar

- [PlatformIO CLI](https://platformio.org/install/cli) veya PlatformIO IDE uzantısı
- [Docker](https://www.docker.com/) ve Docker Compose
- [Node.js](https://nodejs.org/) v20+ ve npm/pnpm
- [Go](https://go.dev/) v1.22+ (Go backend kullanılıyorsa)
- [React Native CLI](https://reactnative.dev/docs/environment-setup) veya [Flutter SDK](https://flutter.dev/)
- FCM etkin bir Firebase projesi
- Calendar API etkin bir Google Cloud projesi (takvim senkronizasyonu için)

---

### 8.2 Donanım Kurulumu

1. **Devreyi kurun:** [Kablolama ve Pinout Tablosu](#32-kablolama-ve-pinout-tablosu)'na göre bağlantıları yapın.
2. **Güç rayını doğrulayın:** ESP32'ye bağlamadan önce LM2596 ayar potansiyometresini, multimetre ile `VOUT+` 5.0V ± 0.1V okuyuncaya kadar ayarlayın.
3. **Firmware'i yükleyin:**
   ```bash
   cd hardware/
   cp include/config.h.example include/config.h
   # config.h dosyasını düzenleyin: Wi-Fi SSID, şifre, API endpoint, araç ID ve API anahtarını girin
   pio run --target upload
   ```
4. **Seri port çıktısını izleyin:**
   ```bash
   pio device monitor --baud 115200
   ```
5. **İlk başlatma:** ESP32 Wi-Fi'ya bağlanacak ve NTP zaman senkronizasyonu yapacaktır. DS3231 bu zamanla ayarlanacaktır. Sonraki başlatmalarda doğrudan DS3231 kullanılır (zaman tutma için Wi-Fi gerekmez).
6. **OBD-II portuna bağlanın:** MCP2515 CANH/CANL terminallerine kablolanan OBD-II kablosunu araç portuna takın.

---

### 8.3 Backend Kurulumu

1. **Depoyu klonlayın ve backend dizinine gidin:**
   ```bash
   git clone https://github.com/kullanici-adiniz/ahet.git
   cd ahet/backend
   ```
2. **Ortam değişkenlerini yapılandırın:**
   ```bash
   cp .env.example .env
   # .env dosyasını veritabanı URL'si, JWT secret, FCM kimlik bilgileri vb. ile doldurun
   ```
3. **Docker Compose ile servisleri başlatın:**
   ```bash
   docker-compose up -d
   ```
4. **Veritabanı migration'larını çalıştırın:**
   ```bash
   make migrate-up
   ```
5. **Geliştirme verilerini yükleyin (isteğe bağlı):**
   ```bash
   cd ../scripts && bash seed-db.sh
   ```
6. API `http://localhost:8080/api/v1` adresinde kullanılabilir olacaktır.
7. **ESP32 payload simülasyonu için test:**
   ```bash
   bash scripts/simulate-esp32-payload.sh
   ```

---

### 8.4 Web Panel Kurulumu

```bash
cd ahet/web
cp .env.example .env.local
# VITE_API_BASE_URL=http://localhost:8080/api/v1 olarak ayarlayın
npm install
npm run dev
```

Web paneli `http://localhost:5173` adresinde kullanılabilir olacaktır.

---

### 8.5 Mobil Uygulama Kurulumu

```bash
cd ahet/mobile
npm install
# iOS
npx pod-install ios
npx react-native run-ios
# Android
npx react-native run-android
```

`src/services/api.ts` dosyasını backend API base URL'si ile yapılandırın.

---

## 9. Ortam Değişkenleri

### Backend `.env`

| Değişken | Açıklama | Örnek |
|----------|----------|-------|
| `DATABASE_URL` | PostgreSQL bağlantı dizesi | `postgres://kullanici:sifre@localhost:5432/ahet` |
| `JWT_SECRET` | JWT token imzalama anahtarı | `uzun-rastgele-bir-secret` |
| `JWT_EXPIRY` | Erişim token geçerlilik süresi | `15m` |
| `FCM_CREDENTIALS_JSON` | Firebase servis hesabı JSON dosyası yolu | `/secrets/firebase.json` |
| `GOOGLE_CALENDAR_CREDENTIALS` | Google OAuth2 servis hesabı yolu | `/secrets/google.json` |
| `DEVICE_API_KEY` | ESP32'nin toplu gönderim için kullandığı API anahtarı | `esp32-cihaz-anahtari-xxxx` |
| `SERVER_PORT` | HTTP sunucu portu | `8080` |
| `ENVIRONMENT` | `development` veya `production` | `development` |

---

## 10. Katkıda Bulunma

1. Depoyu fork edin
2. Özellik dalı oluşturun: `git checkout -b feature/ozellik-adiniz`
3. Değişikliklerinizi açık, emir kipinde commit mesajları ile kaydedin
4. `dev` dalına karşı Pull Request açın
5. İnceleme talep etmeden önce tüm CI kontrollerinin geçtiğinden emin olun

Katkıda bulunmadan önce veri akışını ve bileşen sınırlarını anlamak için `docs/architecture/system-overview.md` dosyasını okuyun.

---

## 11. Lisans

Bu proje **MIT Lisansı** kapsamında lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.

---

> **Yazarlar:** MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
> **Proje:** AH@ — Offline-First IoT Vehicle Telemetry & Control System
