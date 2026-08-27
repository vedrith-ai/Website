import Link from 'next/link';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

interface Props { lang: Lang }

export function Footer({ lang }: Props) {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-bold text-primary mb-2">☀️ {t('hero.title', lang)}</p>
            <p className="text-xs text-muted-foreground">{t('hero.subtitle', lang)}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('about.sharvasit', lang)}</p>
          </div>
          <div>
            <p className="font-medium text-sm mb-3">{t('nav.panchanga', lang)}</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/panchanga" className="hover:text-foreground">{t('nav.panchanga', lang)}</Link></li>
              <li><Link href="/kundali"   className="hover:text-foreground">{t('nav.kundali', lang)}</Link></li>
              <li><Link href="/muhurta"   className="hover:text-foreground">{t('nav.muhurta', lang)}</Link></li>
              <li><Link href="/calendar"  className="hover:text-foreground">{t('nav.calendar', lang)}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm mb-3">{t('knowledge.title', lang)}</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/nakshatra" className="hover:text-foreground">{t('nav.nakshatra', lang)}</Link></li>
              <li><Link href="/festivals" className="hover:text-foreground">{t('nav.festivals', lang)}</Link></li>
              <li><Link href="/knowledge" className="hover:text-foreground">{t('nav.knowledge', lang)}</Link></li>
              <li><Link href="/search"    className="hover:text-foreground">{t('nav.search', lang)}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-sm mb-3">{t('about.title', lang)}</p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/about"    className="hover:text-foreground">{t('nav.about', lang)}</Link></li>
              <li><Link href="/contact"  className="hover:text-foreground">{t('nav.contact', lang)}</Link></li>
              <li><Link href="/settings" className="hover:text-foreground">{t('nav.settings', lang)}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">{t('footer.rights', lang)}</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/about#privacy" className="hover:text-foreground">{t('footer.privacy', lang)}</Link>
            <Link href="/about#terms"   className="hover:text-foreground">{t('footer.terms', lang)}</Link>
            <span className="text-muted-foreground/60">{t('footer.disclaimer', lang)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
