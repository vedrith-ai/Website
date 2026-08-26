// ─────────────────────────────────────────────────────────────────────────────
// Regional Panchanga Name Maps
// 8 traditions: Telugu, Tamil, Kannada, Malayalam,
//               Gujarati, Maharashtrian, Bengali, North Indian
// ─────────────────────────────────────────────────────────────────────────────

import type { RegionalConfig } from './types'
import type { RegionKey }      from '../../../types/panchanga'

// ─── Shared Sanskrit base names (used as fallback) ────────────────────────────
const NAKSHATRA_SANSKRIT = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]

const TITHI_SHUKLA_SANSKRIT = [
  'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
]

const TITHI_KRISHNA_SANSKRIT = [
  'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
]

const YOGA_NAMES_SANSKRIT = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi',
  'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata',
  'Variyana', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha',
  'Shukla', 'Brahma', 'Mahendra', 'Vaidhriti',
]

// ─────────────────────────────────────────────────────────────────────────────
// TELUGU
// ─────────────────────────────────────────────────────────────────────────────
const TELUGU: RegionalConfig = {
  key: 'TELUGU', displayName: 'Telugu', language: 'te',
  nakshatraNames: [
    'Aswini', 'Bharani', 'Karthika', 'Rohini', 'Mrigasira',
    'Arudra', 'Punarvasu', 'Pushyami', 'Aslesha', 'Magha',
    'Pubba', 'Uttara', 'Hasta', 'Chitta', 'Swati',
    'Visakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Poorvashada',
    'Uttarashada', 'Sravana', 'Dhanishta', 'Satabhisha',
    'Poorvabhadra', 'Uttarabhadra', 'Revati',
  ],
  tithiShukla:  ['Paadyami', 'Vidiya', 'Tadiya', 'Chaviti', 'Panchami',
                 'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Pournami'],
  tithiKrishna: ['Paadyami', 'Vidiya', 'Tadiya', 'Chaviti', 'Panchami',
                 'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'],
  pakshaShukla:  'Shudda', pakshaKrishna: 'Bahula',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Aadivaaram', 'Somavaaram', 'Mangalavaaram', 'Budhaavaaram',
                 'Guruvaaram', 'Shukravaaram', 'Shanivaaram'],
}

// ─────────────────────────────────────────────────────────────────────────────
// TAMIL
// ─────────────────────────────────────────────────────────────────────────────
const TAMIL: RegionalConfig = {
  key: 'TAMIL', displayName: 'Tamil', language: 'ta',
  nakshatraNames: [
    'Aswini', 'Bharani', 'Karthigai', 'Rohini', 'Mirugashirisham',
    'Thiruvathirai', 'Punarpoosam', 'Poosam', 'Ayilyam', 'Magam',
    'Pooram', 'Uthiram', 'Hastham', 'Chithirai', 'Swathi',
    'Visakam', 'Anusham', 'Kettai', 'Moolam', 'Pooradam',
    'Uthiradam', 'Thiruvonam', 'Avittam', 'Sadhayam',
    'Poorattathi', 'Uttirattathi', 'Revathi',
  ],
  tithiShukla:  ['Prathipadai', 'Dvithiyai', 'Trithiyai', 'Chathurthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dasami',
                 'Ekadasi', 'Dvadasi', 'Trayodasi', 'Chaturdasi', 'Pournami'],
  tithiKrishna: ['Prathipadai', 'Dvithiyai', 'Trithiyai', 'Chathurthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dasami',
                 'Ekadasi', 'Dvadasi', 'Trayodasi', 'Chaturdasi', 'Amavasai'],
  pakshaShukla:  'Valarpirai', pakshaKrishna: 'Teipirai',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Nyayiru', 'Tingal', 'Chevvay', 'Budhan', 'Viyazhan', 'Velli', 'Shani'],
}

// ─────────────────────────────────────────────────────────────────────────────
// KANNADA
// ─────────────────────────────────────────────────────────────────────────────
const KANNADA: RegionalConfig = {
  key: 'KANNADA', displayName: 'Kannada', language: 'kn',
  nakshatraNames: [
    'Ashwini', 'Bharani', 'Krittike', 'Rohini', 'Mrigashira',
    'Arudre', 'Punarvasu', 'Pushya', 'Aslesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitre', 'Swati',
    'Vishakhe', 'Anuradhe', 'Jyeshthe', 'Moola', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishte', 'Shatabhishe',
    'Purva Bhadrapade', 'Uttara Bhadrapade', 'Revati',
  ],
  tithiShukla:  ['Paadya', 'Bidige', 'Tadige', 'Chavati', 'Panchami',
                 'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Hunnime'],
  tithiKrishna: ['Paadya', 'Bidige', 'Tadige', 'Chavati', 'Panchami',
                 'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasye'],
  pakshaShukla:  'Shukla Paksha', pakshaKrishna: 'Krishna Paksha',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Bhanuvara', 'Somavara', 'Mangalavara', 'Budhavara',
                 'Guruvara', 'Shukravara', 'Shanivara'],
}

