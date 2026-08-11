import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/queue/route.ts
// GET : queue stats + list items
// POST: run next job | batch process | enqueue manual message

import { NextRequest, NextResponse }  from 'next/server'
import {
  getQueueStats,
  listQueueItems,
  enqueueNotification,
  moveToDeadLetter,
} from '@/lib/notifications/queue/notification-queue'
import {
  processNextNotificationJob,
  processBatch,
} from '@/lib/notifications/queue/queue-processor'
import type { NotificationQueueStatus, EnqueueNotificationPayload } from '@/lib/types/notifications'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const view   = searchParams.get('view') ?? 'stats'
    const status = searchParams.get('status') as NotificationQueueStatus | null
    const limit  = parseInt(searchParams.get('limit') ?? '20')

    if (view === 'items') {
      const items = await listQueueItems(status ?? undefined, limit)
      return NextResponse.json({ items })
    }

    const [stats, recent] = await Promise.all([
      getQueueStats(),
      listQueueItems(undefined, 10),
    ])
    return NextResponse.json({ stats, recentItems: recent })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const body   = await request.json() as Record<string, unknown>
    const action = body.action as string | undefined

    if (action === 'run_next') {
      const result = await processNextNotificationJob()
      return NextResponse.json(result)
    }

    if (action === 'process_batch') {
      const size    = Math.min((body.batchSize as number) ?? 10, 50)
      const results = await processBatch(size)
      return NextResponse.json({ processed: results.length, results })
    }

    if (action === 'move_dead_letter') {
      const count = await moveToDeadLetter()
      return NextResponse.json({ moved: count })
    }

    if (action === 'enqueue') {
      const payload = body.payload as EnqueueNotificationPayload | undefined
      if (!payload?.channel || !payload?.recipientIdentifier || !payload?.templateKey) {
        return NextResponse.json(
          { error: 'Required: channel, recipientIdentifier, templateKey, templateVars' },
          { status: 400 },
        )
      }
      const item = await enqueueNotification(payload)
      return NextResponse.json({ item }, { status: 201 })
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
