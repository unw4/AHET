// AH@ — Shared TypeScript Types
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK

// ─── Auth ────────────────────────────────────────────────────
export type UserRole = 'MANAGER' | 'EMPLOYEE' | 'USER'

export interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// ─── Vehicle ─────────────────────────────────────────────────
export interface Vehicle {
  id: string
  name: string
  plate: string
  make?: string
  model?: string
  year?: number
  lastKm: number
  lastSyncAt?: string
  isActive: boolean
  activeDtcCount?: number
}

// ─── Telemetry ───────────────────────────────────────────────
export interface TelemetryRecord {
  id: string
  vehicleId: string
  recordedAt: string
  receivedAt: string
  km: number
  engineRpm?: number
  coolantTempC?: number
  diagnosticActive: boolean   // true when a diagnostic session was running
  dtcs?: DTCEvent[]
}

// ─── DTC Events ──────────────────────────────────────────────
export type DTCSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN'

export interface DTCEvent {
  id: string
  vehicleId: string
  code: string
  description?: string
  severity: DTCSeverity
  firstSeenAt: string
  lastSeenAt: string
  resolvedAt?: string
  isActive: boolean
}

// ─── Tasks ───────────────────────────────────────────────────
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface Task {
  id: string
  vehicleId?: string
  vehicle?: Pick<Vehicle, 'id' | 'name' | 'plate'>
  createdBy: string
  assignedTo?: string
  assignee?: Pick<User, 'id' | 'fullName'>
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  diagnosticSessionId?: string  // linked diagnostic session if task originated from one
}

// ─── Maintenance ─────────────────────────────────────────────
export type MaintenanceType =
  | 'OIL_CHANGE'
  | 'TIRE_ROTATION'
  | 'BRAKE_SERVICE'
  | 'GENERAL_SERVICE'
  | 'OTHER'

export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED'

export interface MaintenanceSchedule {
  id: string
  vehicleId: string
  vehicle?: Pick<Vehicle, 'id' | 'name' | 'plate'>
  type: MaintenanceType
  title: string
  description?: string
  status: MaintenanceStatus
  scheduledDate: string
  scheduledKm?: number
  completedDate?: string
  createdAt: string
}

// ─── Diagnostic Sessions ──────────────────────────────────────
// A diagnostic session is started by a manager/employee while the vehicle
// engine is running. The ESP32 reads live OBD-II/CAN data and logs it.
// Findings (DTC codes + descriptions) are reviewed by the in-house mechanic
// to determine repair actions and cost — no external inspection required.

export type DiagnosticStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED'

export interface DiagnosticFinding {
  code: string          // OBD-II DTC code, e.g. "P0300"
  description: string   // human-readable description
  severity: DTCSeverity
}

export interface DiagnosticSession {
  id: string
  vehicleId: string
  vehicle?: Pick<Vehicle, 'id' | 'name' | 'plate'>
  startedBy: string                     // user id who created the session
  mechanicId?: string                   // assigned mechanic user id
  mechanicName?: string
  status: DiagnosticStatus
  startedAt?: string
  completedAt?: string
  findings: DiagnosticFinding[]
  repairCostEstimate?: number           // in TRY, filled by mechanic after review
  linkedTaskId?: string                 // repair task auto-created from this session
  driverComplaint?: string              // what the driver reported before session
  notes?: string                        // mechanic notes after session
  createdAt: string
}

// ─── Notifications ───────────────────────────────────────────
export type NotificationType =
  | 'DTC_DETECTED'
  | 'KM_THRESHOLD'
  | 'DIAGNOSTIC_STARTED'
  | 'DIAGNOSTIC_COMPLETED'
  | 'TASK_ASSIGNED'
  | 'MAINTENANCE_DUE'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  data?: Record<string, unknown>
  isRead: boolean
  sentAt: string
  readAt?: string
}

// ─── API Response ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: string[]
  }
  meta?: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}
