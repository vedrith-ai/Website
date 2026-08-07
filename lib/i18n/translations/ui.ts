// ─────────────────────────────────────────────────────────────────────────────
// VedRith — UI Translations  [V1.1]
//
// All UI label strings in English and Kannada.
// Structure: flat keys, typed record.
// Future: import from this into a dictionary-based t() function.
// ─────────────────────────────────────────────────────────────────────────────

import type { TranslationRecord } from '../types'

// Every string used in the UI must be defined here.
// Never hardcode visible text in components — always import from this file.

export const UI_STRINGS: Record<string, TranslationRecord> = {

  // ── General ──────────────────────────────────────────────────────────────
  'app.name':           { en: 'VedRith', kn: 'ವೇದ ರಿತ' },
  'app.tagline':        { en: 'The Rhythm of Vedic Wisdom', kn: 'ವೈದಿಕ ಜ್ಞಾನದ ಲಯ' },
  'loading':            { en: 'Loading…', kn: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ…' },
  'error.generic':      { en: 'Something went wrong. Please try again.', kn: 'ದೋಷ ಉಂಟಾಗಿದೆ. ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.' },
  'retry':              { en: 'Retry', kn: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' },
  'close':              { en: 'Close', kn: 'ಮುಚ್ಚಿ' },
  'save':               { en: 'Save', kn: 'ಉಳಿಸಿ' },
  'cancel':             { en: 'Cancel', kn: 'ರದ್ದುಗೊಳಿಸಿ' },
  'back':               { en: 'Back', kn: 'ಹಿಂದೆ' },
  'next':               { en: 'Next', kn: 'ಮುಂದೆ' },
  'view.all':           { en: 'View All', kn: 'ಎಲ್ಲ ನೋಡಿ' },
  'view.details':       { en: 'View Details', kn: 'ವಿವರ ನೋಡಿ' },
  'language':           { en: 'Language', kn: 'ಭಾಷೆ' },

  // ── Navigation ───────────────────────────────────────────────────────────
  'nav.home':       { en: 'Home',     kn: 'ಮನೆ' },
  'nav.panchanga':  { en: 'Panchanga', kn: 'ಪಂಚಾಂಗ' },
  'nav.kundali':    { en: 'Kundali',  kn: 'ಕುಂಡಲಿ' },

  // ── Kundali ───────────────────────────────────────────────────────────────
  'kundali.title':             { en: 'Janma Kundali', kn: 'ಜನ್ಮ ಕುಂಡಲಿ' },
  'kundali.birth.details':     { en: 'Birth Details', kn: 'ಜನನ ವಿವರಗಳು' },
  'kundali.birth.date':        { en: 'Date of Birth', kn: 'ಜನ್ಮ ದಿನಾಂಕ' },
  'kundali.birth.time':        { en: 'Time of Birth', kn: 'ಜನ್ಮ ಸಮಯ' },
  'kundali.birth.place':       { en: 'Place of Birth', kn: 'ಜನ್ಮ ಸ್ಥಳ' },
  'kundali.generate':          { en: 'Generate Kundali', kn: 'ಕುಂಡಲಿ ತಯಾರಿಸಿ' },
  'kundali.chart.south':       { en: 'South Indian Chart', kn: 'ದಕ್ಷಿಣ ಭಾರತ ಚಕ್ರ' },
  'kundali.chart.north':       { en: 'North Indian Chart', kn: 'ಉತ್ತರ ಭಾರತ ಚಕ್ರ' },
  'kundali.panchanga.birth':   { en: 'Birth Panchanga', kn: 'ಜನ್ಮ ಪಂಚಾಂಗ' },
  'kundali.planetary.table':   { en: 'Planetary Positions', kn: 'ಗ್ರಹ ಸ್ಥಾನಗಳು' },
  'kundali.house.placements':  { en: 'House Placements', kn: 'ಭವ ಸ್ಥಾನಗಳು' },

  // ── Planets ───────────────────────────────────────────────────────────────
  'planet.SUN':      { en: 'Sun',      kn: 'ಸೂರ್ಯ' },
  'planet.MOON':     { en: 'Moon',     kn: 'ಚಂದ್ರ' },
  'planet.MARS':     { en: 'Mars',     kn: 'ಕುಜ' },
  'planet.MERCURY':  { en: 'Mercury',  kn: 'ಬುಧ' },
  'planet.JUPITER':  { en: 'Jupiter',  kn: 'ಗುರು' },
  'planet.VENUS':    { en: 'Venus',    kn: 'ಶುಕ್ರ' },
  'planet.SATURN':   { en: 'Saturn',   kn: 'ಶನಿ' },
  'planet.RAHU':     { en: 'Rahu',     kn: 'ರಾಹು' },
  'planet.KETU':     { en: 'Ketu',     kn: 'ಕೇತು' },

  // ── Planetary table headers ───────────────────────────────────────────────
  'col.planet':      { en: 'Planet',    kn: 'ಗ್ರಹ' },
  'col.sign':        { en: 'Sign',      kn: 'ರಾಶಿ' },
  'col.degree':      { en: 'Degree',    kn: 'ಅಂಶ' },
  'col.nakshatra':   { en: 'Nakshatra', kn: 'ನಕ್ಷತ್ರ' },
  'col.pada':        { en: 'Pada',      kn: 'ಪಾದ' },
  'col.house':       { en: 'House',     kn: 'ಭವ' },
  'col.retro':       { en: 'R?',        kn: 'ವ?' },
  'col.daily':       { en: '°/day',     kn: '°/ದಿನ' },

  // ── Kundali labels ────────────────────────────────────────────────────────
  'label.lagna':     { en: 'Lagna (Ascendant)', kn: 'ಲಗ್ನ (ಉದಯ ರಾಶಿ)' },
  'label.moon.sign': { en: 'Moon Sign (Chandra Rashi)', kn: 'ಚಂದ್ರ ರಾಶಿ' },
  'label.sun.sign':  { en: 'Sun Sign (Surya Rashi)',  kn: 'ಸೂರ್ಯ ರಾಶಿ' },
  'label.nakshatra': { en: 'Birth Nakshatra',  kn: 'ಜನ್ಮ ನಕ್ಷತ್ರ' },
  'label.tithi':     { en: 'Birth Tithi',      kn: 'ಜನ್ಮ ತಿಥಿ' },
  'label.yoga':      { en: 'Birth Yoga',       kn: 'ಜನ್ಮ ಯೋಗ' },
  'label.karana':    { en: 'Birth Karana',     kn: 'ಜನ್ಮ ಕರಣ' },
  'label.vara':      { en: 'Weekday',          kn: 'ವಾರ' },
  'label.paksha':    { en: 'Paksha',           kn: 'ಪಕ್ಷ' },
  'label.house':     { en: 'House',            kn: 'ಭವ' },
  'label.rashi':     { en: 'Rashi',            kn: 'ರಾಶಿ' },
  'label.retrograde': { en: 'Retrograde',      kn: 'ವಕ್ರ' },
  'label.direct':    { en: 'Direct',           kn: 'ಮಾರ್ಗ' },
  'label.gender':    { en: 'Gender',           kn: 'ಲಿಂಗ' },
  'label.ayanamsha': { en: 'Ayanamsha',        kn: 'ಅಯನಾಂಶ' },
  'label.house.system': { en: 'House System',  kn: 'ಭವ ವ್ಯವಸ್ಥೆ' },

  // ── Panchanga ─────────────────────────────────────────────────────────────
  'panchanga.title':        { en: "Today's Panchanga", kn: 'ಇಂದಿನ ಪಂಚಾಂಗ' },
  'panchanga.tithi':        { en: 'Tithi',        kn: 'ತಿಥಿ' },
  'panchanga.nakshatra':    { en: 'Nakshatra',    kn: 'ನಕ್ಷತ್ರ' },
  'panchanga.yoga':         { en: 'Yoga',         kn: 'ಯೋಗ' },
  'panchanga.karana':       { en: 'Karana',       kn: 'ಕರಣ' },
  'panchanga.vara':         { en: 'Vara',         kn: 'ವಾರ' },
  'panchanga.paksha':       { en: 'Paksha',       kn: 'ಪಕ್ಷ' },
  'panchanga.masa':         { en: 'Masa',         kn: 'ಮಾಸ' },
  'panchanga.samvatsara':   { en: 'Samvatsara',   kn: 'ಸಂವತ್ಸರ' },
  'panchanga.sunrise':      { en: 'Sunrise',      kn: 'ಸೂರ್ಯೋದಯ' },
  'panchanga.sunset':       { en: 'Sunset',       kn: 'ಸೂರ್ಯಾಸ್ತ' },
  'panchanga.moonrise':     { en: 'Moonrise',     kn: 'ಚಂದ್ರೋದಯ' },
  'panchanga.moonset':      { en: 'Moonset',      kn: 'ಚಂದ್ರಾಸ್ತ' },
  'panchanga.rahu.kalam':   { en: 'Rahu Kalam',   kn: 'ರಾಹು ಕಾಲ' },
  'panchanga.yamaganda':    { en: 'Yamaganda',    kn: 'ಯಮಗಂಡ' },
  'panchanga.gulika':       { en: 'Gulika',       kn: 'ಗುಳಿಕ' },
  'panchanga.abhijit':      { en: 'Abhijit Muhurta', kn: 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ' },
  'panchanga.durmuhurta':   { en: 'Durmuhurta',   kn: 'ದುರ್ಮುಹೂರ್ತ' },
  'panchanga.varjyam':      { en: 'Varjyam',      kn: 'ವರ್ಜ್ಯ' },
  'panchanga.full':         { en: 'Full Panchanga', kn: 'ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ' },
  'panchanga.view.full':    { en: 'View Full Panchanga', kn: 'ಸಂಪೂರ್ಣ ಪಂಚಾಂಗ ನೋಡಿ' },
  'panchanga.next.change':  { en: 'Next Change', kn: 'ಮುಂದಿನ ಬದಲಾವಣೆ' },
  'panchanga.ends.in':      { en: 'ends in', kn: 'ಮುಗಿಯಲು' },

  // ── Rashi names ───────────────────────────────────────────────────────────
  'rashi.Mesha':      { en: 'Aries',       kn: 'ಮೇಷ' },
  'rashi.Vrishabha':  { en: 'Taurus',      kn: 'ವೃಷಭ' },
  'rashi.Mithuna':    { en: 'Gemini',      kn: 'ಮಿಥುನ' },
  'rashi.Karka':      { en: 'Cancer',      kn: 'ಕರ್ಕ' },
  'rashi.Simha':      { en: 'Leo',         kn: 'ಸಿಂಹ' },
  'rashi.Kanya':      { en: 'Virgo',       kn: 'ಕನ್ಯಾ' },
  'rashi.Tula':       { en: 'Libra',       kn: 'ತುಲಾ' },
  'rashi.Vrishchika': { en: 'Scorpio',     kn: 'ವೃಶ್ಚಿಕ' },
  'rashi.Dhanu':      { en: 'Sagittarius', kn: 'ಧನು' },
  'rashi.Makara':     { en: 'Capricorn',   kn: 'ಮಕರ' },
  'rashi.Kumbha':     { en: 'Aquarius',    kn: 'ಕುಂಭ' },
  'rashi.Meena':      { en: 'Pisces',      kn: 'ಮೀನ' },

  // ── [V1.3] All 27 Nakshatras ──────────────────────────────────────────────
  'nakshatra.Ashvini':            { en: 'Ashvini',            kn: 'ಅಶ್ವಿನಿ' },
  'nakshatra.Bharani':            { en: 'Bharani',            kn: 'ಭರಣಿ' },
  'nakshatra.Krittika':           { en: 'Krittika',           kn: 'ಕೃತ್ತಿಕಾ' },
  'nakshatra.Rohini':             { en: 'Rohini',             kn: 'ರೋಹಿಣಿ' },
  'nakshatra.Mrigashira':         { en: 'Mrigashira',         kn: 'ಮೃಗಶಿರ' },
  'nakshatra.Ardra':              { en: 'Ardra',              kn: 'ಆರ್ದ್ರಾ' },
  'nakshatra.Punarvasu':          { en: 'Punarvasu',          kn: 'ಪುನರ್ವಸು' },
  'nakshatra.Pushya':             { en: 'Pushya',             kn: 'ಪುಷ್ಯ' },
  'nakshatra.Ashlesha':           { en: 'Ashlesha',           kn: 'ಆಶ್ಲೇಷಾ' },
  'nakshatra.Magha':              { en: 'Magha',              kn: 'ಮಘಾ' },
  'nakshatra.Purva_Phalguni':     { en: 'Purva Phalguni',     kn: 'ಪೂರ್ವ ಫಲ್ಗುನಿ' },
  'nakshatra.Uttara_Phalguni':    { en: 'Uttara Phalguni',    kn: 'ಉತ್ತರ ಫಲ್ಗುನಿ' },
  'nakshatra.Hasta':              { en: 'Hasta',              kn: 'ಹಸ್ತ' },
  'nakshatra.Chitra':             { en: 'Chitra',             kn: 'ಚಿತ್ರಾ' },
  'nakshatra.Svati':              { en: 'Svati',              kn: 'ಸ್ವಾತಿ' },
  'nakshatra.Vishakha':           { en: 'Vishakha',           kn: 'ವಿಶಾಖಾ' },
  'nakshatra.Anuradha':           { en: 'Anuradha',           kn: 'ಅನುರಾಧಾ' },
  'nakshatra.Jyeshtha':           { en: 'Jyeshtha',           kn: 'ಜ್ಯೇಷ್ಠಾ' },
  'nakshatra.Mula':               { en: 'Mula',               kn: 'ಮೂಲ' },
  'nakshatra.Purva_Ashadha':      { en: 'Purva Ashadha',      kn: 'ಪೂರ್ವಾಷಾಢ' },
  'nakshatra.Uttara_Ashadha':     { en: 'Uttara Ashadha',     kn: 'ಉತ್ತರಾಷಾಢ' },
  'nakshatra.Shravana':           { en: 'Shravana',           kn: 'ಶ್ರವಣ' },
  'nakshatra.Dhanishtha':         { en: 'Dhanishtha',         kn: 'ಧನಿಷ್ಠಾ' },
  'nakshatra.Shatabhisha':        { en: 'Shatabhisha',        kn: 'ಶತಭಿಷ' },
  'nakshatra.Purva_Bhadrapada':   { en: 'Purva Bhadrapada',   kn: 'ಪೂರ್ವ ಭಾದ್ರಪದ' },
  'nakshatra.Uttara_Bhadrapada':  { en: 'Uttara Bhadrapada',  kn: 'ಉತ್ತರ ಭಾದ್ರಪದ' },
  'nakshatra.Revati':             { en: 'Revati',             kn: 'ರೇವತಿ' },
  'nakshatra.Abhijit':            { en: 'Abhijit',            kn: 'ಅಭಿಜಿತ್' },

  // ── [V1.3] All 27 Yogas ───────────────────────────────────────────────────
  'yoga.Vishkambha':  { en: 'Vishkambha',   kn: 'ವಿಷ್ಕಂಭ' },
  'yoga.Priti':       { en: 'Priti',        kn: 'ಪ್ರೀತಿ' },
  'yoga.Ayushman':    { en: 'Ayushman',     kn: 'ಆಯುಷ್ಮಾನ್' },
  'yoga.Saubhagya':   { en: 'Saubhagya',   kn: 'ಸೌಭಾಗ್ಯ' },
  'yoga.Shobhana':    { en: 'Shobhana',    kn: 'ಶೋಭನ' },
  'yoga.Atiganda':    { en: 'Atiganda',    kn: 'ಅತಿಗಂಡ' },
  'yoga.Sukarman':    { en: 'Sukarman',    kn: 'ಸುಕರ್ಮ' },
  'yoga.Dhriti':      { en: 'Dhriti',      kn: 'ಧೃತಿ' },
  'yoga.Shula':       { en: 'Shula',       kn: 'ಶೂಲ' },
  'yoga.Ganda':       { en: 'Ganda',       kn: 'ಗಂಡ' },
  'yoga.Vriddhi':     { en: 'Vriddhi',     kn: 'ವೃದ್ಧಿ' },
  'yoga.Dhruva':      { en: 'Dhruva',      kn: 'ಧ್ರುವ' },
  'yoga.Vyaghata':    { en: 'Vyaghata',    kn: 'ವ್ಯಾಘಾತ' },
  'yoga.Harshana':    { en: 'Harshana',    kn: 'ಹರ್ಷಣ' },
  'yoga.Vajra':       { en: 'Vajra',       kn: 'ವಜ್ರ' },
  'yoga.Siddhi':      { en: 'Siddhi',      kn: 'ಸಿದ್ಧಿ' },
  'yoga.Vyatipata':   { en: 'Vyatipata',   kn: 'ವ್ಯತೀಪಾತ' },
  'yoga.Variyana':    { en: 'Variyana',    kn: 'ವರೀಯಾನ' },
  'yoga.Parigha':     { en: 'Parigha',     kn: 'ಪರಿಘ' },
  'yoga.Shiva':       { en: 'Shiva',       kn: 'ಶಿವ' },
  'yoga.Siddha':      { en: 'Siddha',      kn: 'ಸಿದ್ಧ' },
  'yoga.Sadhya':      { en: 'Sadhya',      kn: 'ಸಾಧ್ಯ' },
  'yoga.Shubha':      { en: 'Shubha',      kn: 'ಶುಭ' },
  'yoga.Shukla':      { en: 'Shukla',      kn: 'ಶುಕ್ಲ' },
  'yoga.Brahma':      { en: 'Brahma',      kn: 'ಬ್ರಹ್ಮ' },
  'yoga.Mahendra':    { en: 'Mahendra',    kn: 'ಮಹೇಂದ್ರ' },
  'yoga.Vaidhriti':   { en: 'Vaidhriti',   kn: 'ವೈಧೃತಿ' },

  // ── [V1.3] All 11 Karanas ────────────────────────────────────────────────
  'karana.Bava':      { en: 'Bava',        kn: 'ಭವ' },
  'karana.Balava':    { en: 'Balava',      kn: 'ಬಾಲವ' },
  'karana.Kaulava':   { en: 'Kaulava',     kn: 'ಕೌಲವ' },
  'karana.Taitila':   { en: 'Taitila',     kn: 'ತೈತಿಲ' },
  'karana.Gara':      { en: 'Gara',        kn: 'ಗರ' },
  'karana.Vanija':    { en: 'Vanija',      kn: 'ವಣಿಜ' },
  'karana.Vishti':    { en: 'Vishti',      kn: 'ವಿಷ್ಟಿ' },
  'karana.Shakuni':   { en: 'Shakuni',     kn: 'ಶಕುನಿ' },
  'karana.Chatushpada': { en: 'Chatushpada', kn: 'ಚತುಷ್ಪಾದ' },
  'karana.Naga':      { en: 'Naga',        kn: 'ನಾಗ' },
  'karana.Kimstughna': { en: 'Kimstughna', kn: 'ಕಿಂಸ್ತುಘ್ನ' },

  // ── [V1.3] All 15/30 Tithis ─────────────────────────────────────────────
  'tithi.Pratipada':   { en: 'Pratipada',   kn: 'ಪ್ರತಿಪದ' },
  'tithi.Dvitiya':     { en: 'Dvitiya',     kn: 'ದ್ವಿತೀಯ' },
  'tithi.Tritiya':     { en: 'Tritiya',     kn: 'ತೃತೀಯ' },
  'tithi.Chaturthi':   { en: 'Chaturthi',   kn: 'ಚತುರ್ಥಿ' },
  'tithi.Panchami':    { en: 'Panchami',    kn: 'ಪಂಚಮಿ' },
  'tithi.Shashthi':    { en: 'Shashthi',    kn: 'ಷಷ್ಠಿ' },
  'tithi.Saptami':     { en: 'Saptami',     kn: 'ಸಪ್ತಮಿ' },
  'tithi.Ashtami':     { en: 'Ashtami',     kn: 'ಅಷ್ಟಮಿ' },
  'tithi.Navami':      { en: 'Navami',      kn: 'ನವಮಿ' },
  'tithi.Dashami':     { en: 'Dashami',     kn: 'ದಶಮಿ' },
  'tithi.Ekadashi':    { en: 'Ekadashi',    kn: 'ಏಕಾದಶಿ' },
  'tithi.Dwadashi':    { en: 'Dwadashi',    kn: 'ದ್ವಾದಶಿ' },
  'tithi.Trayodashi':  { en: 'Trayodashi',  kn: 'ತ್ರಯೋದಶಿ' },
  'tithi.Chaturdashi': { en: 'Chaturdashi', kn: 'ಚತುರ್ದಶಿ' },
  'tithi.Purnima':     { en: 'Purnima',     kn: 'ಪೂರ್ಣಿಮ' },
  'tithi.Amavasya':    { en: 'Amavasya',    kn: 'ಅಮಾವಾಸ್ಯೆ' },

  // ── [V1.3] Vara (Weekdays) ────────────────────────────────────────────────
  'vara.Ravivara':     { en: 'Sunday',      kn: 'ಭಾನುವಾರ' },
  'vara.Somavara':     { en: 'Monday',      kn: 'ಸೋಮವಾರ' },
  'vara.Mangalavara':  { en: 'Tuesday',     kn: 'ಮಂಗಳವಾರ' },
  'vara.Budhavara':    { en: 'Wednesday',   kn: 'ಬುಧವಾರ' },
  'vara.Guruvara':     { en: 'Thursday',    kn: 'ಗುರುವಾರ' },
  'vara.Shukravara':   { en: 'Friday',      kn: 'ಶುಕ್ರವಾರ' },
  'vara.Shanivara':    { en: 'Saturday',    kn: 'ಶನಿವಾರ' },

  // ── [V1.3] Paksha ─────────────────────────────────────────────────────────
  'paksha.Shukla':     { en: 'Shukla Paksha (Waxing)',  kn: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  'paksha.Krishna':    { en: 'Krishna Paksha (Waning)', kn: 'ಕೃಷ್ಣ ಪಕ್ಷ' },

  // ── [V1.3] Daily Enrichment ───────────────────────────────────────────────
  'daily.deity':       { en: 'Deity of the Day',        kn: 'ಇಂದಿನ ದೈವ' },
  'daily.message':     { en: 'Spiritual Message',       kn: 'ಆಧ್ಯಾತ್ಮಿಕ ಸಂದೇಶ' },
  'daily.festival':    { en: "Today's Festival",        kn: 'ಇಂದಿನ ಹಬ್ಬ' },
  'daily.auspicious':  { en: 'Auspicious Today',        kn: 'ಶುಭ ಸಂಕೇತ' },
  'daily.colour':      { en: 'Colour',                  kn: 'ಬಣ್ಣ' },
  'daily.number':      { en: 'Number',                  kn: 'ಸಂಖ್ಯೆ' },
  'daily.direction':   { en: 'Direction',               kn: 'ದಿಕ್ಕು' },
  'daily.flower':      { en: 'Flower',                  kn: 'ಹೂವು' },

  // ── [V1.3] Share Card ─────────────────────────────────────────────────────
  'share.title':       { en: "Share Today's Panchanga",  kn: 'ಇಂದಿನ ಪಂಚಾಂಗ ಹಂಚಿಕೊಳ್ಳಿ' },
  'share.download':    { en: 'Download',                 kn: 'ಡೌನ್‌ಲೋಡ್' },
  'share.native':      { en: 'Share',                   kn: 'ಹಂಚಿ' },
  'share.copy.link':   { en: 'Copy Link',               kn: 'ಲಿಂಕ್ ನಕಲಿ' },
  'share.copy.image':  { en: 'Copy Image',              kn: 'ಚಿತ್ರ ನಕಲಿ' },
  'share.theme.traditional': { en: 'Traditional',       kn: 'ಸಾಂಪ್ರದಾಯಿಕ' },
  'share.theme.modern':      { en: 'Modern',            kn: 'ಆಧುನಿಕ' },
  'share.theme.kannada':     { en: 'Kannada',           kn: 'ಕನ್ನಡ' },
  'share.format.square':     { en: 'Square',            kn: 'ಚೌಕ' },
  'share.format.story':      { en: 'Story',             kn: 'ಕಥೆ' },
  'share.format.landscape':  { en: 'Landscape',         kn: 'ಅಡ್ಡ' },

  // ── [V1.3] Search ─────────────────────────────────────────────────────────
  'search.placeholder':  { en: 'Search Nakshatras, Festivals, Rashis…', kn: 'ನಕ್ಷತ್ರ, ಹಬ್ಬ, ರಾಶಿ ಹುಡುಕಿ…' },
  'search.recent':       { en: 'Recent Searches', kn: 'ಇತ್ತೀಚಿನ ಹುಡುಕಾಟ' },
  'search.no.results':   { en: 'No results found', kn: 'ಫಲಿತಾಂಶ ಸಿಗಲಿಲ್ಲ' },
  'search.category.nakshatra':  { en: 'Nakshatras', kn: 'ನಕ್ಷತ್ರಗಳು' },
  'search.category.festival':   { en: 'Festivals',  kn: 'ಹಬ್ಬಗಳು' },
  'search.category.rashi':      { en: 'Rashis',     kn: 'ರಾಶಿಗಳು' },
  'search.category.yoga':       { en: 'Yogas',      kn: 'ಯೋಗಗಳು' },
  'search.category.planet':     { en: 'Planets',    kn: 'ಗ್ರಹಗಳು' },

  // ── [V1.3] Dashboard ──────────────────────────────────────────────────────
  'dashboard.title':           { en: 'My Dashboard',         kn: 'ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' },
  'dashboard.recent.kundalis': { en: 'Recent Kundalis',      kn: 'ಇತ್ತೀಚಿನ ಕುಂಡಲಿಗಳು' },
  'dashboard.history':         { en: 'Panchanga History',    kn: 'ಪಂಚಾಂಗ ಇತಿಹಾಸ' },
  'dashboard.favourites':      { en: 'Favourite Locations',  kn: 'ಮೆಚ್ಚಿನ ಸ್ಥಳಗಳು' },
  'dashboard.no.login':        { en: 'No account needed',    kn: 'ಖಾತೆ ಬೇಡ' },

  // ── [V1.3] Location ───────────────────────────────────────────────────────
  'location.use.current':  { en: 'Use Current Location', kn: 'ಪ್ರಸ್ತುತ ಸ್ಥಳ ಬಳಸಿ' },
  'location.keep.previous': { en: 'Keep Previous Location', kn: 'ಹಿಂದಿನ ಸ್ಥಳ ಇರಲಿ' },
  'location.detecting':    { en: 'Detecting your location…', kn: 'ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ…' },
  'location.add.favourite': { en: 'Add to Favourites',  kn: 'ಮೆಚ್ಚಿನ ಸ್ಥಳಗಳಿಗೆ ಸೇರಿಸಿ' },
}

/** Translate a UI string key, with fallback to English */
export function getString(key: string, lang: string): string {
  const record = UI_STRINGS[key]
  if (!record) return key
  return (record as Record<string, string>)[lang] ?? record.en
}
