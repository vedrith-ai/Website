import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'festival.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="festival.title"
      description="Vedic festival and observance calendar"
      current="/festivals"
    />
  );
}
