// app/api/v1/events/publish/route.ts
// POST: publish a notification event (server-to-server, callback secret required)
// Also usable from admin for manual event triggering.

import { NextRequest, NextResponse }  from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { publishEvent }               from '@/lib/notifications/event-engine'
import { bootstrapNotificationHandlers } from '@/lib/services/notification-service'
import type { PublishEventPayload }   from '@/lib/types/notifications'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Accept either a shared secret (server-to-server) or a session cookie (admin)
    const secret         = request.headers.get('x-vedrith-event-secret')
    const expectedSecret = process.env.VEDRITH_EVENT_SECRET

    if (expectedSecret && secret !== expectedSecret) {
      // Fall back to session auth
      const supabase = await createSupabaseServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    bootstrapNotificationHandlers()

    const body    = await request.json() as PublishEventPayload
    const { eventType, sourceModule, sourceId, actorId, payload, correlationId } = body

    if (!eventType || !sourceModule) {
      return NextResponse.json(
        { error: 'Required: eventType, sourceModule' },
        { status: 400 },
      )
    }

    const event = await publishEvent({ eventType, sourceModule, sourceId, actorId, payload: payload ?? {}, correlationId })
    return NextResponse.json({ event }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
