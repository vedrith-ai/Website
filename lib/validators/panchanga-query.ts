// ─────────────────────────────────────────────────────────────────────────────
// Panchanga Query Validator
// Zod schema — applied at the API route boundary before any calculation
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod'

// ── Valid region keys ─────────────────────────────────────────────────────────
export const RegionSchema = z.enum([
  'KANNADA',
  'TELUGU',
  'TAMIL',
  'MALAYALAM',
  'GUJARATI',
  'MAHARASHTRIAN',
  'BENGALI',
  'NORTH_INDIAN',
])

// ── Valid ayanamsha keys ──────────────────────────────────────────────────────
export const AyanamshaSchema = z.enum([
  'LAHIRI',
  'KP',
  'RAMAN',
  'TRUE_CHITRA',
])

// ── Date format: YYYY-MM-DD ───────────────────────────────────────────────────
const ISO_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

// ── IANA timezone: basic format check ────────────────────────────────────────
const TIMEZONE_REGEX = /^[A-Za-z]+(?:\/[A-Za-z0-9_+-]+)+$|^UTC$/

// ── Main Panchanga query schema ───────────────────────────────────────────────
export const PanchangaQuerySchema = z.object({
  /** Local date in YYYY-MM-DD format */
  date: z
    .string()
    .regex(ISO_DATE_REGEX, 'Date must be in YYYY-MM-DD format')
    .refine((d) => {
      const year = parseInt(d.split('-')[0], 10)
      return year >= 1900 && year <= 2100
    }, 'Date must be between 1900 and 2100'),

  /** Decimal latitude, positive = North */
  lat: z
    .number({ required_error: 'Latitude is required' })
    .min(-90,  'Latitude must be ≥ −90°')
    .max(90,   'Latitude must be ≤ +90°'),

  /** Decimal longitude, positive = East */
  lng: z
    .number({ required_error: 'Longitude is required' })
    .min(-180, 'Longitude must be ≥ −180°')
    .max(180,  'Longitude must be ≤ +180°'),

  /** IANA timezone identifier */
  timezone: z
    .string({ required_error: 'Timezone is required' })
    .regex(TIMEZONE_REGEX, 'Invalid IANA timezone identifier')
    .max(64, 'Timezone string too long'),

  /** Regional Panchanga tradition */
  region: RegionSchema.default('NORTH_INDIAN'),

  /** Ayanamsha system (default: Lahiri) */
  ayanamsha: AyanamshaSchema.default('LAHIRI'),

  /** Optional display name for the location */
  locationName: z
    .string()
    .max(120, 'Location name too long')
    .optional(),
})

export type ValidatedPanchangaQuery = z.infer<typeof PanchangaQuerySchema>

/**
 * Parse and validate a raw query params object (from URL search params).
 * Returns { success: true, data } or { success: false, error }.
 */
export function parsePanchangaQuery(raw: Record<string, string | undefined>) {
  return PanchangaQuerySchema.safeParse({
    date:         raw.date,
    lat:          raw.lat  !== undefined ? parseFloat(raw.lat)  : undefined,
    lng:          raw.lng  !== undefined ? parseFloat(raw.lng)  : undefined,
    timezone:     raw.timezone,
    region:       raw.region,
    ayanamsha:    raw.ayanamsha,
    locationName: raw.locationName,
  })
}
