// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Panchanga Localization Layer
//
// Provides display-name translations for every Panchanga element
// (Vara, Paksha, Tithi, Nakshatra, Yoga, Karana, Masa, Samvatsara)
// in English and Kannada.
//
// ARCHITECTURE NOTE:
// `LanguageCode` is intentionally a union type with room to grow.
// Adding Telugu ('te'), Tamil ('ta'), Malayalam ('ml'), or Sanskrit ('sa')
// in a future release requires only:
//   1. Extending the LanguageCode union below
//   2. Adding the corresponding key to every NameTable record in this file
//   3. No changes to the orchestrator, types, or UI components are required —
//      they all iterate over LanguageCode generically.
//
// PANCHANGA_V1.1 SCOPE: 'en' and 'kn' only, per product instruction.
// ─────────────────────────────────────────────────────────────────────────────

/** Supported display languages. Extend this union to add new languages. */
export type LanguageCode = 'en' | 'kn'

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'kn']

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: 'English',
  kn: 'ಕನ್ನಡ (Kannada)',
}

/** A name available in every supported language. */
export type NameTable = Record<LanguageCode, string>

/** Helper: build a NameTable from positional arrays (en, kn) — reduces boilerplate. */
function table(en: string, kn: string): NameTable {
  return { en, kn }
}

// ═════════════════════════════════════════════════════════════════════════════
// VARA (Weekday) — 7 entries, index 0=Sunday … 6=Saturday
// Kannada names match the existing romanized regional config
// (Bhanuvara, Somavara, Mangalavara, Budhavara, Guruvara, Shukravara, Shanivara)
// ═════════════════════════════════════════════════════════════════════════════
export const VARA_NAMES: NameTable[] = [
  table('Sunday',    'ಭಾನುವಾರ'),
  table('Monday',    'ಸೋಮವಾರ'),
  table('Tuesday',   'ಮಂಗಳವಾರ'),
  table('Wednesday', 'ಬುಧವಾರ'),
  table('Thursday',  'ಗುರುವಾರ'),
  table('Friday',    'ಶುಕ್ರವಾರ'),
  table('Saturday',  'ಶನಿವಾರ'),
]

// ═════════════════════════════════════════════════════════════════════════════
// PAKSHA — 2 entries
// ═════════════════════════════════════════════════════════════════════════════
export const PAKSHA_NAMES: Record<'SHUKLA' | 'KRISHNA', NameTable> = {
  SHUKLA:  table('Shukla Paksha',  'ಶುಕ್ಲ ಪಕ್ಷ'),
  KRISHNA: table('Krishna Paksha', 'ಕೃಷ್ಣ ಪಕ್ಷ'),
}

// ═════════════════════════════════════════════════════════════════════════════
// TITHI — 16 unique names
// Index 0–13: Pratipada…Chaturdashi (shared by both Pakshas)
// Index 14: Purnima (Shukla 15th)
// Index 15: Amavasya (Krishna 15th)
// ═════════════════════════════════════════════════════════════════════════════
export const TITHI_NAMES: NameTable[] = [
  table('Pratipada',   'ಪಾಡ್ಯ'),
  table('Dvitiya',     'ಬಿದಿಗೆ'),
  table('Tritiya',     'ತದಿಗೆ'),
  table('Chaturthi',   'ಚೌತಿ'),
  table('Panchami',    'ಪಂಚಮಿ'),
  table('Shashthi',    'ಷಷ್ಠಿ'),
  table('Saptami',     'ಸಪ್ತಮಿ'),
  table('Ashtami',     'ಅಷ್ಟಮಿ'),
  table('Navami',      'ನವಮಿ'),
  table('Dashami',     'ದಶಮಿ'),
  table('Ekadashi',    'ಏಕಾದಶಿ'),
  table('Dwadashi',    'ದ್ವಾದಶಿ'),
  table('Trayodashi',  'ತ್ರಯೋದಶಿ'),
  table('Chaturdashi', 'ಚತುರ್ದಶಿ'),
  table('Purnima',     'ಹುಣ್ಣಿಮೆ'),   // index 14 — Shukla 15
  table('Amavasya',    'ಅಮಾವಾಸ್ಯೆ'),   // index 15 — Krishna 15
]

