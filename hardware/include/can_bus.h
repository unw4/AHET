/**
 * hardware/include/can_bus.h
 * AH@ Firmware — CAN bus / OBD-II declarations
 * Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
 *
 * Uses MCP2515 via SPI (CS = PIN_MCP2515_CS, INT = PIN_MCP2515_INT).
 * Reads standard OBD-II PIDs over ISO 15765-4 (CAN 500 Kbps).
 */

#pragma once
#include <Arduino.h>
#include "config.h"

// ─── OBD-II PID constants ─────────────────────────────────────
#define OBD2_PID_ENGINE_RPM        0x0C  // rpm = ((A*256)+B) / 4
#define OBD2_PID_COOLANT_TEMP      0x05  // °C  = A - 40
#define OBD2_PID_ENGINE_LOAD       0x04  // %   = A * 100 / 255
#define OBD2_PID_SHORT_FUEL_TRIM   0x06  // %   = (A - 128) * 100 / 128
#define OBD2_PID_LONG_FUEL_TRIM    0x07  // %   = (A - 128) * 100 / 128
#define OBD2_PID_O2_SENSOR_B1S1    0x14  // V   = A / 200
#define OBD2_PID_VEHICLE_SPEED     0x0D  // km/h = A

// OBD-II service modes
#define OBD2_MODE_CURRENT_DATA     0x01
#define OBD2_MODE_REQUEST_DTCS     0x03  // read stored fault codes
#define OBD2_MODE_CLEAR_DTCS       0x04  // clear fault codes (NOT used by this device)

// ─── Structs ──────────────────────────────────────────────────
struct OBD2Snapshot {
    uint16_t engineRpm;
    int8_t   coolantTempC;
    uint8_t  engineLoadPct;
    int8_t   shortFuelTrimPct;
    int8_t   longFuelTrimPct;
    uint16_t o2SensorMv;        // millivolts
    uint8_t  vehicleSpeedKmh;
};

// ─── Functions ────────────────────────────────────────────────
bool    canBus_init();
bool    canBus_readSnapshot(OBD2Snapshot* out);
uint8_t canBus_readDTCs(char dtcOut[][6], uint8_t maxCount);
                                 // returns number of DTCs found
                                 // dtcOut: array of null-terminated strings e.g. "P0300"
bool    canBus_isEngineRunning(); // RPM > 0
