// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Planet Dignity Engine  [V1.2]
//
// Calculates classical Vedic planetary dignities:
//   Exaltation, Debilitation, Own Sign, Moolatrikona,
//   Friendly, Neutral, Enemy sign, Combust, Retrograde
//
// Source: BPHS (Brihat Parashara Hora Shastra) Chapter 3,
//         Saravali (Kalyana Varma), Jataka Parijata
// ─────────────────────────────────────────────────────────────────────────────

import type { LanguageCode } from '@/lib/i18n/types'

export type PlanetKey = 'SUN'|'MOON'|'MARS'|'MERCURY'|'JUPITER'|'VENUS'|'SATURN'|'RAHU'|'KETU'

export type DignityType =
  | 'Exalted'         // Uchcha — strongest position
  | 'Moolatrikona'    // Own-like sign (secondary own sign)
  | 'OwnSign'         // Swa — planet in its own rashi
  | 'Friendly'        // Mitra — friend's sign
  | 'Neutral'         // Sama — neutral sign
  | 'Enemy'           // Shatru — enemy's sign
  | 'Debilitated'     // Neecha — weakest position
  | 'Combust'         // Asta — within Sun's combustion range
  | 'Retrograde'      // Vakra — apparent backward motion

export interface DignityResult {
  planet:     PlanetKey
  dignity:    DignityType
  strength:   number       // 0 (weakest) to 6 (strongest)
  label:      string       // Display label
  labelKn:    string       // Kannada label
  description: string
  isAuspicious: boolean
}

// ── Classical dignity tables (0-based rashi index) ───────────────────────────
// Source: BPHS Ch.3

const EXALTATION_SIGN: Record<PlanetKey, number> = {
  SUN: 0, MOON: 1, MARS: 9, MERCURY: 5, JUPITER: 3, VENUS: 11, SATURN: 6,
  RAHU: 1, KETU: 7,   // Traditional: Rahu exalted in Taurus/Gemini (varies by text)
}

const DEBILITATION_SIGN: Record<PlanetKey, number> = {
  SUN: 6, MOON: 7, MARS: 3, MERCURY: 11, JUPITER: 9, VENUS: 5, SATURN: 0,
  RAHU: 7, KETU: 1,
}

const OWN_SIGNS: Record<PlanetKey, number[]> = {
  SUN:     [4],
  MOON:    [3],
  MARS:    [0, 7],
  MERCURY: [2, 5],
  JUPITER: [8, 11],
  VENUS:   [1, 6],
  SATURN:  [9, 10],
  RAHU:    [],
  KETU:    [],
}

const MOOLATRIKONA: Record<PlanetKey, number | null> = {
  SUN: 4, MOON: 1, MARS: 0, MERCURY: 5, JUPITER: 8, VENUS: 6, SATURN: 9,
  RAHU: null, KETU: null,
}

// Friendship table: PlanetKey → list of friendly planet keys
const FRIENDS: Record<PlanetKey, PlanetKey[]> = {
  SUN:     ['MOON','MARS','JUPITER'],
  MOON:    ['SUN','MERCURY'],
  MARS:    ['SUN','MOON','JUPITER'],
  MERCURY: ['SUN','VENUS'],
  JUPITER: ['SUN','MOON','MARS'],
  VENUS:   ['MERCURY','SATURN'],
  SATURN:  ['MERCURY','VENUS'],
  RAHU:    ['VENUS','SATURN'],
  KETU:    ['MARS','VENUS'],
}

const ENEMIES: Record<PlanetKey, PlanetKey[]> = {
  SUN:     ['VENUS','SATURN'],
  MOON:    ['RAHU','KETU'],
  MARS:    ['MERCURY'],
  MERCURY: ['MOON'],
  JUPITER: ['MERCURY','VENUS'],
  VENUS:   ['SUN','MOON'],
  SATURN:  ['SUN','MOON','MARS'],
  RAHU:    ['SUN','MOON'],
  KETU:    ['MOON','SUN'],
}

// Which planet rules which sign (0-based rashi index)
const SIGN_RULER: Record<number, PlanetKey> = {
  0:'MARS', 1:'VENUS', 2:'MERCURY', 3:'MOON', 4:'SUN', 5:'MERCURY',
  6:'VENUS', 7:'MARS', 8:'JUPITER', 9:'SATURN', 10:'SATURN', 11:'JUPITER',
}

// Combustion orbs (degrees from Sun) — planet is combust when closer than this
const COMBUSTION_ORB: Record<PlanetKey, number> = {
  SUN:0, MOON:12, MARS:17, MERCURY:14, JUPITER:11, VENUS:10, SATURN:15,
  RAHU:0, KETU:0,
}

// ── Dignity labels ────────────────────────────────────────────────────────────

