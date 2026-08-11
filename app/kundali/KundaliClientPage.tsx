'use client'

import { useState, useCallback } from 'react'
import KundaliBirthForm, { type KundaliFormValues } from '@/components/kundali/KundaliBirthForm'
import KundaliResult from '@/components/kundali/KundaliResult'
import type { KundaliChartRecord } from '@/lib/types/kundali-chart'

export default function KundaliClientPage() {
  const [result,  setResult]  = useState<KundaliChartRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleSubmit = useCallback(async (values: KundaliFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/v1/kundali/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(values),
      })
      const data = await res.json() as { data?: KundaliChartRecord; error?: string }
      if (!res.ok || data.error) throw new Error(data.error ?? 'Kundali generation failed')
      if (data.data) setResult(data.data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto space-y-8">
      <KundaliBirthForm onSubmit={handleSubmit} loading={loading} />
      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {result && <KundaliResult record={result} />}
    </div>
  )
}
