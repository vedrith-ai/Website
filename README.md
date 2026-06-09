# VedRith — The Rhythm of Vedic Wisdom

> **Powered by Sharva's IT**
> Architecture: v2.1.0 | Foundation: v1.0.0

A modern, full-stack Vedic astrology platform delivering precise Panchanga, Kundali, Muhurta, Temple Directory, and devotional wisdom across all regional traditions, in 9 Indian languages.

---

## What's in This Foundation

This is the **V1 Landing Page Foundation** — a production-ready Next.js 15 project covering:

| Section       | Component                                | Status |
|---------------|------------------------------------------|--------|
| Header / Nav  | `components/layout/Header.tsx`           | ✅ Complete |
| Hero          | `components/sections/HeroSection.tsx`    | ✅ Complete |
| Features      | `components/sections/FeaturesSection.tsx`| ✅ Complete |
| About         | `components/sections/AboutSection.tsx`   | ✅ Complete |
| Roadmap       | `components/sections/RoadmapSection.tsx` | ✅ Complete |
| FAQ           | `components/sections/FAQSection.tsx`     | ✅ Complete |
| Contact       | `components/sections/ContactSection.tsx` | ✅ Complete |
| Footer        | `components/layout/Footer.tsx`           | ✅ Complete |
| 404 Page      | `app/not-found.tsx`                      | ✅ Complete |
| Sitemap       | `app/sitemap.ts`                         | ✅ Complete |
| SEO Metadata  | `lib/seo/metadata.ts`                    | ✅ Complete |

---

## Tech Stack

| Layer       | Technology                         |
|-------------|------------------------------------|
| Framework   | Next.js 15.3.2 (App Router)        |
| Language    | TypeScript 5.x (strict mode)       |
| Styling     | Tailwind CSS 3.4                   |
| Fonts       | Cormorant Garamond + Lato (next/font) |
| Deployment  | Vercel (recommended)               |

---

## Logo Usage

Four logo variants are included in `public/images/`. Each is used in its
correct context:

| File                       | Used In                               | Format      |
|----------------------------|---------------------------------------|-------------|
| `logo-horizontal.png`      | Header (desktop)                      | Wide banner |
| `logo-circular.png`        | Header (mobile), favicon, 404 page    | Circular    |
| `logo-full.png`            | Hero section, About section           | Full square |
| `logo-icon.png`            | Footer, Mobile menu overlay           | Icon only   |

---

## Getting Started

### Prerequisites

- Node.js 18.18.0 or later
- npm 9+ or pnpm 8+

### Installation

```bash
# 1. Install dependencies
npm install
# or
pnpm install

# 2. Start the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
vedrith/
├── app/
│   ├── globals.css          # VedRith design tokens, animations, utility classes
│   ├── layout.tsx           # Root layout: fonts, metadata, viewport
│   ├── page.tsx             # Home page (assembles all sections)
│   ├── sitemap.ts           # Auto-generated sitemap.xml
│   └── not-found.tsx        # Custom 404 page
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Sticky nav with scroll glass effect + mobile menu
│   │   └── Footer.tsx       # Dark footer with links, languages, copyright
│   ├── sections/
│   │   ├── HeroSection.tsx       # Full-screen hero with sacred geometry
│   │   ├── FeaturesSection.tsx   # 9-feature dark card grid
│   │   ├── AboutSection.tsx      # Split layout: mission + logo + stats
│   │   ├── RoadmapSection.tsx    # V1–V4 milestone timeline
│   │   ├── FAQSection.tsx        # Accordion FAQ (client component)
│   │   └── ContactSection.tsx    # Waitlist form with validation (client)
│   └── ui/
│       ├── SectionHeader.tsx     # Reusable section title + ornament
│       └── OrnamentDivider.tsx   # Gold three-dot ornamental divider
│
├── lib/
│   ├── constants.ts         # All content: features, roadmap, FAQ, stats
│   └── seo/
│       └── metadata.ts      # generateMetadata() factory for future public routes
│
├── public/
│   └── images/
│       ├── logo-full.png        # Hero + About logo
│       ├── logo-horizontal.png  # Desktop header logo
│       ├── logo-circular.png    # Mobile header + favicon
│       └── logo-icon.png        # Footer + mobile menu logo
│
├── next.config.ts           # Security headers, image optimization
├── tailwind.config.ts       # VedRith brand: navy, gold, cream palette + animations
├── tsconfig.json            # TypeScript strict mode
└── postcss.config.js        # PostCSS / Autoprefixer
```

