// ─────────────────────────────────────────────────────────────────────────────
// VedRith Service Worker  [V1.0 — Production + Auto-Update]
//
// Caching strategy:
//   Static assets (fonts/icons/images/JS/CSS)  → Cache-First
//   Page navigations                           → Network-First w/ offline fallback
//   Panchanga API                              → Network-First, cached for today
//   Other API routes                           → Network-Only
//
// Auto-update:
//   1. Every 30 min the SW checks /api/v1/version
//   2. If buildId differs from the installed version, notifies all clients
//   3. Client shows an update-ready toast; user can tap to reload
//   4. On next SW install, skipWaiting + clients.claim() fires immediately
//
// Midnight reset: Panchanga cache invalidated when the calendar date changes.
// ─────────────────────────────────────────────────────────────────────────────

const APP_VERSION     = '1.0.0'
const CACHE_VERSION   = 'vedrith-v1.0'
const STATIC_CACHE    = `${CACHE_VERSION}-static`
const PAGE_CACHE      = `${CACHE_VERSION}-pages`
const PANCHANGA_CACHE = `${CACHE_VERSION}-panchanga`

const STATIC_ASSETS = [
  '/',
  '/panchanga',
  '/kundali',
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

const NEVER_CACHE = [
  '/api/v1/kundali',
  '/api/v1/rules',
  '/api/v1/version',
  '/_next/webpack-hmr',
]

// ─────────────────────────────────────────────────────────────────────────────
// Install — pre-cache static shell
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// Activate — prune old caches, claim clients immediately
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('vedrith-') && k !== STATIC_CACHE && k !== PAGE_CACHE && k !== PANCHANGA_CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => broadcastToClients({ type: 'SW_ACTIVATED', version: APP_VERSION }))
  )
})

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function isPanchangaApi(url) {
  return url.pathname.includes('/api/v1/panchanga')
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/')         ||
    url.pathname.startsWith('/images/')        ||
    url.pathname.endsWith('.woff2')            ||
    url.pathname.endsWith('.woff')             ||
    url.pathname.endsWith('.ico')              ||
    url.pathname.endsWith('.png')              ||
    url.pathname.endsWith('.jpg')              ||
    url.pathname.endsWith('.svg')              ||
    url.pathname.endsWith('.webmanifest')
  )
}

function shouldNeverCache(url) {
  return NEVER_CACHE.some(p => url.pathname.startsWith(p))
}

async function broadcastToClients(data) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  clients.forEach(c => c.postMessage(data))
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch strategies
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPanchangaWithCache(request) {
  const url      = new URL(request.url)
  const cacheKey = `${url.pathname}${url.search}|date:${todayKey()}`
  const cache    = await caches.open(PANCHANGA_CACHE)

  const cached = await cache.match(cacheKey)
  if (cached) return cached

  // Purge stale entries from previous days
  const keys = await cache.keys()
  for (const k of keys) {
    if (!k.url.includes(`date:${todayKey()}`)) await cache.delete(k)
  }

  try {
    const response = await fetch(request)
    if (response.ok) await cache.put(cacheKey, response.clone())
    return response
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: { code: 'OFFLINE', message: 'Panchanga unavailable offline.' } }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

async function fetchStaticWithCache(request) {
  const cache  = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) await cache.put(request, response.clone())
    return response
  } catch {
    return new Response('', { status: 408 })
  }
}

async function fetchPageWithFallback(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE)
      await cache.put(request, response.clone())
    }
    return response
  } catch {
    const cache  = await caches.open(PAGE_CACHE)
    const cached = await cache.match(request)
    if (cached) return cached
    const offlinePage = await caches.match('/offline')
    return offlinePage ?? new Response('<h1>VedRith is offline</h1>', { headers: { 'Content-Type': 'text/html' } })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch handler
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (shouldNeverCache(url)) return

  if (isPanchangaApi(url)) {
    event.respondWith(fetchPanchangaWithCache(event.request))
    return
  }
  if (isStaticAsset(url)) {
    event.respondWith(fetchStaticWithCache(event.request))
    return
  }
  if (event.request.mode === 'navigate') {
    event.respondWith(fetchPageWithFallback(event.request))
    return
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Message handler — SKIP_WAITING | CLEAR_PANCHANGA_CACHE
// ─────────────────────────────────────────────────────────────────────────────

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  if (event.data?.type === 'CLEAR_PANCHANGA_CACHE') {
    caches.open(PANCHANGA_CACHE)
      .then(cache => cache.keys().then(keys => keys.forEach(k => cache.delete(k))))
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Midnight Panchanga cache invalidation + date-change broadcast
// ─────────────────────────────────────────────────────────────────────────────

let _lastDate = todayKey()

setInterval(() => {
  const now = todayKey()
  if (now !== _lastDate) {
    _lastDate = now
    caches.open(PANCHANGA_CACHE)
      .then(cache => cache.keys().then(keys => keys.forEach(k => cache.delete(k))))
    broadcastToClients({ type: 'DATE_CHANGED', date: now })
  }
}, 60_000)

// ─────────────────────────────────────────────────────────────────────────────
// Auto-Update — checks /api/v1/version every 30 minutes
// If a new buildId is detected, broadcasts UPDATE_AVAILABLE to all clients
// ─────────────────────────────────────────────────────────────────────────────

let _installedBuildId = null

async function checkForAppUpdate() {
  try {
    const res  = await fetch('/api/v1/version', { cache: 'no-store' })
    if (!res.ok) return
    const data = await res.json()

    if (!data.buildId) return

    if (_installedBuildId === null) {
      // First check — record the installed build
      _installedBuildId = data.buildId
      return
    }

    if (data.buildId !== _installedBuildId) {
      // New deployment detected — notify all clients
      broadcastToClients({ type: 'UPDATE_AVAILABLE', newBuildId: data.buildId, version: data.version })
    }
  } catch {
    // Network unavailable — silently skip
  }
}

// Check immediately on SW start, then every 30 min
checkForAppUpdate()
setInterval(checkForAppUpdate, 30 * 60 * 1000)
