'use client'
// components/notifications/NotificationCenter.tsx
// VedRith Notification Platform Phase 1
// Full notification centre — search, filter by category, pagination.

import { useState } from 'react'
import { NotificationList } from './NotificationList'

interface NotificationCenterProps {
  className?: string
}

const CATEGORIES = ['all', 'editorial', 'system', 'content'] as const
type Category = (typeof CATEGORIES)[number]

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [total, setTotal]       = useState(0)

  return (
    <div className={`flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-800">Notification Centre</h2>
          {total > 0 && (
            <p className="text-xs text-stone-500 mt-0.5">{total} total</p>
          )}
        </div>
        <a href="/admin/notifications"
          className="text-xs text-amber-600 hover:text-amber-800">
          Admin view →
        </a>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-stone-100 flex gap-2">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notifications…"
            className="w-full text-sm border border-stone-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <span className="absolute left-2.5 top-2 text-stone-400 text-xs">🔍</span>
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          className="text-sm border border-stone-300 rounded-lg px-2 py-1.5"
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <NotificationList
        filters={{
          category: category !== 'all' ? category : undefined,
          search:   search || undefined,
        }}
        className="flex-1 min-h-0"
        onCountChange={setTotal}
      />
    </div>
  )
}
