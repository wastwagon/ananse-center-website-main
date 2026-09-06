'use client'

import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  CalendarDays,
  HeartHandshake,
  Inbox,
  Mail,
  MessageSquare,
  Ticket,
} from 'lucide-react'
import { fetchAdminDashboard, type AdminDashboardData } from '../../lib/admin-api'

type Kpi = {
  key: string
  value: number
  label: string
  meta: ReactNode
  href?: string
  tone: 'amber' | 'slate' | 'emerald' | 'rose' | 'sky' | 'violet'
  icon: ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>
}

export default function AdminDashboardHome() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data: dashboard } = await fetchAdminDashboard()
        setData(dashboard)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard')
      }
    })()
  }, [])

  if (error) {
    return <p className="admin-error">{error}</p>
  }

  if (!data) {
    return <p style={{ color: '#64748b' }}>Loading dashboard…</p>
  }

  const live = !data.site.maintenanceMode

  const kpis: Kpi[] = [
    {
      key: 'views',
      value: data.analytics?.viewsToday ?? 0,
      label: 'Views today',
      meta: 'Self-hosted analytics',
      href: '/admin/analytics',
      tone: 'violet',
      icon: BarChart3,
    },
    {
      key: 'events',
      value: data.events.published,
      label: 'Published events',
      meta: `${data.events.total} total`,
      href: '/admin/events',
      tone: 'amber',
      icon: CalendarDays,
    },
    {
      key: 'messages',
      value: data.contactMessages.new,
      label: 'New messages',
      meta: `${data.contactMessages.total} total`,
      href: '/admin/contact',
      tone: 'sky',
      icon: MessageSquare,
    },
    {
      key: 'donations',
      value: data.donations.successful,
      label: 'Successful donations',
      meta: `${data.donations.total} total`,
      href: '/admin/donations',
      tone: 'rose',
      icon: HeartHandshake,
    },
    {
      key: 'stories',
      value: data.inbox.pendingStories,
      label: 'Stories to review',
      meta: 'Open inbox',
      href: '/admin/inbox',
      tone: 'emerald',
      icon: Inbox,
    },
    {
      key: 'rsvps',
      value: data.inbox.newRegistrations,
      label: 'Event RSVPs',
      meta: 'View registrations',
      href: '/admin/inbox',
      tone: 'slate',
      icon: Ticket,
    },
    {
      key: 'newsletter',
      value: data.newsletter.subscribers,
      label: 'Newsletter subscribers',
      meta: 'View list',
      href: '/admin/newsletter',
      tone: 'amber',
      icon: Mail,
    },
  ]

  return (
    <>
      <div className={`admin-status-banner ${live ? 'admin-status-banner--live' : 'admin-status-banner--maintenance'}`}>
        <strong>{live ? 'Site is live' : 'Maintenance mode is ON'}</strong>
        <span>
          {live
            ? 'Visitors see the public website.'
            : 'Visitors are redirected to the maintenance page.'}
        </span>
        <Link href="/admin/settings" className="admin-btn admin-btn--ghost admin-btn--sm">
          Change in settings
        </Link>
      </div>

      <div className="admin-kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          const body = (
            <>
              <span className={`admin-kpi-icon admin-kpi-icon--${kpi.tone}`} aria-hidden>
                <Icon strokeWidth={1.75} />
              </span>
              <span className="admin-kpi-label">{kpi.label}</span>
              <strong className="admin-kpi-value">{kpi.value}</strong>
              <span className="admin-kpi-meta">{kpi.meta}</span>
            </>
          )
          return kpi.href ? (
            <Link key={kpi.key} href={kpi.href} className={`admin-kpi-card admin-kpi-card--${kpi.tone}`}>
              {body}
            </Link>
          ) : (
            <article key={kpi.key} className={`admin-kpi-card admin-kpi-card--${kpi.tone}`}>
              {body}
            </article>
          )
        })}
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Quick actions</h2>
        <div className="admin-actions">
          <Link href="/admin/analytics" className="admin-btn admin-btn--primary">
            Website analytics
          </Link>
          <Link href="/admin/events" className="admin-btn admin-btn--ghost">
            Manage events
          </Link>
          <Link href="/admin/inbox" className="admin-btn admin-btn--ghost">
            Review inbox
          </Link>
          <Link href="/admin/content" className="admin-btn admin-btn--ghost">
            Edit site content
          </Link>
          <Link href="/admin/settings" className="admin-btn admin-btn--ghost">
            Site settings
          </Link>
          <Link href="/admin/media" className="admin-btn admin-btn--ghost">
            Media library
          </Link>
          <Link href="/admin/system" className="admin-btn admin-btn--ghost">
            System & database
          </Link>
        </div>
      </div>

      {data.launchReadiness ? (
        <div className="admin-card" style={{ marginTop: '1.25rem' }}>
          <h2 className="admin-card-title">Launch readiness</h2>
          {data.launchReadiness.ready ? (
            <p style={{ color: '#166534', marginTop: 0, lineHeight: 1.6 }}>
              Ops checks passed and no placeholder content detected. Review SEO and legal copy once more before
              go-live.
            </p>
          ) : (
            <p style={{ color: '#475569', marginTop: 0, lineHeight: 1.6 }}>
              Clear the items below before public launch (or hide unfinished sections via{' '}
              <code>*.sections.visible</code>). Guide: <code>docs/CMS-HANDOVER.md</code>.
            </p>
          )}

          {data.launchReadiness.opsChecks && data.launchReadiness.opsChecks.length > 0 ? (
            <>
              <h3 style={{ fontSize: '0.95rem', margin: '1rem 0 0.35rem', color: '#0f172a' }}>
                Operations
              </h3>
              <ul style={{ color: '#334155', lineHeight: 1.7, paddingLeft: '1.25rem', marginTop: 0 }}>
                {data.launchReadiness.opsChecks.map((check) => {
                  const blocking = !check.ok && check.required !== false
                  return (
                    <li
                      key={check.id}
                      style={{ color: check.ok ? '#166534' : blocking ? '#9a3412' : '#a16207' }}
                    >
                      {check.ok ? '✓ ' : blocking ? '○ ' : '! '}
                      {check.href && !check.ok ? (
                        <Link href={check.href}>{check.label}</Link>
                      ) : (
                        check.label
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          ) : null}

          {(data.launchReadiness.placeholderNewsCount ?? 0) > 0 ||
          data.launchReadiness.placeholderContentKeys.length > 0 ? (
            <>
              <h3 style={{ fontSize: '0.95rem', margin: '1rem 0 0.35rem', color: '#0f172a' }}>
                Placeholder content
              </h3>
              <ul
                style={{
                  color: '#334155',
                  lineHeight: 1.7,
                  paddingLeft: '1.25rem',
                  marginTop: 0,
                  marginBottom: 0,
                }}
              >
                {(data.launchReadiness.placeholderNewsCount ?? 0) > 0 ? (
                  <li>
                    <Link href="/admin/news">
                      {data.launchReadiness.placeholderNewsCount} news/blog post(s)
                    </Link>{' '}
                    still titled “Placeholder…”
                  </li>
                ) : null}
                {data.launchReadiness.placeholderContentKeys.map((item) => (
                  <li key={item.key}>
                    <Link href={`/admin/content?q=${encodeURIComponent(item.key)}`}>{item.key}</Link>
                    {item.label ? ` — ${item.label}` : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="admin-card" style={{ marginTop: '1.25rem' }}>
        <h2 className="admin-card-title">Content handover checklist</h2>
        <p style={{ color: '#475569', marginTop: 0, lineHeight: 1.6 }}>
          Seeded pages use <strong>placeholders</strong> (names, quotes, milestones, stock photos) so the site
          looks complete — replace them with approved Ananse Center content when ready. Full guide:{' '}
          <code>docs/CMS-HANDOVER.md</code>.
        </p>
        <ol style={{ color: '#334155', lineHeight: 1.7, paddingLeft: '1.25rem', marginBottom: 0 }}>
          <li>
            <Link href="/admin/settings">Settings</Link> — phone, email, address, social links
          </li>
          <li>
            <Link href="/admin/content">Site Content → site</Link> — logo, favicon, nav, footer, global band
          </li>
          <li>
            <Link href="/admin/content">Site Content → home</Link> — hero, story (rich text), CTAs, stats, images
          </li>
          <li>
            <Link href="/admin/content">Site Content → about</Link> — Who We Are, mission/vision, timeline,
            leadership placeholders
          </li>
          <li>
            <Link href="/admin/programs">Programs</Link> +{' '}
            <Link href="/admin/content">programs.testimonials</Link> — real titles/covers; replace placeholder
            quotes
          </li>
          <li>
            <Link href="/admin/events">Events</Link> — dates, starts/ends, capacity, registration status, covers
          </li>
          <li>
            <Link href="/admin/news">News & blog</Link> — create posts with rich text, cover photo, author,
            featured
          </li>
          <li>
            <Link href="/admin/media">Media</Link> — upload workshop/community photos; wire into image keys /
            photoUrl
          </li>
          <li>
            <Link href="/admin/content">trustees.members</Link> — replace placeholder board names
          </li>
          <li>
            <Link href="/admin/content">Site Content → seo</Link> — page titles & descriptions before launch
          </li>
          <li>
            <Link href="/admin/analytics">Analytics</Link> — review self-hosted traffic after go-live
          </li>
          <li>
            Optional: hide unfinished blocks via <code>*.sections.visible</code> JSON keys
          </li>
        </ol>
      </div>
    </>
  )
}
