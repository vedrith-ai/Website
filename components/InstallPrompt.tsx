'use client';

import { useState, useEffect } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface Props { lang: Lang }

export function InstallPrompt({ lang }: Props) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm rounded-xl border bg-card shadow-lg p-4 space-y-3">
      <div>
        <p className="font-semibold text-sm">{t('pwa.install', lang)}</p>
        <p className="text-xs text-muted-foreground">{t('pwa.install.desc', lang)}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          className="flex-1 rounded bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
        >
          {t('pwa.install.btn', lang)}
        </button>
        <button
          onClick={() => setVisible(false)}
          className="rounded border px-3 py-2 text-xs"
        >
          {t('pwa.dismiss', lang)}
        </button>
      </div>
    </div>
  );
}
