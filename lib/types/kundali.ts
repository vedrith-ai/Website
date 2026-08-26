import type { AyanamshaKey } from './panchanga'
export type { AyanamshaKey }

export type PlanetId = 'SUN'|'MOON'|'MARS'|'MERCURY'|'JUPITER'|'VENUS'|'SATURN'|'RAHU'|'KETU'
export const ALL_PLANETS: PlanetId[] = ['SUN','MOON','MARS','MERCURY','JUPITER','VENUS','SATURN','RAHU','KETU']

export type RashiIndex = 0|1|2|3|4|5|6|7|8|9|10|11

export const RASHI_NAMES: Record<RashiIndex, { en: string; sa: string; symbol: string }> = {
  0:  { en: 'Aries',       sa: 'Mesha',      symbol: '♈' },
  1:  { en: 'Taurus',      sa: 'Vrishabha',  symbol: '♉' },
  2:  { en: 'Gemini',      sa: 'Mithuna',    symbol: '♊' },
  3:  { en: 'Cancer',      sa: 'Karka',      symbol: '♋' },
  4:  { en: 'Leo',         sa: 'Simha',      symbol: '♌' },
  5:  { en: 'Virgo',       sa: 'Kanya',      symbol: '♍' },
  6:  { en: 'Libra',       sa: 'Tula',       symbol: '♎' },
  7:  { en: 'Scorpio',     sa: 'Vrishchika', symbol: '♏' },
  8:  { en: 'Sagittarius', sa: 'Dhanu',      symbol: '♐' },
  9:  { en: 'Capricorn',   sa: 'Makara',     symbol: '♑' },
  10: { en: 'Aquarius',    sa: 'Kumbha',     symbol: '♒' },
  11: { en: 'Pisces',      sa: 'Meena',      symbol: '♓' },
}

export type HouseSystem = 'WHOLE_SIGN'|'EQUAL'|'PLACIDUS'

export interface PlanetaryPosition {
  planet: PlanetId; longitude: number; latitude: number; distance: number
  rashi: RashiIndex; rashiLongitude: number; nakshatra: number; pada: number
  isRetrograde: boolean; dailyMotion: number
}
export type PlanetaryPositions = Record<PlanetId, PlanetaryPosition>

export interface AscendantResult {
  longitude: number; rashi: RashiIndex; rashiLongitude: number
  nakshatra: number; pada: number; ramc: number
}

export interface HouseCusps {
  system: HouseSystem
  cusps: [number,number,number,number,number,number,number,number,number,number,number,number]
  rashis?: [RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex,RashiIndex]
}

export interface ObliquityResult {
  meanObliquity: number; trueObliquity: number
  nutationLongitude: number; nutationObliquity: number
}

export interface EquatorialCoords { rightAscension: number; declination: number }

export interface BirthData {
  name: string; dateOfBirth: string; timeOfBirth: string; timezone: string
  latitude: number; longitude: number; placeName: string; ayanamsha?: AyanamshaKey
}

export interface ValidatedBirthData extends Required<BirthData> {
  julianDay: number; utcOffset: number
}

export interface KundaliChartData {
  birthData: ValidatedBirthData; ascendant: AscendantResult
  planets: PlanetaryPositions; houseCusps: HouseCusps; obliquity: ObliquityResult
  ayanamsha: AyanamshaKey; ayanamshaValue: number; computedAt: string
}

export type KundaliErrorCode = 'INVALID_DATE'|'INVALID_TIME'|'INVALID_TIMEZONE'|'INVALID_COORDINATES'|'INVALID_NAME'|'DATE_OUT_OF_RANGE'|'COMPUTATION_ERROR'

export interface KundaliError { code: KundaliErrorCode; message: string; field?: keyof BirthData }

export type KundaliResult<T> = { success: true; data: T } | { success: false; error: KundaliError }
