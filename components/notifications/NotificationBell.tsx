'use client'
// components/notifications/NotificationBell.tsx
// VedRith Notification Platform Phase 1
// Header bell icon with live unread count + quick-action dropdown.
// Drop into any layout header — polls every 30s automatically.

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Notification } from '@/lib/types/notifications'

interface NotificationBellProps {
  className?: string
  onOpenCenter?: () => void
}

const PRIORITY_COLORS = {
  LOW:    'bg-stone-400',
  NORMAL: 'bg-amber-500',
  HIGH:   'bg-orange-500',
  URGENT: 'bg-red-500',
}

export function NotificationBell({ className = '', onOpenCenter }: NotificationBellProps) {
  const [count, setCount]       = useState(0)
  const [recent, setRecent]     = useState<Notification[]>([])
  const [open, setOpen]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const dropdownRef             = useRef<HTMLDivElement>(null)

  const fetchCount = useCallback(async () => {
    try {
      const res  = await fetch('/api/v1/notifications/count')
      const data = await res.json() as { count: number }
      setCount(data.count ?? 0)
    } catch { /* silently ignore */ }
  }, [])

  const fetchRecent = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/v1/notifications?limit=5&isRead=false')
      const data = await res.json() as { notifications: Notification[] }
      setRecent(data.notifications ?? [])
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [])

  // Poll every 30s
  useEffect(() => {
    void fetchCount()
    const t = setInterval(fetchCount, 30_000)
    return () => clearInterval(t)
  }, [fetchCount])

  // Load recent on open
  useEffect(() => {
    if (open) void fetchRecent()
  }, [open, fetchRecent])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markRead = async (id: string) => {
    await fetch(`/api/v1/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_read' }),
    })
    setRecent(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    setCount(c => Math.max(0, c - 1))
  }

  const markAllRead = async () => {
    await fetch('/api/v1/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_all_read' }),
    })
    setRecent(prev => prev.map(n => ({ ...n, isRead: true })))
    setCount(0)
  }

  const relativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m    = Math.floor(diff / 60_000)
    if (m < 1)  return 'just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    return `${Math.floor(h / 24)}d ago`
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
        aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 leading-none">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-stone-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <span className="text-sm font-semibold text-stone-700">Notifications</span>
            <div className="flex gap-2">
              {count > 0 && (
                <button onClick={markAllRead}
                  className="text-xs text-amber-600 hover:text-amber-800">
                  Mark all read
                </button>
              )}
              {onOpenCenter && (
                <button onClick={() => { setOpen(false); onOpenCenter() }}
                  className="text-xs text-stone-400 hover:text-stone-600">
                  See all →
                </button>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="max-h-96 overflow-y-auto divide-y divide-stone-50">
            {loading ? (
              <div className="flex justify-center py-8">
                <span className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recent.length === 0 ? (
              <div className="py-8 text-center">
                <span className="text-2xl block mb-1">🔔</span>
                <p className="text-sm text-stone-400">All caught up!</p>
              </div>
            ) : (
              recent.map(n => (
                <button
                  key={n.id}
                  className={`w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors ${!n.isRead ? 'bg-amber-50/40' : ''}`}
                  onClick={() => { if (!n.isRead) markRead(n.id); if (n.actionUrl) window.location.href = n.actionUrl }}
                >
                  <div className="flex gap-3 items-start">
                    <span className="text-xl flex-shrink-0 mt-0.5">{n.icon ?? '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-medium truncate ${!n.isRead ? 'text-stone-800' : 'text-stone-600'}`}>
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_COLORS[n.priority]}`} />
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-stone-400 mt-1">{relativeTime(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {onOpenCenter && (
            <div className="px-4 py-2 border-t border-stone-100 bg-stone-50">
              <button
                onClick={() => { setOpen(false); onOpenCenter() }}
                className="w-full text-xs text-center text-amber-700 hover:text-amber-800 font-medium py-1"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
