// backend/pkg/whatsapp/client.go
// AH@ Backend — WhatsApp Business Cloud API client wrapper
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
//
// Uses Meta's WhatsApp Business Cloud API (v19.0+).
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
//
// Required env vars:
//   WHATSAPP_TOKEN        — permanent system user token from Meta Business Manager
//   WHATSAPP_PHONE_ID     — Phone Number ID (not the phone number itself)
//   WHATSAPP_BUSINESS_ID  — WhatsApp Business Account ID

package whatsapp

// TODO: Implement the following:
//
// type Client struct { ... }
//
// func NewClient(token, phoneID string) *Client
//
// func (c *Client) SendTextMessage(to, body string) error
//   — POST https://graph.facebook.com/v19.0/{phone-number-id}/messages
//   — Payload: { messaging_product, to, type: "text", text: { body } }
//
// func (c *Client) SendTemplateMessage(to, templateName, langCode string, components []TemplateComponent) error
//   — Sends a pre-approved template message (required for first-contact / 24h window)
//
// func (c *Client) VerifyWebhook(token, challenge string) (string, error)
//   — Handles GET webhook verification from Meta
//
// func (c *Client) ParseWebhookEvent(body []byte) (*WebhookEvent, error)
//   — Parses incoming POST from Meta webhook (delivery receipts, replies)
