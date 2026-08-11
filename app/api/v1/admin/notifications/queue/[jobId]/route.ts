import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/queue/[jobId]/route.ts
// GET   : job detail
// PATCH : retry a failed job
// DELETE: cancel a pending job

import { NextRequest, NextResponse }  from 'next/server'
import {
  getQueueItemById,
  cancelNotificationJob,
  enqueueNotification,
} from '@/lib/notifications/queue/notification-queue'

export const dynamic = 'force-dynamic'
type Params = { params: Promise<{ jobId: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req as import('next/server').NextRequest)
    if (!auth.ok) return auth.response

    const { jobId } = await params
    const item = await getQueueItemById(jobId)
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ item })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req as import('next/server').NextRequest)
    if (!auth.ok) return auth.response

    const { jobId } = await params
    const original  = await getQueueItemById(jobId)
    if (!original) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Re-enqueue as a fresh job
    const retried = await enqueueNotification({
      channel:             original.channel,
      recipientIdentifier: original.recipientIdentifier,
      templateKey:         original.templateKey,
      templateVars:        {},
      eventId:             original.eventId ?? undefined,
      priority:            original.priority,
      metadata:            { ...original.metadata, retryOf: jobId },
    })

    return NextResponse.json({ retried })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireAdmin(req as import('next/server').NextRequest)
    if (!auth.ok) return auth.response

    const { jobId } = await params
    await cancelNotificationJob(jobId)
    return NextResponse.json({ cancelled: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
