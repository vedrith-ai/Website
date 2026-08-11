// =============================================================================
// VedRith Notification Platform Phase 1 — Email Provider Interface
// Abstract contract for all email provider implementations.
// =============================================================================

import type { SendMessagePayload, SendMessageResult } from '@/lib/notifications/channels/notification-channel'

export abstract class EmailProvider {
  abstract readonly providerKey: string
  abstract send(payload: SendMessagePayload): Promise<SendMessageResult>
  abstract healthCheck(): Promise<boolean>
}
