// ─────────────────────────────────────────────────────────────────────────────
// VedRith — i18n Type System  [Platform V1.1]
//
// Multilingual foundation. Currently implemented: en + kn.
// Architecture supports 12+ languages — adding a new language requires only:
//   1. Add code to LanguageCode union below
//   2. Add translation file in translations/<code>.ts
//   3. Register it in LANGUAGE_META
// No component or engine changes required.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Supported UI language codes.
 * Extend this union to add future languages.
 * Currently implemented: 'en' | 'kn'
 */
export type LanguageCode =
  | 'en'   // English       — implemented V1.1
  | 'kn'   // Kannada       — implemented V1.1
  | 'hi'   // Hindi         — future
  | 'sa'   // Sanskrit      — future
  | 'ta'   // Tamil         — future
  | 'te'   // Telugu        — future
  | 'ml'   // Malayalam     — future
  | 'mr'   // Marathi       — future
  | 'gu'   // Gujarati      — future
  | 'bn'   // Bengali       — future
  | 'or'   // Odia          — future
  | 'pa'   // Punjabi       — future

/** Languages that are fully implemented and selectable by users */
export const IMPLEMENTED_LANGUAGES: LanguageCode[] = ['en', 'kn']

export interface LanguageMeta {
  code:       LanguageCode
  nameNative: string          // e.g. "ಕನ್ನಡ"
  nameEn:     string          // e.g. "Kannada"
  rtl:        boolean
  implemented: boolean
  script:     string          // Unicode script name
  fontClass?: string          // CSS class for font override
}

export const LANGUAGE_META: Record<LanguageCode, LanguageMeta> = {
  en: { code:'en', nameNative:'English',     nameEn:'English',    rtl:false, implemented:true,  script:'Latin'     },
  kn: { code:'kn', nameNative:'ಕನ್ನಡ',       nameEn:'Kannada',    rtl:false, implemented:true,  script:'Kannada',  fontClass:'font-kannada' },
  hi: { code:'hi', nameNative:'हिंदी',        nameEn:'Hindi',      rtl:false, implemented:false, script:'Devanagari' },
  sa: { code:'sa', nameNative:'संस्कृतम्',   nameEn:'Sanskrit',   rtl:false, implemented:false, script:'Devanagari' },
  ta: { code:'ta', nameNative:'தமிழ்',        nameEn:'Tamil',      rtl:false, implemented:false, script:'Tamil'     },
  te: { code:'te', nameNative:'తెలుగు',       nameEn:'Telugu',     rtl:false, implemented:false, script:'Telugu'    },
  ml: { code:'ml', nameNative:'മലയാളം',       nameEn:'Malayalam',  rtl:false, implemented:false, script:'Malayalam' },
  mr: { code:'mr', nameNative:'मराठी',        nameEn:'Marathi',    rtl:false, implemented:false, script:'Devanagari' },
  gu: { code:'gu', nameNative:'ગુજરાતી',      nameEn:'Gujarati',   rtl:false, implemented:false, script:'Gujarati'  },
  bn: { code:'bn', nameNative:'বাংলা',        nameEn:'Bengali',    rtl:false, implemented:false, script:'Bengali'   },
  or: { code:'or', nameNative:'ଓଡ଼ିଆ',       nameEn:'Odia',       rtl:false, implemented:false, script:'Odia'      },
  pa: { code:'pa', nameNative:'ਪੰਜਾਬੀ',       nameEn:'Punjabi',    rtl:false, implemented:false, script:'Gurmukhi'  },
}

/**
 * A value available in all implemented languages.
 * For ui strings, only 'en' and 'kn' are required.
 * Future languages can be added without breaking existing code.
 */
export type TranslationRecord = {
  [K in LanguageCode]?: string
} & {
  en: string   // English is always required as fallback
}

/** Resolve a translation, falling back to English */
export function t(record: TranslationRecord, lang: LanguageCode): string {
  return record[lang] ?? record.en
}
