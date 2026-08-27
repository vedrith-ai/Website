import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'contact.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="contact.title"
      description="Get in touch with Sharva's IT"
      current="/contact"
    />
  );
}
