'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Programs', href: '/programs' },
  { name: 'Events', href: '/events' },
  { name: 'Videos', href: '/videos' },
  { name: 'Support', href: '/support' },
  { name: 'Contact', href: '/contact#form' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handle = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <nav
      className={`navbar-main ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}
    >
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <img src="/ananse-logo.png" alt="Ananse Center Logo" className="navbar-logo-img" />
        </Link>

        <div className="nav-desktop">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href === '/contact#form' && pathname.startsWith('/contact'))
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`navbar-link${active ? ' navbar-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.name}
              </Link>
            )
          })}
          <Link href="/support" className="btn-primary navbar-cta">
            Donate
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="nav-mobile-btn navbar-hamburger"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`nav-mobile-drawer navbar-mobile-drawer-wrapper ${isOpen ? 'navbar-mobile-drawer-open' : 'navbar-mobile-drawer-closed'}`}
      >
        <div className="navbar-mobile-inner">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href === '/contact#form' && pathname.startsWith('/contact'))
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`navbar-mobile-link${active ? ' navbar-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.name}
              </Link>
            )
          })}
          <div className="navbar-mobile-cta-box">
            <Link
              href="/support"
              onClick={() => setIsOpen(false)}
              className="btn-primary navbar-mobile-cta"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
