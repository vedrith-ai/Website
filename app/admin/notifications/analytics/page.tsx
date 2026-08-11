'use client'
// app/admin/notifications/analytics/page.tsx
import { useState }        from 'react'
import { DeliveryStats }   from '@/components/notifications/admin'
import { SystemAlerts }    from '@/components/notifications/admin'

type Tab = 'delivery' | 'alerts' | 'audit'

export default function AnalyticsPage() {
  const [tab, setTab] = useState<Tab>('delivery')
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Analytics & Audit</h1>
          <p className="text-sm text-stone-500 mt-1">Delivery stats, system alerts, and full audit logs.</p>
        </div>
        <a href="/admin/notifications" className="text-sm text-stone-400 hover:text-amber-600">← Notifications</a>
      </div>
      <div className="flex gap-1 border-b border-stone-200">
        {([['delivery','Delivery Stats'],['alerts','System Alerts'],['audit','Audit Log']] as [Tab,string][]).map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === id ? 'border-amber-500 text-amber-700' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>
            {label}
          </button>
        ))}
      </div>
      {tab === 'delivery' && <DeliveryStats />}
      {tab === 'alerts'   && <SystemAlerts />}
      {tab === 'audit'    && <AuditLog />}
    </div>
  )
}

function AuditLog() {
  const [logs, setLogs]     = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    fetch('/api/v1/admin/notifications/failed?view=logs&limit=50')
      .then(r => r.json())
      .then((j: { failures: unknown[] }) => setLogs(j.failures ?? []))
      .finally(() => setLoading(false))
    return undefined
  })

  if (loading) return <div className="flex justify-center py-12"><span className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>{['Channel','Template','Recipient','Status','Attempt','Time'].map(h => (
            <th key={h} className="text-left px-4 py-2.5 text-stone-500 font-medium">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {(logs as Array<Record<string, unknown>>).map((l, i) => (
            <tr key={i} className="hover:bg-stone-50">
              <td className="px-4 py-2.5">{l.channel as string}</td>
              <td className="px-4 py-2.5 text-stone-600 truncate max-w-[120px]">{l.template_key as string}</td>
              <td className="px-4 py-2.5 text-stone-400 truncate max-w-[100px]">{l.recipient_identifier as string}</td>
              <td className="px-4 py-2.5">
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${l.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {l.status as string}
                </span>
              </td>
              <td className="px-4 py-2.5 text-stone-500">{l.attempt_number as number}</td>
              <td className="px-4 py-2.5 text-stone-400">{new Date(l.created_at as string).toLocaleString()}</td>
            </tr>
          ))}
          {logs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-stone-400">No log entries</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
