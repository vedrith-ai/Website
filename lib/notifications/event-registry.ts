// =============================================================================
// VedRith Notification Platform Phase 1 — Event Registry
// Defines the handler signature and maps event types to their default
// channels and templates. Handlers register here — the engine dispatches here.
// =============================================================================

import type { NotificationEventType, NotificationEvent } from '@/lib/types/notifications'

// ── Handler contract ──────────────────────────────────────────────────────────

export interface EventHandlerResult {
  handler:  string
  ok:       boolean
  message?: string
  data?:    Record<string, unknown>
}

export type EventHandler = (event: NotificationEvent) => Promise<EventHandlerResult>

// ── Handler registry ──────────────────────────────────────────────────────────

const registry = new Map<NotificationEventType, EventHandler[]>()

export function registerHandler(
  eventType: NotificationEventType,
  handler:   EventHandler,
): void {
  const existing = registry.get(eventType) ?? []
  registry.set(eventType, [...existing, handler])
}

export function getHandlers(eventType: NotificationEventType): EventHandler[] {
  return registry.get(eventType) ?? []
}

export function getAllRegisteredTypes(): NotificationEventType[] {
  return Array.from(registry.keys())
}

// ── Default template mapping ──────────────────────────────────────────────────
// Maps event type → default in-app template key.
// These templates are seeded in migration 0043.

export const EVENT_DEFAULT_TEMPLATES: Partial<Record<NotificationEventType, string>> = {
  SUBMISSION_APPROVED:           'submission_approved_inapp',
  SUBMISSION_REJECTED:           'submission_rejected_inapp',
  EDITORIAL_REVIEW_REQUIRED:     'editorial_review_required_inapp',
  MEDIA_PROCESSING_COMPLETED:    'media_processing_completed_inapp',
  MEDIA_PROCESSING_FAILED:       'media_processing_completed_inapp',
  IMPORT_COMPLETED:              'import_completed_inapp',
  IMPORT_FAILED:                 'import_completed_inapp',
  SYSTEM_HEALTH_ALERT:           'system_health_alert_inapp',
  PROVIDER_FAILURE:              'provider_failure_inapp',
  STORAGE_ALERT:                 'system_health_alert_inapp',
  QUEUE_FAILURE:                 'system_health_alert_inapp',
}

// ── Source module labels ──────────────────────────────────────────────────────

export const SOURCE_MODULE_LABELS: Record<string, string> = {
  cms:             'CMS',
  media:           'Media Platform',
  knowledge:       'Knowledge Base',
  devotional:      'Devotional Library',
  import:          'Data Import',
  system:          'System',
  'temple-directory': 'Temple Directory',
}

export function resolveSourceLabel(sourceModule: string): string {
  return SOURCE_MODULE_LABELS[sourceModule] ?? sourceModule
}
