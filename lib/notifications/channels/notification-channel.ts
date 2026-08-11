// =============================================================================
// VedRith Notification Platform Phase 1 — Notification Channel Interface
// Abstract contract all channel implementations must satisfy.
// Adding a new channel (SMS, WhatsApp, Push) requires only a new class.
// =============================================================================

export interface SendMessagePayload {
  recipientIdentifier:  string   // email | phone | user_id | webhook URL
  subject:              string | null
  body:                 string
  htmlBody:             string | null
  metadata?:            Record<string, unknown>
}

export interface SendMessageResult {
  ok:               boolean
  providerResponse: Record<string, unknown>
  errorMessage?:    string
  messageId?:       string
}

export abstract class NotificationChannelBase {
  abstract readonly channelKey:  string
  abstract readonly channelType: string

  /**
   * Send a single message. Returns result regardless of success/failure.
   * Never throws — callers rely on the result.ok flag.
   */
  abstract send(payload: SendMessagePayload): Promise<SendMessageResult>

  /**
   * Health check. Returns true if the channel is reachable.
   */
  abstract healthCheck(): Promise<boolean>
}
