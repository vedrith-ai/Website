import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'vara.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="vara.page.title"
      description="Vedic weekday guide and planetary rulerships"
      current="/vara"
    />
  );
}
