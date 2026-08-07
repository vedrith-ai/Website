// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Share Card Types  [V1.3]
//
// Defines the data model for daily Panchanga share cards.
// Architecture is forward-compatible with:
//   • Additional themes (premium)
//   • A4 / PDF export
//   • Personalised cards (with birth chart overlay)
// ─────────────────────────────────────────────────────────────────────────────

// ── Card theme ────────────────────────────────────────────────────────────────

export type ShareCardTheme =
  | 'traditional'   // Dark navy/gold — VedRith signature style
  | 'modern'        // Clean white with accent colour
  | 'kannada'       // Kannada-first layout with traditional decorations
  // future: 'premium-gold' | 'premium-dark' | 'saffron'

// ── Card format ───────────────────────────────────────────────────────────────

export type ShareCardFormat =
  | 'square'        // 1080×1080 — Instagram / WhatsApp
  | 'story'         // 1080×1920 — Instagram/WhatsApp Stories
  | 'landscape'     // 1200×630 — Twitter / Facebook / LinkedIn
  // future: 'a4'   // 2480×3508 — Printable A4

// ── Card language ─────────────────────────────────────────────────────────────

export type ShareCardLang = 'en' | 'kn'

// ── Card data (populated from PanchangaResult + location + date) ──────────────

export interface ShareCardData {
  // Date & location
  date:         string       // YYYY-MM-DD
  dateDisplay:  string       // e.g. "Monday, 5 August 2026"
  locationName: string
  locationKn?:  string

  // Five angas
  tithi:     { name: string; nameKn: string; paksha: string; pakshaKn: string }
  nakshatra: { name: string; nameKn: string }
  yoga:      { name: string; nameKn?: string }
  karana:    { name: string; nameKn?: string }
  vara:      { name: string; nameKn: string }

  // Solar / lunar times
  sunrise:   string
  sunset:    string
  moonrise?: string
  rahuKalam: { start: string; end: string }

  // Masa & samvatsara
  masa?:       string
  masaKn?:     string
  samvatsara?: string

  // Festival (primary, if any)
  festival?: { nameEn: string; nameKn: string; deity: string; type: string }

  // Deity of the day
  deity: { nameEn: string; nameKn: string; mantraEn: string; mantraKn?: string; symbol: string }

  // Spiritual message
  message: { en: string; kn: string; sourceEn: string; sourceKn: string }

  // Auspicious
  auspicious: {
    colour:    { en: string; kn: string }
    number:    number
    direction: { en: string; kn: string }
  }

  // Card metadata
  theme:        ShareCardTheme
  format:       ShareCardFormat
  lang:         ShareCardLang
  generatedAt:  string   // ISO timestamp
  brandName:    string   // 'VedRith'
  tagline:      string
}

// ── Share action result ───────────────────────────────────────────────────────

export type ShareAction = 'download' | 'native-share' | 'copy-image' | 'copy-url'

export interface ShareResult {
  success:  boolean
  action:   ShareAction
  error?:   string
}

// ── Card dimensions ───────────────────────────────────────────────────────────

export const CARD_DIMENSIONS: Record<ShareCardFormat, { width: number; height: number }> = {
  square:    { width: 1080, height: 1080 },
  story:     { width: 1080, height: 1920 },
  landscape: { width: 1200, height:  630 },
}