/**
 * Resolve the localized Tithi name for a global Tithi number (1–30).
 * Tithis 1–14 (Shukla) and 16–29 (Krishna, i.e. local 1–14) share names.
 * Tithi 15 = Purnima, Tithi 30 = Amavasya.
 */
export function getTithiNameTable(globalTithiNumber: number): NameTable {
  if (globalTithiNumber === 15) return TITHI_NAMES[14]   // Purnima
  if (globalTithiNumber === 30) return TITHI_NAMES[15]   // Amavasya
  const localIndex = (globalTithiNumber - 1) % 15        // 0–13
  return TITHI_NAMES[localIndex]
}

// ═════════════════════════════════════════════════════════════════════════════
// NAKSHATRA — 27 entries, index 0=Ashwini … 26=Revati
// ═════════════════════════════════════════════════════════════════════════════
export const NAKSHATRA_NAMES: NameTable[] = [
  table('Ashwini',          'ಅಶ್ವಿನಿ'),
  table('Bharani',          'ಭರಣಿ'),
  table('Krittika',         'ಕೃತ್ತಿಕಾ'),
  table('Rohini',           'ರೋಹಿಣಿ'),
  table('Mrigashira',       'ಮೃಗಶಿರಾ'),
  table('Ardra',            'ಆರ್ದ್ರಾ'),
  table('Punarvasu',        'ಪುನರ್ವಸು'),
  table('Pushya',           'ಪುಷ್ಯ'),
  table('Ashlesha',         'ಆಶ್ಲೇಷಾ'),
  table('Magha',            'ಮಘಾ'),
  table('Purva Phalguni',   'ಪೂರ್ವ ಫಲ್ಗುಣಿ'),
  table('Uttara Phalguni',  'ಉತ್ತರ ಫಲ್ಗುಣಿ'),
  table('Hasta',            'ಹಸ್ತ'),
  table('Chitra',           'ಚಿತ್ರಾ'),
  table('Swati',            'ಸ್ವಾತಿ'),
  table('Vishakha',         'ವಿಶಾಖಾ'),
  table('Anuradha',         'ಅನುರಾಧಾ'),
  table('Jyeshtha',         'ಜ್ಯೇಷ್ಠಾ'),
  table('Moola',            'ಮೂಲ'),
  table('Purva Ashadha',    'ಪೂರ್ವಾಷಾಢ'),
  table('Uttara Ashadha',   'ಉತ್ತರಾಷಾಢ'),
  table('Shravana',         'ಶ್ರವಣ'),
  table('Dhanishtha',       'ಧನಿಷ್ಠಾ'),
  table('Shatabhisha',      'ಶತಭಿಷಾ'),
  table('Purva Bhadrapada', 'ಪೂರ್ವಾಭಾದ್ರ'),
  table('Uttara Bhadrapada','ಉತ್ತರಾಭಾದ್ರ'),
  table('Revati',           'ರೇವತಿ'),
]

// ═════════════════════════════════════════════════════════════════════════════
// YOGA — 27 entries, index 0=Vishkambha … 26=Vaidhriti
// ═════════════════════════════════════════════════════════════════════════════
export const YOGA_NAMES: NameTable[] = [
  table('Vishkambha', 'ವಿಷ್ಕಂಭ'),
  table('Priti',      'ಪ್ರೀತಿ'),
  table('Ayushman',   'ಆಯುಷ್ಮಾನ್'),
  table('Saubhagya',  'ಸೌಭಾಗ್ಯ'),
  table('Shobhana',   'ಶೋಭನ'),
  table('Atiganda',   'ಅತಿಗಂಡ'),
  table('Sukarma',    'ಸುಕರ್ಮ'),
  table('Dhriti',     'ಧೃತಿ'),
  table('Shula',      'ಶೂಲ'),
  table('Ganda',      'ಗಂಡ'),
  table('Vriddhi',    'ವೃದ್ಧಿ'),
  table('Dhruva',     'ಧ್ರುವ'),
  table('Vyaghata',   'ವ್ಯಾಘಾತ'),
  table('Harshana',   'ಹರ್ಷಣ'),
  table('Vajra',      'ವಜ್ರ'),
  table('Siddhi',     'ಸಿದ್ಧಿ'),
  table('Vyatipata',  'ವ್ಯತಿಪಾತ'),
  table('Variyana',   'ವರೀಯಾನ'),
  table('Parigha',    'ಪರಿಘ'),
  table('Shiva',      'ಶಿವ'),
  table('Siddha',     'ಸಿದ್ಧ'),
  table('Sadhya',     'ಸಾಧ್ಯ'),
  table('Shubha',     'ಶುಭ'),
  table('Shukla',     'ಶುಕ್ಲ'),
  table('Brahma',     'ಬ್ರಹ್ಮ'),
  table('Mahendra',   'ಮಹೇಂದ್ರ'),
  table('Vaidhriti',  'ವೈಧೃತಿ'),
]

