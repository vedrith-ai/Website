import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getKundaliRepository } from '@/lib/db'
import KundaliResult from '@/components/kundali/KundaliResult'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id }=await params
  const record=await getKundaliRepository().getById(id).catch(()=>null)
  if(!record) return { title:'Chart Not Found | VedRith' }
  return {
    title:`${record.name} — Janma Kundali | VedRith`,
    description:`Vedic birth chart for ${record.name}, born ${record.chart.birthData.dateOfBirth} at ${record.chart.birthData.placeName}.`,
    robots:{ index:false, follow:false },
  }
}

export default async function KundaliChartPage({ params }: Props) {
  const { id }=await params
  let record
  try { record=await getKundaliRepository().getById(id) }
  catch { record=null }
  if(!record) notFound()

  return (
    <div className="min-h-screen bg-navy-950">
      <nav className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-cream-100">VedRith</Link>
          <Link href="/kundali" className="font-sans text-[0.65rem] tracking-[0.18em] uppercase text-cream-100/50 hover:text-gold-400 transition-colors">← New Chart</Link>
        </div>
      </nav>
      <div className="border-b border-white/[0.06] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-[0.6rem] tracking-[0.3em] uppercase text-gold-500 mb-2">Janma Kundali</p>
          <h1 className="font-serif text-2xl md:text-3xl font-light text-cream-100">{record.name}</h1>
          <p className="font-sans text-sm text-cream-100/40 mt-1">{record.chart.birthData.dateOfBirth} · {record.chart.birthData.placeName}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <KundaliResult record={record}/>
        <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between">
          <p className="font-sans text-xs text-cream-100/25">Chart ID: <code className="font-mono text-cream-100/40">{record.id}</code></p>
          <Link href="/kundali" className="font-sans text-[0.7rem] tracking-[0.14em] uppercase px-5 py-2 border border-white/20 text-cream-100/50 hover:border-gold-500/40 hover:text-gold-400 transition-colors">Generate Another Chart</Link>
        </div>
      </div>
    </div>
  )
}
