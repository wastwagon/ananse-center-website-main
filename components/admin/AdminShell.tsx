'use client'

import Link from 'next/link'
import { useEffect, useState, type ComponentType } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  Archive,
  BarChart3,
  BookMarked,
  BookOpen,
  CalendarDays,
  Camera,
  Contact,
  ExternalLink,
  FileText,
  FolderOpen,
  HeartHandshake,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Server,
  UserCircle2,
  Users,
  X,
} from 'lucide-react'
import { adminLogout, adminMe } from '../../lib/admin-api'

type AdminRole = 'superadmin' | 'admin' | 'editor' | 'finance'

type NavIcon = ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>

type NavLink = {
  href: string
  label: string
  exact?: boolean
  roles: AdminRole[]
  icon: NavIcon
  /** Public URL pattern for “View on site” in the header. */
  previewHref?: string
}

type NavGroup = {
  id: string
  label: string
  links: NavLink[]
}

const navGroups: NavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    links: [
      {
        href: '/admin',
        label: 'Dashboard',
        exact: true,
        roles: ['superadmin', 'admin', 'editor', 'finance'],
        icon: LayoutDashboard,
        previewHref: '/',
      },
      {
        href: '/admin/analytics',
        label: 'Analytics',
        roles: ['superadmin', 'admin', 'editor', 'finance'],
        icon: BarChart3,
      },
    ],
  },
  {
    id: 'publish',
    label: 'Publish',
    links: [
      {
        href: '/admin/content',
        label: 'Site content',
        roles: ['superadmin', 'admin', 'editor'],
        icon: FileText,
        previewHref: '/',
      },
      {
        href: '/admin/media',
        label: 'Media library',
        roles: ['superadmin', 'admin', 'editor'],
        icon: ImageIcon,
      },
      {
        href: '/admin/programs',
        label: 'Programs',
        roles: ['superadmin', 'admin', 'editor'],
        icon: FolderOpen,
        previewHref: '/programs',
      },
      {
        href: '/admin/events',
        label: 'Events',
        roles: ['superadmin', 'admin', 'editor'],
        icon: CalendarDays,
        previewHref: '/events',
      },
      {
        href: '/admin/insights',
        label: 'Insights',
        roles: ['superadmin', 'admin', 'editor'],
        icon: BookOpen,
        previewHref: '/insights',
      },
      {
        href: '/admin/library',
        label: 'Library',
        roles: ['superadmin', 'admin', 'editor'],
        icon: BookMarked,
        previewHref: '/library',
      },
      {
        href: '/admin/photo-albums',
        label: 'Photo albums',
        roles: ['superadmin', 'admin', 'editor'],
        icon: Camera,
        previewHref: '/library/photos',
      },
      {
        href: '/admin/people',
        label: 'People',
        roles: ['superadmin', 'admin', 'editor'],
        icon: UserCircle2,
        previewHref: '/people',
      },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    links: [
      {
        href: '/admin/inbox',
        label: 'Inbox',
        roles: ['superadmin', 'admin', 'editor'],
        icon: Inbox,
      },
      {
        href: '/admin/contact',
        label: 'Contact messages',
        roles: ['superadmin', 'admin', 'editor', 'finance'],
        icon: Contact,
      },
      {
        href: '/admin/newsletter',
        label: 'Newsletter list',
        roles: ['superadmin', 'admin', 'editor'],
        icon: Mail,
      },
      {
        href: '/admin/donations',
        label: 'Donations',
        roles: ['superadmin', 'admin', 'finance'],
        icon: HeartHandshake,
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    links: [
      {
        href: '/admin/users',
        label: 'Admin users',
        roles: ['superadmin', 'admin'],
        icon: Users,
      },
      {
        href: '/admin/settings',
        label: 'Settings',
        roles: ['superadmin', 'admin'],
        icon: Settings,
      },
      {
        href: '/admin/system',
        label: 'System',
        roles: ['superadmin', 'admin'],
        icon: Server,
      },
      {
        href: '/admin/archives',
        label: 'Archives (legacy)',
        roles: ['superadmin', 'admin'],
        icon: Archive,
      },
    ],
  },
]

function normalizeRole(role: string): AdminRole {
  const known: AdminRole[] = ['superadmin', 'admin', 'editor', 'finance']
  return known.includes(role as AdminRole) ? (role as AdminRole) : 'admin'
}

function isActive(pathname: string, link: NavLink) {
  return link.exact ? pathname === link.href : pathname.startsWith(link.href)
}

export default function AdminShell({
  title,
  children,
  previewHref,
}: {
  title: string
  children: React.ReactNode
  /** Override the header “View on site” link for this page. */
  previewHref?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<AdminRole>('admin')
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    void adminMe()
      .then(({ user }) => setRole(normalizeRole(user.role)))
      .catch(() => setRole('admin'))
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => link.roles.includes(role)),
    }))
    .filter((group) => group.links.length > 0)

  const activeLink = visibleGroups.flatMap((group) => group.links).find((link) => isActive(pathname, link))
  const headerPreview = previewHref ?? activeLink?.previewHref ?? '/'

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className={`admin-root${navOpen ? ' admin-root--nav-open' : ''}`}>
      <button
        type="button"
        className="admin-nav-toggle"
        aria-expanded={navOpen}
        aria-controls="admin-sidebar"
        onClick={() => setNavOpen((open) => !open)}
      >
        {navOpen ? <X size={18} strokeWidth={2} aria-hidden /> : <Menu size={18} strokeWidth={2} aria-hidden />}
        <span>{navOpen ? 'Close menu' : 'Menu'}</span>
      </button>

      {navOpen ? (
        <button
          type="button"
          className="admin-nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <aside id="admin-sidebar" className="admin-sidebar">
        <div className="admin-brand">
          <img
            src="/ananse-logo.png"
            alt="ANANSE"
            className="admin-brand-logo"
            width={168}
            height={50}
          />
          <span>Leadership CMS</span>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          {visibleGroups.map((group) => (
            <div key={group.id} className="admin-nav-group">
              <p className="admin-nav-group-label">{group.label}</p>
              {group.links.map((link) => {
                const active = isActive(pathname, link)
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
            </div>
          ))}
        </nav>
        <div className="admin-actions admin-sidebar-footer">
          <Link href="/" className="admin-nav-link" target="_blank" rel="noopener noreferrer">
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
          <div className="admin-header-actions">
            <a
              href={headerPreview}
              className="admin-btn admin-btn--ghost admin-btn--sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} strokeWidth={2} aria-hidden />
              View on site
            </a>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
