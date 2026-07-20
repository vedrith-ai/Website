import type { KundaliRepository } from './kundali-repository'
import type { KundaliChartRecord } from '../types/kundali-chart'

interface SupabaseRow {
  id: string; name: string; gender: string; chart: unknown
  birth_tithi: unknown; birth_yoga: unknown; birth_karana: unknown
  house_placements: unknown; house_system_used: string
  created_at: string; updated_at: string
}

function toRow(r: KundaliChartRecord) {
  return { id: r.id, name: r.name, gender: r.gender, chart: r.chart,
    birth_tithi: r.birthTithi, birth_yoga: r.birthYoga, birth_karana: r.birthKarana,
    house_placements: r.housePlacements, house_system_used: r.houseSystemUsed,
    created_at: r.createdAt, updated_at: r.updatedAt }
}
function fromRow(row: SupabaseRow): KundaliChartRecord {
  return { id: row.id, name: row.name, gender: row.gender as KundaliChartRecord['gender'],
    chart: row.chart as KundaliChartRecord['chart'],
    birthTithi: row.birth_tithi as KundaliChartRecord['birthTithi'],
    birthYoga: row.birth_yoga as KundaliChartRecord['birthYoga'],
    birthKarana: row.birth_karana as KundaliChartRecord['birthKarana'],
    housePlacements: row.house_placements as KundaliChartRecord['housePlacements'],
    houseSystemUsed: row.house_system_used as KundaliChartRecord['houseSystemUsed'],
    createdAt: row.created_at, updatedAt: row.updated_at }
}

export class SupabaseKundaliRepository implements KundaliRepository {
  private baseUrl: string
  private headers: Record<string, string>
  constructor(url: string, key: string) {
    this.baseUrl = `${url.replace(/\/$/, '')}/rest/v1/kundali_charts`
    this.headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
  }
  async create(record: KundaliChartRecord): Promise<KundaliChartRecord> {
    const res = await fetch(this.baseUrl, {
      method: 'POST', headers: { ...this.headers, Prefer: 'return=representation' },
      body: JSON.stringify(toRow(record)) })
    if (!res.ok) throw new Error(`Supabase insert failed (${res.status})`)
    const rows = (await res.json()) as SupabaseRow[]
    if (!rows[0]) throw new Error('Supabase insert returned no rows')
    return fromRow(rows[0])
  }
  async getById(id: string): Promise<KundaliChartRecord | null> {
    const url = `${this.baseUrl}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`
    const res = await fetch(url, { method: 'GET', headers: this.headers })
    if (!res.ok) throw new Error(`Supabase fetch failed (${res.status})`)
    const rows = (await res.json()) as SupabaseRow[]
    return rows[0] ? fromRow(rows[0]) : null
  }
}
