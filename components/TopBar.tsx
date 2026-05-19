'use client'

import { Phone, Mail } from 'lucide-react'
import { contact, social } from '../lib/site'

function FacebookIcon() {
  return (
    <svg
      className="topbar-social-icon"
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="currentColor"
      aria-hidden
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      className="topbar-social-icon"
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.427.403a4.92 4.92 0 0 1 1.77 1.153 4.92 4.92 0 0 1 1.153 1.77c.163.457.349 1.257.403 2.427.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.427a4.92 4.92 0 0 1-1.153 1.77 4.92 4.92 0 0 1-1.77 1.153c-.457.163-1.257.349-2.427.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.427-.403a4.92 4.92 0 0 1-1.77-1.153 4.92 4.92 0 0 1-1.153-1.77c-.163-.457-.349-1.257-.403-2.427C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.427a4.92 4.92 0 0 1 1.153-1.77 4.92 4.92 0 0 1 1.77-1.153c.457-.163 1.257-.349 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.905.333 4.14.63a6.12 6.12 0 0 0-2.19 1.19A6.12 6.12 0 0 0 .63 4.14C.333 4.905.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.059 1.277.261 2.148.558 2.913a6.12 6.12 0 0 0 1.19 2.19 6.12 6.12 0 0 0 2.19 1.19c.765.297 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.059 2.148-.261 2.913-.558a6.12 6.12 0 0 0 2.19-1.19 6.12 6.12 0 0 0 1.19-2.19c.297-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.059-1.277-.261-2.148-.558-2.913a6.12 6.12 0 0 0-1.19-2.19 6.12 6.12 0 0 0-2.19-1.19c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0-2.881 0 1.44 1.44 0 0 0 2.881 0z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg
      className="topbar-social-icon"
      viewBox="0 0 24 24"
      width={14}
      height={14}
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

const socialLinks = [
  { href: social.facebook, label: 'Facebook', Icon: FacebookIcon },
  { href: social.instagram, label: 'Instagram', Icon: InstagramIcon },
  { href: social.youtube, label: 'YouTube', Icon: YoutubeIcon },
] as const

export default function TopBar() {
  return (
    <div className="topbar-root">
      <div className="topbar-container">
        <div className="topbar-contact">
          <a href={contact.phoneHref} className="topbar-contact-item topbar-contact-link">
            <Phone size={14} className="topbar-icon" aria-hidden />
            {contact.phone}
          </a>
          <span className="topbar-contact-divider" aria-hidden>
            |
          </span>
          <a href={`mailto:${contact.email}`} className="topbar-contact-item topbar-contact-link">
            <Mail size={14} className="topbar-icon" aria-hidden />
            {contact.email}
          </a>
        </div>

        <div className="topbar-social">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="topbar-social-link"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