const DIGNITY_LABELS: Record<DignityType, { en: string; kn: string; strength: number; auspicious: boolean; desc: string }> = {
  Exalted:      { en:'Exalted (Uchcha)',      kn:'ಉಚ್ಚ',         strength:6, auspicious:true,  desc:'Planet at its maximum strength — qualities fully expressed.' },
  Moolatrikona: { en:'Moolatrikona',          kn:'ಮೂಲತ್ರಿಕೋಣ',   strength:5, auspicious:true,  desc:'Secondary own sign — very strong position.' },
  OwnSign:      { en:'Own Sign (Swa)',         kn:'ಸ್ವ ರಾಶಿ',     strength:4, auspicious:true,  desc:'Planet in its own sign — comfortable and effective.' },
  Friendly:     { en:'Friendly Sign (Mitra)',  kn:'ಮಿತ್ರ ರಾಶಿ',   strength:3, auspicious:true,  desc:'Planet in a friend\'s sign — supportive, works well.' },
  Neutral:      { en:'Neutral Sign (Sama)',    kn:'ಸಮ ರಾಶಿ',      strength:2, auspicious:true,  desc:'Planet in a neutral sign — average results.' },
  Enemy:        { en:'Enemy Sign (Shatru)',    kn:'ಶತ್ರು ರಾಶಿ',   strength:1, auspicious:false, desc:'Planet in an enemy\'s sign — hampered, works with difficulty.' },
  Debilitated:  { en:'Debilitated (Neecha)',   kn:'ನೀಚ',          strength:0, auspicious:false, desc:'Planet at its minimum strength — qualities suppressed.' },
  Combust:      { en:'Combust (Asta)',         kn:'ಅಸ್ತ',         strength:0, auspicious:false, desc:'Planet too close to Sun — obscured, weakened.' },
  Retrograde:   { en:'Retrograde (Vakra)',     kn:'ವಕ್ರ',         strength:3, auspicious:true,  desc:'Apparent backward motion — intensified, inward energy.' },
}

// ── Core dignity calculation ──────────────────────────────────────────────────

/**
 * Calculate the dignity of a planet in a given rashi.
 *
 * @param planet    Planet key
 * @param rashi     0-based rashi index (0=Mesha, 11=Meena)
 * @param longitude Ecliptic longitude (0-360°) for retrograde/combust detection
 * @param sunLongitude Sun's ecliptic longitude (for combust detection)
 * @param isRetrograde Whether the planet is retrograde
 */
export function getPlanetDignity(
  planet:       PlanetKey,
  rashi:        number,
  longitude:    number,
  sunLongitude: number,
  isRetrograde: boolean,
  lang:         LanguageCode = 'en'  // eslint-disable-line @typescript-eslint/no-unused-vars
): DignityResult {
  const baseDignity = computeBaseDignity(planet, rashi)
  let dtype   = baseDignity
  let combust = false

  // Check combustion (only for non-Sun planets)
  if (planet !== 'SUN' && planet !== 'RAHU' && planet !== 'KETU') {
    const orb = COMBUSTION_ORB[planet]
    if (orb > 0) {
      let diff = Math.abs(longitude - sunLongitude)
      if (diff > 180) diff = 360 - diff
      if (diff < orb) {
        combust = true
        dtype   = 'Combust'
      }
    }
  }

  const info = DIGNITY_LABELS[dtype]

  return {
    planet,
    dignity:      dtype,
    strength:     combust ? 0 : (isRetrograde ? Math.max(info.strength, 3) : info.strength),
    label:        info.en,
    labelKn:      info.kn,
    description:  info.desc,
    isAuspicious: combust ? false : info.auspicious,
  }
}

function computeBaseDignity(planet: PlanetKey, rashi: number): DignityType {
  if (EXALTATION_SIGN[planet] === rashi)     return 'Exalted'
  if (DEBILITATION_SIGN[planet] === rashi)   return 'Debilitated'
  if (OWN_SIGNS[planet].includes(rashi))     return 'OwnSign'
  if (MOOLATRIKONA[planet] === rashi)        return 'Moolatrikona'

  // Determine friendship via sign ruler
  const ruler = SIGN_RULER[rashi]
  if (!ruler || ruler === planet)            return 'OwnSign'
  if (FRIENDS[planet]?.includes(ruler))     return 'Friendly'
  if (ENEMIES[planet]?.includes(ruler))     return 'Enemy'
  return 'Neutral'
}

// ── Batch calculation ─────────────────────────────────────────────────────────

interface PlanetPosition {
  rashi:        number
  longitude:    number
  isRetrograde: boolean
}

export function getAllDignities(
  positions:    Record<string, PlanetPosition>,
  sunLongitude: number,
  lang:         LanguageCode = 'en'  // eslint-disable-line @typescript-eslint/no-unused-vars
): Record<PlanetKey, DignityResult> {
  const result = {} as Record<PlanetKey, DignityResult>
  const keys: PlanetKey[] = ['SUN','MOON','MARS','MERCURY','JUPITER','VENUS','SATURN','RAHU','KETU']

  for (const planet of keys) {
    const pos = positions[planet]
    if (!pos) continue
    result[planet] = getPlanetDignity(
      planet, pos.rashi, pos.longitude, sunLongitude, pos.isRetrograde, lang
    )
  }

  return result
}

// ── Dignity badge colours ─────────────────────────────────────────────────────

export function dignityBadgeClass(dtype: DignityType): string {
  const map: Record<DignityType, string> = {
    Exalted:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Moolatrikona: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    OwnSign:      'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Friendly:     'bg-sky-500/20 text-sky-300 border-sky-500/30',
    Neutral:      'bg-gray-500/20 text-gray-300 border-gray-500/30',
    Enemy:        'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Debilitated:  'bg-red-500/20 text-red-300 border-red-500/30',
    Combust:      'bg-red-900/30 text-red-400 border-red-500/20',
    Retrograde:   'bg-amber-500/20 text-amber-300 border-amber-500/30',
  }
  return map[dtype] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30'
}
