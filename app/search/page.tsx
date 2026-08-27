import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'search.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="search.title"
      description="Search across Nakshatras, Rashis, Yogas and more"
      current="/search"
    />
  );
}
