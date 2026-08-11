// =============================================================================
// VedRith Notification Platform Phase 1 — Console Email Provider (Dev)
// Logs email to console instead of sending. Used when VEDRITH_EMAIL_PROVIDER
// is absent or set to 'console'. Zero external dependencies.
// =============================================================================

import { EmailProvider }                  from './email-provider'
import type { SendMessagePayload, SendMessageResult } from '@/lib/notifications/channels/notification-channel'

export class ConsoleEmailProvider extends EmailProvider {
  readonly providerKey = 'console'

  async send(payload: SendMessagePayload): Promise<SendMessageResult> {

    console.log('[VedRith Email] CONSOLE PROVIDER (dev mode)')

    console.log(`  Subject: ${payload.subject ?? '(no subject)'}`)

    if (payload.htmlBody) console.log(`  HTML: (available — ${payload.htmlBody.length} chars)`)

    return { ok: true, providerResponse: { provider: 'console', logged: true } }
  }

  async healthCheck(): Promise<boolean> { return true }
}
