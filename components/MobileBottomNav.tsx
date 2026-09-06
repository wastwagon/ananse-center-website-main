'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from './I18nProvider'
import { localizedPath, stripLocalePrefix } from '../lib/locale-path'
import { cmsIconForKey } from '../lib/cms-icons'
import { DEFAULT_MOBILE_NAV, splitHref, type CmsMobileNavLink } from '../lib/cms/nav'

type MobileBottomNavProps = {
  links?: CmsMobileNavLink[]
}

function matchPath(linkPath: string, currentPath: string): boolean {
  if (linkPath === '/') return currentPath === '/'
  return currentPath.startsWith(linkPath)
}

export default function MobileBottomNav({ links = DEFAULT_MOBILE_NAV }: MobileBottomNavProps) {
  const pathname = usePathname()
  const logicalPath = stripLocalePrefix(pathname)
  const { locale } = useI18n()

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile primary navigation">
      <div className="mobile-bottom-nav-inner">
        {links.map((link) => {
          const { path, hash } = splitHref(link.href)
          const active = matchPath(path, logicalPath)
          const Icon = cmsIconForKey(link.iconKey)
          return (
            <Link
              key={`${link.label}-${link.href}`}
              href={localizedPath(path, locale) + hash}
              className={`mobile-bottom-nav-item${active ? ' mobile-bottom-nav-item--active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <span className="mobile-bottom-nav-icon" aria-hidden>
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
              </span>
              <span className="mobile-bottom-nav-label">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
