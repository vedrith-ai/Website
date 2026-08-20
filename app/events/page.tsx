import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'events.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="events.page.title"
      description="Upcoming Vedic events and announcements"
      current="/events"
    />
  );
}
