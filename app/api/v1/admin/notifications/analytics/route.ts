import { requireAdmin }          from '@/lib/auth/require-admin'
// app/api/v1/admin/notifications/analytics/route.ts
import { NextRequest, NextResponse }   from 'next/server'
import { getNotificationPlatformAnalytics } from '@/lib/services/notification-analytics-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.ok) return auth.response
    const analytics = await getNotificationPlatformAnalytics()
    return NextResponse.json({ analytics })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
