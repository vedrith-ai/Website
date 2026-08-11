'use client'
// components/notifications/admin/NotificationDashboard.tsx
// VedRith Notification Platform Phase 1 — Admin overview dashboard

import { useEffect, useState } from 'react'
import type { NotificationPlatformAnalytics } from '@/lib/types/notifications'

export function NotificationDashboard() {
  const [data, setData]       = useState<NotificationPlatformAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/admin/notifications/analytics')
      .then(r => r.json())
      .then((j: { analytics: NotificationPlatformAnalytics }) => setData(j.analytics))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const rate = data?.deliveryRatePct ?? 0
  const rateColor = rate >= 95 ? 'text-green-600' : rate >= 80 ? 'text-amber-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Messages Sent"       value={data?.totalSent ?? 0}       icon="📤" />
        <StatCard label="Delivered"           value={data?.totalDelivered ?? 0}  icon="✅" />
        <StatCard label="Failed"              value={data?.totalFailed ?? 0}     icon="❌" color={data?.totalFailed ? 'red' : undefined} />
        <StatCard label="Unread (In-App)"     value={data?.unreadCount ?? 0}     icon="🔔" />
      </div>

      {/* Delivery rate */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">Overall Delivery Rate</span>
          <span className={`text-lg font-bold ${rateColor}`}>{rate}%</span>
        </div>
        <div className="h-2 bg-stone-100 rounded-full">
          <div
            className={`h-full rounded-full transition-all ${rate >= 95 ? 'bg-green-400' : rate >= 80 ? 'bg-amber-400' : 'bg-red-400'}`}
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      {/* By channel */}
      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-stone-700 mb-3">By Channel</h3>
        <div className="space-y-2">
          {Object.entries(data?.byChannel ?? {}).map(([ch, stats]) => (
            <div key={ch} className="flex items-center justify-between text-sm">
              <span className="text-stone-600">{ch}</span>
              <div className="flex gap-4 text-stone-500 text-xs">
                <span className="text-green-600">✓ {stats.delivered}</span>
                <span className="text-red-500">✗ {stats.failed}</span>
                <span>{stats.sent} total</span>
              </div>
            </div>
          ))}
          {Object.keys(data?.byChannel ?? {}).length === 0 && (
            <p className="text-sm text-stone-400">No data yet</p>
          )}
        </div>
      </div>

      {/* Queue health + recent failures */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Queue Health</h3>
          <div className="space-y-1.5">
            {Object.entries(data?.queueHealth.byStatus ?? {}).map(([status, count]) => (
              <div key={status} className="flex justify-between text-sm">
                <span className="text-stone-500">{status}</span>
                <span className="font-medium text-stone-700">{count as number}</span>
              </div>
            ))}
          </div>
          {(data?.queueHealth.deadLetter ?? 0) > 0 && (
            <p className="text-xs text-red-500 mt-2">
              ⚠ {data!.queueHealth.deadLetter} dead letter items — manual review needed
            </p>
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Recent Failures</h3>
          {(data?.recentFailures ?? []).length === 0 ? (
            <p className="text-sm text-stone-400">No recent failures 🎉</p>
          ) : (
            <div className="space-y-2">
              {data!.recentFailures.slice(0, 5).map(f => (
                <div key={f.id} className="text-xs text-stone-600">
                  <span className="text-red-500 mr-1">✗</span>
                  <span>{f.templateKey}</span>
                  <span className="text-stone-400 ml-1">({f.channel})</span>
                </div>
              ))}
              <a href="/admin/notifications/analytics"
                className="text-xs text-amber-600 hover:text-amber-800">View all →</a>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        {[
          { href: '/admin/notifications/queue',     icon: '⚙️', label: 'Queue Monitor' },
          { href: '/admin/notifications/templates', icon: '📝', label: 'Templates' },
          { href: '/admin/notifications/analytics', icon: '📊', label: 'Analytics' },
          { href: '/admin/notifications/channels',  icon: '📡', label: 'Channels' },
        ].map(a => (
          <a key={a.href} href={a.href}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 text-stone-700 transition-colors">
            <span>{a.icon}</span><span>{a.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── QueueMonitor ──────────────────────────────────────────────────────────────

import type { NotificationQueueItem, NotificationQueueStats } from '@/lib/types/notifications'

export function QueueMonitor() {
  const [stats, setStats]     = useState<NotificationQueueStats | null>(null)
  const [items, setItems]     = useState<NotificationQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  const load = async () => {
    setLoading(true)
    const res  = await fetch('/api/v1/admin/notifications/queue')
    const json = await res.json() as { stats: NotificationQueueStats; recentItems: NotificationQueueItem[] }
    setStats(json.stats)
    setItems(json.recentItems ?? [])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const runNext = async () => {
    setRunning(true)
    await fetch('/api/v1/admin/notifications/queue', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'run_next' }),
    })
    setRunning(false)
    void load()
  }

  const processBatch = async () => {
    setRunning(true)
    await fetch('/api/v1/admin/notifications/queue', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'process_batch', batchSize: 10 }),
    })
    setRunning(false)
    void load()
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(stats?.byStatus ?? {}).map(([s, c]) => (
          <div key={s} className="bg-white border border-stone-200 rounded-xl p-3 text-center">
            <p className="text-xs text-stone-400 truncate">{s}</p>
            <p className="text-xl font-bold text-stone-700">{c as number}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={runNext} disabled={running || (stats?.pending ?? 0) === 0}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50">
          {running ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '▶'}
          Run next
        </button>
        <button onClick={processBatch} disabled={running || (stats?.pending ?? 0) === 0}
          className="flex items-center gap-2 px-4 py-2 bg-stone-700 text-white text-sm rounded-lg hover:bg-stone-800 disabled:opacity-50">
          ⚡ Process batch (10)
        </button>
        <button onClick={load} className="px-3 py-2 text-sm border border-stone-200 rounded-lg hover:bg-stone-50">
          ↻ Refresh
        </button>
      </div>

      {/* Items table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['Channel', 'Template', 'Recipient', 'Status', 'Attempts', 'Created'].map(h => (
              <th key={h} className="text-left px-4 py-2.5 text-stone-500 font-medium">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.length === 0
              ? <tr><td colSpan={6} className="px-4 py-6 text-center text-stone-400">Queue empty</td></tr>
              : items.map(item => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="px-4 py-2.5">{item.channel}</td>
                  <td className="px-4 py-2.5 text-stone-600 truncate max-w-[120px]">{item.templateKey}</td>
                  <td className="px-4 py-2.5 text-stone-400 truncate max-w-[100px]">{item.recipientIdentifier}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-2.5 text-stone-500">{item.attempts}/{item.maxAttempts}</td>
                  <td className="px-4 py-2.5 text-stone-400">{new Date(item.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── ChannelHealth ─────────────────────────────────────────────────────────────

import type { NotificationChannel } from '@/lib/types/notifications'

export function ChannelHealth() {
  const [channels, setChannels] = useState<NotificationChannel[]>([])
  const [loading, setLoading]   = useState(true)
  const [checking, setChecking] = useState(false)

  const load = async () => {
    setLoading(true)
    const res  = await fetch('/api/v1/admin/notifications/channels')
    const json = await res.json() as { channels: NotificationChannel[] }
    setChannels(json.channels ?? [])
    setLoading(false)
  }

  useEffect(() => { void load() }, [])

  const refreshHealth = async () => {
    setChecking(true)
    await fetch('/api/v1/admin/notifications/channels', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'refresh_health' }),
    })
    setChecking(false)
    void load()
  }

  if (loading) return <Spinner />

  const HEALTH_COLORS: Record<string, string> = {
    UP:      'text-green-600 bg-green-50',
    DEGRADED:'text-amber-600 bg-amber-50',
    DOWN:    'text-red-600 bg-red-50',
    UNKNOWN: 'text-stone-500 bg-stone-50',
  }
  const HEALTH_ICONS: Record<string, string> = {
    UP: '✅', DEGRADED: '⚠️', DOWN: '🔴', UNKNOWN: '❓',
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={refreshHealth} disabled={checking}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-stone-300 hover:bg-stone-50 disabled:opacity-50">
          {checking ? <span className="w-4 h-4 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" /> : '🔄'}
          Refresh health
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {channels.map(ch => (
          <div key={ch.id} className="bg-white border border-stone-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-stone-700">{ch.label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{ch.channelType}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${HEALTH_COLORS[ch.healthStatus] ?? HEALTH_COLORS.UNKNOWN}`}>
                {HEALTH_ICONS[ch.healthStatus]} {ch.healthStatus}
              </span>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-stone-500">
              <span>✓ {ch.messagesSent.toLocaleString()} sent</span>
              <span>✗ {ch.messagesFailed.toLocaleString()} failed</span>
              {ch.rateLimitPerHour && <span>⏱ {ch.rateLimitPerHour}/hr</span>}
            </div>
            {ch.lastHealthCheck && (
              <p className="text-[10px] text-stone-400 mt-2">
                Checked: {new Date(ch.lastHealthCheck).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── DeliveryStats ─────────────────────────────────────────────────────────────

import type { NotificationDeliveryStats } from '@/lib/types/notifications'

export function DeliveryStats() {
  const [stats, setStats]     = useState<NotificationDeliveryStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/admin/notifications/analytics')
      .then(r => r.json())
      .then((j: { analytics: { byTemplate: NotificationDeliveryStats[] } }) => setStats(j.analytics?.byTemplate ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>{['Template', 'Channel', 'Sent', 'Delivered', 'Failed', 'Rate'].map(h => (
            <th key={h} className="text-left px-4 py-3 text-stone-500 font-medium text-xs">{h}</th>
          ))}</tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {stats.length === 0
            ? <tr><td colSpan={6} className="px-4 py-8 text-center text-stone-400 text-xs">No delivery data yet</td></tr>
            : stats.map((s, i) => (
              <tr key={i} className="hover:bg-stone-50">
                <td className="px-4 py-3 text-stone-700 text-xs truncate max-w-[160px]">{s.templateKey}</td>
                <td className="px-4 py-3 text-stone-500 text-xs">{s.channel}</td>
                <td className="px-4 py-3 text-stone-600 text-xs">{s.totalAttempts}</td>
                <td className="px-4 py-3 text-green-600 text-xs">{s.delivered}</td>
                <td className="px-4 py-3 text-red-500 text-xs">{s.failed}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={`font-medium ${s.deliveryRatePct >= 95 ? 'text-green-600' : s.deliveryRatePct >= 80 ? 'text-amber-600' : 'text-red-500'}`}>
                    {s.deliveryRatePct}%
                  </span>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

// ── SystemAlerts ──────────────────────────────────────────────────────────────

import type { NotificationEvent } from '@/lib/types/notifications'

export function SystemAlerts() {
  const [events, setEvents]   = useState<NotificationEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/v1/admin/notifications?view=events&limit=20')
      .then(r => r.json())
      .then((j: { events: NotificationEvent[] }) => {
        const alerts = (j.events ?? []).filter(e =>
          ['SYSTEM_HEALTH_ALERT', 'PROVIDER_FAILURE', 'STORAGE_ALERT', 'QUEUE_FAILURE'].includes(e.eventType)
        )
        setEvents(alerts)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="space-y-3">
      {events.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-stone-400">
          <span className="text-4xl mb-2">✅</span>
          <p className="text-sm">No system alerts</p>
        </div>
      ) : events.map(e => {
        const payload    = e.payload as Record<string, unknown>
        const level      = (payload.alertLevel ?? 'INFO') as string
        const levelStyle = {
          CRITICAL: 'border-red-300 bg-red-50 text-red-800',
          ERROR:    'border-red-200 bg-red-50/50 text-red-700',
          WARNING:  'border-yellow-200 bg-yellow-50 text-yellow-800',
          INFO:     'border-blue-200 bg-blue-50 text-blue-800',
        }[level] ?? 'border-stone-200 bg-stone-50 text-stone-700'

        return (
          <div key={e.id} className={`border rounded-xl p-4 ${levelStyle}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  [{level}] {String(payload.component ?? e.sourceModule)}
                </p>
                <p className="text-sm mt-1">{String(payload.alertMessage ?? payload.error_message ?? e.eventType)}</p>
              </div>
              <p className="text-xs flex-shrink-0 opacity-70">
                {new Date(e.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── TemplateEditor ────────────────────────────────────────────────────────────

import type { NotificationTemplate } from '@/lib/types/notifications'

export function TemplateEditor({ templateId }: { templateId: string }) {
  const [tmpl, setTmpl]       = useState<NotificationTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [preview, setPreview] = useState<{ subject: string | null; body: string; htmlBody: string | null } | null>(null)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch(`/api/v1/admin/notifications/templates/${templateId}`)
      .then(r => r.json())
      .then((j: { template: NotificationTemplate }) => setTmpl(j.template))
      .finally(() => setLoading(false))
  }, [templateId])

  const save = async () => {
    if (!tmpl) return
    setSaving(true)
    await fetch(`/api/v1/admin/notifications/templates/${templateId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        name:              tmpl.name,
        subject:           tmpl.subject,
        textBody:          tmpl.textBody,
        htmlBody:          tmpl.htmlBody,
        actionUrlTemplate: tmpl.actionUrlTemplate,
        isActive:          tmpl.isActive,
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const doPreview = async () => {
    if (!tmpl) return
    const res  = await fetch(`/api/v1/admin/notifications/templates/${templateId}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'preview', vars: tmpl.examplePayload }),
    })
    const json = await res.json() as { preview: typeof preview }
    setPreview(json.preview)
  }

  if (loading) return <Spinner />
  if (!tmpl)   return <p className="text-stone-400 text-sm p-4">Template not found</p>

  return (
    <div className="space-y-4">
      {/* Meta */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-stone-600 block mb-1">Name</label>
          <input value={tmpl.name} onChange={e => setTmpl(t => t && ({ ...t, name: e.target.value }))}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="text-xs font-medium text-stone-600 block mb-1">Subject / Title</label>
          <input value={tmpl.subject ?? ''} onChange={e => setTmpl(t => t && ({ ...t, subject: e.target.value }))}
            className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2" placeholder="{{variable}} supported" />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-stone-600 block mb-1">Text Body</label>
        <textarea value={tmpl.textBody} onChange={e => setTmpl(t => t && ({ ...t, textBody: e.target.value }))}
          rows={4} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 font-mono resize-y" />
      </div>

      {tmpl.channel === 'EMAIL' && (
        <div>
          <label className="text-xs font-medium text-stone-600 block mb-1">HTML Body</label>
          <textarea value={tmpl.htmlBody ?? ''} onChange={e => setTmpl(t => t && ({ ...t, htmlBody: e.target.value }))}
            rows={8} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 font-mono resize-y" />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-stone-600 block mb-1">Action URL Template</label>
        <input value={tmpl.actionUrlTemplate ?? ''} onChange={e => setTmpl(t => t && ({ ...t, actionUrlTemplate: e.target.value }))}
          className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 font-mono"
          placeholder="/admin/cms/submissions/{{submission_id}}" />
      </div>

      {/* Variables reference */}
      {tmpl.variables.length > 0 && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
          <p className="text-xs font-medium text-stone-600 mb-2">Available variables:</p>
          <div className="flex flex-wrap gap-2">
            {tmpl.variables.map(v => (
              <code key={v.name} className="text-xs bg-white border border-stone-300 rounded px-2 py-0.5 text-amber-700">
                {`{{${v.name}}}`}{v.required ? ' *' : ''}
              </code>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50">
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
          {saved ? '✓ Saved' : 'Save changes'}
        </button>
        <button onClick={doPreview} className="px-4 py-2 border border-stone-300 text-stone-700 text-sm rounded-lg hover:bg-stone-50">
          Preview
        </button>
      </div>

      {/* Preview panel */}
      {preview && (
        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-stone-600 mb-3">Preview</p>
          {preview.subject && (
            <p className="text-sm font-medium text-stone-700 mb-2">{preview.subject}</p>
          )}
          {preview.htmlBody ? (
            <div className="border border-stone-200 rounded-lg overflow-hidden">
              <iframe srcDoc={preview.htmlBody} className="w-full h-64" title="Email preview" />
            </div>
          ) : (
            <p className="text-sm text-stone-600 whitespace-pre-wrap">{preview.body}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Shared ────────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <span className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:     'bg-yellow-100 text-yellow-700',
    SENDING:     'bg-blue-100 text-blue-700 animate-pulse',
    DELIVERED:   'bg-green-100 text-green-700',
    FAILED:      'bg-red-100 text-red-700',
    CANCELLED:   'bg-stone-100 text-stone-500',
    SCHEDULED:   'bg-purple-100 text-purple-700',
    DEAD_LETTER: 'bg-red-200 text-red-800',
  }
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${map[status] ?? 'bg-stone-100 text-stone-500'}`}>
      {status}
    </span>
  )
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number | string
  icon:  string
  color?: 'red' | 'green' | 'amber'
}) {
  const textColor = color === 'red' ? 'text-red-600' : color === 'green' ? 'text-green-600' : color === 'amber' ? 'text-amber-600' : 'text-stone-800'
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-1">
      <span className="text-xl">{icon}</span>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-stone-500">{label}</p>
    </div>
  )
}
