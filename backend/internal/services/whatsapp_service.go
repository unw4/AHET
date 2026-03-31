// backend/internal/services/whatsapp_service.go
// AH@ Backend — WhatsApp notification dispatch service
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
//
// Wraps the WhatsApp Cloud API client and maps internal
// notification events to the correct WhatsApp message templates.
//
// Template messages must be pre-approved in Meta Business Manager.
// Template names used:
//   - ahet_dtc_alert       (DTC detected)
//   - ahet_km_threshold    (KM maintenance due)
//   - ahet_test_approved   (Gas test approved by manager)
//   - ahet_test_result     (Gas test result ready)
//   - ahet_task_assigned   (Task assigned to employee)

package services

// TODO: Implement the following:
//
// type WhatsAppService struct {
//     client   *whatsapp.Client
//     userRepo *repository.UserRepository
// }
//
// func NewWhatsAppService(client *whatsapp.Client, userRepo *repository.UserRepository) *WhatsAppService
//
// func (s *WhatsAppService) SendDTCAlert(vehicleID, dtcCode, severity string, recipients []string) error
//
// func (s *WhatsAppService) SendKMThresholdAlert(vehicleID string, currentKM int, recipients []string) error
//
// func (s *WhatsAppService) SendTestApproved(vehicleID, approvedBy string, recipients []string) error
//
// func (s *WhatsAppService) SendTestResult(vehicleID string, result string, recipients []string) error
//
// func (s *WhatsAppService) SendTaskAssigned(taskTitle, assigneeName, dueDate string, recipient string) error
