// =============================================================================
// VedRith Notification Platform Phase 1 — In-App Channel
// Writes notification records to the notifications table.
// Resolves templates before persisting.
// =============================================================================

import { getSupabaseAdminClient }              from '@/lib/supabase/admin'
import { NotificationChannelBase }             from './notification-channel'
import { renderTemplate }                      from '@/lib/notifications/email/email-renderer'
import type { SendMessagePayload, SendMessageResult } from './notification-channel'
import type { NotificationEvent, Notification, NotificationFilters } from '@/lib/types/notifications'

export class InAppChannel extends NotificationChannelBase {
  readonly channelKey  = 'in-app-primary'
  readonly channelType = 'IN_APP'

  async send(payload: SendMessagePayload): Promise<SendMessageResult> {
    try {
      const admin = getSupabaseAdminClient()
      const { error } = await admin.from('notifications').insert({
        recipient_id: payload.recipientIdentifier,
        title:        payload.subject ?? payload.body.slice(0, 80),
        body:         payload.body,
        icon:         (payload.metadata?.icon as string) ?? null,
        category:     (payload.metadata?.category as string) ?? 'system',
        priority:     (payload.metadata?.priority as string) ?? 'NORMAL',
        action_url:   (payload.metadata?.actionUrl as string) ?? null,
        group_key:    (payload.metadata?.groupKey as string) ?? null,
        event_id:     (payload.metadata?.eventId as string) ?? null,
        template_key: (payload.metadata?.templateKey as string) ?? null,
        metadata:     payload.metadata ?? {},
      })
      if (error) throw error
      return { ok: true, providerResponse: {} }
    } catch (err) {
      return { ok: false, providerResponse: {}, errorMessage: (err as Error).message }
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const admin = getSupabaseAdminClient()
      await admin.from('notifications').select('id').limit(1)
      return true
    } catch { return false }
  }
}

// ── Convenience: create in-app notification from an event ─────────────────────

export async function createInAppNotificationFromEvent(
  event: NotificationEvent,
  templateKey: string,
): Promise<void> {
  const admin = getSupabaseAdminClient()

  // Fetch the template
  const { data: tmpl } = await admin
    .from('notification_templates')
    .select('*')
    .eq('template_key', templateKey)
    .eq('is_active', true)
    .single()

  if (!tmpl) {
    console.warn(`[InAppChannel] Template not found: ${templateKey}`)
    return
  }

  const t = tmpl as Record<string, unknown>

  // Render template body with event payload as vars
  const vars = flattenPayload(event.payload)
  const body      = renderTemplate(t.text_body as string, vars)
  const title     = renderTemplate((t.subject as string) ?? body.slice(0, 80), vars)
  const actionUrl = t.action_url_template
    ? renderTemplate(t.action_url_template as string, vars)
    : null

  await admin.from('notifications').insert({
    recipient_id: 'admin',
    title,
    body,
    icon:         t.icon ?? null,
    category:     t.category ?? 'system',
    priority:     'NORMAL',
    action_url:   actionUrl,
    event_id:     event.id,
    template_key: templateKey,
    metadata:     { sourceModule: event.sourceModule, sourceId: event.sourceId },
  })
}

// ── Notification CRUD helpers (used by service layer) ────────────────────────

function mapDbNotification(row: Record<string, unknown>): Notification {
  return {
    id:          row.id          as string,
    recipientId: row.recipient_id as string,
    title:       row.title       as string,
    body:        row.body        as string,
    icon:        (row.icon       as string) ?? null,
    category:    row.category    as string,
    priority:    row.priority    as Notification['priority'],
    actionUrl:   (row.action_url as string) ?? null,
    isRead:      row.is_read     as boolean,
    readAt:      (row.read_at    as string) ?? null,
    isArchived:  row.is_archived  as boolean,
    archivedAt:  (row.archived_at as string) ?? null,
    isDismissed: row.is_dismissed as boolean,
    dismissedAt: (row.dismissed_at as string) ?? null,
    groupKey:    (row.group_key  as string) ?? null,
    metadata:    (row.metadata   as Record<string, unknown>) ?? {},
    eventId:     (row.event_id   as string) ?? null,
    templateKey: (row.template_key as string) ?? null,
    createdAt:   row.created_at  as string,
  }
}

export async function getNotifications(
  recipientId: string,
  filters:     NotificationFilters = {},
): Promise<{ notifications: Notification[]; total: number }> {
  const admin = getSupabaseAdminClient()
  const page  = filters.page  ?? 1
  const limit = Math.min(filters.limit ?? 20, 100)
  const from  = (page - 1) * limit

  let query = admin
    .from('notifications')
    .select('*')
    .eq('recipient_id', recipientId)
    .eq('is_archived', false)
    .eq('is_dismissed', false)
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1)

  if (filters.isRead !== undefined) query = query.eq('is_read', filters.isRead)
  if (filters.category)             query = query.eq('category', filters.category)
  if (filters.priority)             query = query.eq('priority', filters.priority)
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,body.ilike.%${filters.search}%`)
  }

  const { data } = await query
  return {
    notifications: (data ?? []).map(row => mapDbNotification(row as Record<string, unknown>)),
    total:         (data ?? []).length,
  }
}

export async function markNotificationRead(id: string, recipientId: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  await admin.from('notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('recipient_id', recipientId)
}

export async function markAllRead(recipientId: string): Promise<number> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin.rpc('mark_all_notifications_read', { p_recipient_id: recipientId })
  return (data as number) ?? 0
}

export async function archiveNotification(id: string, recipientId: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  await admin.from('notifications')
    .update({ is_archived: true, archived_at: new Date().toISOString() })
    .eq('id', id)
    .eq('recipient_id', recipientId)
}

export async function dismissNotification(id: string, recipientId: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  await admin.from('notifications')
    .update({ is_dismissed: true, dismissed_at: new Date().toISOString() })
    .eq('id', id)
    .eq('recipient_id', recipientId)
}

export async function getUnreadCount(recipientId: string): Promise<number> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin.rpc('get_unread_notification_count', { p_recipient_id: recipientId })
  return (data as number) ?? 0
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function flattenPayload(payload: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [k, v] of Object.entries(payload)) {
    result[k] = v != null ? String(v) : ''
    // Also expose common aliases
    if (k === 'submission_id') result['submission_id'] = String(v)
    if (k === 'submissionId') result['submission_id'] = String(v)
    if (k === 'media_id')     result['media_id'] = String(v)
    if (k === 'mediaId')      result['media_id'] = String(v)
  }
  return result
}
