'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — i18n Context & Hook  [RC1]
// Provides language state. Persists in localStorage. Supports entire site.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { LanguageCode } from './types'
import { IMPLEMENTED_LANGUAGES, LANGUAGE_META } from './types'
import { UI_STRINGS } from './translations/ui'
import { getPreferences, savePreferences } from '@/lib/storage/preferences'

// ── Context ───────────────────────────────────────────────────────────────────

interface I18nContextValue {
  lang:      LanguageCode
  setLang:   (lang: LanguageCode) => void
  t:         (key: string) => string
  tRecord:   (record: Partial<Record<LanguageCode, string>> & { en: string }) => string
  availableLangs: LanguageCode[]
}

const I18nContext = createContext<I18nContextValue>({
  lang:    'kn',
  setLang: () => {},
  t:       (k) => k,
  tRecord: (r) => r.en,
  availableLangs: IMPLEMENTED_LANGUAGES,
})

// ── Provider ──────────────────────────────────────────────────────────────────

export function I18nProvider({ children, defaultLang = 'kn' }: {
  children:     ReactNode
  defaultLang?: LanguageCode
}) {
  const [lang, setLangState] = useState<LanguageCode>(defaultLang)

  // Load from localStorage on mount — entire site switches
  useEffect(() => {
    try {
      const prefs = getPreferences()
      if (prefs.lang && IMPLEMENTED_LANGUAGES.includes(prefs.lang as LanguageCode)) {
        setLangState(prefs.lang as LanguageCode)
        document.documentElement.lang = prefs.lang
      }
    } catch { /* ignore */ }
  }, [])

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang)
    document.documentElement.lang = newLang
    try { savePreferences({ lang: newLang }) } catch { /* ignore */ }
  }, [])

  const t = useCallback((key: string): string => {
    const record = UI_STRINGS[key]
    if (!record) return key
    return (record as Record<string, string>)[lang] ?? record.en
  }, [lang])

  const tRecord = useCallback((
    record: Partial<Record<LanguageCode, string>> & { en: string }
  ): string => {
    return (record as Record<string, string>)[lang] ?? record.en
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tRecord, availableLangs: IMPLEMENTED_LANGUAGES }}>
      {children}
    </I18nContext.Provider>
  )
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useTranslation() {
  return useContext(I18nContext)
}

export function useLocalLang(): LanguageCode {
  const [lang, setLang] = useState<LanguageCode>('kn')
  useEffect(() => {
    try {
      const prefs = getPreferences()
      if (prefs.lang && IMPLEMENTED_LANGUAGES.includes(prefs.lang as LanguageCode)) {
        setLang(prefs.lang as LanguageCode)
      }
    } catch { /* ignore */ }
  }, [])
  return lang
}

// ── Language Switcher ─────────────────────────────────────────────────────────

interface LanguageSwitcherProps {
  className?: string
  compact?:   boolean
  dark?:      boolean   // for use on dark backgrounds (mobile menu)
}

export function LanguageSwitcher({ className = '', compact = false, dark = false }: LanguageSwitcherProps) {
  const { lang, setLang, availableLangs } = useTranslation()

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {!compact && (
        <span className={`text-xs mr-1 ${dark ? 'text-cream-100/40' : 'text-navy-600/60'}`}>
          Lang:
        </span>
      )}
      {availableLangs.map(code => {
        const meta    = LANGUAGE_META[code]
        const isActive = lang === code
        return (
          <button
            key={code}
            onClick={() => setLang(code)}
            aria-pressed={isActive}
            aria-label={`Switch to ${meta.nameEn}`}
            className={`
              px-2.5 py-1 rounded-lg text-xs font-medium transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500
              ${isActive
                ? dark
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/40'
                  : 'bg-amber-500/20 text-amber-700 border border-amber-500/40'
                : dark
                  ? 'text-cream-100/40 border border-transparent hover:text-cream-100/70 hover:border-white/15'
                  : 'text-navy-600/60 border border-transparent hover:text-navy-800 hover:border-navy-200/50'
              }
              ${meta.fontClass ?? ''}
            `}
          >
            {meta.nameNative}
          </button>
        )
      })}
    </div>
  )
}
