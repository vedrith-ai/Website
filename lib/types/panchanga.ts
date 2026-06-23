// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Panchanga Engine Types  (V1.1 — additive extensions marked below)
// All types shared across the Panchanga calculation pipeline
// ─────────────────────────────────────────────────────────────────────────────

// ── Region keys ───────────────────────────────────────────────────────────────
export type RegionKey =
  | 'KANNADA'
  | 'TELUGU'
  | 'TAMIL'
  | 'MALAYALAM'
  | 'GUJARATI'
  | 'MAHARASHTRIAN'
  | 'BENGALI'
  | 'NORTH_INDIAN'

// ── Ayanamsha keys ────────────────────────────────────────────────────────────
export type AyanamshaKey = 'LAHIRI' | 'KP' | 'RAMAN' | 'TRUE_CHITRA'

// ── Paksha (lunar fortnight) ──────────────────────────────────────────────────
export type Paksha = 'SHUKLA' | 'KRISHNA'

// ── [V1.1] Lunar calendar system ─────────────────────────────────────────────
/** Amanta: month ends at Amavasya (South Indian / Kannada tradition).
 *  Purnimanta: month ends at Purnima (North Indian tradition). */
export type CalendarSystem = 'AMANTA' | 'PURNIMANTA'

// ── [V1.1] Display language ───────────────────────────────────────────────────
/** Languages supported for display-name localisation.
 *  Extensible: add 'te'|'ta'|'ml'|'sa' in a future release. */
export type LanguageCode = 'en' | 'kn'

// ── Time range ────────────────────────────────────────────────────────────────
export interface TimeRange {
  start:  Date
  end:    Date
  /** Human-readable start in local time, e.g. "10:30 AM" */
  startLocal: string
  /** Human-readable end in local time, e.g. "12:00 PM" */
  endLocal:   string
}

// ── Tithi ─────────────────────────────────────────────────────────────────────
export interface TithiResult {
  number:     number          // 1–30 (15 Shukla + 15 Krishna)
  name:       string          // e.g. "Panchami"
  nameLocal:  string          // Regional name
  paksha:     Paksha
  pakshaName: string          // "Shukla" or "Krishna" (regional)
  endTime:    Date            // When this tithi ends
  endLocal:   string          // Formatted end time
  completed:  number          // % elapsed, 0–100
  quality:    'SHUBHA' | 'ASHUBHA' | 'MIXED'
  /** [V1.1] Display name in the requested language */
  displayName?: string
}

// ── Nakshatra ─────────────────────────────────────────────────────────────────
export interface NakshatraResult {
  number:    number           // 1–27
  name:      string           // Sanskrit / English name
  nameLocal: string           // Regional name
  pada:      number           // 1–4
  endTime:   Date
  endLocal:  string
  deity:     string           // Ruling deity
  ruler:     string           // Ruling planet
  quality:   'SHUBHA' | 'ASHUBHA' | 'MIXED'
  /** [V1.1] Display name in the requested language */
  displayName?: string
}

// ── Yoga ──────────────────────────────────────────────────────────────────────
export interface YogaResult {
  number:    number           // 1–27
  name:      string
  endTime:   Date
  endLocal:  string
  quality:   'SHUBHA' | 'ASHUBHA' | 'MIXED'
  /** [V1.1] Display name in the requested language */
  displayName?: string
}

// ── Karana ────────────────────────────────────────────────────────────────────
export interface KaranaResult {
  number:   number            // 1–11 (Karana type index)
  name:     string
  isFixed:  boolean           // Fixed (Sthira) or Movable (Chara)
  endTime:  Date
  endLocal: string
  quality:  'SHUBHA' | 'ASHUBHA' | 'MIXED'
  /** [V1.1] Display name in the requested language */
  displayName?: string
}

// ── Vara (weekday) ────────────────────────────────────────────────────────────
export interface VaraResult {
  number:   number            // 0=Sun, 1=Mon, ..., 6=Sat
  name:     string            // e.g. "Sunday"
  nameLocal: string           // Regional weekday name
  ruler:    string            // Ruling planet
  quality:  'SHUBHA' | 'ASHUBHA' | 'MIXED'
  /** [V1.1] Display name in the requested language */
  displayName?: string
}

// ── [V1.1] Masa (Chandramana lunar month) ────────────────────────────────────
export interface MasaInfo {
  /** 0=Chaitra … 11=Phalguna */
  index: number
  name:  string
  displayName: string         // in the requested language
}

export interface MasaResult {
  amanta:         MasaInfo
  purnimanta:     MasaInfo
  calendarSystem: CalendarSystem
  /** The masa matching the user's chosen calendarSystem */
  current:        MasaInfo
}

// ── [V1.1] Samvatsara (60-year cycle) ────────────────────────────────────────
export interface SamvatsaraResult {
  /** 1-based position in the 60-year cycle (1=Prabhava … 60=Akshaya) */
  index:      number
  name:       string
  displayName: string         // in the requested language
  shakaYear:  number
  vikramYear: number
}

// ── Panchanga query input ─────────────────────────────────────────────────────
export interface PanchangaQuery {
  date:       string          // YYYY-MM-DD in local time
  lat:        number          // Decimal degrees
  lng:        number          // Decimal degrees
  timezone:   string          // IANA timezone, e.g. "Asia/Kolkata"
  region:     RegionKey
  ayanamsha?: AyanamshaKey    // Default: LAHIRI
  locationName?: string       // Display label for the location
  /** [V1.1] Display language. Default: 'en' */
  lang?:           LanguageCode
  /** [V1.1] Lunar calendar system. Default: 'AMANTA' */
  calendarSystem?: CalendarSystem
}

// ── Complete Panchanga result ─────────────────────────────────────────────────
export interface PanchangaResult {
  // Query echo
  date:          string
  location: {
    lat:          number
    lng:          number
    timezone:     string
    name:         string
  }
  region:         RegionKey
  ayanamsha:      AyanamshaKey
  ayanamshaValue: number      // Degrees of ayanamsha at this date

  // Solar/lunar times
  sunrise:  Date
  sunset:   Date
  moonrise: Date | null
  moonset:  Date | null

  // Formatted local times
  sunriseLocal:  string
  sunsetLocal:   string
  moonriseLocal: string | null
  moonsetLocal:  string | null

  // Five limbs
  tithi:     TithiResult
  nakshatra: NakshatraResult
  yoga:      YogaResult
  karana:    KaranaResult
  vara:      VaraResult

  // [V1.1] Traditional calendar context
  masa:        MasaResult
  samvatsara:  SamvatsaraResult

  // [V1.1] Active language and calendar system
  lang:           LanguageCode
  calendarSystem: CalendarSystem

  // Inauspicious periods
  rahuKalam:   TimeRange
  gulikaKalam: TimeRange
  yamaganda:   TimeRange

  // Auspicious
  abhijitMuhurta: TimeRange

  // Metadata
  computedAt: string          // ISO timestamp
  julianDay:  number          // JD at local sunrise
}

// ── Geocode result ────────────────────────────────────────────────────────────
export interface GeocodeResult {
  name:     string
  lat:      number
  lng:      number
  timezone: string
  country:  string
}

// ── API response wrapper ──────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  success: true
  data:    T
  meta: {
    request_id:  string
    computed_at: string
    cache_hit:   boolean
  }
}

export interface ApiError {
  success: false
  error: {
    code:    string
    message: string
    field?:  string
  }
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

