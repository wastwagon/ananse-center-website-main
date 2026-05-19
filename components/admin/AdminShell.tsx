'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { adminLogout } from '../../lib/admin-api'

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/content', label: 'Site content' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/programs', label: 'Programs' },
  { href: '/admin/contact', label: 'Contact messages' },
  { href: '/admin/newsletter', label: 'Newsletter' },
  { href: '/admin/donations', label: 'Donations' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/system', label: 'System' },
]

export default function AdminShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          Ananse Admin
          <span>Content management</span>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          {links.map((link) => {
            const active = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-nav-link${active ? ' admin-nav-link--active' : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        <div className="admin-actions" style={{ marginTop: 'auto' }}>
          <Link href="/" className="admin-nav-link">
            View site
          </Link>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-title">{title}</h1>
        </header>
        {children}
      </div>
    </div>
  )
}
