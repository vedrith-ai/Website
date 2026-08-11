'use client'
// app/admin/notifications/templates/page.tsx
import { useEffect, useState } from 'react'
import type { NotificationTemplate } from '@/lib/types/notifications'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    fetch(`/api/v1/admin/notifications/templates${search ? `?search=${encodeURIComponent(search)}` : ''}`)
      .then(r => r.json())
      .then((j: { templates: NotificationTemplate[] }) => setTemplates(j.templates ?? []))
      .finally(() => setLoading(false))
  }, [search])

  const CHANNEL_COLORS: Record<string, string> = {
    IN_APP: 'bg-amber-100 text-amber-700',
    EMAIL:  'bg-blue-100 text-blue-700',
    SMS:    'bg-green-100 text-green-700',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Notification Templates</h1>
          <p className="text-sm text-stone-500 mt-1">Manage reusable message templates for every channel.</p>
        </div>
        <a href="/admin/notifications" className="text-sm text-stone-400 hover:text-amber-600">← Notifications</a>
      </div>

      <div className="flex gap-3">
        <input
          type="search" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search templates…"
          className="flex-1 text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>{['Name', 'Key', 'Channel', 'Event', 'Auto', 'Version', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-stone-500 font-medium text-xs">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {templates.length === 0
                ? <tr><td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-xs">No templates found</td></tr>
                : templates.map(t => (
                  <tr key={t.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 text-stone-700 font-medium">{t.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-500">{t.templateKey}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CHANNEL_COLORS[t.channel] ?? 'bg-stone-100 text-stone-500'}`}>
                        {t.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-400">{t.eventType ?? '—'}</td>
                    <td className="px-4 py-3 text-xs">{t.autoSend ? '✅' : '—'}</td>
                    <td className="px-4 py-3 text-xs text-stone-400">v{t.version}</td>
                    <td className="px-4 py-3">
                      <a href={`/admin/notifications/templates/${t.id}`}
                        className="text-xs text-amber-600 hover:text-amber-800">Edit</a>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
