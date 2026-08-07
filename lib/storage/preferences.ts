// ─────────────────────────────────────────────────────────────────────────────
// VedRith — Local Preferences  [Platform V1]
//
// ALL data stored in localStorage only.
// NO cloud storage. NO login required. NO tracking.
//
// Keys are namespaced with 'vr_' to avoid collisions.
// ─────────────────────────────────────────────────────────────────────────────

const KEY = {
  LOCATION:       'vr_location',
  PREFERENCES:    'vr_prefs',
  PWA_INSTALL:    'vr_pwa_install',
  LAST_PANCHANGA: 'vr_last_panchanga',
  LOCATION_ASKED: 'vr_location_asked',
} as const

// ── Location ──────────────────────────────────────────────────────────────────

export interface StoredLocation {
  lat:         number
  lng:         number
  name:        string    // Human-readable city name
  timezone:    string    // IANA timezone e.g. 'Asia/Kolkata'
  region:      string    // e.g. 'Karnataka'
  source:      'gps' | 'manual' | 'default'
  savedAt:     string    // ISO timestamp
}

const DEFAULT_LOCATION: StoredLocation = {
  lat:      12.9716,
  lng:      77.5946,
  name:     'Bengaluru',
  timezone: 'Asia/Kolkata',
  region:   'Karnataka',
  source:   'default',
  savedAt:  new Date().toISOString(),
}

export function getStoredLocation(): StoredLocation {
  try {
    const raw = localStorage.getItem(KEY.LOCATION)
    if (!raw) return DEFAULT_LOCATION
    const parsed = JSON.parse(raw)
    // Validate minimal shape
    if (typeof parsed.lat === 'number' && typeof parsed.lng === 'number') return parsed
    return DEFAULT_LOCATION
  } catch {
    return DEFAULT_LOCATION
  }
}

export function saveLocation(loc: Omit<StoredLocation, 'savedAt'>): void {
  try {
    const full: StoredLocation = { ...loc, savedAt: new Date().toISOString() }
    localStorage.setItem(KEY.LOCATION, JSON.stringify(full))
  } catch {}
}

export function clearLocation(): void {
  try { localStorage.removeItem(KEY.LOCATION) } catch {}
}

export function hasCustomLocation(): boolean {
  try {
    const raw = localStorage.getItem(KEY.LOCATION)
    if (!raw) return false
    const parsed = JSON.parse(raw)
    return parsed.source !== 'default'
  } catch { return false }
}

// ── User preferences ──────────────────────────────────────────────────────────

export interface UserPreferences {
  lang:           string   // LanguageCode — string for storage compatibility
  theme:          'dark' | 'light' | 'system'
  chartStyle:     'south' | 'north'
  pakshaStyle:    'chandramana' | 'sauramana'
  regionalTrad:   'Karnataka' | 'Maharashtra' | 'TamilNadu' | 'AndhraTelangana' | 'Kerala' | 'NorthIndia'
  showSeconds:    boolean
  compactCards:   boolean
}

const DEFAULT_PREFS: UserPreferences = {
  lang:           'kn',
  theme:          'dark',
  chartStyle:     'south',
  pakshaStyle:    'chandramana',
  regionalTrad:   'Karnataka',
  showSeconds:    false,
  compactCards:   false,
}

export function getPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(KEY.PREFERENCES)
    if (!raw) return DEFAULT_PREFS
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
  } catch { return DEFAULT_PREFS }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  try {
    const current = getPreferences()
    localStorage.setItem(KEY.PREFERENCES, JSON.stringify({ ...current, ...prefs }))
  } catch {}
}

// ── PWA Install state ─────────────────────────────────────────────────────────

export interface PWAInstallState {
  installed:    boolean
  dismissed:    boolean
  dismissedAt:  string | null
  /** Remind after 7 days if dismissed */
  remindAfterDays: number
}

const DEFAULT_PWA_STATE: PWAInstallState = {
  installed:       false,
  dismissed:       false,
  dismissedAt:     null,
  remindAfterDays: 7,
}

export function getPWAInstallState(): PWAInstallState {
  try {
    const raw = localStorage.getItem(KEY.PWA_INSTALL)
    if (!raw) return DEFAULT_PWA_STATE
    return { ...DEFAULT_PWA_STATE, ...JSON.parse(raw) }
  } catch { return DEFAULT_PWA_STATE }
}

export function savePWAInstallState(state: Partial<PWAInstallState>): void {
  try {
    const current = getPWAInstallState()
    localStorage.setItem(KEY.PWA_INSTALL, JSON.stringify({ ...current, ...state }))
  } catch {}
}

export function shouldShowInstallPrompt(): boolean {
  try {
    const state = getPWAInstallState()
    if (state.installed) return false
    if (!state.dismissed) return true
    if (!state.dismissedAt) return false
    const dismissedMs = new Date(state.dismissedAt).getTime()
    const daysSince   = (Date.now() - dismissedMs) / (1000 * 60 * 60 * 24)
    return daysSince >= state.remindAfterDays
  } catch { return false }
}

// ── Location permission asked ─────────────────────────────────────────────────

export function hasLocationBeenAsked(): boolean {
  try { return localStorage.getItem(KEY.LOCATION_ASKED) === '1' } catch { return false }
}

export function markLocationAsked(): void {
  try { localStorage.setItem(KEY.LOCATION_ASKED, '1') } catch {}
}

// ── Last viewed Panchanga (quick-resume) ──────────────────────────────────────

export interface CachedPanchangaSummary {
  date:         string    // YYYY-MM-DD
  locationName: string
  tithi:        string
  nakshatra:    string
  yoga:         string
  vara:         string
  sunrise:      string
  sunset:       string
  cachedAt:     string
}

