// =============================================================================
// VedRith Notification Platform Phase 1 — Resend Email Provider (Production)
// Uses the Resend API for transactional email delivery.
// Set VEDRITH_EMAIL_PROVIDER=resend and RESEND_API_KEY in environment.
// Resend is the recommended provider — simple API, great deliverability.
// =============================================================================

import { EmailProvider }                   from './email-provider'
import type { SendMessagePayload, SendMessageResult } from '@/lib/notifications/channels/notification-channel'

const RESEND_API_URL = 'https://api.resend.com/emails'

export class ResendEmailProvider extends EmailProvider {
  readonly providerKey = 'resend'

  private get apiKey(): string {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not configured')
    return key
  }

  private get fromAddress(): string {
    return process.env.VEDRITH_EMAIL_FROM ?? 'VedRith <noreply@vedrith.com>'
  }

  async send(payload: SendMessagePayload): Promise<SendMessageResult> {
    try {
      const body: Record<string, unknown> = {
        from:    this.fromAddress,
        to:      [payload.recipientIdentifier],
        subject: payload.subject ?? 'VedRith Notification',
        text:    payload.body,
      }
      if (payload.htmlBody) body.html = payload.htmlBody

      const res = await fetch(RESEND_API_URL, {
        method:  'POST',
        headers: {
          Authorization:  `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await res.json() as Record<string, unknown>

      if (!res.ok) {
        return {
          ok:               false,
          providerResponse: data,
          errorMessage:     `Resend API error ${res.status}: ${(data.message as string) ?? 'Unknown'}`,
        }
      }

      return {
        ok:               true,
        providerResponse: data,
        messageId:        data.id as string | undefined,
      }
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
      // Verify the API key by hitting the domains endpoint
      const res = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      })
      return res.status === 200 || res.status === 404 // 404 = no domains, but key is valid
    } catch {
      return false
    }
  }
}
