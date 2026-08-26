// ─────────────────────────────────────────────────────────────────────────────
// Regional Panchanga Configuration Types
// Each of the 8 supported regional traditions has its own name maps,
// calendar epoch preferences, and Rahu Kalam naming conventions.
// ─────────────────────────────────────────────────────────────────────────────

import type { RegionKey } from '../../../types/panchanga'

export interface RegionalConfig {
  key:              RegionKey
  displayName:      string
  language:         string

  // Panchanga term names in regional language
  nakshatraNames:   string[]   // 27 entries
  tithiShukla:      string[]   // 15 entries (Pratipada…Purnima)
  tithiKrishna:     string[]   // 15 entries (Pratipada…Amavasya)
  pakshaShukla:     string     // "Shukla" in regional
  pakshaKrishna:    string     // "Krishna" in regional
  yogaNames:        string[]   // 27 entries (same Sanskrit names mostly)
  varNames:         string[]   // 7 entries (Sun…Sat)
}
