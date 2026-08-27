'use client';
import { useEffect, useState } from 'react';
import { t } from '@/src/i18n/ui';
import type { Lang } from '@/src/types';

export function PWAUpdateBanner({ lang }: { lang: Lang }) {
  const [available,setAvailable]=useState(false);
  useEffect(()=>{
    const handler=()=>setAvailable(true);
    window.addEventListener('vedrith:swUpdateAvailable',handler);
    return()=>window.removeEventListener('vedrith:swUpdateAvailable',handler);
  },[]);
  if(!available) return null;
  const apply=async()=>{
    if(navigator.serviceWorker.controller){
      navigator.serviceWorker.controller.postMessage({type:'SW_SKIP_WAITING'});
    }
  };
  return <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-xl border bg-card shadow-xl p-4">
    <p className="font-semibold text-sm">{t('pwa.update.title',lang)}</p>
    <p className="text-xs text-muted-foreground mt-1">{t('pwa.update.desc',lang)}</p>
    <div className="flex gap-2 mt-3"><button onClick={apply} className="flex-1 rounded bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">{t('pwa.update.button',lang)}</button><button onClick={()=>setAvailable(false)} className="rounded border px-3 py-2 text-xs">{t('common.close',lang)}</button></div>
  </div>;
}
