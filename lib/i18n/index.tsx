'use client'

// ─────────────────────────────────────────────────────────────────────────────
// VedRith — i18n Context & Hook  [V1.1]
//
// Provides language state to all components.
// Persists choice in localStorage via preferences system.
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
  /** Translate a UI string key */
  t:         (key: string) => string
  /** Translate an inline record { en, kn, ... } */
  tRecord:   (record: Partial<Record<LanguageCode, string>> & { en: string }) => string
  availableLangs: LanguageCode[]
}

const I18nContext = createContext<I18nContextValue>({
  lang:    'en',
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const prefs = getPreferences()
      if (prefs.lang && IMPLEMENTED_LANGUAGES.includes(prefs.lang as LanguageCode)) {
        setLangState(prefs.lang as LanguageCode)
      }
    } catch {}
  }, [])

  const setLang = useCallback((newLang: LanguageCode) => {
    setLangState(newLang)
    try { savePreferences({ lang: newLang }) } catch {}
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

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTranslation() {
  return useContext(I18nContext)
}

// ── Lightweight standalone hook (no context required) ─────────────────────────
// Use this in components that don't have I18nProvider in tree,
// reading from localStorage directly.

export function useLocalLang(): LanguageCode {
  const [lang, setLang] = useState<LanguageCode>('kn')
  useEffect(() => {
    try {
      const prefs = getPreferences()
      if (prefs.lang && IMPLEMENTED_LANGUAGES.includes(prefs.lang as LanguageCode)) {
        setLang(prefs.lang as LanguageCode)
      }
    } catch {}
  }, [])
  return lang
}

// ── Language Switcher component ────────────────────────────────────────────────

interface LanguageSwitcherProps {
  className?: string
  compact?:   boolean
}

export function LanguageSwitcher({ className = '', compact = false }: LanguageSwitcherProps) {
  const { lang, setLang, availableLangs } = useTranslation()

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Language selector"
    >
      {!compact && (
        <span className="text-xs text-muted-foreground mr-1">Lang:</span>
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
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isActive
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-muted-foreground hover:text-foreground border border-transparent hover:border-border hover:bg-muted/50'
            } ${meta.fontClass ?? ''}`}
          >
            {meta.nameNative}
          </button>
        )
      })}
    </div>
  )
}
