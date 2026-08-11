'use client'
// components/notifications/NotificationItem.tsx + NotificationList.tsx
// VedRith Notification Platform Phase 1

import { useState, useEffect, useCallback } from 'react'
import type { Notification, NotificationFilters } from '@/lib/types/notifications'

// ── NotificationItem ──────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification
  onRead?:      (id: string) => void
  onArchive?:   (id: string) => void
  onDismiss?:   (id: string) => void
  compact?:     boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  editorial: 'text-amber-700 bg-amber-50',
  system:    'text-blue-700 bg-blue-50',
  content:   'text-green-700 bg-green-50',
}

const PRIORITY_DOT: Record<string, string> = {
  LOW:    'bg-stone-300',
  NORMAL: 'bg-amber-400',
  HIGH:   'bg-orange-500',
  URGENT: 'bg-red-500',
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m    = Math.floor(diff / 60_000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24)  return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function NotificationItem({
  notification: n,
  onRead,
  onArchive,
  onDismiss,
  compact = false,
}: NotificationItemProps) {
  const catColor = CATEGORY_COLORS[n.category] ?? 'text-stone-600 bg-stone-50'

  return (
    <div
      className={`group flex gap-3 px-4 py-3 border-b border-stone-100 last:border-0 ${
        !n.isRead ? 'bg-amber-50/30' : 'bg-white'
      } hover:bg-stone-50 transition-colors`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <span className="text-xl">{n.icon ?? '🔔'}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium truncate ${!n.isRead ? 'text-stone-800' : 'text-stone-600'}`}>
                {n.title}
              </p>
              {!n.isRead && (
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[n.priority]}`} />
              )}
            </div>
            {!compact && (
              <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.body}</p>
            )}
          </div>

          {/* Actions (shown on hover) */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {!n.isRead && onRead && (
              <button onClick={() => onRead(n.id)}
                className="text-xs text-stone-400 hover:text-amber-600 px-1.5 py-0.5 rounded"
                title="Mark read">✓</button>
            )}
            {onArchive && (
              <button onClick={() => onArchive(n.id)}
                className="text-xs text-stone-400 hover:text-stone-600 px-1.5 py-0.5 rounded"
                title="Archive">📁</button>
            )}
            {onDismiss && (
              <button onClick={() => onDismiss(n.id)}
                className="text-xs text-stone-400 hover:text-red-500 px-1.5 py-0.5 rounded"
                title="Dismiss">✕</button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${catColor}`}>
            {n.category}
          </span>
          <span className="text-[10px] text-stone-400">{relativeTime(n.createdAt)}</span>
          {n.actionUrl && (
            <a href={n.actionUrl}
              className="text-[10px] text-amber-600 hover:underline"
              onClick={e => e.stopPropagation()}>
              View →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── NotificationList ──────────────────────────────────────────────────────────

interface NotificationListProps {
  filters?:   NotificationFilters
  className?: string
  onCountChange?: (count: number) => void
}

export function NotificationList({ filters = {}, className = '', onCountChange }: NotificationListProps) {
  const [items, setItems]       = useState<Notification[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [loading, setLoading]   = useState(true)
  const [activeFilter, setActive] = useState<'all' | 'unread' | 'archived'>('all')

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', String(p))
      params.set('limit', '20')
      if (activeFilter === 'unread') params.set('isRead', 'false')
      if (filters.category) params.set('category', filters.category)
      if (filters.search)   params.set('search',   filters.search)

      const res  = await fetch(`/api/v1/notifications?${params}`)
      const data = await res.json() as { notifications: Notification[]; total: number }
      if (p === 1) setItems(data.notifications ?? [])
      else         setItems(prev => [...prev, ...(data.notifications ?? [])])
      setTotal(data.total ?? 0)
      onCountChange?.(data.total ?? 0)
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [activeFilter, filters.category, filters.search, onCountChange])

  useEffect(() => { setPage(1); void load(1) }, [activeFilter, load])

  const performAction = async (id: string, action: string) => {
    await fetch(`/api/v1/notifications/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action }),
    })
    if (action === 'mark_read') {
      setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } else {
      setItems(prev => prev.filter(n => n.id !== id))
      setTotal(t => t - 1)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    void load(next)
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-stone-200 px-4 mb-0">
        {(['all', 'unread', 'archived'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px capitalize transition-colors ${
              activeFilter === f
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="flex-1" />
        {items.some(n => !n.isRead) && (
          <button
            onClick={async () => {
              await fetch('/api/v1/notifications', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'mark_all_read' }),
              })
              setItems(prev => prev.map(n => ({ ...n, isRead: true })))
            }}
            className="text-xs text-amber-600 hover:text-amber-800 py-2 px-2"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {loading && items.length === 0 ? (
          <div className="flex justify-center py-12">
            <span className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-stone-400">
            <span className="text-4xl mb-2">🔔</span>
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <>
            {items.map(n => (
              <NotificationItem
                key={n.id}
                notification={n}
                onRead={id => performAction(id, 'mark_read')}
                onArchive={id => performAction(id, 'archive')}
                onDismiss={id => performAction(id, 'dismiss')}
              />
            ))}
            {items.length < total && (
              <div className="p-4 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="text-sm text-amber-600 hover:text-amber-800 disabled:opacity-50"
                >
                  {loading ? 'Loading…' : `Load more (${total - items.length} remaining)`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
