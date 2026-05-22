'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { adminLogout, adminMe } from '../../lib/admin-api'

type AdminRole = 'superadmin' | 'admin' | 'editor' | 'finance'

const links: {
  href: string
  label: string
  exact?: boolean
  roles: AdminRole[]
}[] = [
  { href: '/admin', label: 'Dashboard', exact: true, roles: ['superadmin', 'admin', 'editor', 'finance'] },
  { href: '/admin/content', label: 'Site content', roles: ['superadmin', 'admin', 'editor'] },
  { href: '/admin/media', label: 'Media library', roles: ['superadmin', 'admin', 'editor'] },
  { href: '/admin/events', label: 'Events', roles: ['superadmin', 'admin', 'editor'] },
  { href: '/admin/programs', label: 'Programs', roles: ['superadmin', 'admin', 'editor'] },
  { href: '/admin/archives', label: 'Archives', roles: ['superadmin', 'admin', 'editor'] },
  { href: '/admin/inbox', label: 'Inbox', roles: ['superadmin', 'admin', 'editor'] },
  { href: '/admin/contact', label: 'Contact messages', roles: ['superadmin', 'admin', 'editor', 'finance'] },
  { href: '/admin/newsletter', label: 'Newsletter', roles: ['superadmin', 'admin', 'editor'] },
  { href: '/admin/donations', label: 'Donations', roles: ['superadmin', 'admin', 'finance'] },
  { href: '/admin/settings', label: 'Settings', roles: ['superadmin', 'admin'] },
  { href: '/admin/system', label: 'System', roles: ['superadmin', 'admin'] },
]

function normalizeRole(role: string): AdminRole {
  if (links.some((l) => l.roles.includes(role as AdminRole))) return role as AdminRole
  return 'admin'
}

export default function AdminShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<AdminRole>('admin')

  useEffect(() => {
    void adminMe()
      .then(({ user }) => setRole(normalizeRole(user.role)))
      .catch(() => setRole('admin'))
  }, [])

  const visibleLinks = links.filter((link) => link.roles.includes(role))

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
          {visibleLinks.map((link) => {
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
