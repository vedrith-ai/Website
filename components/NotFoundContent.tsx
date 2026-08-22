'use client';

import Link from 'next/link';
import { useLang } from '@/components/providers/LangProvider';
import { t } from '@/src/i18n/ui';

export function NotFoundContent() {
  const { lang } = useLang();

  return (
    <main className="container mx-auto px-4 py-24 text-center space-y-6">
      <div className="text-6xl">🔭</div>
      <h1 className="text-3xl font-bold">{t('404.title', lang)}</h1>
      <p className="text-muted-foreground">{t('404.message', lang)}</p>
      <Link
        href="/"
        className="inline-block rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
      >
        {t('404.home', lang)}
      </Link>
    </main>
  );
}
