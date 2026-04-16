// AH@ Mobile — Shared TypeScript Types
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
// Re-exports web types for React Native

export type {
  UserRole,
  User,
  AuthTokens,
  Vehicle,
  TelemetryRecord,
  DTCEvent,
  DTCSeverity,
  Task,
  TaskStatus,
  TaskPriority,
  MaintenanceSchedule,
  MaintenanceType,
  MaintenanceStatus,
  DiagnosticSession,
  DiagnosticFinding,
  DiagnosticStatus,
  Notification,
  NotificationType,
  ApiResponse,
} from '../../web/src/types/index'

// ─── Mobile-specific types ────────────────────────────────────

export interface PushNotificationPayload {
  notificationId: string
  type: string
  vehicleId?: string
  taskId?: string
  maintenanceId?: string
  diagnosticSessionId?: string
}

export type AppScreen =
  | 'Home'
  | 'VehicleDetail'
  | 'Notifications'
  | 'Maintenance'
  | 'Login'
