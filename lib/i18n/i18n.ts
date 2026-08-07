// ─────────────────────────────────────────────────────────────────────────────
// VedRith — i18n Public API  [V1.1]
// ─────────────────────────────────────────────────────────────────────────────

export type { LanguageCode, TranslationRecord, LanguageMeta } from './types'
export { IMPLEMENTED_LANGUAGES, LANGUAGE_META, t } from './types'
export { UI_STRINGS, getString } from './translations/ui'
export { I18nProvider, useTranslation, useLocalLang, LanguageSwitcher } from './index'
export {
  nakshatraLabel, nakshatraName,
  rashiLabel, rashiShort, getRashiInfo,
  planetName, planetShort,
  houseLabel, houseShort,
  RASHI_INFO, PLANET_INFO,
} from './kundali-names'
