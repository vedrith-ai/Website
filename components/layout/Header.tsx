'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

interface Props { lang: Lang; onLangChange: (l: Lang) => void }

const NAV_ITEMS = [
  { href: '/panchanga', key: 'nav.panchanga' },
  { href: '/kundali',   key: 'nav.kundali'   },
  { href: '/muhurta',   key: 'nav.muhurta'   },
  { href: '/calendar',  key: 'nav.calendar'  },
  { href: '/festivals', key: 'nav.festivals' },
  { href: '/knowledge', key: 'nav.knowledge' },
];

export function Header({ lang, onLangChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-shadow ${
        scrolled ? 'bg-background/95 backdrop-blur shadow-sm' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <span className="text-xl">☀️</span>
          <span>{t('hero.title', lang)}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t(item.key, lang)}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => onLangChange(lang === 'en' ? 'kn' : 'en')}
            className="rounded-full border px-3 py-1 text-xs font-medium hover:bg-accent transition-colors"
            aria-label={t('a11y.langSwitch', lang)}
          >
            {lang === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </button>

          {/* Search */}
          <Link href="/search" className="rounded-md p-1.5 hover:bg-accent" aria-label={t('search.title', lang)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden rounded-md p-1.5 hover:bg-accent"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? t('a11y.menuClose', lang) : t('a11y.menuOpen', lang)}
            aria-expanded={menuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t bg-background px-4 py-3 space-y-1" aria-label="Mobile navigation">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
            >
              {t(item.key, lang)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
