import type { Metadata } from 'next';
import { NotFoundContent } from '@/components/NotFoundContent';

export const metadata: Metadata = { title: 'Page Not Found | VedRith' };

// Server component keeps metadata clean.
// NotFoundContent is a client component that reads lang from LangProvider
// (which wraps the entire app in layout.tsx — not-found is inside that tree).
export default function NotFound() {
  return <NotFoundContent />;
}
