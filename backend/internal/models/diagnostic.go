// backend/internal/models/diagnostic.go
// AH@ Backend — DiagnosticSession and DiagnosticFinding structs
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

package models

import "time"

type DiagnosticStatus string

const (
	DiagnosticPending   DiagnosticStatus = "PENDING"
	DiagnosticActive    DiagnosticStatus = "ACTIVE"
	DiagnosticCompleted DiagnosticStatus = "COMPLETED"
)

type DiagnosticSession struct {
	ID                UUID             `db:"id"                   json:"id"`
	VehicleID         UUID             `db:"vehicle_id"           json:"vehicleId"`
	StartedBy         UUID             `db:"started_by"           json:"startedBy"`
	MechanicID        *UUID            `db:"mechanic_id"          json:"mechanicId,omitempty"`
	Status            DiagnosticStatus `db:"status"               json:"status"`
	StartedAt         *time.Time       `db:"started_at"           json:"startedAt,omitempty"`
	CompletedAt       *time.Time       `db:"completed_at"         json:"completedAt,omitempty"`
	DriverComplaint   *string          `db:"driver_complaint"     json:"driverComplaint,omitempty"`
	Notes             *string          `db:"notes"                json:"notes,omitempty"`
	RepairCostEstimate *int            `db:"repair_cost_estimate" json:"repairCostEstimate,omitempty"` // TRY kuruş
	LinkedTaskID      *UUID            `db:"linked_task_id"       json:"linkedTaskId,omitempty"`
	CreatedAt         time.Time        `db:"created_at"           json:"createdAt"`

	// Joined fields (not stored in this table)
	Findings    []DiagnosticFinding `db:"-" json:"findings"`
	VehiclePlate string             `db:"-" json:"vehiclePlate,omitempty"`
	MechanicName string             `db:"-" json:"mechanicName,omitempty"`
}

type DiagnosticFinding struct {
	ID          UUID    `db:"id"           json:"id"`
	SessionID   UUID    `db:"session_id"   json:"sessionId"`
	DTCEventID  *UUID   `db:"dtc_event_id" json:"dtcEventId,omitempty"`
	Code        string  `db:"code"         json:"code"`
	Description string  `db:"description"  json:"description"`
	Severity    string  `db:"severity"     json:"severity"` // LOW | MEDIUM | HIGH | CRITICAL
}

// CreateDiagnosticSessionRequest is the POST /diagnostics request body.
type CreateDiagnosticSessionRequest struct {
	VehicleID       string  `json:"vehicleId"       binding:"required,uuid"`
	MechanicID      *string `json:"mechanicId"      binding:"omitempty,uuid"`
	DriverComplaint *string `json:"driverComplaint"`
}

// CloseDiagnosticSessionRequest is the POST /diagnostics/:id/close request body.
type CloseDiagnosticSessionRequest struct {
	Findings           []DiagnosticFindingInput `json:"findings"           binding:"required"`
	RepairCostEstimate *int                     `json:"repairCostEstimate"`
	Notes              *string                  `json:"notes"`
	CreateRepairTask   bool                     `json:"createRepairTask"`  // auto-create a Task
}

type DiagnosticFindingInput struct {
	Code        string `json:"code"        binding:"required"`
	Description string `json:"description" binding:"required"`
	Severity    string `json:"severity"    binding:"required"`
}

// UUID is a convenience alias; replace with google/uuid in actual implementation.
type UUID = string
