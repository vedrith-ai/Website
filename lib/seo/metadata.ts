import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────────────────────
// Base metadata shared across all pages
// ─────────────────────────────────────────────────────────────────────────────
const BASE_OG = {
  siteName:  SITE.name,
  locale:    'en_IN',
  type:      'website' as const,
  images: [
    {
      url:    '/images/logo-full.png',
      width:  1080,
      height: 1080,
      alt:    `${SITE.name} — ${SITE.tagline}`,
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Home / Landing page metadata
// ─────────────────────────────────────────────────────────────────────────────
export function generateHomeMetadata(): Metadata {
  return {
    title:       `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    openGraph:   { ...BASE_OG, title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description, url: SITE.url },
    alternates:  { canonical: SITE.url },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Nakshatra page metadata (public SEO route — §3 (public)/nakshatra/[slug])
// ─────────────────────────────────────────────────────────────────────────────
export function generateNakshatraMetadata(nakshatra: string, meaning: string): Metadata {
  const title = `${nakshatra} Nakshatra — Meaning, Deity, Characteristics | ${SITE.name}`
  const desc  = `Complete guide to ${nakshatra} Nakshatra: ruling planet, deity, characteristics, suitable activities, mantra, and remedies. ${meaning.slice(0, 100)}…`
  const url   = `${SITE.url}/nakshatra/${nakshatra.toLowerCase()}`
  return {
    title,
    description:  desc,
    openGraph:    { ...BASE_OG, title, description: desc, url },
    alternates:   { canonical: url },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tithi page metadata (public SEO route — §3 (public)/tithi/[slug])
// ─────────────────────────────────────────────────────────────────────────────
export function generateTithiMetadata(tithi: string, meaning: string): Metadata {
  const title = `${tithi} Tithi — Meaning, Ruling Deity, Suitable Activities | ${SITE.name}`
  const desc  = `What is ${tithi} Tithi? Learn its significance, ruling deity, auspicious and inauspicious activities, and how it affects your day. ${meaning.slice(0, 80)}…`
  const url   = `${SITE.url}/tithi/${tithi.toLowerCase().replace(/\s+/g, '-')}`
  return {
    title,
    description:  desc,
    openGraph:    { ...BASE_OG, title, description: desc, url },
    alternates:   { canonical: url },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Temple page metadata (public SEO route — §3 (public)/temples/[slug])
// ─────────────────────────────────────────────────────────────────────────────
export function generateTempleMetadata(params: {
  name:     string
  deity:    string
  city:     string
  state:    string
  slug:     string
}): Metadata {
  const { name, deity, city, state, slug } = params
  const title = `${name} — Timings, Festivals & Location | ${SITE.name}`
  const desc  = `Visit ${name} in ${city}, ${state}. Dedicated to ${deity}. Get daily pooja timings, annual festival calendar, and temple information on VedRith.`
  const url   = `${SITE.url}/temples/${slug}`
  return {
    title,
    description:  desc,
    openGraph:    { ...BASE_OG, title, description: desc, url },
    alternates:   { canonical: url },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Panchanga city + date page metadata (public SEO — (public)/panchanga/[city]/[date])
// ─────────────────────────────────────────────────────────────────────────────
export function generatePanchangaMetadata(params: {
  city:      string
  date:      string   // e.g. "2027-03-14"
  tithi?:    string
  nakshatra?: string
}): Metadata {
  const { city, date, tithi, nakshatra } = params
  const displayDate = new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const title = `Panchanga for ${city} on ${displayDate} | ${SITE.name}`
  const desc  = tithi && nakshatra
    ? `Today's Panchanga for ${city}: Tithi ${tithi}, Nakshatra ${nakshatra}. Get Rahu Kalam, Choghadiya, Sunrise and all five limbs of the Panchanga.`
    : `Daily Panchanga for ${city} on ${displayDate}. Tithi, Nakshatra, Yoga, Karana, Vara, Rahu Kalam and Choghadiya.`
  const url   = `${SITE.url}/panchanga/${city.toLowerCase()}/${date}`
  return {
    title,
    description:  desc,
    openGraph:    { ...BASE_OG, title, description: desc, url },
    alternates:   { canonical: url },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Festival page metadata (public SEO — (public)/festivals/[slug])
// ─────────────────────────────────────────────────────────────────────────────
export function generateFestivalMetadata(params: {
  name:        string
  description: string
  slug:        string
}): Metadata {
  const { name, description, slug } = params
  const title = `${name} — Date, Significance & Rituals | ${SITE.name}`
  const desc  = description.slice(0, 160)
  const url   = `${SITE.url}/festivals/${slug}`
  return {
    title,
    description:  desc,
    openGraph:    { ...BASE_OG, title, description: desc, url },
    alternates:   { canonical: url },
  }
}
