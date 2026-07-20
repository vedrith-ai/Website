'use client'

import { useEffect } from 'react'

/**
 * Registers /sw.js after window load so it never competes with the
 * initial page load for bandwidth/CPU. Fails silently — a missing or
 * failed service worker must never block the site from working.
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Non-fatal — site works fully without offline support
      })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
