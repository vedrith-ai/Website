import type { Metadata } from 'next';
import { PageTemplate } from '@/components/PageTemplate';

export const metadata: Metadata = { title: 'graha.page.title | VedRith' };

export default function Page() {
  return (
    <PageTemplate
      titleKey="graha.page.title"
      description="Nine planets of Vedic astrology"
      current="/graha"
    />
  );
}
