// backend/internal/handlers/tests.go
// AH@ Backend — Diagnostic session handlers
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
//
// Endpoints:
//   GET    /api/v1/diagnostics            → list sessions (MANAGER)
//   POST   /api/v1/diagnostics            → create session, assign mechanic (MANAGER/EMPLOYEE)
//   GET    /api/v1/diagnostics/:id        → session detail with findings
//   POST   /api/v1/diagnostics/:id/start  → set status ACTIVE, record started_at
//   POST   /api/v1/diagnostics/:id/close  → set status COMPLETED, save findings + cost
//
// Flow:
//   1. Manager creates session (PENDING) with vehicle_id + mechanic_id + driver_complaint
//   2. Mechanic starts session → ESP32 sets diagnostic_active=true on next telemetry record
//   3. CAN bus data is read live; DTC codes are captured in telemetry_logs
//   4. Mechanic closes session → submits findings[], repair_cost_estimate, notes
//   5. Handler auto-creates a Task if findings are non-empty and linked_task_id is null
//   6. DIAGNOSTIC_COMPLETED notification sent to MANAGER

package handlers

// TODO: Implement DiagnosticHandler with the flow described above.
// See backend/internal/services/diagnostic_service.go for business logic.
// See backend/internal/models/diagnostic.go for struct definitions.
