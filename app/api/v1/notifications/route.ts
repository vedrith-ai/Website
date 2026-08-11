// app/api/v1/notifications/route.ts
// GET: list notifications | PATCH: mark all read

import { NextRequest, NextResponse }  from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getNotifications, markAllRead } from '@/lib/notifications/channels/in-app-channel'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ notifications: [], total: 0, page: 1, limit: 20 })

    const url    = new URL(req.url)
    const limit  = parseInt(url.searchParams.get('limit')  ?? '20', 10)
    const page   = parseInt(url.searchParams.get('page')   ?? '1',  10)
    const isRead = url.searchParams.get('isRead')

    const filters: Record<string, unknown> = { limit, page }
    if (isRead !== null) filters.isRead = isRead === 'true'

    const result = await getNotifications(user.id, filters)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json() as { action: string }
    if (body.action === 'mark_all_read') {
      await markAllRead(user.id)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
