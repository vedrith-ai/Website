import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'tithi.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="tithi.page.title"
      description="The 30 lunar days of the Vedic calendar"
      current="/tithi"
    />
  );
}
