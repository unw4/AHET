// AH@ Mobile — Shared TypeScript Types
// Authors: MERT EGEMEN ÇAR · MEHMET ALİ KAYIK
// Re-exports and extends web types for React Native specifics

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
  TestSession,
  TestResult,
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
}

export type AppScreen =
  | 'Home'
  | 'VehicleDetail'
  | 'Notifications'
  | 'Maintenance'
  | 'Login'
