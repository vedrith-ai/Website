// app/admin/notifications/queue/page.tsx
import { Suspense }      from 'react'
import { QueueMonitor }  from '@/components/notifications/admin'
export const dynamic = 'force-dynamic'
export default function QueuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Message Queue</h1>
          <p className="text-sm text-stone-500 mt-1">Monitor, run, and manage outbound notification jobs.</p>
        </div>
        <a href="/admin/notifications" className="text-sm text-stone-400 hover:text-amber-600">← Notifications</a>
      </div>
      <Suspense fallback={<div className="h-64 bg-stone-100 rounded-xl animate-pulse" />}>
        <QueueMonitor />
      </Suspense>
    </div>
  )
}
