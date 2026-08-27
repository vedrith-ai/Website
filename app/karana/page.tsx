import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'karana.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="karana.page.title"
      description="The 11 half-day Karanas explained"
      current="/karana"
    />
  );
}
