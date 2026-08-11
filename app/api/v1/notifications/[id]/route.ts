// app/api/v1/notifications/[id]/route.ts
// PATCH: mark read / archive / dismiss | DELETE: delete notification

import { NextRequest, NextResponse }  from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  markNotificationRead,
  archiveNotification,
  dismissNotification,
} from '@/lib/notifications/channels/in-app-channel'

export const dynamic = 'force-dynamic'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { id } = await params
    const body    = await req.json() as { action: string }

    switch (body.action) {
      case 'mark_read': await markNotificationRead(id, user.id); break
      case 'archive':   await archiveNotification(id, user.id);  break
      case 'dismiss':   await dismissNotification(id, user.id);  break
      default: return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
