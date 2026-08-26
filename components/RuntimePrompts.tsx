'use client';

import { useLang } from '@/components/providers/LangProvider';
import { InstallPrompt } from '@/components/InstallPrompt';
import { PWAUpdateBanner } from '@/components/PWAUpdateBanner';

export function RuntimePrompts() {
  const { lang } = useLang();
  return <>
    <InstallPrompt lang={lang} />
    <PWAUpdateBanner lang={lang} />
  </>;
}
