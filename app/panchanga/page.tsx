import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'panchanga.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="panchanga.title"
      description="Daily five-limb Vedic almanac for your location"
      current="/panchanga"
    />
  );
}
