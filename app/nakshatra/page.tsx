import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'nakshatra.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="nakshatra.page.title"
      description="Guide to all 27 lunar mansions"
      current="/nakshatra"
    />
  );
}
