-- Migration: 006_create_maintenance
-- Maintenance schedules and records

CREATE TYPE maintenance_type AS ENUM ('OIL_CHANGE', 'TIRE_ROTATION', 'BRAKE_SERVICE', 'GAS_TEST', 'GENERAL_SERVICE', 'OTHER');
CREATE TYPE maintenance_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED');

CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id          UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    created_by          UUID NOT NULL REFERENCES users(id),
    type                maintenance_type NOT NULL,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    status              maintenance_status NOT NULL DEFAULT 'SCHEDULED',
    scheduled_date      DATE NOT NULL,
    scheduled_km        INTEGER,
    completed_date      DATE,
    google_event_id     TEXT,
    apple_event_uid     TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_vehicle_id     ON maintenance_schedules (vehicle_id);
CREATE INDEX idx_maintenance_scheduled_date ON maintenance_schedules (scheduled_date);
CREATE INDEX idx_maintenance_status         ON maintenance_schedules (status);
