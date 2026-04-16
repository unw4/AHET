-- Migration: 009_create_diagnostic_sessions
-- Diagnostic sessions: in-house mechanic runs OBD-II scan while engine is on.
-- Replaces the former "gas test" concept. No pass/fail — findings drive repair tasks.

CREATE TYPE diagnostic_status AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED');

CREATE TABLE IF NOT EXISTS diagnostic_sessions (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id           UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    started_by           UUID NOT NULL REFERENCES users(id),
    mechanic_id          UUID REFERENCES users(id),
    status               diagnostic_status NOT NULL DEFAULT 'PENDING',
    started_at           TIMESTAMPTZ,
    completed_at         TIMESTAMPTZ,
    driver_complaint     TEXT,                       -- what the driver reported
    notes                TEXT,                       -- mechanic notes post-session
    repair_cost_estimate INTEGER,                    -- estimated repair cost in TRY (kuruş)
    linked_task_id       UUID REFERENCES tasks(id) ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Findings are stored as a child table (one session → many DTC findings)
CREATE TABLE IF NOT EXISTS diagnostic_findings (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id     UUID NOT NULL REFERENCES diagnostic_sessions(id) ON DELETE CASCADE,
    dtc_event_id   UUID REFERENCES dtc_events(id) ON DELETE SET NULL,
    code           VARCHAR(10) NOT NULL,
    description    TEXT NOT NULL,
    severity       VARCHAR(20) NOT NULL DEFAULT 'UNKNOWN'
);

CREATE INDEX idx_diag_sessions_vehicle_id  ON diagnostic_sessions (vehicle_id);
CREATE INDEX idx_diag_sessions_status      ON diagnostic_sessions (status);
CREATE INDEX idx_diag_findings_session_id  ON diagnostic_findings (session_id);
