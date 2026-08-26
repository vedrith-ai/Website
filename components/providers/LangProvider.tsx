'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from '@/src/types';

const LANG_KEY = 'vedrith:lang';
const SUPPORTED: Lang[] = ['en', 'kn'];

interface LangContextType {
  lang:    Lang;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextType>({
  lang:    'en',
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  // Start with 'en' on server to match SSR; hydrate from localStorage on client
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY) as Lang | null;
      if (stored && SUPPORTED.includes(stored)) {
        setLangState(stored);
        document.cookie = `vedrith:lang=${stored}; Path=/; Max-Age=31536000; SameSite=Lax`;
        document.documentElement.lang = stored === 'kn' ? 'kn' : 'en';
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const setLang = (l: Lang) => {
    if (!SUPPORTED.includes(l)) return;
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
      document.cookie = `vedrith:lang=${l}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {}
    document.documentElement.lang = l === 'kn' ? 'kn' : 'en';
    // Notify any non-context listeners (e.g. SW)
    window.dispatchEvent(new CustomEvent('vedrith:langChange', { detail: { lang: l } }));
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextType {
  return useContext(LangContext);
}