---

## Brand Design System

### Colour Palette

| Token         | Hex       | Usage                          |
|---------------|-----------|--------------------------------|
| `navy-900`    | `#1B2A4A` | Primary text, backgrounds      |
| `navy-950`    | `#0D1525` | Footer, dark sections          |
| `gold-500`    | `#C9A052` | Accent, CTA, ornaments         |
| `gold-400`    | `#D9AC3A` | Hover states, lighter accents  |
| `cream`       | `#F8F3EC` | Page background, light sections|

### Typography

| Role      | Font                 | Weights       |
|-----------|----------------------|---------------|
| Display   | Cormorant Garamond   | 300, 400, 500, 600, 700 (+ italic) |
| Body/UI   | Lato                 | 300, 400, 700 |

Both fonts are loaded via `next/font/google` — zero layout shift, self-hosted.

### Animations

| Class                 | Effect                              |
|-----------------------|-------------------------------------|
| `animate-float`       | Gentle vertical float (hero logo)   |
| `animate-spin-slow`   | Slow clockwise ring rotation        |
| `animate-spin-reverse`| Slow counter-clockwise ring rotation|
| `animate-fade-up`     | Fade + slide up entry               |
| `animate-shimmer`     | Gold shimmer text gradient          |
| `animate-pulse-soft`  | Soft opacity pulse                  |

### CSS Utility Classes (globals.css)

| Class           | Description                             |
|-----------------|-----------------------------------------|
| `.text-shimmer` | Animated gold gradient text             |
| `.hero-bg`      | Sacred geometry radial gradient bg      |
| `.mandala-ring` | Absolute-position concentric circle     |
| `.feature-card` | Dark card with gold hover effects       |
| `.btn-gold`     | Primary gold CTA button                 |
| `.btn-ghost`    | Outline button (cream on dark)          |
| `.vedrith-input`| Dark-bg form input with gold focus ring |

---

## Deploying to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Production deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic CI/CD deployment on every
push to `main`.

---

## Environment Variables

This foundation has no required environment variables. When integrating
Supabase and Razorpay (V1 / V1.5), add to `.env.local`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay (V1.5)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Resend Email
RESEND_API_KEY=

# Site
NEXT_PUBLIC_SITE_URL=https://vedrith.com
```

---

## Next Steps (V1 Development)

Following the VedRith Architecture v2.1.0:

1. **Authentication** — Integrate Supabase Auth with email/OTP and Google OAuth
2. **Dashboard shell** — Build the `(dashboard)/` route group with sidebar layout
3. **Panchanga engine** — Implement `lib/engines/panchanga/` (Swiss Ephemeris WASM)
4. **Kundali engine** — Implement `lib/engines/kundali/` with Vimshottari Dasha
5. **Muhurta engine** — Implement `lib/engines/muhurta/` with weighted scoring
6. **Database** — Apply Supabase migrations from `supabase/migrations/`
7. **Knowledge Base** — Seed `lib/knowledge/` with all 27 Nakshatra entries

---

## Architecture Reference

Full technical specification: **VedRith Architecture v2.1.0**

Covers: Folder structure, database schema (18 tables), authentication flow,
API design (REST v1), all 6 calculation engines, SEO architecture, payment
architecture (Razorpay), security, deployment, and multi-language strategy.

---

*VedRith — The Rhythm of Vedic Wisdom*
*Powered by Sharva's IT*
