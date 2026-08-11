import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/channels/route.ts
// GET : channel registry + health status
// POST: refresh health | update channel config

import { NextRequest, NextResponse }  from 'next/server'
import { getSupabaseAdminClient }     from '@/lib/supabase/admin'
import { refreshChannelHealth }       from '@/lib/services/notification-analytics-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response

    const admin = getSupabaseAdminClient()
    const { data } = await admin
      .from('notification_channels')
      .select('*')
      .order('sort_order')

    return NextResponse.json({ channels: data ?? [] })
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

    if (action === 'refresh_health') {
      const health = await refreshChannelHealth()
      return NextResponse.json({ health })
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