export function getLastPanchanga(): CachedPanchangaSummary | null {
  try {
    const raw = localStorage.getItem(KEY.LAST_PANCHANGA)
    if (!raw) return null
    const data = JSON.parse(raw)
    // Only return if it's today's cache
    const today = new Date().toISOString().slice(0, 10)
    return data.date === today ? data : null
  } catch { return null }
}

export function saveLastPanchanga(summary: Omit<CachedPanchangaSummary, 'cachedAt'>): void {
  try {
    localStorage.setItem(KEY.LAST_PANCHANGA, JSON.stringify({
      ...summary,
      cachedAt: new Date().toISOString(),
    }))
  } catch {}
}

// ── isomorphic safe wrapper ───────────────────────────────────────────────────

/** Returns true if we are in a browser context (not SSR) */
export const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

/** Safe localStorage.getItem that never throws */
export function safeGet(key: string): string | null {
  if (!isBrowser) return null
  try { return localStorage.getItem(key) } catch { return null }
}

// ── [V1.3] Favourite locations ────────────────────────────────────────────────

const KEY_FAVOURITES  = 'vr_fav_locations'
const MAX_FAVOURITES  = 5

export interface FavouriteLocation extends StoredLocation {
  label?: string   // Optional user-set label e.g. "Home", "Temple"
}

export function getFavouriteLocations(): FavouriteLocation[] {
  try {
    const raw = localStorage.getItem(KEY_FAVOURITES)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveFavouriteLocation(loc: FavouriteLocation): void {
  try {
    const existing = getFavouriteLocations()
    const withoutDup = existing.filter(
      l => !(Math.abs(l.lat - loc.lat) < 0.01 && Math.abs(l.lng - loc.lng) < 0.01)
    )
    const updated = [loc, ...withoutDup].slice(0, MAX_FAVOURITES)
    localStorage.setItem(KEY_FAVOURITES, JSON.stringify(updated))
  } catch {}
}

export function removeFavouriteLocation(lat: number, lng: number): void {
  try {
    const existing = getFavouriteLocations()
    const updated  = existing.filter(
      l => !(Math.abs(l.lat - lat) < 0.01 && Math.abs(l.lng - lng) < 0.01)
    )
    localStorage.setItem(KEY_FAVOURITES, JSON.stringify(updated))
  } catch {}
}

// ── [V1.3] Recent searches ────────────────────────────────────────────────────

const KEY_RECENT_SEARCHES = 'vr_recent_searches'
const MAX_RECENT_SEARCHES  = 10

export interface RecentSearch {
  query:      string
  type:       'panchanga' | 'kundali' | 'knowledge' | 'festival'
  searchedAt: string
}

export function getRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(KEY_RECENT_SEARCHES)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addRecentSearch(query: string, type: RecentSearch['type']): void {
  try {
    const existing = getRecentSearches()
    const withoutDup = existing.filter(s => s.query.toLowerCase() !== query.toLowerCase())
    const updated = [{ query, type, searchedAt: new Date().toISOString() }, ...withoutDup]
      .slice(0, MAX_RECENT_SEARCHES)
    localStorage.setItem(KEY_RECENT_SEARCHES, JSON.stringify(updated))
  } catch {}
}

export function clearRecentSearches(): void {
  try { localStorage.removeItem(KEY_RECENT_SEARCHES) } catch {}
}

// ── [V1.3] Panchanga history (recent computed Panchangas) ─────────────────────

const KEY_PANCHANGA_HISTORY = 'vr_panchanga_history'
const MAX_HISTORY           = 7

export interface PanchangaHistoryEntry {
  date:         string
  locationName: string
  tithi:        string
  nakshatra:    string
  vara:         string
  festival?:    string
  viewedAt:     string
}

export function getPanchangaHistory(): PanchangaHistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY_PANCHANGA_HISTORY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addPanchangaHistory(entry: Omit<PanchangaHistoryEntry, 'viewedAt'>): void {
  try {
    const existing  = getPanchangaHistory()
    const withoutDup = existing.filter(e => !(e.date === entry.date && e.locationName === entry.locationName))
    const updated   = [{ ...entry, viewedAt: new Date().toISOString() }, ...withoutDup]
      .slice(0, MAX_HISTORY)
    localStorage.setItem(KEY_PANCHANGA_HISTORY, JSON.stringify(updated))
  } catch {}
}

export function clearPanchangaHistory(): void {
  try { localStorage.removeItem(KEY_PANCHANGA_HISTORY) } catch {}
}

// ── [V1.3] Recent Kundalis ────────────────────────────────────────────────────

const KEY_RECENT_KUNDALIS = 'vr_recent_kundalis'
const MAX_RECENT_KUNDALIS  = 5

export interface RecentKundali {
  id:         string       // hash of name+dob+pob
  name:       string
  dob:        string       // YYYY-MM-DD
  tob:        string       // HH:MM
  pob:        string       // place of birth name
  lagna?:     string
  viewedAt:   string
}

export function getRecentKundalis(): RecentKundali[] {
  try {
    const raw = localStorage.getItem(KEY_RECENT_KUNDALIS)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addRecentKundali(entry: Omit<RecentKundali, 'viewedAt'>): void {
  try {
    const existing   = getRecentKundalis()
    const withoutDup = existing.filter(e => e.id !== entry.id)
    const updated    = [{ ...entry, viewedAt: new Date().toISOString() }, ...withoutDup]
      .slice(0, MAX_RECENT_KUNDALIS)
    localStorage.setItem(KEY_RECENT_KUNDALIS, JSON.stringify(updated))
  } catch {}
}

export function clearRecentKundalis(): void {
  try { localStorage.removeItem(KEY_RECENT_KUNDALIS) } catch {}
}
