-- Migration: 003_create_telemetry
-- Raw telemetry records received from ESP32 bulk payloads

CREATE TABLE IF NOT EXISTS telemetry_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    recorded_at     TIMESTAMPTZ NOT NULL,   -- From ESP32 RTC timestamp
    received_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    km              INTEGER NOT NULL,
    engine_rpm      SMALLINT,
    coolant_temp_c  SMALLINT,
    diagnostic_active BOOLEAN NOT NULL DEFAULT FALSE  -- true when a diagnostic session was running,
    raw_payload     JSONB
);

CREATE INDEX idx_telemetry_vehicle_id   ON telemetry_logs (vehicle_id);
CREATE INDEX idx_telemetry_recorded_at  ON telemetry_logs (recorded_at DESC);
