import type { KundaliChartRecord } from '../types/kundali-chart'

export interface KundaliRepository {
  create(record: KundaliChartRecord): Promise<KundaliChartRecord>
  getById(id: string): Promise<KundaliChartRecord | null>
}
