// =============================================================================
// VedRith Notification Platform Phase 1 — Event Engine
// Central publisher. Persists events, dispatches to registered handlers.
// All VedRith modules call publishEvent() — nothing else.
// =============================================================================

import { getSupabaseAdminClient }                        from '@/lib/supabase/admin'
import { getHandlers, EVENT_DEFAULT_TEMPLATES }          from './event-registry'
import type {
  NotificationEvent,
  PublishEventPayload,
  NotificationEventType,
} from '@/lib/types/notifications'

// ── DB row mapper ─────────────────────────────────────────────────────────────

function mapDbEvent(row: Record<string, unknown>): NotificationEvent {
  return {
    id:             row.id             as string,
    eventType:      row.event_type     as NotificationEventType,
    sourceModule:   row.source_module  as string,
    sourceId:       (row.source_id     as string) ?? null,
    actorId:        (row.actor_id      as string) ?? null,
    payload:        (row.payload       as Record<string, unknown>) ?? {},
    processed:      row.processed      as boolean,
    processedAt:    (row.processed_at  as string) ?? null,
    handlerResults: (row.handler_results as NotificationEvent['handlerResults']) ?? [],
    correlationId:  (row.correlation_id as string) ?? null,
    createdAt:      row.created_at     as string,
  }
}

// ── Core publish function ─────────────────────────────────────────────────────

/**
 * Publish an event to the VedRith event engine.
 * This is the single entry point for all notification-triggering actions.
 *
 * 1. Persists the event to notification_events.
 * 2. Dispatches to all registered handlers (in-app, email, etc.).
 * 3. Marks the event as processed with handler results.
 */
export async function publishEvent(
  payload: PublishEventPayload,
): Promise<NotificationEvent> {
  const admin = getSupabaseAdminClient()

  // 1. Persist the event
  const { data, error } = await admin
    .from('notification_events')
    .insert({
      event_type:    payload.eventType,
      source_module: payload.sourceModule,
      source_id:     payload.sourceId     ?? null,
      actor_id:      payload.actorId      ?? null,
      payload:       payload.payload,
      correlation_id: payload.correlationId ?? null,
    })
    .select()
    .single()

  if (error || !data) {
    throw new Error(`Failed to persist event: ${error?.message}`)
  }

  const event = mapDbEvent(data as Record<string, unknown>)

  // 2. Auto-dispatch in-app notification if a default template is bound
  const defaultTemplateKey = EVENT_DEFAULT_TEMPLATES[payload.eventType]
  if (defaultTemplateKey) {
    try {
      const { createInAppNotificationFromEvent } = await import('./channels/in-app-channel')
      await createInAppNotificationFromEvent(event, defaultTemplateKey)
    } catch (err) {
      console.error(`[EventEngine] In-app dispatch failed for ${payload.eventType}:`, err)
    }
  }

  // 3. Dispatch to registered handlers (email, webhooks, etc.)
  const handlers      = getHandlers(payload.eventType)
  const handlerResults: NotificationEvent['handlerResults'] = []

  for (const handler of handlers) {
    try {
      const result = await handler(event)
      handlerResults.push(result)
    } catch (err) {
      handlerResults.push({
        handler: handler.name || 'anonymous',
        ok:      false,
        message: (err as Error).message,
      })
    }
  }

  // 4. Mark processed
  await admin.rpc('mark_event_processed', {
    p_event_id:       event.id,
    p_handler_results: handlerResults,
  })

  return { ...event, processed: true, processedAt: new Date().toISOString(), handlerResults }
}

// ── Helper: publish a system alert ───────────────────────────────────────────

export async function publishSystemAlert(params: {
  message:    string
  level:      'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  component:  string
  details?:   Record<string, unknown>
  actorId?:   string
}): Promise<NotificationEvent> {
  return publishEvent({
    eventType:    'SYSTEM_HEALTH_ALERT',
    sourceModule: 'system',
    actorId:      params.actorId,
    payload: {
      alertMessage: params.message,
      alertLevel:   params.level,
      component:    params.component,
      details:      params.details ?? {},
    },
  })
}

// ── Helper: publish a submission event ───────────────────────────────────────

export async function publishSubmissionEvent(
  eventType: 'SUBMISSION_APPROVED' | 'SUBMISSION_REJECTED' | 'EDITORIAL_REVIEW_REQUIRED',
  params: {
    submissionId: string
    title:        string
    submitter?:   string
    reason?:      string
    actorId?:     string
    actionUrl?:   string
  },
): Promise<NotificationEvent> {
  return publishEvent({
    eventType,
    sourceModule: 'cms',
    sourceId:     params.submissionId,
    actorId:      params.actorId,
    payload: {
      submissionId: params.submissionId,
      title:        params.title,
      submitter:    params.submitter,
      reason:       params.reason,
      actionUrl:    params.actionUrl ?? `/admin/cms/submissions/${params.submissionId}`,
    },
  })
}

// ── Helper: publish a media event ─────────────────────────────────────────────

export async function publishMediaEvent(
  eventType: 'MEDIA_PROCESSING_COMPLETED' | 'MEDIA_PROCESSING_FAILED',
  params: {
    mediaId:       string
    filename:      string
    variantsCount?: number
    error?:        string
    actorId?:      string
  },
): Promise<NotificationEvent> {
  return publishEvent({
    eventType,
    sourceModule: 'media',
    sourceId:     params.mediaId,
    actorId:      params.actorId,
    payload: {
      mediaId:       params.mediaId,
      filename:      params.filename,
      variantsCount: params.variantsCount,
      error:         params.error,
    },
  })
}

// ── Helper: publish an import event ──────────────────────────────────────────

export async function publishImportEvent(
  eventType: 'IMPORT_COMPLETED' | 'IMPORT_FAILED',
  params: {
    source:        string
    recordCount:   number
    successCount?: number
    failureCount?: number
    error?:        string
    actorId?:      string
  },
): Promise<NotificationEvent> {
  return publishEvent({
    eventType,
    sourceModule: 'import',
    actorId:      params.actorId,
    payload: {
      source:        params.source,
      record_count:  params.recordCount,
      successCount:  params.successCount,
      failureCount:  params.failureCount,
      error:         params.error,
    },
  })
}

// ── Query helpers ─────────────────────────────────────────────────────────────

export async function getRecentEvents(limit = 20): Promise<NotificationEvent[]> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin
    .from('notification_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []).map(row => mapDbEvent(row as Record<string, unknown>))
}

export async function getUnprocessedEvents(limit = 50): Promise<NotificationEvent[]> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin
    .from('notification_events')
    .select('*')
    .eq('processed', false)
    .order('created_at', { ascending: true })
    .limit(limit)
  return (data ?? []).map(row => mapDbEvent(row as Record<string, unknown>))
}
