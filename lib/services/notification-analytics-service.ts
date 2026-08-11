// =============================================================================
// VedRith Notification Platform Phase 1 — Notification Analytics Service
// Aggregates delivery stats, channel health, and platform-wide analytics.
// =============================================================================

import { getSupabaseAdminClient }      from '@/lib/supabase/admin'
import { checkAllChannelHealth }       from '@/lib/notifications/channels/channel-manager'
import { getQueueStats }               from '@/lib/notifications/queue/notification-queue'
import { getUnreadCount }              from '@/lib/notifications/channels/in-app-channel'
import type {
  NotificationDeliveryStats,
  NotificationPlatformAnalytics,
  NotificationDeliveryLog,
  NotificationChannelType,
} from '@/lib/types/notifications'

// ── Delivery stats by template / channel ─────────────────────────────────────

export async function getDeliveryStats(): Promise<NotificationDeliveryStats[]> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin
    .from('notification_delivery_stats')
    .select('*')
    .order('total_attempts', { ascending: false })

  return (data ?? []).map(row => {
    const r = row as Record<string, unknown>
    return {
      channel:         r.channel          as NotificationChannelType,
      templateKey:     r.template_key     as string,
      totalAttempts:   Number(r.total_attempts),
      delivered:       Number(r.delivered),
      failed:          Number(r.failed),
      deadLetter:      Number(r.dead_letter),
      deliveryRatePct: Number(r.delivery_rate_pct),
      lastAttemptAt:   (r.last_attempt_at as string) ?? null,
    }
  })
}

// ── Recent failures ───────────────────────────────────────────────────────────

export async function getRecentFailures(limit = 20): Promise<NotificationDeliveryLog[]> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin
    .from('notification_delivery_logs')
    .select('*')
    .in('status', ['FAILED', 'DEAD_LETTER'])
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map(row => {
    const r = row as Record<string, unknown>
    return {
      id:                   r.id                    as string,
      queueId:              r.queue_id              as string,
      channel:              r.channel               as NotificationChannelType,
      recipientIdentifier:  r.recipient_identifier  as string,
      templateKey:          r.template_key          as string,
      status:               r.status                as NotificationDeliveryLog['status'],
      providerResponse:     (r.provider_response    as Record<string, unknown>) ?? null,
      errorMessage:         (r.error_message        as string) ?? null,
      attemptNumber:        Number(r.attempt_number),
      deliveredAt:          (r.delivered_at         as string) ?? null,
      createdAt:            r.created_at            as string,
    }
  })
}

// ── Platform-wide analytics ───────────────────────────────────────────────────

export async function getNotificationPlatformAnalytics(): Promise<NotificationPlatformAnalytics> {
  const [deliveryStats, queueStats, failures, , unreadCount] = await Promise.all([
    getDeliveryStats(),
    getQueueStats(),
    getRecentFailures(10),
    checkAllChannelHealth(),
    getUnreadCount('admin'),
  ])

  // Aggregate totals
  const totalSent      = deliveryStats.reduce((s, r) => s + r.totalAttempts, 0)
  const totalDelivered = deliveryStats.reduce((s, r) => s + r.delivered, 0)
  const totalFailed    = deliveryStats.reduce((s, r) => s + r.failed, 0)
  const deliveryRate   = totalSent > 0
    ? Math.round((totalDelivered / totalSent) * 100 * 10) / 10
    : 0

  // By channel aggregation
  const byChannel: NotificationPlatformAnalytics['byChannel'] = {} as NotificationPlatformAnalytics['byChannel']
  for (const stat of deliveryStats) {
    const ch = stat.channel
    if (!byChannel[ch]) byChannel[ch] = { sent: 0, delivered: 0, failed: 0 }
    byChannel[ch].sent      += stat.totalAttempts
    byChannel[ch].delivered += stat.delivered
    byChannel[ch].failed    += stat.failed
  }

  return {
    totalSent,
    totalDelivered,
    totalFailed,
    deliveryRatePct:  deliveryRate,
    byChannel,
    byTemplate:       deliveryStats,
    queueHealth:      queueStats,
    unreadCount,
    recentFailures:   failures,
  }
}

// ── Channel health (with DB update) ──────────────────────────────────────────

export async function refreshChannelHealth(): Promise<Record<string, boolean>> {
  const health = await checkAllChannelHealth()
  const admin  = getSupabaseAdminClient()

  for (const [channelType, ok] of Object.entries(health)) {
    await admin
      .from('notification_channels')
      .update({
        health_status:     ok ? 'UP' : 'DOWN',
        last_health_check: new Date().toISOString(),
      })
      .eq('channel_type', channelType)
  }

  return health
}

// ── Audit log query ───────────────────────────────────────────────────────────

export async function getAuditLogs(limit = 50): Promise<NotificationDeliveryLog[]> {
  const admin = getSupabaseAdminClient()
  const { data } = await admin
    .from('notification_delivery_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map(row => {
    const r = row as Record<string, unknown>
    return {
      id:                   r.id                    as string,
      queueId:              r.queue_id              as string,
      channel:              r.channel               as NotificationChannelType,
      recipientIdentifier:  r.recipient_identifier  as string,
      templateKey:          r.template_key          as string,
      status:               r.status                as NotificationDeliveryLog['status'],
      providerResponse:     (r.provider_response    as Record<string, unknown>) ?? null,
      errorMessage:         (r.error_message        as string) ?? null,
      attemptNumber:        Number(r.attempt_number),
      deliveredAt:          (r.delivered_at         as string) ?? null,
      createdAt:            r.created_at            as string,
    }
  })
}
