'use client'
// PanchangaClientPage — wraps form + result with full state management
// SEO metadata is set in page.tsx (server component)

import { useState, useCallback } from 'react'
import PanchangaForm, { type PanchangaFormValues } from '@/components/panchanga/PanchangaForm'
import PanchangaResult from '@/components/panchanga/PanchangaResult'
import type { PanchangaResult as PanchangaResultType } from '@/lib/types/panchanga'

export default function PanchangaClientPage() {
  const [result,  setResult]  = useState<PanchangaResultType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleSubmit = useCallback(async (values: PanchangaFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        date:     values.date,
        lat:      String(values.lat),
        lng:      String(values.lng),
        tz:       values.timezone,
        region:   values.region,
        lang:     values.lang,
        calendar: values.calendarSystem,
      })
      const res  = await fetch(`/api/v1/panchanga/daily?${params}`)
      const data = await res.json() as { data?: PanchangaResultType; error?: string }
      if (!res.ok || data.error) throw new Error(data.error ?? 'Failed to load Panchanga')
      if (data.data) setResult(data.data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto space-y-8">
      <PanchangaForm onSubmit={handleSubmit} loading={loading} />
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {result && <PanchangaResult result={result} />}
    </div>
  )
}
