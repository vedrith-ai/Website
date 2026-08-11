import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/route.ts
// GET: admin notification list (all recipients) + event log

import { NextRequest, NextResponse }           from 'next/server'
import { getSupabaseAdminClient }              from '@/lib/supabase/admin'
import { getRecentEvents }                     from '@/lib/notifications/event-engine'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const { searchParams } = request.nextUrl
    const view  = searchParams.get('view') ?? 'events'
    const limit = parseInt(searchParams.get('limit') ?? '20')

    if (view === 'events') {
      const events = await getRecentEvents(limit)
      return NextResponse.json({ events })
    }

    if (view === 'notifications') {
      const admin = getSupabaseAdminClient()
      const { data } = await admin
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
      return NextResponse.json({ notifications: data ?? [], total: (data ?? []).length })
    }

    return NextResponse.json({ error: `Unknown view: ${view}` }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
