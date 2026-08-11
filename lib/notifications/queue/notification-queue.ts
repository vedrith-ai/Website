// =============================================================================
// VedRith Notification Platform Phase 1 — Notification Queue
// Background queue for all outbound channel messages.
// Atomic claiming via claim_next_notification_job() RPC.
// =============================================================================

import { getSupabaseAdminClient }     from '@/lib/supabase/admin'
import { renderEmailTemplate }        from '@/lib/notifications/email/email-renderer'
import type {
  NotificationQueueItem,
  EnqueueNotificationPayload,
  NotificationQueueStats,
  NotificationQueueStatus,
  NotificationChannelType,
} from '@/lib/types/notifications'

// ── DB row mapper ─────────────────────────────────────────────────────────────

function mapDbItem(row: Record<string, unknown>): NotificationQueueItem {
  return {
    id:                   row.id                    as string,
    channel:              row.channel               as NotificationChannelType,
    recipientIdentifier:  row.recipient_identifier  as string,
    templateKey:          row.template_key          as string,
    resolvedSubject:      (row.resolved_subject     as string) ?? null,
    resolvedBody:         row.resolved_body         as string,
    resolvedHtml:         (row.resolved_html        as string) ?? null,
    status:               row.status                as NotificationQueueStatus,
    priority:             row.priority              as number,
    attempts:             row.attempts              as number,
    maxAttempts:          row.max_attempts          as number,
    scheduledAt:          row.scheduled_at          as string,
    nextAttemptAt:        row.next_attempt_at       as string,
    sentAt:               (row.sent_at              as string) ?? null,
    providerResponse:     (row.provider_response    as Record<string, unknown>) ?? null,
    errorMessage:         (row.error_message        as string) ?? null,
    eventId:              (row.event_id             as string) ?? null,
    metadata:             (row.metadata             as Record<string, unknown>) ?? {},
    rateLimitGroup:       (row.rate_limit_group     as string) ?? null,
    createdAt:            row.created_at            as string,
    updatedAt:            row.updated_at            as string,
  }
}

// ── Enqueue ───────────────────────────────────────────────────────────────────

export async function enqueueNotification(
  payload: EnqueueNotificationPayload,
): Promise<NotificationQueueItem> {
  const admin = getSupabaseAdminClient()

  // Fetch and render the template
  const { data: tmpl } = await admin
    .from('notification_templates')
    .select('*')
    .eq('template_key', payload.templateKey)
    .eq('is_active', true)
    .single()

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vedrith.com'
  let resolvedSubject: string | null = null
  let resolvedBody:    string        = payload.templateVars.body ?? ''
  let resolvedHtml:    string | null = null

  if (tmpl) {
    const t = tmpl as Record<string, unknown>
    const rendered = renderEmailTemplate(
      {
        subject:              t.subject as string | null,
        text_body:            t.text_body as string,
        html_body:            t.html_body as string | null,
        action_url_template:  t.action_url_template as string | null,
      },
      payload.templateVars,
      baseUrl,
    )
    resolvedSubject = rendered.subject
    resolvedBody    = rendered.textBody
    resolvedHtml    = rendered.htmlBody
  }

  const scheduledAt = payload.scheduledAt ?? new Date().toISOString()
  const rateLimitGroup = `${payload.channel.toLowerCase()}:${payload.recipientIdentifier}`

  const { data, error } = await admin
    .from('notification_queue')
    .insert({
      channel:               payload.channel,
      recipient_identifier:  payload.recipientIdentifier,
      template_key:          payload.templateKey,
      resolved_subject:      resolvedSubject,
      resolved_body:         resolvedBody,
      resolved_html:         resolvedHtml,
      priority:              payload.priority  ?? 5,
      scheduled_at:          scheduledAt,
      next_attempt_at:       scheduledAt,
      event_id:              payload.eventId   ?? null,
      metadata:              payload.metadata  ?? {},
      rate_limit_group:      rateLimitGroup,
      status:                payload.scheduledAt ? 'SCHEDULED' : 'PENDING',
    })
    .select()
    .single()

  if (error || !data) throw new Error(`Failed to enqueue: ${error?.message}`)
  return mapDbItem(data as Record<string, unknown>)
}

// ── Claim next job (atomic) ───────────────────────────────────────────────────

export async function claimNextNotificationJob(): Promise<NotificationQueueItem | null> {
  const admin = getSupabaseAdminClient()
  const { data, error } = await admin.rpc('claim_next_notification_job')
  if (error) throw new Error(`Claim failed: ${String(error)}`)
  if (!data) return null
  return mapDbItem(data as Record<string, unknown>)
}

