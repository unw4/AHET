-- Migration: 004_create_dtc_events
-- Diagnostic Trouble Code events parsed from telemetry

CREATE TABLE IF NOT EXISTS dtc_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    telemetry_id    UUID REFERENCES telemetry_logs(id) ON DELETE SET NULL,
    code            VARCHAR(10) NOT NULL,   -- e.g. P0300
    description     TEXT,
    severity        VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN', -- LOW, MEDIUM, HIGH, CRITICAL
    first_seen_at   TIMESTAMPTZ NOT NULL,
    last_seen_at    TIMESTAMPTZ NOT NULL,
    resolved_at     TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_dtc_vehicle_id  ON dtc_events (vehicle_id);
CREATE INDEX idx_dtc_code        ON dtc_events (code);
CREATE INDEX idx_dtc_active      ON dtc_events (is_active) WHERE is_active = TRUE;
