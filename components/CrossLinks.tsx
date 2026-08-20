'use client';

import { useEffect, useRef } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

interface Link { href: string; labelKey: string; icon: string }

const LINKS: Link[] = [
  { href: '/panchanga',  labelKey: 'crosslinks.today',     icon: '☀️' },
  { href: '/kundali',    labelKey: 'crosslinks.kundali',   icon: '⭕' },
  { href: '/muhurta',    labelKey: 'crosslinks.muhurta',   icon: '🕐' },
  { href: '/nakshatra',  labelKey: 'crosslinks.nakshatra', icon: '⭐' },
  { href: '/calendar',   labelKey: 'crosslinks.calendar',  icon: '📅' },
  { href: '/knowledge',  labelKey: 'crosslinks.knowledge', icon: '📖' },
  { href: '/festivals',  labelKey: 'crosslinks.festivals', icon: '🎉' },
];

interface Props { lang: Lang; current?: string }

export function CrossLinks({ lang, current }: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  // Custom DOM event wiring for analytics / telemetry
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const handleClick = (e: Event) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href') ?? '';
      // Dispatch custom navigation event for SW / telemetry
      window.dispatchEvent(new CustomEvent('vedrith:crosslink', { detail: { href } }));
    };

    list.addEventListener('click', handleClick);
    return () => list.removeEventListener('click', handleClick);
  }, []);

  const visible = LINKS.filter(l => l.href !== current);

  return (
    <nav aria-label={t('crosslinks.title', lang)}>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
        {t('crosslinks.title', lang)}
      </p>
      <ul ref={listRef} className="flex flex-wrap gap-2">
        {visible.map(link => (
          <li key={link.href}>
            <a
              href={link.href}
              className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-sm hover:bg-accent hover:border-primary/40 transition-colors"
            >
              <span aria-hidden>{link.icon}</span>
              <span>{t(link.labelKey, lang)}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