// ═════════════════════════════════════════════════════════════════════════════
// KARANA — 11 entries (7 Chara/movable + 4 Sthira/fixed)
// Indexed by name for lookup convenience (matches names returned by karana.ts)
// ═════════════════════════════════════════════════════════════════════════════
export const KARANA_NAMES: Record<string, NameTable> = {
  Bava:        table('Bava',        'ಬವ'),
  Balava:      table('Balava',      'ಬಾಲವ'),
  Kaulava:     table('Kaulava',     'ಕೌಲವ'),
  Taitila:     table('Taitila',     'ತೈತಿಲ'),
  Garaja:      table('Garaja',      'ಗರಜಿ'),
  Vanija:      table('Vanija',      'ವಣಿಜ'),
  Vishti:      table('Vishti',      'ವಿಷ್ಟಿ (ಭದ್ರಾ)'),
  Shakuni:     table('Shakuni',     'ಶಕುನಿ'),
  Chatushpada: table('Chatushpada', 'ಚತುಷ್ಪಾದ'),
  Naga:        table('Naga',        'ನಾಗ'),
  Kimstughna:  table('Kimstughna',  'ಕಿಂಸ್ತುಘ್ನ'),
}

/** Lookup helper with safe fallback (returns English name twice if not found). */
export function getKaranaNameTable(name: string): NameTable {
  return KARANA_NAMES[name] ?? table(name, name)
}

// ═════════════════════════════════════════════════════════════════════════════
// CHANDRAMANA MASA — 12 entries, index 0=Chaitra … 11=Phalguna
// ═════════════════════════════════════════════════════════════════════════════
export const MASA_NAMES: NameTable[] = [
  table('Chaitra',     'ಚೈತ್ರ'),
  table('Vaishakha',   'ವೈಶಾಖ'),
  table('Jyeshtha',    'ಜ್ಯೇಷ್ಠ'),
  table('Ashadha',     'ಆಷಾಢ'),
  table('Shravana',    'ಶ್ರಾವಣ'),
  table('Bhadrapada',  'ಭಾದ್ರಪದ'),
  table('Ashwayuja',   'ಆಶ್ವೀಜ'),
  table('Kartika',     'ಕಾರ್ತಿಕ'),
  table('Margashira',  'ಮಾರ್ಗಶಿರ'),
  table('Pushya',      'ಪುಷ್ಯ'),
  table('Magha',       'ಮಾಘ'),
  table('Phalguna',    'ಫಾಲ್ಗುಣ'),
]

