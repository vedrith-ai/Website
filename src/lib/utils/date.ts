/**
 * Returns today's date as YYYY-MM-DD in the given IANA timezone.
 * Uses the sv-SE locale which produces ISO 8601 date format natively.
 * This avoids the UTC rollover problem when users are east of UTC.
 */
export function todayInTimezone(timezone: string): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: timezone });
}

/** Format a Date to HH:MM in the given timezone */
export function formatTime(date: Date, timezone: string): string {
  return date.toLocaleTimeString('en-IN', {
    timeZone:     timezone,
    hour:         '2-digit',
    minute:       '2-digit',
    hour12:       false,
  });
}

/** Parse YYYY-MM-DD into a UTC midnight Date */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** Add minutes to a Date */
export function addMinutes(date: Date, mins: number): Date {
  return new Date(date.getTime() + mins * 60_000);
}

/** Julian Day Number from a UTC date */
export function toJulianDay(date: Date): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + date.getUTCHours() / 24;
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045
  );
}

/** Day of week (0=Sun) from a Date in a given timezone */
export function weekdayInTimezone(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
  }).formatToParts(date);
  const day = parts.find(p => p.type === 'weekday')?.value ?? 'Sun';
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(day);
}

/** Human-readable format: "Monday, 14 July 2025" */
export function formatLongDate(dateStr: string, timezone: string, lang: string = 'en-IN'): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-IN', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