// ─────────────────────────────────────────────────────────────────────────────
// MALAYALAM
// ─────────────────────────────────────────────────────────────────────────────
const MALAYALAM: RegionalConfig = {
  key: 'MALAYALAM', displayName: 'Malayalam', language: 'ml',
  nakshatraNames: [
    'Aswathi', 'Bharani', 'Karthika', 'Rohini', 'Makayiram',
    'Thiruvathira', 'Punartham', 'Pooyam', 'Ayilyam', 'Makam',
    'Pooram', 'Uthram', 'Atham', 'Chithra', 'Chothi',
    'Vishakam', 'Anizham', 'Thrikketta', 'Moolam', 'Pooradam',
    'Uthradam', 'Thiruvonam', 'Avittam', 'Chathayam',
    'Pooruruttathi', 'Uthruttathi', 'Revathi',
  ],
  tithiShukla:  ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Pournami'],
  tithiKrishna: ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'],
  pakshaShukla:  'Vella Paksha', pakshaKrishna: 'Krishnapaksha',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Njayar', 'Thinkal', 'Chowwa', 'Budhan', 'Vyazham', 'Velli', 'Shani'],
}

// ─────────────────────────────────────────────────────────────────────────────
// GUJARATI
// ─────────────────────────────────────────────────────────────────────────────
const GUJARATI: RegionalConfig = {
  key: 'GUJARATI', displayName: 'Gujarati', language: 'gu',
  nakshatraNames: NAKSHATRA_SANSKRIT,
  tithiShukla:  ['Ekam', 'Bij', 'Trij', 'Choth', 'Pancham',
                 'Chath', 'Satam', 'Aatham', 'Nom', 'Dasam',
                 'Agiyaras', 'Baras', 'Teras', 'Chaudas', 'Poonam'],
  tithiKrishna: ['Ekam', 'Bij', 'Trij', 'Choth', 'Pancham',
                 'Chath', 'Satam', 'Aatham', 'Nom', 'Dasam',
                 'Agiyaras', 'Baras', 'Teras', 'Chaudas', 'Amas'],
  pakshaShukla:  'Sud', pakshaKrishna: 'Vad',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Ravivar', 'Somvar', 'Mangalvar', 'Budhvar',
                 'Guruvar', 'Shukravar', 'Shanivar'],
}

// ─────────────────────────────────────────────────────────────────────────────
// MAHARASHTRIAN
// ─────────────────────────────────────────────────────────────────────────────
const MAHARASHTRIAN: RegionalConfig = {
  key: 'MAHARASHTRIAN', displayName: 'Maharashtrian', language: 'mr',
  nakshatraNames: NAKSHATRA_SANSKRIT,
  tithiShukla:  TITHI_SHUKLA_SANSKRIT,
  tithiKrishna: TITHI_KRISHNA_SANSKRIT,
  pakshaShukla:  'Shukla Paksha', pakshaKrishna: 'Krishna Paksha',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Ravivar', 'Somvar', 'Mangalvar', 'Budhvar',
                 'Guruvar', 'Shukravar', 'Shanivar'],
}

// ─────────────────────────────────────────────────────────────────────────────
// BENGALI
// ─────────────────────────────────────────────────────────────────────────────
const BENGALI: RegionalConfig = {
  key: 'BENGALI', displayName: 'Bengali', language: 'bn',
  nakshatraNames: [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purba Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purbashadha',
    'Uttarashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
    'Purba Bhadrapada', 'Uttara Bhadrapada', 'Revati',
  ],
  tithiShukla:  ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'],
  tithiKrishna: ['Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
                 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
                 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'],
  pakshaShukla:  'Shukla Paksha', pakshaKrishna: 'Krishna Paksha',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Robibar', 'Shombar', 'Mongolbar', 'Budhbar',
                 'Brihospotibar', 'Shukrobar', 'Shonibar'],
}

// ─────────────────────────────────────────────────────────────────────────────
// NORTH INDIAN (Hindi)
// ─────────────────────────────────────────────────────────────────────────────
const NORTH_INDIAN: RegionalConfig = {
  key: 'NORTH_INDIAN', displayName: 'North Indian', language: 'hi',
  nakshatraNames: NAKSHATRA_SANSKRIT,
  tithiShukla:  TITHI_SHUKLA_SANSKRIT,
  tithiKrishna: TITHI_KRISHNA_SANSKRIT,
  pakshaShukla:  'Shukla Paksha', pakshaKrishna: 'Krishna Paksha',
  yogaNames:    YOGA_NAMES_SANSKRIT,
  varNames:     ['Ravivar', 'Somvar', 'Mangalvar', 'Budhvar',
                 'Guruvar', 'Shukravar', 'Shanivar'],
}

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────
export const REGIONAL_CONFIGS: Record<RegionKey, RegionalConfig> = {
  TELUGU:        TELUGU,
  TAMIL:         TAMIL,
  KANNADA:       KANNADA,
  MALAYALAM:     MALAYALAM,
  GUJARATI:      GUJARATI,
  MAHARASHTRIAN: MAHARASHTRIAN,
  BENGALI:       BENGALI,
  NORTH_INDIAN:  NORTH_INDIAN,
}

export function getRegionalConfig(region: RegionKey): RegionalConfig {
  return REGIONAL_CONFIGS[region] ?? NORTH_INDIAN
}
