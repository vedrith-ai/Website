'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let registration: ServiceWorkerRegistration | null = null;
    let messageHandler: ((event: MessageEvent) => void) | null = null;

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

        messageHandler = (event: MessageEvent) => {
          if (event.data?.type === 'SW_UPDATE_AVAILABLE') {
            window.dispatchEvent(new CustomEvent('vedrith:swUpdateAvailable', {
              detail: { version: event.data.version },
            }));
          }
        };
        navigator.serviceWorker.addEventListener('message', messageHandler);

        registration.update();

        registration.addEventListener('updatefound', () => {
          const worker = registration?.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              window.dispatchEvent(new CustomEvent('vedrith:swUpdateAvailable'));
            }
          });
        });
      } catch (error) {
        console.warn('[VedRith] Service worker registration failed', error);
      }
    };

    void register();

    const onControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    return () => {
      if (messageHandler) navigator.serviceWorker.removeEventListener('message', messageHandler);
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return null;
}
