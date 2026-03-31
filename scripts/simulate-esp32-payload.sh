#!/usr/bin/env bash
# simulate-esp32-payload.sh — Simulate a bulk telemetry POST from an ESP32 device
# Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
# Usage: bash simulate-esp32-payload.sh [API_URL] [DEVICE_KEY]

set -euo pipefail

API_URL="${1:-http://localhost:8080/api/v1}"
DEVICE_KEY="${2:-esp32-device-key-REPLACE_ME}"
VEHICLE_ID="${VEHICLE_ID:-vehicle-001}"

TIMESTAMP_1=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TIMESTAMP_2=$(date -u -v-30M +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "-30 minutes" +"%Y-%m-%dT%H:%M:%SZ")

echo "==> Simulating ESP32 bulk payload to $API_URL"
echo "    Device key: ${DEVICE_KEY:0:12}..."
echo "    Vehicle ID: $VEHICLE_ID"

curl -s -X POST "$API_URL/telemetry/bulk" \
  -H "Content-Type: application/json" \
  -H "X-Device-Api-Key: $DEVICE_KEY" \
  -d "{
    \"device_id\": \"$VEHICLE_ID\",
    \"firmware_version\": \"0.1.0-sim\",
    \"transmitted_at\": \"$TIMESTAMP_1\",
    \"records\": [
      {
        \"vehicle_id\": \"$VEHICLE_ID\",
        \"timestamp\": \"$TIMESTAMP_2\",
        \"km\": 142350,
        \"dtcs\": [\"P0300\", \"P0171\"],
        \"engine_rpm\": 820,
        \"coolant_temp_c\": 91,
        \"test_active\": false,
        \"test_result\": null
      },
      {
        \"vehicle_id\": \"$VEHICLE_ID\",
        \"timestamp\": \"$TIMESTAMP_1\",
        \"km\": 142360,
        \"dtcs\": [],
        \"engine_rpm\": 0,
        \"coolant_temp_c\": 35,
        \"test_active\": false,
        \"test_result\": null
      }
    ]
  }" | jq .

echo "==> Simulation complete."
