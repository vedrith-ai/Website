import type { KundaliRepository } from './kundali-repository'
import { InMemoryKundaliRepository } from './in-memory-kundali-repository'
import { SupabaseKundaliRepository } from './supabase-kundali-repository'

let _repo: KundaliRepository | null = null
let _warned = false

export function getKundaliRepository(): KundaliRepository {
  if (_repo) return _repo
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url && key) {
    _repo = new SupabaseKundaliRepository(url, key)
  } else {
    if (!_warned) {
      console.warn('[VedRith] No Supabase config — using in-memory repository (data will not persist)')
      _warned = true
    }
    _repo = new InMemoryKundaliRepository()
  }
  return _repo
}
