// backend/internal/handlers/whatsapp.go
// AH@ Backend — WhatsApp webhook and phone registration handlers
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
//
// Endpoints:
//   GET  /api/v1/whatsapp/webhook  — Meta webhook verification (hub.challenge)
//   POST /api/v1/whatsapp/webhook  — Receive delivery receipts and inbound messages
//   POST /api/v1/whatsapp/register — Register a user's WhatsApp phone number

package handlers

// TODO: Implement the following handlers:
//
// func WhatsAppWebhookVerify(c *gin.Context)
//   — Reads hub.mode, hub.verify_token, hub.challenge query params
//   — Validates token against WHATSAPP_WEBHOOK_VERIFY_TOKEN env var
//   — Returns hub.challenge on success, 403 on failure
//
// func WhatsAppWebhookReceive(c *gin.Context)
//   — Parses incoming Meta webhook POST body
//   — Handles status updates (sent, delivered, read)
//   — Logs inbound messages if any
//
// func WhatsAppRegisterPhone(c *gin.Context)
//   — Authenticated endpoint: saves user's WhatsApp phone number to DB
//   — Validates E.164 format (+905xxxxxxxxx)
