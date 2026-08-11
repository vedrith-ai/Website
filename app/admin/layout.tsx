import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin — VedRith',
  robots: { index: false, follow: false },
}

const adminNav = [
  { label: 'Notifications', href: '/admin/notifications' },
  { label: 'Templates',     href: '/admin/notifications/templates' },
  { label: 'Queue',         href: '/admin/notifications/queue' },
  { label: 'Channels',      href: '/admin/notifications/channels' },
  { label: 'Analytics',     href: '/admin/notifications/analytics' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin nav bar */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-stone-800 text-sm mr-4">VedRith Admin</span>
              <nav className="flex items-center gap-1" aria-label="Admin navigation">
                {adminNav.map(link => (
                  <Link key={link.href} href={link.href}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <Link href="/" className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
              ← Back to site
            </Link>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
