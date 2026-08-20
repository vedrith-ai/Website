import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'dashboard.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="dashboard.title"
      description="Your personal Vedic astrology dashboard"
      current="/dashboard"
    />
  );
}
