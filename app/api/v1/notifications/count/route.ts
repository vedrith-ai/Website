// app/api/v1/notifications/count/route.ts
// GET: unread notification count (returns 0 if user not authenticated / Supabase not configured)

import { NextResponse }               from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getUnreadCount }             from '@/lib/notifications/channels/in-app-channel'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    // If no auth, return 0 silently (feature available when Supabase is configured)
    if (!user) return NextResponse.json({ count: 0 })
    const count = await getUnreadCount(user.id)
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}
