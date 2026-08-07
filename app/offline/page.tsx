import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Offline — VedRith',
  description: 'VedRith is currently offline. Please reconnect to access your Panchanga.',
  robots: { index: false },
}

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-sm space-y-6">
        <div className="text-6xl" aria-hidden>🌙</div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">ಸಂಪರ್ಕ ಕಡಿದಿದೆ</h1>
          <p className="text-muted-foreground">
            VedRith is currently offline.
          </p>
          <p className="text-sm text-muted-foreground">
            Previously viewed Panchanga and knowledge pages may still be available.
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-300/80">
          <p className="font-medium mb-1">What works offline:</p>
          <ul className="text-left space-y-1 text-xs text-amber-300/60">
            <li>✓ Today&apos;s Panchanga (if previously loaded)</li>
            <li>✓ Knowledge pages</li>
            <li>✓ App navigation</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Link
            href="/"
            className="block w-full rounded-xl bg-amber-500 text-black font-semibold py-3 hover:bg-amber-400 transition-colors text-sm"
          >
            Try Again
          </Link>
          <Link
            href="/panchanga"
            className="block w-full rounded-xl border border-border py-2.5 text-sm hover:bg-muted transition-colors text-muted-foreground"
          >
            Open Panchanga (cached)
          </Link>
        </div>
      </div>
    </main>
  )
}
