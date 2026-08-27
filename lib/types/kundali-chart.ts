// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Kundali Engine V1 Types
// ─────────────────────────────────────────────────────────────────────────────
import type { PlanetId, KundaliChartData, HouseSystem, AyanamshaKey } from './kundali'
import type { TithiResult, YogaResult, KaranaResult } from './panchanga'

export type { AyanamshaKey }
export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export interface KundaliFormInput {
  name:         string
  gender:       Gender
  dateOfBirth:  string
  timeOfBirth:  string
  timezone:     string
  latitude:     number
  longitude:    number
  placeName:    string
  ayanamsha?:   AyanamshaKey
  houseSystem?: HouseSystem
}

export type HousePlacements = Record<PlanetId, number>
export type PlanetsByHouse  = Record<number, PlanetId[]>

export interface KundaliChartRecord {
  id:              string
  name:            string
  gender:          Gender
  chart:           KundaliChartData
  birthTithi:      TithiResult
  birthYoga:       YogaResult
  birthKarana:     KaranaResult
  housePlacements: HousePlacements
  houseSystemUsed: HouseSystem
  createdAt:       string
  updatedAt:       string
}

export type { ApiResponse, ApiSuccess, ApiError } from './panchanga'

export interface KundaliChartTheme {
  background:          string
  cellFill:            string
  cellFillAlt:         string
  cellStroke:          string
  textColor:           string
  houseNumberColor:    string
  ascendantHighlight:  string
  ascendantText:       string
}

export const DEFAULT_CHART_THEME: KundaliChartTheme = {
  background:          '#0D1525',
  cellFill:            'rgba(255,255,255,0.02)',
  cellFillAlt:         'rgba(255,255,255,0.04)',
  cellStroke:          'rgba(201,160,82,0.35)',
  textColor:           '#F8F3EC',
  houseNumberColor:    'rgba(201,160,82,0.55)',
  ascendantHighlight:  'rgba(201,160,82,0.16)',
  ascendantText:       '#E8C97A',
}

export const PLANET_ABBREVIATIONS: Record<PlanetId, string> = {
  SUN: 'Su', MOON: 'Mo', MARS: 'Ma', MERCURY: 'Me',
  JUPITER: 'Ju', VENUS: 'Ve', SATURN: 'Sa', RAHU: 'Ra', KETU: 'Ke',
}

export const ASCENDANT_ABBREVIATION = 'Asc'
