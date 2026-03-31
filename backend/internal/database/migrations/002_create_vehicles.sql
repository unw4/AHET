-- Migration: 002_create_vehicles
-- Vehicle registry table

CREATE TABLE IF NOT EXISTS vehicles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    plate           VARCHAR(20)  NOT NULL UNIQUE,
    make            VARCHAR(100),
    model           VARCHAR(100),
    year            SMALLINT,
    last_km         INTEGER NOT NULL DEFAULT 0,
    last_sync_at    TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_plate ON vehicles (plate);
