/**
 * hardware/include/state_machine.h
 * AH@ Firmware — State machine declarations
 * Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
 *
 * States:
 *   IDLE       — engine off / no CAN activity
 *   LOGGING    — engine running, normal telemetry logging at DIAG_IDLE_POLL_INTERVAL_MS
 *   DIAGNOSTIC — diagnostic session active (signalled by backend), polling at DIAG_POLL_INTERVAL_MS
 *   TRANSMIT   — Wi-Fi connected, uploading SD logs to backend
 *   ERROR      — unrecoverable hardware fault (CAN/SD/RTC)
 */

#pragma once
#include <Arduino.h>
#include "config.h"

// ─── State enum ───────────────────────────────────────────────
enum class DeviceState : uint8_t {
    IDLE       = 0,
    LOGGING    = 1,
    DIAGNOSTIC = 2,
    TRANSMIT   = 3,
    ERROR      = 4,
};

// ─── Telemetry record (one OBD-II snapshot) ───────────────────
struct TelemetryRecord {
    char       vehicleId[37];    // UUID string
    uint32_t   unixTimestamp;    // from DS3231
    uint32_t   km;
    uint16_t   engineRpm;
    int8_t     coolantTempC;
    bool       diagnosticActive; // true when in DIAGNOSTIC state
    char       dtcCodes[DIAG_MAX_DTC_COUNT][6]; // e.g. "P0300\0"
    uint8_t    dtcCount;
};

// ─── Functions ────────────────────────────────────────────────
void     stateMachine_init();
void     stateMachine_run();          // call in loop()
DeviceState stateMachine_getState();
void     stateMachine_enterDiagnostic();
void     stateMachine_exitDiagnostic();
