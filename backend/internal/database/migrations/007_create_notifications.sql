-- Migration: 007_create_notifications
-- Notification delivery log and device token registry

CREATE TYPE notification_type AS ENUM ('DTC_DETECTED', 'KM_THRESHOLD', 'DIAGNOSTIC_STARTED', 'DIAGNOSTIC_COMPLETED', 'TASK_ASSIGNED', 'MAINTENANCE_DUE');

CREATE TABLE IF NOT EXISTS device_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fcm_token   TEXT NOT NULL UNIQUE,
    platform    VARCHAR(20) NOT NULL,  -- ios, android, web
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            notification_type NOT NULL,
    title           VARCHAR(255) NOT NULL,
    body            TEXT NOT NULL,
    data            JSONB,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at         TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_id  ON notifications (user_id);
CREATE INDEX idx_notifications_unread   ON notifications (user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_device_tokens_user_id  ON device_tokens (user_id);
