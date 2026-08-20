// ─── Language & Region ────────────────────────────────────────────────────────

export type Lang   = 'en' | 'kn';
export type Region = 'KARNATAKA' | 'ANDHRA' | 'TAMIL_NADU' | 'KERALA' | 'MAHARASHTRA' | 'NATIONAL';

// ─── Panchanga ─────────────────────────────────────────────────────────────────

export interface PanchangaRequest {
  date:      string;   // YYYY-MM-DD (timezone-aware)
  latitude:  number;
  longitude: number;
  timezone:  string;   // IANA e.g. "Asia/Kolkata"
  region:    Region;
}

export interface Muhurta {
  name:  string;
  start: string;  // HH:MM
  end:   string;  // HH:MM
  quality: 'auspicious' | 'inauspicious' | 'neutral';
}

export interface PanchangaResponse {
  date:           string;
  vara:           string;       // weekday
  varaIndex:      number;       // 0=Sunday
  tithi:          string;
  tithiIndex:     number;       // 1-30
  tithiPaksha:    'shukla' | 'krishna';
  tithiEndTime:   string;
  nakshatra:      string;
  nakshatraIndex: number;       // 0-26
  nakshatraPada:  number;       // 1-4
  nakshatraEndTime: string;
  yoga:           string;
  yogaIndex:      number;       // 0-26
  yogaEndTime:    string;
  karana:         string;
  karanaIndex:    number;
  sunrise:        string;
  sunset:         string;
  moonrise:       string;
  moonset:        string;
  abhijitMuhurta: { start: string; end: string; durationMinutes: number };
  rahukalam:      { start: string; end: string };
  yamagandam:     { start: string; end: string };
  gulikakalam:    { start: string; end: string };
  durmuhurtam:    Array<{ start: string; end: string }>;
  auspiciousYoga: boolean;
  festivals:      string[];
  deityOfDay:     string;
  spiritualMessage: string;
  region:         Region;
}

// ─── Kundali ───────────────────────────────────────────────────────────────────

export interface KundaliRequest {
  name:      string;
  dob:       string;   // YYYY-MM-DD
  tob:       string;   // HH:MM (24h)
  pob:       string;   // place of birth (display)
  latitude:  number;
  longitude: number;
  timezone:  string;
}

export interface PlanetPosition {
  planet:     string;
  longitude:  number;
  rashi:      string;
  rashiIndex: number;
  nakshatra:  string;
  pada:       number;
  degree:     number;
  isRetrograde: boolean;
  house:      number;
  dignity:    'exalted' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated';
}

export interface HouseData {
  house:    number;
  rashi:    string;
  rashiIndex: number;
  degree:   number;
  planets:  string[];
}

export interface KundaliResponse {
  name:         string;
  dob:          string;
  tob:          string;
  pob:          string;
  lagna:        string;
  lagnaIndex:   number;
  lagnaRashi:   string;
  nakshatraLagna: string;
  planets:      PlanetPosition[];
  houses:       HouseData[];
  dashaBalance: { planet: string; yearsRemaining: number };
  yogas:        string[];
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminSession {
  token:     string;
  expiresAt: number;
  scope:     'admin';
}

export interface EventPayload {
  title:       string;
  description: string;
  date:        string;
  category:    'festival' | 'muhurta' | 'alert' | 'general';
  region?:     Region;
  lang?:       Lang;
}

// ─── Contact ───────────────────────────────────────────────────────────────────

export interface ContactPayload {
  name:    string;
  email:   string;
  subject: string;
  message: string;
}

// ─── Location ──────────────────────────────────────────────────────────────────

export interface LocationData {
  city:      string;
  state:     string;
  country:   string;
  latitude:  number;
  longitude: number;
  timezone:  string;
}

// ─── Search ────────────────────────────────────────────────────────────────────

export interface SearchResult {
  id:       string;
  type:     'nakshatra' | 'rashi' | 'graha' | 'yoga' | 'tithi' | 'karana' | 'vara' | 'festival' | 'knowledge';
  title:    string;
  titleKn?: string;
  excerpt:  string;
  href:     string;
  score:    number;
}

// ─── API Responses ─────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data:    T;
}

export interface ApiError {
  success: false;
  error:   string;
  code?:   string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Share Card ────────────────────────────────────────────────────────────────

export type ShareTheme  = 'saffron' | 'midnight' | 'lotus' | 'forest';
export type ShareAspect = '1:1' | '4:5' | '9:16' | '16:9';

export interface ShareCardOptions {
  theme:   ShareTheme;
  aspect:  ShareAspect;
  lang:    Lang;
  include: ('tithi' | 'nakshatra' | 'yoga' | 'vara' | 'muhurta')[];
}
