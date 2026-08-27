'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLang } from '@/components/providers/LangProvider';
import { getTithiKnowledge, TITHI_KNOWLEDGE } from '@/lib/knowledge/tithi-knowledge';
import { getYogaKnowledge, YOGA_KNOWLEDGE } from '@/lib/knowledge/yoga-knowledge';
import { getKaranaKnowledge, KARANA_KNOWLEDGE } from '@/lib/knowledge/karana-knowledge';
import { getVaraKnowledge, VARA_KNOWLEDGE } from '@/lib/knowledge/vara-knowledge';

type Kind = 'tithi' | 'yoga' | 'karana' | 'vara';

interface KnowledgeEntry {
  key: string;
  nameEn: string;
  nameKn: string;
  meaning: string;
  description: string;
  deity?: string;
  planet?: string;
  symbol?: string;
  suitableActivities?: string[];
  avoidActivities?: string[];
  spiritualSignificance?: string;
  mantra?: string;
  fastingInfo?: string;
  remedy?: string;
  isFixed?: boolean;
}

const configs = {
  tithi: { title: { en: 'Tithi Knowledge', kn: 'ತಿಥಿ ಜ್ಞಾನ' }, data: TITHI_KNOWLEDGE, lookup: getTithiKnowledge },
  yoga: { title: { en: 'Yoga Knowledge', kn: 'ಯೋಗ ಜ್ಞಾನ' }, data: YOGA_KNOWLEDGE, lookup: getYogaKnowledge },
  karana: { title: { en: 'Karana Knowledge', kn: 'ಕರಣ ಜ್ಞಾನ' }, data: KARANA_KNOWLEDGE, lookup: getKaranaKnowledge },
  vara: { title: { en: 'Vara Knowledge', kn: 'ವಾರ ಜ್ಞಾನ' }, data: VARA_KNOWLEDGE, lookup: getVaraKnowledge },
} as const;

export default function KnowledgeDetail({ kind }: { kind: Kind }) {
  const { lang, setLang } = useLang();
  const config = configs[kind];
  const entries = Object.values(config.data) as KnowledgeEntry[];
  const tr = (en: string, kn: string) => (lang === 'kn' ? kn : en);

  return (
    <>
      <Header lang={lang} onLangChange={setLang} />

      <main id="main-content" className="min-h-screen bg-cream pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold-700">
              {tr('VedRith Knowledge', 'ವೇದಋಥ್ ಜ್ಞಾನ')}
            </p>

            <h1 className="font-serif text-5xl text-navy-900 font-light mt-2">
              {config.title[lang]}
            </h1>

            <p className="text-navy-600 mt-4">
              {tr(
                'Reference, meaning, traditional suitability and observance guidance from the VedRith knowledge base.',
                'ವೇದಋಥ್ ಜ್ಞಾನ ಸಂಗ್ರಹದಲ್ಲಿನ ಅರ್ಥ, ಸಾಂಪ್ರದಾಯಿಕ ಉಪಯುಕ್ತತೆ ಮತ್ತು ಆಚರಣೆ ಮಾಹಿತಿಯನ್ನು ತಿಳಿಯಿರಿ.'
              )}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {entries.map((item) => (
              <article
                key={item.key}
                id={item.key}
                className="bg-white border border-navy-900/10 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-[0.18em] text-gold-700">
                      {kind}
                    </p>
                    <h2 className="font-serif text-3xl text-navy-900 mt-1">
                      {lang === 'kn' ? item.nameKn : item.nameEn}
                    </h2>
                  </div>

                  {kind === 'karana' && (
                    <span className="text-xs text-navy-500">
                      {item.isFixed ? tr('Fixed', 'ಸ್ಥಿರ') : tr('Movable', 'ಚರ')}
                    </span>
                  )}
                </div>

                <p className="text-navy-700 mt-4 leading-relaxed">{item.meaning}</p>
                <p className="text-navy-600 mt-3 leading-relaxed">{item.description}</p>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  <div>
                    <p className="text-[0.62rem] uppercase tracking-wider text-gold-700">
                      {tr('Presiding deity / influence', 'ಅಧಿದೇವತೆ / ಪ್ರಭಾವ')}
                    </p>
                    <p className="text-sm text-navy-700 mt-1">
                      {item.deity || item.planet || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[0.62rem] uppercase tracking-wider text-gold-700">
                      {tr('Symbol', 'ಚಿಹ್ನೆ')}
                    </p>
                    <p className="text-sm text-navy-700 mt-1">{item.symbol || '—'}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mt-5 pt-5 border-t border-navy-900/10">
                  <div>
                    <h3 className="font-semibold text-sm text-navy-900">
                      {tr('Suitable activities', 'ಅನುಕೂಲ ಕಾರ್ಯಗಳು')}
                    </h3>
                    <ul className="list-disc ml-5 mt-2 text-sm text-navy-600 space-y-1">
                      {(item.suitableActivities ?? []).map((activity) => (
                        <li key={activity}>{activity}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-navy-900">
                      {tr('Avoid', 'ತಪ್ಪಿಸಬೇಕಾದವು')}
                    </h3>
                    <ul className="list-disc ml-5 mt-2 text-sm text-navy-600 space-y-1">
                      {(item.avoidActivities ?? []).map((activity) => (
                        <li key={activity}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {(item.spiritualSignificance ||
                  item.mantra ||
                  item.fastingInfo ||
                  item.remedy) && (
                  <div className="mt-5 pt-5 border-t border-navy-900/10 space-y-3 text-sm text-navy-600">
                    {item.spiritualSignificance && (
                      <p>
                        <strong>{tr('Spiritual significance', 'ಆಧ್ಯಾತ್ಮಿಕ ಮಹತ್ವ')}:</strong>{' '}
                        {item.spiritualSignificance}
                      </p>
                    )}
                    {item.mantra && (
                      <p>
                        <strong>{tr('Mantra', 'ಮಂತ್ರ')}:</strong> {item.mantra}
                      </p>
                    )}
                    {item.fastingInfo && (
                      <p>
                        <strong>{tr('Observance / fasting', 'ವ್ರತ / ಆಚರಣೆ')}:</strong>{' '}
                        {item.fastingInfo}
                      </p>
                    )}
                    {item.remedy && (
                      <p>
                        <strong>{tr('Traditional remedy', 'ಸಾಂಪ್ರದಾಯಿಕ ಪರಿಹಾರ')}:</strong>{' '}
                        {item.remedy}
                      </p>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
