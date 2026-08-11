// app/admin/notifications/page.tsx
import { Suspense }                  from 'react'
import { NotificationDashboard }     from '@/components/notifications/admin'

export const dynamic = 'force-dynamic'

export default function NotificationsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Notification Platform</h1>
        <p className="text-sm text-stone-500 mt-1">
          Event-driven communication system — events, queue, channels, and templates.
        </p>
      </div>
      <Suspense fallback={<Skeleton />}>
        <NotificationDashboard />
      </Suspense>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-stone-100 rounded-xl" />)}</div>
      <div className="h-12 bg-stone-100 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">{[...Array(2)].map((_, i) => <div key={i} className="h-48 bg-stone-100 rounded-xl" />)}</div>
    </div>
  )
}