// ── Complete a job ────────────────────────────────────────────────────────────

export async function completeNotificationJob(
  jobId:            string,
  providerResponse: Record<string, unknown>,
  channelKey:       string,
): Promise<void> {
  const admin = getSupabaseAdminClient()
  const now   = new Date().toISOString()

  await admin.from('notification_queue').update({
    status:            'DELIVERED',
    sent_at:           now,
    provider_response: providerResponse,
    error_message:     null,
  }).eq('id', jobId)

  // Write to immutable delivery log
  const job = await getQueueItem(jobId)
  if (job) {
    await admin.from('notification_delivery_logs').insert({
      queue_id:             jobId,
      channel:              job.channel,
      recipient_identifier: job.recipientIdentifier,
      template_key:         job.templateKey,
      status:               'DELIVERED',
      provider_response:    providerResponse,
      attempt_number:       job.attempts,
      delivered_at:         now,
    })
  }

  // Increment channel stats
  await admin.rpc('increment_channel_stats', { p_channel_key: channelKey, p_success: true })
}

// ── Fail a job (with backoff) ─────────────────────────────────────────────────

export async function failNotificationJob(
  jobId:        string,
  errorMessage: string,
  channelKey:   string,
): Promise<void> {
  const admin = getSupabaseAdminClient()
  const job   = await getQueueItem(jobId)
  if (!job) return

  const isFinal    = job.attempts >= job.maxAttempts
  const backoffMs  = Math.min(1000 * Math.pow(2, job.attempts), 60_000)

  await admin.from('notification_queue').update({
    status:         isFinal ? 'FAILED' : 'PENDING',
    error_message:  errorMessage,
    next_attempt_at: isFinal
      ? null
      : new Date(Date.now() + backoffMs).toISOString(),
  }).eq('id', jobId)

  // Log the failure
  await admin.from('notification_delivery_logs').insert({
    queue_id:             jobId,
    channel:              job.channel,
    recipient_identifier: job.recipientIdentifier,
    template_key:         job.templateKey,
    status:               'FAILED',
    error_message:        errorMessage,
    attempt_number:       job.attempts,
  })

  await admin.rpc('increment_channel_stats', { p_channel_key: channelKey, p_success: false })
}

// ── Cancel a job ──────────────────────────────────────────────────────────────

export async function cancelNotificationJob(jobId: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  await admin.from('notification_queue')
    .update({ status: 'CANCELLED' })
    .eq('id', jobId)
    .in('status', ['PENDING', 'SCHEDULED'])
}

// ── Queue stats ───────────────────────────────────────────────────────────────

export async function getQueueStats(): Promise<NotificationQueueStats> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin.rpc('get_notification_queue_stats')

  const byStatus:  Record<string, number> = {}
  const byChannel: Record<string, number> = {}

  for (const row of (data ?? []) as Array<{ status: string; channel: string; count: number }>) {
    byStatus[row.status]   = (byStatus[row.status]   ?? 0) + Number(row.count)
    byChannel[row.channel] = (byChannel[row.channel] ?? 0) + Number(row.count)
  }

  return {
    byStatus:   byStatus  as NotificationQueueStats['byStatus'],
    byChannel:  byChannel as NotificationQueueStats['byChannel'],
    deadLetter: byStatus['DEAD_LETTER'] ?? 0,
    pending:    byStatus['PENDING']     ?? 0,
  }
}

// ── List queue items ──────────────────────────────────────────────────────────

export async function listQueueItems(
  status?: NotificationQueueStatus,
  limit = 20,
): Promise<NotificationQueueItem[]> {
  const admin = getSupabaseAdminClient()
  let query = admin
    .from('notification_queue')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (status) query = query.eq('status', status)

  const { data } = await query
  return (data ?? []).map(row => mapDbItem(row as Record<string, unknown>))
}

// ── Get a single item ─────────────────────────────────────────────────────────

async function getQueueItem(id: string): Promise<NotificationQueueItem | null> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin.from('notification_queue').select('*').eq('id', id).single()
  return data ? mapDbItem(data as Record<string, unknown>) : null
}

export async function getQueueItemById(id: string): Promise<NotificationQueueItem | null> {
  return getQueueItem(id)
}

// ── Move to dead letter ───────────────────────────────────────────────────────

export async function moveToDeadLetter(): Promise<number> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin.rpc('move_to_dead_letter')
  return (data as number) ?? 0
}
