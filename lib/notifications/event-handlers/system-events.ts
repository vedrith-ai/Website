// =============================================================================
// VedRith Notification Platform Phase 1 — System Event Handlers
// Alert admins on system failures, provider errors, storage issues.
// =============================================================================

import { registerHandler }         from '@/lib/notifications/event-registry'
import { enqueueNotification }     from '@/lib/notifications/queue/notification-queue'
import type { EventHandlerResult } from '@/lib/notifications/event-registry'
import type { NotificationEvent, SystemAlertPayload } from '@/lib/types/notifications'

const ADMIN_EMAIL = () => process.env.VEDRITH_ADMIN_EMAIL ?? ''

// ── Generic system alert handler ─────────────────────────────────────────────

async function handleSystemAlert(event: NotificationEvent): Promise<EventHandlerResult> {
  const adminEmail = ADMIN_EMAIL()
  if (!adminEmail) {
    return { handler: 'handleSystemAlert', ok: true, message: 'No admin email configured' }
  }

  const payload = event.payload as unknown as SystemAlertPayload
  const subject = `[VedRith ${payload.alertLevel ?? 'ALERT'}] ${payload.component}: ${payload.alertMessage}`

  await enqueueNotification({
    channel:             'EMAIL',
    recipientIdentifier: adminEmail,
    templateKey:         'system_health_alert_inapp',  // text-only fallback for email
    templateVars: {
      alert_message: String(payload.alertMessage ?? ''),
      alert_level:   String(payload.alertLevel   ?? 'WARNING'),
      component:     String(payload.component    ?? 'system'),
    },
    eventId:  event.id,
    priority: payload.alertLevel === 'CRITICAL' ? 1 : 2,
    metadata: { subject },
  })

  return { handler: 'handleSystemAlert', ok: true }
}

// ── Provider failure ──────────────────────────────────────────────────────────

async function handleProviderFailure(event: NotificationEvent): Promise<EventHandlerResult> {
  const adminEmail = ADMIN_EMAIL()
  if (!adminEmail) return { handler: 'handleProviderFailure', ok: true, message: 'No admin email' }

  const payload = event.payload as { providerName?: string; errorMessage?: string }
  await enqueueNotification({
    channel:             'EMAIL',
    recipientIdentifier: adminEmail,
    templateKey:         'provider_failure_inapp',
    templateVars: {
      provider_name:  String(payload.providerName  ?? 'Unknown Provider'),
      error_message:  String(payload.errorMessage  ?? 'No details available'),
    },
    eventId:  event.id,
    priority: 1,
  })

  return { handler: 'handleProviderFailure', ok: true }
}

// ── Register handlers ─────────────────────────────────────────────────────────

export function registerSystemEventHandlers(): void {
  registerHandler('SYSTEM_HEALTH_ALERT', handleSystemAlert)
  registerHandler('STORAGE_ALERT',       handleSystemAlert)
  registerHandler('QUEUE_FAILURE',       handleSystemAlert)
  registerHandler('PROVIDER_FAILURE',    handleProviderFailure)
}
