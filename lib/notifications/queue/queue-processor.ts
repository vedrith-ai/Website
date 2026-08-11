// =============================================================================
// VedRith Notification Platform Phase 1 — Queue Processor
// Claims and processes one notification job at a time.
// Called by cron, manual trigger, or Vercel Cron.
// =============================================================================

import { resolveChannel }             from '@/lib/notifications/channels/channel-manager'
import {
  claimNextNotificationJob,
  completeNotificationJob,
  failNotificationJob,
  moveToDeadLetter,
}                                     from './notification-queue'

export interface ProcessResult {
  processed:    boolean
  jobId?:       string
  channel?:     string
  templateKey?: string
  ok?:          boolean
  error?:       string
}

/**
 * Claim and process one pending notification job.
 * Returns `{ processed: false }` if the queue is empty.
 */
export async function processNextNotificationJob(): Promise<ProcessResult> {
  const job = await claimNextNotificationJob()
  if (!job) return { processed: false }

  let channelInstance: ReturnType<typeof resolveChannel>
  try {
    channelInstance = resolveChannel(job.channel)
  } catch (err) {
    await failNotificationJob(job.id, (err as Error).message, 'unknown')
    return {
      processed:  true,
      jobId:      job.id,
      channel:    job.channel,
      templateKey: job.templateKey,
      ok:         false,
      error:      (err as Error).message,
    }
  }

  const result = await channelInstance.send({
    recipientIdentifier: job.recipientIdentifier,
    subject:             job.resolvedSubject,
    body:                job.resolvedBody,
    htmlBody:            job.resolvedHtml,
    metadata: {
      ...job.metadata,
      eventId:     job.eventId,
      templateKey: job.templateKey,
    },
  })

  if (result.ok) {
    await completeNotificationJob(job.id, result.providerResponse, channelInstance.channelKey)
  } else {
    await failNotificationJob(
      job.id,
      result.errorMessage ?? 'Unknown send error',
      channelInstance.channelKey,
    )
  }

  return {
    processed:   true,
    jobId:       job.id,
    channel:     job.channel,
    templateKey: job.templateKey,
    ok:          result.ok,
    error:       result.errorMessage,
  }
}

/**
 * Process up to `batchSize` jobs in one call.
 * Returns after batch is complete or queue is empty.
 */
export async function processBatch(batchSize = 10): Promise<ProcessResult[]> {
  const results: ProcessResult[] = []
  for (let i = 0; i < batchSize; i++) {
    const result = await processNextNotificationJob()
    if (!result.processed) break
    results.push(result)
  }
  // Move any permanently failed jobs to dead letter queue
  await moveToDeadLetter().catch(() => {})
  return results
}
