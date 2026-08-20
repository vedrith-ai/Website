import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'kundali.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="kundali.title"
      description="Generate your Vedic birth chart"
      current="/kundali"
    />
  );
}
