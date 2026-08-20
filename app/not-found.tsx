import type { Metadata } from 'next';
import Link from 'next/link';
import { t } from '@/src/i18n/ui';

export const metadata: Metadata = { title: 'Page Not Found | VedRith' };

export default function NotFound() {
  const lang = 'en';
  return (
    <main className="container mx-auto px-4 py-24 text-center space-y-6">
      <div className="text-6xl">🔭</div>
      <h1 className="text-3xl font-bold">{t('404.title', lang)}</h1>
      <p className="text-muted-foreground">{t('404.message', lang)}</p>
      <Link href="/" className="inline-block rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
        {t('404.home', lang)}
      </Link>
    </main>
  );
}
