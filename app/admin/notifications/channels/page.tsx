// app/admin/notifications/channels/page.tsx
import { Suspense }      from 'react'
import { ChannelHealth } from '@/components/notifications/admin'
export const dynamic = 'force-dynamic'
export default function ChannelsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Channel Health</h1>
          <p className="text-sm text-stone-500 mt-1">Monitor all notification channels and providers.</p>
        </div>
        <a href="/admin/notifications" className="text-sm text-stone-400 hover:text-amber-600">← Notifications</a>
      </div>
      <Suspense fallback={<div className="h-48 bg-stone-100 rounded-xl animate-pulse" />}>
        <ChannelHealth />
      </Suspense>
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm text-stone-600">
        <p className="font-medium mb-1">Phase 2 channels</p>
        <p>SMS, WhatsApp, Push Notifications, Webhooks, and Browser Notifications are architecturally
        ready. Each adds a new adapter in <code className="bg-white px-1 rounded border border-stone-300 text-xs">lib/notifications/channels/</code> and
        registers it in <code className="bg-white px-1 rounded border border-stone-300 text-xs">channel-manager.ts</code>. No other changes required.</p>
      </div>
    </div>
  )
}
