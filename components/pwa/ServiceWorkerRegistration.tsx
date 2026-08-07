'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Service Worker Registration + Auto-Update  [V1.0]
//
// Registers /sw.js and handles:
//   • DATE_CHANGED  → dispatch vedrith:date-changed to refresh Panchanga
//   • UPDATE_AVAILABLE → show toast, user taps → sends SKIP_WAITING → reload
//   • SW_ACTIVATED  → silent confirmation
//
// The update toast is minimal and non-blocking — appears at bottom of screen.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef, useCallback } from 'react'

export function ServiceWorkerRegistration() {
  const [updateReady, setUpdateReady] = useState(false)
  const [updating,    setUpdating]    = useState(false)
  const [swReg,       setSwReg]       = useState<ServiceWorkerRegistration | null>(null)
  // Keep a stable ref to `updating` so the message handler can read the
  // latest value without being recreated (and without adding it to deps).
  const updatingRef = useRef(updating)
  useEffect(() => { updatingRef.current = updating }, [updating])

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    let pollInterval: ReturnType<typeof setInterval> | null = null

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(reg => {
        setSwReg(reg)
        // Poll for SW updates every hour (complementing the SW's internal check)
        pollInterval = setInterval(() => reg.update(), 60 * 60 * 1000)
      })
      .catch(err => console.warn('[SW] Registration failed:', err))

    // Handle all messages from the Service Worker
    const handler = (event: MessageEvent) => {
      switch (event.data?.type) {
        case 'DATE_CHANGED':
          window.dispatchEvent(
            new CustomEvent('vedrith:date-changed', { detail: event.data.date })
          )
          break

        case 'UPDATE_AVAILABLE':
          // New build detected — show the update toast
          setUpdateReady(true)
          break

        case 'SW_ACTIVATED':
          // New SW took control — reload to get fresh assets
          if (updatingRef.current) window.location.reload()
          break
      }
    }

    navigator.serviceWorker.addEventListener('message', handler)

    return () => {
      navigator.serviceWorker.removeEventListener('message', handler)
      if (pollInterval !== null) clearInterval(pollInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run once on mount — registration and message listener are stable

  const handleUpdate = useCallback(() => {
    setUpdating(true)

    // Tell the waiting SW to take control immediately
    if (swReg?.waiting) {
      swReg.waiting.postMessage({ type: 'SKIP_WAITING' })
    } else {
      // Fallback — just reload; the browser will fetch new SW on next load
      window.location.reload()
    }
  }, [swReg])

  const handleDismiss = useCallback(() => setUpdateReady(false), [])

  if (!updateReady) return null

  return (
    <div
      role="alertdialog"
      aria-live="polite"
      aria-label="App update available"
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 z-[100]
        w-[calc(100%-2rem)] max-w-sm
        flex items-center justify-between gap-3
        rounded-2xl border border-amber-500/30
        bg-[#0a0f1e]/95 backdrop-blur-md
        px-4 py-3 shadow-2xl
        animate-in slide-in-from-bottom-4 duration-300
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0" aria-hidden>✨</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">VedRith updated</p>
          <p className="text-xs text-white/60 truncate">Tap to apply the latest version</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleUpdate}
          disabled={updating}
          className="rounded-lg bg-amber-500 text-black text-xs font-bold px-3 py-1.5 hover:bg-amber-400 transition-colors disabled:opacity-60"
        >
          {updating ? 'Updating…' : 'Update'}
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss update notification"
          className="text-white/40 hover:text-white/70 transition-colors p-1 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
