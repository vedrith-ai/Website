import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'rashi.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="rashi.page.title"
      description="12 zodiac signs in Vedic astrology"
      current="/rashi"
    />
  );
}