// ═════════════════════════════════════════════════════════════════════════════
// SAMVATSARA — 60-year Brihaspati (Jovian) cycle, index 0=Prabhava … 59=Akshaya
//
// This is the standard 60-name cycle used in Telugu, Kannada, and most
// South Indian Panchangas, addressed via the formula:
//   cycleIndex (0-based) = (shakaYear + 11) mod 60
//   samvatsaraName = SAMVATSARA_NAMES[cycleIndex]
// (See samvatsara.ts for the full derivation and worked example.)
// ═════════════════════════════════════════════════════════════════════════════
export const SAMVATSARA_NAMES: NameTable[] = [
  table('Prabhava',     'ಪ್ರಭವ'),
  table('Vibhava',      'ವಿಭವ'),
  table('Shukla',       'ಶುಕ್ಲ'),
  table('Pramoda',      'ಪ್ರಮೋದ'),
  table('Prajapati',    'ಪ್ರಜಾಪತಿ'),
  table('Angirasa',     'ಆಂಗೀರಸ'),
  table('Shrimukha',    'ಶ್ರೀಮುಖ'),
  table('Bhava',        'ಭಾವ'),
  table('Yuva',         'ಯುವ'),
  table('Dhata',        'ಧಾತ'),
  table('Ishvara',      'ಈಶ್ವರ'),
  table('Bahudhanya',   'ಬಹುಧಾನ್ಯ'),
  table('Pramathi',     'ಪ್ರಮಾಥಿ'),
  table('Vikrama',      'ವಿಕ್ರಮ'),
  table('Vrisha',       'ವೃಷ (ವಿಷು)'),
  table('Chitrabhanu',  'ಚಿತ್ರಭಾನು'),
  table('Subhanu',      'ಸುಭಾನು'),
  table('Tarana',       'ತಾರಣ'),
  table('Parthiva',     'ಪಾರ್ಥಿವ'),
  table('Vyaya',        'ವ್ಯಯ'),
  table('Sarvajit',     'ಸರ್ವಜಿತ್'),
  table('Sarvadhari',   'ಸರ್ವಧಾರಿ'),
  table('Virodhi',      'ವಿರೋಧಿ'),
  table('Vikriti',      'ವಿಕೃತಿ'),
  table('Khara',        'ಖರ'),
  table('Nandana',      'ನಂದನ'),
  table('Vijaya',       'ವಿಜಯ'),
  table('Jaya',         'ಜಯ'),
  table('Manmatha',     'ಮನ್ಮಥ'),
  table('Durmukhi',     'ದುರ್ಮುಖಿ'),
  table('Hevilambi',    'ಹೇವಿಲಂಬಿ'),
  table('Vilambi',      'ವಿಲಂಬಿ'),
  table('Vikari',       'ವಿಕಾರಿ'),
  table('Sharvari',     'ಶಾರ್ವರಿ'),
  table('Plava',        'ಪ್ಲವ'),
  table('Shubhakrit',   'ಶುಭಕೃತ್'),
  table('Shobhakrit',   'ಶೋಭಕೃತ್'),
  table('Krodhi',       'ಕ್ರೋಧಿ'),
  table('Vishvavasu',   'ವಿಶ್ವಾವಸು'),
  table('Parabhava',    'ಪರಾಭವ'),
  table('Plavanga',     'ಪ್ಲವಂಗ'),
  table('Kilaka',       'ಕೀಲಕ'),
  table('Saumya',       'ಸೌಮ್ಯ'),
  table('Sadharana',    'ಸಾಧಾರಣ'),
  table('Virodhakrit',  'ವಿರೋಧಕೃತ್'),
  table('Paridhavi',    'ಪರಿಧಾವಿ'),
  table('Pramadi',      'ಪ್ರಮಾದಿ'),
  table('Ananda',       'ಆನಂದ'),
  table('Rakshasa',     'ರಾಕ್ಷಸ'),
  table('Anala',        'ಅನಲ'),
  table('Pingala',      'ಪಿಂಗಳ'),
  table('Kalayukti',    'ಕಾಳಯುಕ್ತಿ'),
  table('Siddharthi',   'ಸಿದ್ಧಾರ್ಥಿ'),
  table('Raudra',       'ರೌದ್ರ'),
  table('Durmati',      'ದುರ್ಮತಿ'),
  table('Dundubhi',     'ದುಂದುಭಿ'),
  table('Rudhirodgari', 'ರುಧಿರೋದ್ಗಾರಿ'),
  table('Raktakshi',    'ರಕ್ತಾಕ್ಷಿ'),
  table('Krodhana',     'ಕ್ರೋಧನ'),
  table('Akshaya',      'ಅಕ್ಷಯ'),
]

// ═════════════════════════════════════════════════════════════════════════════
// Generic helper — extract a single language's string from a NameTable,
// with guaranteed fallback to English if a language is somehow missing.
// ═════════════════════════════════════════════════════════════════════════════
export function pickName(nameTable: NameTable, lang: LanguageCode): string {
  return nameTable[lang] ?? nameTable.en
}
