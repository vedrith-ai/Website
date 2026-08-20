'use client';

import { useLang }     from '@/components/providers/LangProvider';
import { CrossLinks }  from '@/components/CrossLinks';
import { Header }      from '@/components/layout/Header';
import { Footer }      from '@/components/layout/Footer';
import { t } from '@/src/i18n/ui';

interface Props {
  titleKey:    string;
  description: string;
  current:     string;
  children?:   React.ReactNode;
}

export function PageTemplate({ titleKey, description, current, children }: Props) {
  const { lang, setLang } = useLang();

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />
      <main id="main-content" className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t(titleKey, lang)}</h1>
        <p className="text-muted-foreground mb-8">{description}</p>
        {children ?? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            <p>{t('common.loading', lang)}</p>
          </div>
        )}
        <div className="mt-12">
          <CrossLinks lang={lang} current={current} />
        </div>
      </main>
      <Footer lang={lang} />
    </>
  );
}
