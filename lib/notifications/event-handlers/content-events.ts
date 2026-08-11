// =============================================================================
// VedRith Notification Platform Phase 1 — Content & Editorial Event Handlers
// Registered handlers for CMS/editorial events.
// These wire the event engine to the email channel for admin notifications.
// =============================================================================

import { registerHandler }             from '@/lib/notifications/event-registry'
import { enqueueNotification }         from '@/lib/notifications/queue/notification-queue'
import type { EventHandlerResult }     from '@/lib/notifications/event-registry'
import type { NotificationEvent, SubmissionEventPayload } from '@/lib/types/notifications'

// ── Submission approved — send email to submitter ─────────────────────────────

async function handleSubmissionApproved(event: NotificationEvent): Promise<EventHandlerResult> {
  const payload = event.payload as unknown as SubmissionEventPayload

  // Only send email if submitter email is known
  const submitterEmail = (payload as unknown as Record<string, unknown>).submitter_email as string | undefined
  if (!submitterEmail) {
    return { handler: 'handleSubmissionApproved', ok: true, message: 'No submitter email — skipped' }
  }

  await enqueueNotification({
    channel:             'EMAIL',
    recipientIdentifier: submitterEmail,
    templateKey:         'submission_approved_email',
    templateVars: {
      title:         String(payload.title ?? ''),
      submitter_name: String(payload.submitter ?? 'Contributor'),
      action_url:    String(payload.actionUrl ?? 'https://vedrith.com'),
    },
    eventId:  event.id,
    priority: 3,
  })

  return { handler: 'handleSubmissionApproved', ok: true }
}

// ── Editorial review required — notify admin team ────────────────────────────

async function handleEditorialReviewRequired(event: NotificationEvent): Promise<EventHandlerResult> {
  const adminEmail = process.env.VEDRITH_ADMIN_EMAIL
  if (!adminEmail) {
    return { handler: 'handleEditorialReviewRequired', ok: true, message: 'No admin email — skipped' }
  }

  const payload = event.payload as unknown as SubmissionEventPayload

  await enqueueNotification({
    channel:             'EMAIL',
    recipientIdentifier: adminEmail,
    templateKey:         'submission_approved_email',  // repurposed with override vars
    templateVars: {
      title:         `Editorial Review Needed: ${String(payload.title ?? '')}`,
      submitter_name: 'Editorial Team',
      action_url:    String(payload.actionUrl ?? '/admin/cms/submissions'),
    },
    eventId:  event.id,
    priority: 2,
  })

  return { handler: 'handleEditorialReviewRequired', ok: true }
}

// ── Register all handlers ─────────────────────────────────────────────────────

export function registerContentEventHandlers(): void {
  registerHandler('SUBMISSION_APPROVED',       handleSubmissionApproved)
  registerHandler('EDITORIAL_REVIEW_REQUIRED', handleEditorialReviewRequired)
}
