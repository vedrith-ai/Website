// =============================================================================
// VedRith Notification Platform Phase 1 — Notification Service
// Unified facade for all modules to interact with the notification system.
// =============================================================================

// Re-export event publishing helpers
export {
  publishEvent,
  publishSystemAlert,
  publishSubmissionEvent,
  publishMediaEvent,
  publishImportEvent,
  getRecentEvents,
  getUnprocessedEvents,
} from '@/lib/notifications/event-engine'

// Re-export in-app notification helpers
export {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllRead,
  archiveNotification,
  dismissNotification,
} from '@/lib/notifications/channels/in-app-channel'

// Re-export queue helpers
export {
  enqueueNotification,
  getQueueStats,
  listQueueItems,
  cancelNotificationJob,
  moveToDeadLetter,
} from '@/lib/notifications/queue/notification-queue'

// Re-export processor
export {
  processNextNotificationJob,
  processBatch,
} from '@/lib/notifications/queue/queue-processor'

// Re-export channel helpers
export {
  checkAllChannelHealth,
  getSupportedChannels,
} from '@/lib/notifications/channels/channel-manager'

// ── Handler registration bootstrap ───────────────────────────────────────────
// Import this once at app startup (e.g., in layout.tsx server component or
// a dedicated startup module) to register all event handlers.

let _handlersRegistered = false

export function bootstrapNotificationHandlers(): void {
  if (_handlersRegistered) return
  _handlersRegistered = true

  // Handlers are registered lazily to avoid import cycles
  Promise.all([
    import('@/lib/notifications/event-handlers/content-events').then(m => m.registerContentEventHandlers()),
    import('@/lib/notifications/event-handlers/system-events').then(m => m.registerSystemEventHandlers()),
  ]).catch(err => console.error('[Notifications] Handler registration failed:', err))
}
