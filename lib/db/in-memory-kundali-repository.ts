import type { KundaliRepository } from './kundali-repository'
import type { KundaliChartRecord } from '../types/kundali-chart'

export class InMemoryKundaliRepository implements KundaliRepository {
  private store = new Map<string, KundaliChartRecord>()
  async create(record: KundaliChartRecord): Promise<KundaliChartRecord> {
    this.store.set(record.id, record)
    return record
  }
  async getById(id: string): Promise<KundaliChartRecord | null> {
    return this.store.get(id) ?? null
  }
}
