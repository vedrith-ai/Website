'use client'

import { useState, useCallback } from 'react'
import Image                       from 'next/image'
import Link                        from 'next/link'
import PanchangaForm               from '@/components/panchanga/PanchangaForm'
import PanchangaResult             from '@/components/panchanga/PanchangaResult'
import type { PanchangaResult as TPanchangaResult, ApiResponse } from '@/lib/types/panchanga'
import type { PanchangaFormValues }  from '@/components/panchanga/PanchangaForm'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function PanchangaPage() {
  const [result,  setResult]  = useState<TPanchangaResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const handleSubmit = useCallback(async (values: PanchangaFormValues) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const params = new URLSearchParams({
        date:         values.date,
        lat:          String(values.lat),
        lng:          String(values.lng),
        timezone:     values.timezone,
        region:       values.region,
        ayanamsha:    values.ayanamsha,
        locationName: values.locationName,
        lang:           values.lang,            // [V1.1]
        calendarSystem: values.calendarSystem,   // [V1.1]
      })

      const res  = await fetch(`/api/v1/panchanga/daily?${params.toString()}`)
      const data = await res.json() as ApiResponse<TPanchangaResult>

      if (!data.success) {
        setError(data.error.message)
        return
      }

      setResult(data.data)

      // Scroll to results on mobile
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('panchanga-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-navy-950">

      {/* ── Top navigation ──────────────────────────────────────────────── */}
    <Header />

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="border-b border-white/[0.06] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold-500 mb-3">
            Pañcāṅga Engine V1.1
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-cream-100 mb-2 leading-tight">
            Traditional Kannada Panchanga Calculator
          </h1>
          <p className="font-sans text-sm text-cream-100/50 max-w-xl">
            Astronomical-grade Panchanga for any date, city, and regional tradition.
            All five limbs, Paksha, Chandramana Masa, Samvatsara, Rahu Kalam, and Abhijit Muhurta —
            in English and Kannada.
          </p>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">

          {/* ── Form panel ────────────────────────────────────────────── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-navy-900/70 border border-white/[0.08] p-6">
              <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-5">
                Calculation Parameters
              </p>
              <PanchangaForm onSubmit={handleSubmit} loading={loading} />
            </div>

            {/* Disclaimer */}
            <p className="font-sans text-[0.6rem] text-cream-100/20 mt-3 leading-relaxed">
              Calculations use VSOP87 / ELP2000 astronomical algorithms.
              Accuracy: Sun ±0.01°, Moon ±0.1°. Sufficient for all Panchanga determinations.
            </p>
          </div>

          {/* ── Results panel ─────────────────────────────────────────── */}
          <div id="panchanga-result">
            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-4 animate-pulse" aria-busy="true" aria-label="Loading Panchanga">
                <div className="h-28 bg-navy-800/50 border border-white/[0.05]" />
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-36 bg-navy-800/40 border border-white/[0.04]" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-32 bg-navy-800/40 border border-white/[0.04]" />
                  <div className="h-32 bg-navy-800/40 border border-white/[0.04]" />
                </div>
                <div className="h-28 bg-navy-800/40 border border-white/[0.04]" />
                <div className="h-24 bg-navy-800/40 border border-white/[0.04]" />
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="bg-red-500/8 border border-red-500/20 p-6" role="alert">
                <div className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171"
                       strokeWidth="1.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                  <div>
                    <p className="font-sans text-sm text-red-400 font-medium mb-1">Calculation Error</p>
                    <p className="font-sans text-xs text-red-300/70">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                {/* Decorative mandala rings */}
                <div className="relative w-32 h-32 mb-8" aria-hidden="true">
                  {[32, 56, 80, 112].map((size, i) => (
                    <div
                      key={size}
                      className="absolute rounded-full border border-gold-500/15"
                      style={{
                        width: size, height: size,
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.8 - i * 0.15,
                      }}
                    />
                  ))}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                  font-serif text-3xl text-gold-500/30">ॐ</div>
                </div>
                <p className="font-serif text-xl font-light text-cream-100/40 mb-2">
                  Select a date and location
                </p>
                <p className="font-sans text-xs text-cream-100/25 max-w-sm">
                  Enter your date, search for your city, choose your regional tradition,
                  and calculate your Panchanga.
                </p>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <PanchangaResult result={result} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
