'use client'

import Link from 'next/link'

interface PanchangaCardData {
  id:      string
  icon:    string
  titleKn: string
  titleEn: string
  value:   string
  sub?:    string
  href:    string
  accent?: boolean
}

interface PanchangaCardsProps {
  cards: PanchangaCardData[]
}

// ── Individual card ───────────────────────────────────────────────────────────

function PanchangaCard({ card }: { card: PanchangaCardData }) {
  return (
    <Link
      href={card.href}
      className={`group flex flex-col gap-2 rounded-2xl border p-4 transition-all min-w-[160px] sm:min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
        card.accent
          ? 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-400/50'
          : 'border-border bg-muted/20 hover:bg-muted/40 hover:border-border/80'
      }`}
      aria-label={`${card.titleEn}: ${card.value}${card.sub ? `, ${card.sub}` : ''} — Open Panchanga`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{card.titleKn}</span>
        <span className="text-lg leading-none" aria-hidden>{card.icon}</span>
      </div>
      <div>
        <p className={`font-semibold text-base leading-tight ${card.accent ? 'text-amber-300' : 'text-foreground'}`}>
          {card.value}
        </p>
        {card.sub && (
          <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
        )}
      </div>
      <span className="text-xs text-amber-400/60 group-hover:text-amber-400 transition-colors mt-auto">
        ವಿವರ ನೋಡಿ →
      </span>
    </Link>
  )
}

// ── Cards grid/scroll container ───────────────────────────────────────────────

export function PanchangaCards({ cards }: PanchangaCardsProps) {
  if (!cards.length) return null

  return (
    <div className="relative">
      {/* Mobile: horizontal scroll */}
      <div
        className="flex gap-3 overflow-x-auto pb-2 sm:hidden snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Today's Panchanga highlights"
      >
        {cards.map(card => (
          <div key={card.id} className="snap-start shrink-0 w-44" role="listitem">
            <PanchangaCard card={card} />
          </div>
        ))}
      </div>

      {/* Desktop: 2-column grid */}
      <div
        className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3"
        role="list"
        aria-label="Today's Panchanga highlights"
      >
        {cards.map(card => (
          <div key={card.id} role="listitem">
            <PanchangaCard card={card} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Build cards from panchanga data ──────────────────────────────────────────

interface PanchangaData {
  tithi?:          { name: string; nameLocal?: string; paksha?: string }
  nakshatra?:      { name: string; nameLocal?: string }
  yoga?:           { name: string }
  vara?:           { name: string; nameLocal?: string }
  sunriseLocal?:   string
  sunsetLocal?:    string
  rahuKalam?:      { startLocal: string; endLocal: string }
  abhijitMuhurta?: { startLocal: string; endLocal: string }
}

export function buildPanchangaCards(data: PanchangaData): PanchangaCardData[] {
  const cards: PanchangaCardData[] = []

  if (data.tithi) cards.push({
    id: 'tithi', icon: '🌙', titleKn: 'ತಿಥಿ', titleEn: 'Tithi',
    value:  data.tithi.nameLocal ?? data.tithi.name,
    sub:    data.tithi.paksha ? `${data.tithi.paksha} ಪಕ್ಷ` : undefined,
    href:   '/panchanga', accent: true,
  })

  if (data.nakshatra) cards.push({
    id: 'nakshatra', icon: '⭐', titleKn: 'ನಕ್ಷತ್ರ', titleEn: 'Nakshatra',
    value: data.nakshatra.nameLocal ?? data.nakshatra.name,
    href:  '/panchanga',
  })

  if (data.yoga) cards.push({
    id: 'yoga', icon: '🔆', titleKn: 'ಯೋಗ', titleEn: 'Yoga',
    value: data.yoga.name,
    href:  '/panchanga',
  })

  if (data.vara) cards.push({
    id: 'vara', icon: '📅', titleKn: 'ವಾರ', titleEn: 'Vara',
    value: data.vara.nameLocal ?? data.vara.name,
    href:  '/panchanga',
  })

  if (data.sunriseLocal) cards.push({
    id: 'sunrise', icon: '🌅', titleKn: 'ಸೂರ್ಯೋದಯ', titleEn: 'Sunrise',
    value: data.sunriseLocal,
    sub:   data.sunsetLocal ? `ಸೂರ್ಯಾಸ್ತ: ${data.sunsetLocal}` : undefined,
    href:  '/panchanga',
  })

  if (data.rahuKalam) cards.push({
    id: 'rahu', icon: '⚠️', titleKn: 'ರಾಹು ಕಾಲ', titleEn: 'Rahu Kalam',
    value: `${data.rahuKalam.startLocal}`,
    sub:   `ಅಂತ್ಯ: ${data.rahuKalam.endLocal}`,
    href:  '/panchanga',
  })

  if (data.abhijitMuhurta) cards.push({
    id: 'abhijit', icon: '✨', titleKn: 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ', titleEn: 'Abhijit Muhurta',
    value: data.abhijitMuhurta.startLocal,
    sub:   `ಅಂತ್ಯ: ${data.abhijitMuhurta.endLocal}`,
    href:  '/panchanga', accent: true,
  })

  return cards
}
