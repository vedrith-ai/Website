// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Kundali Name Lookups  [V1.1]
//
// Rich name display for Kundali — converts numeric indices to
// localised names with both traditional name and number.
//
// Examples:
//   nakshatraLabel(4, 'en') → "Rohini (4)"
//   nakshatraLabel(4, 'kn') → "ರೋಹಿಣಿ (4)"
//   rashiLabel(2, 'kn')    → "ವೃಷಭ (2)"
// ─────────────────────────────────────────────────────────────────────────────

import type { LanguageCode } from './types'

// ── Nakshatra names (1-based: 1=Ashwini … 27=Revati) ─────────────────────────

const NAKSHATRA_EN: string[] = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu',
  'Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta',
  'Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Moola','Purva Ashadha',
  'Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada',
  'Uttara Bhadrapada','Revati',
]

const NAKSHATRA_KN: string[] = [
  'ಅಶ್ವಿನಿ','ಭರಣಿ','ಕೃತ್ತಿಕಾ','ರೋಹಿಣಿ','ಮೃಗಶಿರಾ','ಆರ್ದ್ರಾ','ಪುನರ್ವಸು',
  'ಪುಷ್ಯ','ಆಶ್ಲೇಷಾ','ಮಘಾ','ಪೂರ್ವ ಫಲ್ಗುಣಿ','ಉತ್ತರ ಫಲ್ಗುಣಿ','ಹಸ್ತ',
  'ಚಿತ್ರಾ','ಸ್ವಾತಿ','ವಿಶಾಖಾ','ಅನುರಾಧಾ','ಜ್ಯೇಷ್ಠಾ','ಮೂಲ','ಪೂರ್ವಾಷಾಢ',
  'ಉತ್ತರಾಷಾಢ','ಶ್ರವಣ','ಧನಿಷ್ಠಾ','ಶತಭಿಷಾ','ಪೂರ್ವಾಭಾದ್ರ','ಉತ್ತರಾಭಾದ್ರ','ರೇವತಿ',
]

/** Get nakshatra name for 1-based index, with (n) appended */
export function nakshatraLabel(index: number, lang: LanguageCode): string {
  const i    = index - 1
  const name = lang === 'kn' ? (NAKSHATRA_KN[i] ?? '') : (NAKSHATRA_EN[i] ?? '')
  return name ? `${name} (${index})` : `#${index}`
}

/** Get just the nakshatra name without number */
export function nakshatraName(index: number, lang: LanguageCode): string {
  const i = index - 1
  return (lang === 'kn' ? NAKSHATRA_KN[i] : NAKSHATRA_EN[i]) ?? `#${index}`
}

// ── Rashi names (1-based: 1=Mesha/Aries … 12=Meena/Pisces) ──────────────────

export interface RashiInfo {
  sanskrit: string
  en:       string
  kn:       string
  symbol:   string
}

export const RASHI_INFO: RashiInfo[] = [
  { sanskrit:'Mesha',      en:'Aries',       kn:'ಮೇಷ',      symbol:'♈' },
  { sanskrit:'Vrishabha',  en:'Taurus',      kn:'ವೃಷಭ',     symbol:'♉' },
  { sanskrit:'Mithuna',    en:'Gemini',      kn:'ಮಿಥುನ',    symbol:'♊' },
  { sanskrit:'Karka',      en:'Cancer',      kn:'ಕರ್ಕ',     symbol:'♋' },
  { sanskrit:'Simha',      en:'Leo',         kn:'ಸಿಂಹ',     symbol:'♌' },
  { sanskrit:'Kanya',      en:'Virgo',       kn:'ಕನ್ಯಾ',    symbol:'♍' },
  { sanskrit:'Tula',       en:'Libra',       kn:'ತುಲಾ',     symbol:'♎' },
  { sanskrit:'Vrishchika', en:'Scorpio',     kn:'ವೃಶ್ಚಿಕ',  symbol:'♏' },
  { sanskrit:'Dhanu',      en:'Sagittarius', kn:'ಧನು',      symbol:'♐' },
  { sanskrit:'Makara',     en:'Capricorn',   kn:'ಮಕರ',      symbol:'♑' },
  { sanskrit:'Kumbha',     en:'Aquarius',    kn:'ಕುಂಭ',     symbol:'♒' },
  { sanskrit:'Meena',      en:'Pisces',      kn:'ಮೀನ',      symbol:'♓' },
]

