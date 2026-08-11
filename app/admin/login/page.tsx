'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Admin Login Page — submits to /api/admin/login which sets an HttpOnly cookie.
// The token is NEVER stored in localStorage, sessionStorage, or JS variables.
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from 'react'
import { useRouter }              from 'next/navigation'

export default function AdminLoginPage() {
  const router   = useRouter()
  const [token,   setToken]   = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ token }),
        credentials: 'same-origin',
      })

      if (res.ok) {
        // Cookie is set by server — redirect to admin dashboard
        // Clear the token from memory immediately
        setToken('')
        router.push('/admin/notifications')
      } else {
        const data = await res.json() as { error?: string }
        setError(data.error ?? 'Login failed.')
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }, [token, router])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-stone-800 mb-1">VedRith Admin</h1>
          <p className="text-sm text-stone-500">Enter your admin token to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-xs font-medium text-stone-600 mb-1">
              Admin Token
            </label>
            <input
              id="token"
              type="password"
              autoComplete="current-password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="Enter VEDRITH_ADMIN_TOKEN"
              required
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-2 text-sm font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-stone-400 text-center mt-6">
          Restricted access. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}
