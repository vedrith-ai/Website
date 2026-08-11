// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Supabase SSR Client  [RC1]
// ─────────────────────────────────────────────────────────────────────────────
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies }                                  from 'next/headers'

export async function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null as null }, error: null }),
      },
    } as const
  }

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // Safe to ignore in Server Components
        }
      },
    },
  })
}
