'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import KundaliBirthForm from '@/components/kundali/KundaliBirthForm'
import type { KundaliFormValues } from '@/components/kundali/KundaliBirthForm'
import type { ApiResponse } from '@/lib/types/panchanga'
import type { KundaliChartRecord } from '@/lib/types/kundali-chart'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function KundaliPage() {
  const router  = useRouter()
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
      const data = await res.json() as ApiResponse<KundaliChartRecord>
      if (!data.success) { setError(data.error.message); return }
      router.push(`/kundali/${data.data.id}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <Header />

      {/* Page header */}
      <div className="border-b border-white/[0.06] pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold-500 mb-3">Kundali Engine V1</p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-cream-100 mb-2">
            Vedic Birth Chart Generator
          </h1>
          <p className="font-sans text-sm text-cream-100/50 max-w-xl">
            Generate a complete Vedic birth chart — Lagna, all 9 planets, house cusps,
            Nakshatra, Tithi, Yoga, Karana — in South and North Indian chart styles.
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-10 items-start">

          {/* Form */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-navy-900/70 border border-white/[0.08] p-6 rounded-xl">
              <p className="font-sans text-[0.6rem] tracking-[0.25em] uppercase text-gold-500/70 mb-5">
                Birth Details
              </p>
              <KundaliBirthForm onSubmit={handleSubmit} loading={loading} />
            </div>
            {error && (
              <div className="mt-4 bg-red-500/8 border border-red-500/20 rounded-xl p-4" role="alert">
                <p className="font-sans text-sm text-red-400">{error}</p>
              </div>
            )}
            <p className="font-sans text-[0.6rem] text-cream-100/20 mt-3 leading-relaxed">
              Calculations use VSOP87 / ELP2000 astronomical algorithms with Lahiri ayanamsha.
            </p>
          </div>

          {/* Empty state (desktop) */}
          <div className="hidden lg:flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="relative w-48 h-48 mb-8" aria-hidden="true">
              {[40, 72, 110, 152, 192].map((s, i) => (
                <div key={s} className="absolute rounded-full border border-gold-500/15"
                  style={{ width: s, height: s, top: '50%', left: '50%',
                           transform: 'translate(-50%,-50%)', opacity: 0.9 - i * 0.15 }} />
              ))}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-5xl text-gold-500/25">
                ॐ
              </span>
            </div>
            <p className="font-serif text-xl font-light text-cream-100/40 mb-2">
              Enter birth details to generate your chart
            </p>
            <p className="font-sans text-xs text-cream-100/25 max-w-xs">
              Your South Indian and North Indian Kundali charts will appear here,
              with a complete planetary positions table and house placements.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/panchanga" className="font-sans text-xs text-gold-400/70 hover:text-gold-400 transition-colors">
                View Panchanga →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
