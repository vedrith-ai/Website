// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/version
// Returns the current app build ID and version string.
// Polled by the client auto-updater to detect new deployments.
// ─────────────────────────────────────────────────────────────────────────────

import { type NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev'
const VERSION  = '1.0.0-rc1'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function GET(_req: NextRequest) {
  return NextResponse.json(
    { version: VERSION, buildId: BUILD_ID, ok: true },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}
