'use client';

import { useState, useEffect, useRef } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang, SearchResult } from '@/src/types';

interface Props { lang: Lang }

export function SmartSearch({ lang }: Props) {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) setResults(json.data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const TYPE_ICONS: Record<string, string> = {
    nakshatra: '⭐', rashi: '♈', graha: '🪐',
    yoga: '🔯', tithi: '🌙', karana: '☯️',
    vara: '📅', festival: '🎉', knowledge: '📖',
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={t('search.placeholder', lang)}
          className="w-full rounded-xl border bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={t('search.title', lang)}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {results.length > 0 && (
        <div className="rounded-xl border bg-card divide-y shadow-md">
          {results.map(r => (
            <a
              key={r.id}
              href={r.href}
              className="flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors"
            >
              <span className="text-lg mt-0.5">{TYPE_ICONS[r.type] ?? '📄'}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{r.title}</span>
                  {r.titleKn && <span className="text-xs text-muted-foreground font-kannada">{r.titleKn}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {query.length >= 2 && !loading && results.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">
          {t('search.noResults', lang)}
        </p>
      )}
    </div>
  );
}
