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
  testActive: boolean
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
}

// ─── Maintenance ─────────────────────────────────────────────
export type MaintenanceType = 'OIL_CHANGE' | 'TIRE_ROTATION' | 'BRAKE_SERVICE' | 'GAS_TEST' | 'GENERAL_SERVICE' | 'OTHER'
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

// ─── Test Sessions ───────────────────────────────────────────
export type TestResult = 'PASS' | 'FAIL' | 'INCOMPLETE'

export interface TestSession {
  id: string
  vehicleId: string
  vehicle?: Pick<Vehicle, 'id' | 'name' | 'plate'>
  approvedBy: string
  startedAt?: string
  completedAt?: string
  result?: TestResult
  notes?: string
}

// ─── Notifications ───────────────────────────────────────────
export type NotificationType = 'DTC_DETECTED' | 'KM_THRESHOLD' | 'TEST_APPROVED' | 'TEST_RESULT' | 'TASK_ASSIGNED' | 'MAINTENANCE_DUE'

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
