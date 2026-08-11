// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Supabase Admin Client  [RC1]
// Uses the service-role key for server-side operations (never exposed to client).
// Fails clearly when not configured so the operator knows what to fix.
// ─────────────────────────────────────────────────────────────────────────────
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ── Singleton ────────────────────────────────────────────────────────────────
let _client: SupabaseClient | null = null

/**
 * Returns the Supabase admin client (service-role).
 * Throws a clear error in production if env vars are missing.
 * In development/test the error is a warning to ease local setup.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (_client) return _client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    const msg =
      '[VedRith] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for notification ' +
      'persistence and admin operations. Set these environment variables and restart the server.'
    if (process.env.NODE_ENV === 'production') {
      throw new Error(msg)
    }
    // In dev/test: log and return a no-op that throws on use
    console.warn(msg)
    // Return a stub that throws on table access so callers surface the error
    return createNoopThatThrows()
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _client
}

// ── No-op stub (dev/test only) ────────────────────────────────────────────────
function createNoopThatThrows(): SupabaseClient {
  const err = () => { throw new Error('Supabase not configured — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY') }
  return new Proxy({} as SupabaseClient, { get: () => err })
}

/** True if Supabase is configured in this environment */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
