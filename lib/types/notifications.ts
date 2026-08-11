// =============================================================================
// VedRith Notification Platform Phase 1 — Types
// All TypeScript types for the notification and communication layer.
// =============================================================================

// ── Event engine ──────────────────────────────────────────────────────────────

export type NotificationEventType =
  // Content lifecycle
  | 'CONTENT_PUBLISHED' | 'CONTENT_UPDATED' | 'CONTENT_ARCHIVED'
  // Editorial
  | 'EDITORIAL_REVIEW_REQUIRED' | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REJECTED' | 'TRANSLATION_REQUIRED'
  // Import / processing
  | 'IMPORT_COMPLETED' | 'IMPORT_FAILED'
  | 'MEDIA_PROCESSING_COMPLETED' | 'MEDIA_PROCESSING_FAILED'
  // System
  | 'SYSTEM_HEALTH_ALERT' | 'PROVIDER_FAILURE'
  | 'STORAGE_ALERT' | 'QUEUE_FAILURE' | 'BACKUP_COMPLETED'
  // Future domains
  | 'PANCHANGA_ALERT' | 'KUNDALI_ALERT' | 'USER_EVENT' | 'CUSTOM'

export interface NotificationEvent {
  id:             string
  eventType:      NotificationEventType
  sourceModule:   string
  sourceId:       string | null
  actorId:        string | null
  payload:        Record<string, unknown>
  processed:      boolean
  processedAt:    string | null
  handlerResults: Array<{ handler: string; ok: boolean; message?: string }>
  correlationId:  string | null
  createdAt:      string
}

export interface PublishEventPayload {
  eventType:    NotificationEventType
  sourceModule: string
  sourceId?:    string
  actorId?:     string
  payload:      Record<string, unknown>
  correlationId?: string
}

// ── Channels ──────────────────────────────────────────────────────────────────

export type NotificationChannelType =
  | 'IN_APP' | 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'WEBHOOK' | 'BROWSER'

export type ChannelHealthStatus = 'UP' | 'DEGRADED' | 'DOWN' | 'UNKNOWN'

export interface NotificationChannel {
  id:                 string
  channelKey:         string
  label:              string
  channelType:        NotificationChannelType
  config:             Record<string, unknown>
  isActive:           boolean
  isDefault:          boolean
  healthStatus:       ChannelHealthStatus
  lastHealthCheck:    string | null
  messagesSent:       number
  messagesFailed:     number
  lastUsedAt:         string | null
  rateLimitPerHour:   number | null
  sortOrder:          number
  createdAt:          string
  updatedAt:          string
}

// ── Templates ─────────────────────────────────────────────────────────────────

export interface TemplateVariable {
  name:        string
  description: string
  required:    boolean
}

export interface NotificationTemplate {
  id:                 string
  templateKey:        string
  name:               string
  description:        string | null
  channel:            NotificationChannelType
  subject:            string | null
  htmlBody:           string | null
  textBody:           string
  icon:               string | null
  category:           string | null
  actionUrlTemplate:  string | null
  variables:          TemplateVariable[]
  examplePayload:     Record<string, unknown>
  isActive:           boolean
  version:            number
  eventType:          NotificationEventType | null
  autoSend:           boolean
  createdBy:          string | null
  createdAt:          string
  updatedAt:          string
}

export interface TemplateRenderResult {
  subject:   string | null
  body:      string
  htmlBody:  string | null
  actionUrl: string | null
}

// ── In-app notifications ──────────────────────────────────────────────────────

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

export interface Notification {
  id:          string
  recipientId: string
  title:       string
  body:        string
  icon:        string | null
  category:    string
  priority:    NotificationPriority
  actionUrl:   string | null
  isRead:      boolean
  readAt:      string | null
  isArchived:  boolean
  archivedAt:  string | null
  isDismissed: boolean
  dismissedAt: string | null
  groupKey:    string | null
  metadata:    Record<string, unknown>
  eventId:     string | null
  templateKey: string | null
  createdAt:   string
}

