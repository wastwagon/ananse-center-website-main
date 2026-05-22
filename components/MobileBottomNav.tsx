'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Heart, Home, Mail, Sparkles } from 'lucide-react'
import { useI18n } from './I18nProvider'
import { localizedPath, stripLocalePrefix } from '../lib/locale-path'

const tabs = [
  { key: 'nav.home', href: '/', icon: Home, match: (path: string) => path === '/' },
  {
    key: 'nav.programs',
    href: '/programs',
    icon: Sparkles,
    match: (path: string) => path.startsWith('/programs'),
  },
  {
    key: 'nav.events',
    href: '/events',
    icon: CalendarDays,
    match: (path: string) => path.startsWith('/events'),
  },
  {
    key: 'nav.donate',
    href: '/support',
    icon: Heart,
    match: (path: string) => path.startsWith('/support'),
  },
  {
    key: 'nav.contact',
    href: '/contact',
    icon: Mail,
    match: (path: string) => path.startsWith('/contact'),
  },
] as const

export default function MobileBottomNav() {
  const pathname = usePathname()
  const logicalPath = stripLocalePrefix(pathname)
  const { locale, translate } = useI18n()

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile primary navigation">
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => {
          const active = tab.match(logicalPath)
          const Icon = tab.icon
          return (
            <Link
              key={tab.key}
              href={localizedPath(tab.href, locale)}
              className={`mobile-bottom-nav-item${active ? ' mobile-bottom-nav-item--active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="mobile-bottom-nav-icon" aria-hidden>
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
              </span>
              <span className="mobile-bottom-nav-label">{translate(tab.key)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
