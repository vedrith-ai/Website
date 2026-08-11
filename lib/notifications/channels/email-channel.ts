// =============================================================================
// VedRith Notification Platform Phase 1 — Email Channel
// Routes outbound email through the active email provider.
// Provider is resolved from VEDRITH_EMAIL_PROVIDER env var.
// =============================================================================

import { NotificationChannelBase }                   from './notification-channel'
import type { SendMessagePayload, SendMessageResult } from './notification-channel'

export class EmailChannel extends NotificationChannelBase {
  readonly channelKey  = 'email-primary'
  readonly channelType = 'EMAIL'

  private async getProvider() {
    const provider = process.env.VEDRITH_EMAIL_PROVIDER ?? 'console'
    if (provider === 'resend') {
      const { ResendEmailProvider } = await import('@/lib/notifications/email/providers/resend-provider')
      return new ResendEmailProvider()
    }
    const { ConsoleEmailProvider } = await import('@/lib/notifications/email/providers/console-provider')
    return new ConsoleEmailProvider()
  }

  async send(payload: SendMessagePayload): Promise<SendMessageResult> {
    try {
      const provider = await this.getProvider()
      return await provider.send(payload)
    } catch (err) {
      return {
        ok:               false,
        providerResponse: {},
        errorMessage:     (err as Error).message,
      }
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const provider = await this.getProvider()
      return await provider.healthCheck()
    } catch {
      return false
    }
  }
}
