'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLang } from '@/components/providers/LangProvider';

interface Props {
  title: string;
  enTitle?: string;
  detail?: string;
}

export default function ComingSoon({ title, enTitle, detail }: Props) {
  const { lang, setLang } = useLang();
  const heading = lang === 'kn' ? title : enTitle || title;

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />

      <main
        id="main-content"
        className="bg-cream min-h-screen pt-28 pb-20"
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="mx-auto mb-8 w-24 h-24 rounded-full border border-gold-500/30 flex items-center justify-center text-4xl">
            ॐ
          </div>

          <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold-700">
            {lang === 'kn' ? 'ಭವಿಷ್ಯದ ಭಾಗ' : 'Roadmap'}
          </p>

          <h1 className="font-serif text-5xl text-navy-900 font-light mt-2">
            {heading}
          </h1>

          <p className="text-navy-600 mt-5 leading-relaxed">
            {detail ||
              (lang === 'kn'
                ? 'ಈ ಭಾಗವು ವೇದಋಥ್ ಮುಂದಿನ ಹಂತದಲ್ಲಿ ಲಭ್ಯವಾಗಲಿದೆ.'
                : 'This module is planned for a future VedRith release. It is not presented as live in V1.')}
          </p>

          <Link href="/" className="btn-gold mt-8">
            {lang === 'kn' ? 'ಮುಖಪುಟಕ್ಕೆ' : 'Back to VedRith'}
          </Link>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
