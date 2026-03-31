-- Migration: 008_add_whatsapp_phone
-- Adds WhatsApp phone number field to users table
-- and creates a WhatsApp message log table

ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_phone VARCHAR(20);

CREATE INDEX IF NOT EXISTS idx_users_whatsapp_phone ON users (whatsapp_phone)
  WHERE whatsapp_phone IS NOT NULL;

CREATE TABLE IF NOT EXISTS whatsapp_message_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    to_phone        VARCHAR(20) NOT NULL,
    template_name   VARCHAR(100),
    message_body    TEXT,
    wa_message_id   TEXT,                   -- Meta's message ID from API response
    status          VARCHAR(20) NOT NULL DEFAULT 'SENT',  -- SENT, DELIVERED, READ, FAILED
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status_at       TIMESTAMPTZ
);

CREATE INDEX idx_wa_log_user_id    ON whatsapp_message_log (user_id);
CREATE INDEX idx_wa_log_status     ON whatsapp_message_log (status);
CREATE INDEX idx_wa_log_wa_msg_id  ON whatsapp_message_log (wa_message_id);