/** Get Rashi info for 0-based index (RashiIndex type) */
export function getRashiInfo(rashi: number): RashiInfo {
  return RASHI_INFO[rashi] ?? { sanskrit:'?', en:'?', kn:'?', symbol:'?' }
}

/** Full label: "Rohini — Taurus (2)" */
export function rashiLabel(rashi: number, lang: LanguageCode): string {
  const info = getRashiInfo(rashi)
  const num  = rashi + 1
  if (lang === 'kn') return `${info.kn} ${info.symbol} (${num})`
  return `${info.sanskrit} — ${info.en} ${info.symbol} (${num})`
}

/** Short label: "ವೃಷಭ ♉" */
export function rashiShort(rashi: number, lang: LanguageCode): string {
  const info = getRashiInfo(rashi)
  const name = lang === 'kn' ? info.kn : `${info.sanskrit}`
  return `${name} ${info.symbol}`
}

// ── Planet display names ───────────────────────────────────────────────────────

export type PlanetKey = 'SUN'|'MOON'|'MARS'|'MERCURY'|'JUPITER'|'VENUS'|'SATURN'|'RAHU'|'KETU'

export interface PlanetInfo {
  key:     PlanetKey
  en:      string
  kn:      string
  sa:      string   // Sanskrit name
  symbol:  string
  order:   number   // traditional display order
}

export const PLANET_INFO: Record<PlanetKey, PlanetInfo> = {
  SUN:     { key:'SUN',     en:'Sun',     kn:'ಸೂರ್ಯ',   sa:'Surya',     symbol:'☉', order:1 },
  MOON:    { key:'MOON',    en:'Moon',    kn:'ಚಂದ್ರ',   sa:'Chandra',   symbol:'☽', order:2 },
  MARS:    { key:'MARS',    en:'Mars',    kn:'ಕುಜ',      sa:'Mangala',   symbol:'♂', order:3 },
  MERCURY: { key:'MERCURY', en:'Mercury', kn:'ಬುಧ',      sa:'Budha',     symbol:'☿', order:4 },
  JUPITER: { key:'JUPITER', en:'Jupiter', kn:'ಗುರು',    sa:'Brihaspati',symbol:'♃', order:5 },
  VENUS:   { key:'VENUS',   en:'Venus',   kn:'ಶುಕ್ರ',   sa:'Shukra',    symbol:'♀', order:6 },
  SATURN:  { key:'SATURN',  en:'Saturn',  kn:'ಶನಿ',     sa:'Shani',     symbol:'♄', order:7 },
  RAHU:    { key:'RAHU',    en:'Rahu',    kn:'ರಾಹು',    sa:'Rahu',      symbol:'☊', order:8 },
  KETU:    { key:'KETU',    en:'Ketu',    kn:'ಕೇತು',    sa:'Ketu',      symbol:'☋', order:9 },
}

/** Get planet display name in language */
export function planetName(key: PlanetKey, lang: LanguageCode): string {
  const info = PLANET_INFO[key]
  if (!info) return key
  return lang === 'kn' ? `${info.kn} (${info.sa})` : `${info.en} (${info.sa})`
}

/** Get short planet name */
export function planetShort(key: PlanetKey, lang: LanguageCode): string {
  const info = PLANET_INFO[key]
  if (!info) return key
  return lang === 'kn' ? info.kn : info.en
}

// ── House labels ──────────────────────────────────────────────────────────────

const HOUSE_KN = [
  'ಪ್ರಥಮ','ದ್ವಿತೀಯ','ತೃತೀಯ','ಚತುರ್ಥ','ಪಂಚಮ','ಷಷ್ಠ',
  'ಸಪ್ತಮ','ಅಷ್ಟಮ','ನವಮ','ದಶಮ','ಏಕಾದಶ','ದ್ವಾದಶ',
]
const HOUSE_EN = [
  '1st','2nd','3rd','4th','5th','6th',
  '7th','8th','9th','10th','11th','12th',
]

export function houseLabel(house: number, lang: LanguageCode): string {
  const i = house - 1
  const name = lang === 'kn' ? (HOUSE_KN[i] ?? `${house}`) : (HOUSE_EN[i] ?? `${house}`)
  return lang === 'kn' ? `${name} ಭವ (${house})` : `${name} House`
}

export function houseShort(house: number, lang: LanguageCode): string {
  const i = house - 1
  return lang === 'kn'
    ? (HOUSE_KN[i] ?? `${house}`) + ` (${house})`
    : HOUSE_EN[i] ?? `${house}`
}
