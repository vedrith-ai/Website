'use client';

import { useEffect, useState } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface Props { lang: Lang }

const DISMISS_KEY = 'vedrith:pwaPromptDismissed';

export function InstallPrompt({ lang }: Props) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {}

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setManual(false);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Give the browser a moment; on iOS/unsupported browsers we still show
    // the user the "Continue in Browser" option and install instructions.
    const timer = window.setTimeout(() => {
      setVisible(true);
      setManual(true);
    }, 1200);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch {}
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') dismiss();
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-[55] mx-auto max-w-md rounded-2xl border border-gold-500/25 bg-card shadow-2xl p-5 space-y-4">
      <div>
        <p className="font-serif text-xl text-foreground">
          {t('pwa.install', lang)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('pwa.install.desc', lang)}
        </p>
        {manual && !deferredPrompt && (
          <p className="text-xs text-muted-foreground mt-2">
            {lang === 'kn'
              ? 'ಬ್ರೌಸರ್ ಮೆನುವಿನಿಂದ “Add to Home Screen” ಆಯ್ಕೆ ಮಾಡಿ.'
              : 'Use your browser menu and choose “Add to Home Screen” or “Install app”.'}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {deferredPrompt && (
          <button onClick={install} className="flex-1 rounded bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
            {t('pwa.install.btn', lang)}
          </button>
        )}
        <button onClick={dismiss} className="flex-1 rounded border px-3 py-2 text-xs">
          {lang === 'kn' ? 'ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮುಂದುವರಿಸಿ' : 'Continue in Browser'}
        </button>
      </div>
    </div>
  );
}
