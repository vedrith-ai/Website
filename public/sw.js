/* VedRith Service Worker — V1.0 */

const CACHE_NAME    = 'vedrith-v1';
const VERSION_URL   = '/api/v1/version';
const POLL_INTERVAL = 60 * 60 * 1000; // 1 hour

const STATIC_ASSETS = [
  '/',
  '/panchanga',
  '/kundali',
  '/manifest.json',
];

// ── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.all(STATIC_ASSETS.map(async asset => {
        try { await cache.add(asset); } catch {}
      }));
    })
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
  startVersionPolling();
});

// ── Fetch — network-first for API, cache-first for static ────────────────────

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith('/api/')) {
    // Network-first — never serve stale API responses
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ success: false, error: 'Offline' }), {
          status:  503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return response;
      });
    })
  );
});

// ── Version polling — auto-update detection ──────────────────────────────────

let currentVersion = null;

async function checkVersion() {
  try {
    const res  = await fetch(VERSION_URL, { cache: 'no-store' });
    const data = await res.json();
    if (!currentVersion) {
      currentVersion = data.version;
      return;
    }
    if (data.version !== currentVersion) {
      // Notify all clients — they show the update banner
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client =>
        client.postMessage({ type: 'SW_UPDATE_AVAILABLE', version: data.version })
      );
    }
  } catch {
    // Offline — skip
  }
}

function startVersionPolling() {
  checkVersion();
  setInterval(checkVersion, POLL_INTERVAL);
}

// ── Message handler — skip waiting on demand ─────────────────────────────────

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SW_SKIP_WAITING') {
    self.skipWaiting();
  }
});
