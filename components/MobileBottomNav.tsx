'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Heart, Home, Mail, Sparkles } from 'lucide-react'

const tabs = [
  { name: 'Home', href: '/', icon: Home, match: (path: string) => path === '/' },
  { name: 'Programs', href: '/programs', icon: Sparkles, match: (path: string) => path.startsWith('/programs') },
  { name: 'Events', href: '/events', icon: CalendarDays, match: (path: string) => path.startsWith('/events') },
  { name: 'Donate', href: '/support', icon: Heart, match: (path: string) => path.startsWith('/support') },
  {
    name: 'Contact',
    href: '/contact',
    icon: Mail,
    match: (path: string) => path.startsWith('/contact'),
  },
] as const

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile primary navigation">
      <div className="mobile-bottom-nav-inner">
        {tabs.map((tab) => {
          const active = tab.match(pathname)
          const Icon = tab.icon
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`mobile-bottom-nav-item${active ? ' mobile-bottom-nav-item--active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="mobile-bottom-nav-icon" aria-hidden>
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
              </span>
              <span className="mobile-bottom-nav-label">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
