'use client'

import Link from 'next/link'
import { useEffect, useState, type ComponentType } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Archive,
  BarChart3,
  CalendarDays,
  Contact,
  FileText,
  FolderOpen,
  HeartHandshake,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Newspaper,
  Settings,
  Server,
  Users,
  ExternalLink,
} from 'lucide-react'
import { adminLogout, adminMe } from '../../lib/admin-api'

type AdminRole = 'superadmin' | 'admin' | 'editor' | 'finance'

type NavIcon = ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>

const links: {
  href: string
  label: string
  exact?: boolean
  roles: AdminRole[]
  icon: NavIcon
}[] = [
  {
    href: '/admin',
    label: 'Dashboard',
    exact: true,
    roles: ['superadmin', 'admin', 'editor', 'finance'],
    icon: LayoutDashboard,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    roles: ['superadmin', 'admin', 'editor', 'finance'],
    icon: BarChart3,
  },
  { href: '/admin/content', label: 'Site content', roles: ['superadmin', 'admin', 'editor'], icon: FileText },
  { href: '/admin/media', label: 'Media library', roles: ['superadmin', 'admin', 'editor'], icon: ImageIcon },
  { href: '/admin/events', label: 'Events', roles: ['superadmin', 'admin', 'editor'], icon: CalendarDays },
  { href: '/admin/programs', label: 'Programs', roles: ['superadmin', 'admin', 'editor'], icon: FolderOpen },
  { href: '/admin/archives', label: 'Archives', roles: ['superadmin', 'admin', 'editor'], icon: Archive },
  { href: '/admin/news', label: 'News', roles: ['superadmin', 'admin', 'editor'], icon: Newspaper },
  { href: '/admin/inbox', label: 'Inbox', roles: ['superadmin', 'admin', 'editor'], icon: Inbox },
  {
    href: '/admin/contact',
    label: 'Contact messages',
    roles: ['superadmin', 'admin', 'editor', 'finance'],
    icon: Contact,
  },
  { href: '/admin/newsletter', label: 'Newsletter', roles: ['superadmin', 'admin', 'editor'], icon: Mail },
  { href: '/admin/donations', label: 'Donations', roles: ['superadmin', 'admin', 'finance'], icon: HeartHandshake },
  { href: '/admin/users', label: 'Admin users', roles: ['superadmin', 'admin'], icon: Users },
  { href: '/admin/settings', label: 'Settings', roles: ['superadmin', 'admin'], icon: Settings },
  { href: '/admin/system', label: 'System', roles: ['superadmin', 'admin'], icon: Server },
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
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-nav-link${active ? ' admin-nav-link--active' : ''}`}
              >
                <span className="admin-nav-icon" aria-hidden>
                  <Icon strokeWidth={1.75} />
                </span>
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="admin-actions admin-sidebar-footer">
          <Link href="/" className="admin-nav-link">
            <span className="admin-nav-icon" aria-hidden>
              <ExternalLink strokeWidth={1.75} />
            </span>
            <span>View site</span>
          </Link>
          <button type="button" className="admin-btn admin-btn--ghost admin-btn--sidebar" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={1.75} aria-hidden />
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
