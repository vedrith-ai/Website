// =============================================================================
// VedRith Notification Platform Phase 1 — Channel Manager
// Resolves the correct channel adapter for a given NotificationChannelType.
// New channels (SMS, Push, Webhook) register here without other changes.
// =============================================================================

import { InAppChannel }                    from './in-app-channel'
import { EmailChannel }                    from './email-channel'
import { NotificationChannelBase }         from './notification-channel'
import type { NotificationChannelType }    from '@/lib/types/notifications'

type ChannelFactory = () => NotificationChannelBase

const CHANNEL_REGISTRY: Record<string, ChannelFactory> = {
  IN_APP:   () => new InAppChannel(),
  EMAIL:    () => new EmailChannel(),
  // Phase 2 channels — registered here when implemented:
  // SMS:      () => new SmsChannel(),
  // WHATSAPP: () => new WhatsAppChannel(),
  // PUSH:     () => new PushChannel(),
  // WEBHOOK:  () => new WebhookChannel(),
  // BROWSER:  () => new BrowserChannel(),
}

export function resolveChannel(channelType: NotificationChannelType): NotificationChannelBase {
  const factory = CHANNEL_REGISTRY[channelType]
  if (!factory) {
    throw new Error(`Channel "${channelType}" is not yet implemented. Available: ${Object.keys(CHANNEL_REGISTRY).join(', ')}`)
  }
  return factory()
}

export function getSupportedChannels(): NotificationChannelType[] {
  return Object.keys(CHANNEL_REGISTRY) as NotificationChannelType[]
}

export async function checkAllChannelHealth(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}
  for (const [type, factory] of Object.entries(CHANNEL_REGISTRY)) {
    try {
      results[type] = await factory().healthCheck()
    } catch {
      results[type] = false
    }
  }
  return results
}
