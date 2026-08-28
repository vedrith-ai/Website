import Image from 'next/image';
import Link from 'next/link';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

export function Footer({lang}:{lang:Lang}) {
  return (
    <footer className="bg-navy-950 text-cream-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="flex flex-col items-center text-center mb-12">
          <Image src="/images/logo-icon.png" alt="VedRith" width={84} height={84} className="h-20 w-20 mb-4 opacity-90" />
          <p className="font-serif text-3xl font-light">VedRith</p>
          <p className="font-sans text-[0.7rem] tracking-[0.22em] uppercase text-gold-500 mt-2">Powered by Sharva's IT</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            [t('nav.panchanga',lang),[['/panchanga',t('nav.panchanga',lang)],['/kundali',t('nav.kundali',lang)]]],
            [t('nav.knowledge',lang),[['/knowledge',t('nav.knowledge',lang)],['/search',t('nav.search',lang)],['/share',t('nav.share',lang)]]],
            [t('nav.about',lang),[['/about',t('nav.about',lang)],['/contact',t('nav.contact',lang)],['/privacy',t('footer.privacy',lang)]]],
            [t('common.language',lang),[['/settings',t('nav.settings',lang)],['/panchanga',t('nav.panchanga',lang)]]],
          ].map(([title,links])=>(
            <div key={String(title)}>
              <p className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-gold-500 mb-4">{String(title)}</p>
              <ul className="space-y-2 text-sm text-cream-100/55">
                {(links as string[][]).map(([href,label])=><li key={href}><Link href={href} className="hover:text-gold-400 transition-colors">{label}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3 text-xs text-cream-100/35">
          <span>© {new Date().getFullYear()} VedRith · Powered by Sharva's IT</span>
          <span>vedrith.sharvasit.in</span>
        </div>
      </div>
    </footer>
  );
}
