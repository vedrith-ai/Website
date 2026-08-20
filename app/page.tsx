import type { Metadata } from 'next';
import { HomeContent } from '@/components/home/HomeContent';

export const metadata: Metadata = {
  title: 'VedRith — Vedic Astrology & Panchanga',
};

// Server component — keeps metadata export clean.
// HomeContent is a client component that reads lang and location from context.
export default function HomePage() {
  return <HomeContent />;
}
