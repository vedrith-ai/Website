import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'calendar.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="calendar.title"
      description="Vedic lunar calendar with festivals and muhurtas"
      current="/calendar"
    />
  );
}