export interface CreateNotificationPayload {
  recipientId:  string
  title:        string
  body:         string
  icon?:        string
  category?:    string
  priority?:    NotificationPriority
  actionUrl?:   string
  groupKey?:    string
  metadata?:    Record<string, unknown>
  eventId?:     string
  templateKey?: string
}

export interface NotificationFilters {
  isRead?:    boolean
  category?:  string
  priority?:  NotificationPriority
  search?:    string
  page?:      number
  limit?:     number
}

// ── Queue ─────────────────────────────────────────────────────────────────────

export type NotificationQueueStatus =
  | 'PENDING' | 'SENDING' | 'DELIVERED' | 'FAILED'
  | 'CANCELLED' | 'SCHEDULED' | 'DEAD_LETTER'

export interface NotificationQueueItem {
  id:                   string
  channel:              NotificationChannelType
  recipientIdentifier:  string
  templateKey:          string
  resolvedSubject:      string | null
  resolvedBody:         string
  resolvedHtml:         string | null
  status:               NotificationQueueStatus
  priority:             number
  attempts:             number
  maxAttempts:          number
  scheduledAt:          string
  nextAttemptAt:        string
  sentAt:               string | null
  providerResponse:     Record<string, unknown> | null
  errorMessage:         string | null
  eventId:              string | null
  metadata:             Record<string, unknown>
  rateLimitGroup:       string | null
  createdAt:            string
  updatedAt:            string
}

export interface EnqueueNotificationPayload {
  channel:              NotificationChannelType
  recipientIdentifier:  string
  templateKey:          string
  templateVars:         Record<string, string>
  eventId?:             string
  priority?:            number
  scheduledAt?:         string
  metadata?:            Record<string, unknown>
}

export interface NotificationQueueStats {
  byStatus:   Record<NotificationQueueStatus, number>
  byChannel:  Record<NotificationChannelType, number>
  deadLetter: number
  pending:    number
}

// ── Delivery logs ─────────────────────────────────────────────────────────────

export interface NotificationDeliveryLog {
  id:                   string
  queueId:              string
  channel:              NotificationChannelType
  recipientIdentifier:  string
  templateKey:          string
  status:               NotificationQueueStatus
  providerResponse:     Record<string, unknown> | null
  errorMessage:         string | null
  attemptNumber:        number
  deliveredAt:          string | null
  createdAt:            string
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface NotificationDeliveryStats {
  channel:          NotificationChannelType
  templateKey:      string
  totalAttempts:    number
  delivered:        number
  failed:           number
  deadLetter:       number
  deliveryRatePct:  number
  lastAttemptAt:    string | null
}

export interface NotificationPlatformAnalytics {
  totalSent:          number
  totalDelivered:     number
  totalFailed:        number
  deliveryRatePct:    number
  byChannel:          Record<NotificationChannelType, { sent: number; delivered: number; failed: number }>
  byTemplate:         NotificationDeliveryStats[]
  queueHealth:        NotificationQueueStats
  unreadCount:        number
  recentFailures:     NotificationDeliveryLog[]
}

// ── User preferences ──────────────────────────────────────────────────────────

export interface NotificationUserPreferences {
  id:                   string
  userId:               string
  channelPreferences:   Partial<Record<NotificationChannelType, boolean>>
  language:             string
  digestMode:           boolean
  digestFrequency:      'daily' | 'weekly'
  quietHoursEnabled:    boolean
  quietHoursStart:      string | null
  quietHoursEnd:        string | null
  categoryPreferences:  Record<string, boolean>
  createdAt:            string
  updatedAt:            string
}

// ── System alert payload helpers ──────────────────────────────────────────────

export type AlertLevel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'

export interface SystemAlertPayload {
  alertMessage:  string
  alertLevel:    AlertLevel
  component:     string        // 'media-processing' | 'import' | 'provider' | ...
  details?:      Record<string, unknown>
}

export interface SubmissionEventPayload {
  submissionId:  string
  title:         string
  submitter?:    string
  reason?:       string
  actionUrl?:    string
}

export interface MediaEventPayload {
  mediaId:       string
  filename:      string
  variantsCount?: number
  error?:        string
}

export interface ImportEventPayload {
  source:        string
  recordCount:   number
  successCount?: number
  failureCount?: number
  error?:        string
}
