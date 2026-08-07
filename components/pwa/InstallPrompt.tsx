'use client'

// ─────────────────────────────────────────────────────────────────────────────
// PWA Install Prompt — Platform V1
//
// Non-intrusive. Shown max once per session until user installs or dismisses.
// Respects 7-day cool-down after dismissal. Never shown if already installed.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { savePWAInstallState, shouldShowInstallPrompt } from '@/lib/storage/preferences'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [show, setShow]             = useState(false)
  const [deferredPrompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS]           = useState(false)
  const [installed, setInstalled]   = useState(false)

  useEffect(() => {
    // Already running as standalone — don't show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      savePWAInstallState({ installed: true })
      return
    }

    // iOS detection (Safari doesn't fire beforeinstallprompt)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream
    setIsIOS(ios)

    if (!shouldShowInstallPrompt()) return

    // Shared timer ref so both branches can be cleaned up identically
    let showTimer: ReturnType<typeof setTimeout> | null = null

    if (ios) {
      // Show manual instructions for iOS after 3s
      showTimer = setTimeout(() => setShow(true), 3000)
      return () => { if (showTimer !== null) clearTimeout(showTimer) }
    }

    // Capture the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      if (showTimer !== null) clearTimeout(showTimer)
      showTimer = setTimeout(() => setShow(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // App installed
    const installedHandler = () => {
      setInstalled(true)
      setShow(false)
      savePWAInstallState({ installed: true })
    }
    window.addEventListener('appinstalled', installedHandler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
      if (showTimer !== null) clearTimeout(showTimer)
    }
  }, [])

  function dismiss() {
    setShow(false)
    savePWAInstallState({ dismissed: true, dismissedAt: new Date().toISOString() })
  }

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      savePWAInstallState({ installed: true })
    } else {
      savePWAInstallState({ dismissed: true, dismissedAt: new Date().toISOString() })
    }
    setShow(false)
    setPrompt(null)
  }

  if (!show || installed) return null

  return (
    <div
      role="banner"
      aria-label="Install VedRith app"
      className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <div className="rounded-2xl border border-amber-500/30 bg-background/95 backdrop-blur-sm shadow-2xl p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xl">
            🕉
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">Install VedRith</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {isIOS
                ? 'Tap the Share button and choose "Add to Home Screen" for the full app experience.'
                : 'Install for offline Panchanga, faster loading, and a native app experience.'}
            </p>

            {isIOS ? (
              <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                <span>Share</span>
                <span aria-hidden>→</span>
                <span>Add to Home Screen</span>
              </div>
            ) : (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={install}
                  className="flex-1 rounded-lg bg-amber-500 text-black text-xs font-semibold py-2 px-3 hover:bg-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Install App
                </button>
                <button
                  onClick={dismiss}
                  className="rounded-lg border border-border text-xs text-muted-foreground py-2 px-3 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Not now
                </button>
              </div>
            )}
          </div>

          <button
            onClick={dismiss}
            aria-label="Close install prompt"
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            ✕
          </button>
        </div>

        {isIOS && (
          <button
            onClick={dismiss}
            className="mt-3 w-full rounded-lg border border-border text-xs text-muted-foreground py-2 hover:bg-muted transition-colors"
          >
            Continue in browser
          </button>
        )}
      </div>
    </div>
  )
}
