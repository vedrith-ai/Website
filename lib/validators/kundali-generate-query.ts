import { z } from 'zod'

export const GenderSchema      = z.enum(['MALE', 'FEMALE', 'OTHER'])
export const AyanamshaSchema   = z.enum(['LAHIRI', 'KP', 'RAMAN', 'TRUE_CHITRA'])
export const HouseSystemSchema = z.enum(['WHOLE_SIGN', 'EQUAL', 'PLACIDUS'])

const ISO_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const TIME_REGEX     = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/
const TIMEZONE_REGEX = /^[A-Za-z]+(?:\/[A-Za-z0-9_+-]+){1,3}$|^UTC$/

export const KundaliGenerateSchema = z.object({
  name:        z.string({ required_error: 'Name is required' }).min(1).max(120),
  gender:      GenderSchema,
  dateOfBirth: z.string({ required_error: 'Date of birth is required' }).regex(ISO_DATE_REGEX, 'Date must be YYYY-MM-DD'),
  timeOfBirth: z.string({ required_error: 'Time of birth is required' }).regex(TIME_REGEX, 'Time must be HH:MM'),
  timezone:    z.string({ required_error: 'Timezone is required' }).regex(TIMEZONE_REGEX, 'Invalid IANA timezone').max(64),
  latitude:    z.number({ required_error: 'Latitude is required' }).min(-90).max(90),
  longitude:   z.number({ required_error: 'Longitude is required' }).min(-180).max(180),
  placeName:   z.string({ required_error: 'Place name is required' }).min(1).max(160),
  ayanamsha:   AyanamshaSchema.default('LAHIRI'),
  houseSystem: HouseSystemSchema.default('WHOLE_SIGN'),
})

export type ValidatedKundaliGenerateInput = z.infer<typeof KundaliGenerateSchema>

export function parseKundaliGenerateBody(raw: unknown) {
  return KundaliGenerateSchema.safeParse(raw)
}
