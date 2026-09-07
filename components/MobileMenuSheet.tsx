'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from './I18nProvider'
import { localizedPath, stripLocalePrefix } from '../lib/locale-path'
import { X } from 'lucide-react'

export type MobileMenuLink = {
  name: string
  href: string
}

type MobileMenuSheetProps = {
  isOpen: boolean
  onClose: () => void
  links: readonly MobileMenuLink[]
  title?: string
  donateLabel?: string
}

export default function MobileMenuSheet({
  isOpen,
  onClose,
  links,
  title = 'More',
  donateLabel = 'Donate Now',
}: MobileMenuSheetProps) {
  const pathname = usePathname()
  const { locale } = useI18n()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) onClose()
    // Close when route changes only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="mobile-menu-sheet-root" role="presentation">
      <button type="button" className="mobile-menu-sheet-backdrop" aria-label="Close menu" onClick={onClose} />
      <div
        ref={panelRef}
        className="mobile-menu-sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-sheet-title"
      >
        <div className="mobile-menu-sheet-handle" aria-hidden />
        <div className="mobile-menu-sheet-header">
          <p id="mobile-menu-sheet-title" className="mobile-menu-sheet-title">
            {title}
          </p>
          <button type="button" className="mobile-menu-sheet-close tap-target" aria-label="Close menu" onClick={onClose}>
            <X size={22} strokeWidth={2} aria-hidden />
          </button>
        </div>
        <nav className="mobile-menu-sheet-nav" aria-label="Additional pages">
          {links.map((link) => {
            const logical = stripLocalePrefix(pathname)
            const linkLogical = stripLocalePrefix(link.href.split('#')[0])
            const active =
              logical === linkLogical ||
              (link.href.includes('#') && logical.startsWith('/contact'))
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`mobile-menu-sheet-link${active ? ' mobile-menu-sheet-link--active' : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={onClose}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
        <div className="mobile-menu-sheet-footer">
          <Link
            href={localizedPath('/support', locale)}
            className="btn-primary mobile-menu-sheet-donate"
            onClick={onClose}
          >
            {donateLabel}
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  )
}
