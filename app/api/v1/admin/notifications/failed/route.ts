import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/failed/route.ts
// GET : failed & dead-letter queue items
// POST: retry-all failed | purge dead letter

import { NextRequest, NextResponse }  from 'next/server'
import {
  listQueueItems,
  enqueueNotification,
} from '@/lib/notifications/queue/notification-queue'
import { getRecentFailures }          from '@/lib/services/notification-analytics-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const view = searchParams.get('view') ?? 'logs'

    if (view === 'queue') {
      const [failed, deadLetter] = await Promise.all([
        listQueueItems('FAILED',      50),
        listQueueItems('DEAD_LETTER', 50),
      ])
      return NextResponse.json({ failed, deadLetter })
    }

    const failures = await getRecentFailures(50)
    return NextResponse.json({ failures, total: failures.length })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const body   = await request.json() as Record<string, unknown>
    const action = body.action as string

    if (action === 'retry_all') {
      const failed = await listQueueItems('FAILED', 100)
      const retried: string[] = []
      for (const item of failed) {
        const newItem = await enqueueNotification({
          channel:             item.channel,
          recipientIdentifier: item.recipientIdentifier,
          templateKey:         item.templateKey,
          templateVars:        {},
          eventId:             item.eventId ?? undefined,
          priority:            item.priority,
          metadata:            { ...item.metadata, retryOf: item.id },
        })
        retried.push(newItem.id)
      }
      return NextResponse.json({ retried: retried.length, jobIds: retried })
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
