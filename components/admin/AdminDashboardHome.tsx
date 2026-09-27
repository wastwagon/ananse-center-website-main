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
    return <p className="admin-empty">Loading dashboard…</p>
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
    <div className="admin-dash">
      <header className={`admin-dash-hero ${live ? 'is-live' : 'is-maintenance'}`}>
        <div>
          <p className="admin-dash-kicker">{live ? 'Live' : 'Maintenance'}</p>
          <h2 className="admin-dash-heading">
            {live ? 'The public site is open.' : 'Visitors see the maintenance page.'}
          </h2>
        </div>
        <Link href="/admin/settings" className="admin-btn admin-btn--ghost admin-btn--sm">
          Site settings
        </Link>
      </header>

      <div className="admin-kpi-grid">
        {kpis.slice(0, 4).map((kpi) => {
          const Icon = kpi.icon
          return (
            <Link key={kpi.key} href={kpi.href || '/admin'} className="admin-kpi-card">
              <span className={`admin-kpi-icon admin-kpi-icon--${kpi.tone}`} aria-hidden>
                <Icon strokeWidth={1.75} />
              </span>
              <span className="admin-kpi-label">{kpi.label}</span>
              <strong className="admin-kpi-value">{kpi.value}</strong>
              <span className="admin-kpi-meta">{kpi.meta}</span>
            </Link>
          )
        })}
      </div>

      <div className="admin-dash-split">
        <section className="admin-card">
          <h2 className="admin-card-title">Inbox</h2>
          <ul className="admin-attention-list">
            {kpis.filter((kpi) => (kpi.key === 'stories' || kpi.key === 'rsvps') && kpi.value > 0).length ===
            0 ? (
              <li className="admin-attention-clear">No stories or RSVPs waiting.</li>
            ) : (
              kpis
                .filter((kpi) => (kpi.key === 'stories' || kpi.key === 'rsvps') && kpi.value > 0)
                .map((kpi) => (
                  <li key={kpi.key}>
                    <Link href={kpi.href || '/admin'}>
                      <strong>{kpi.value}</strong>
                      <span>{kpi.label}</span>
                    </Link>
                  </li>
                ))
            )}
          </ul>
          <p className="admin-help" style={{ margin: '0.75rem 0 0' }}>
            <Link href="/admin/newsletter">{data.newsletter.subscribers} newsletter subscribers</Link>
          </p>
        </section>

        <section className="admin-card">
          <h2 className="admin-card-title">Launch</h2>
          {data.launchReadiness?.ready ? (
            <p className="admin-help" style={{ marginBottom: 0 }}>
              Ops checks passed. Review SEO and legal copy once more before go-live.
            </p>
          ) : (
            <ul className="admin-check-list">
              {(data.launchReadiness?.opsChecks ?? [])
                .filter((check) => !check.ok && check.id !== 'demo-preview')
                .slice(0, 5)
                .map((check) => (
                  <li key={check.id}>
                    {check.href ? <Link href={check.href}>{check.label}</Link> : check.label}
                  </li>
                ))}
              {(data.launchReadiness?.placeholderNewsCount ?? 0) > 0 ? (
                <li>
                  <Link href="/admin/insights">
                    {data.launchReadiness?.placeholderNewsCount} insight drafts still titled Placeholder
                  </Link>
                </li>
              ) : null}
              {(data.launchReadiness?.opsChecks ?? []).every((check) => check.ok) &&
              (data.launchReadiness?.placeholderNewsCount ?? 0) === 0 ? (
                <li>A few content checks are still open. Open the list below.</li>
              ) : null}
            </ul>
          )}
        </section>
      </div>

      {data.demoPreview && data.demoPreview.total > 0 ? (
        <section className="admin-card admin-card--demo">
          <h2 className="admin-card-title">Demo records still published</h2>
          <p className="admin-help">
            These use <code>demo-*</code> slugs. Unpublish them before launch.
          </p>
          <div className="admin-task-grid admin-task-grid--fit">
            {data.demoPreview.events > 0 ? (
              <Link href="/admin/events" className="admin-task">
                <strong>Events</strong>
                <span>{data.demoPreview.events} still published</span>
              </Link>
            ) : null}
            {data.demoPreview.people > 0 ? (
              <Link href="/admin/people" className="admin-task">
                <strong>People</strong>
                <span>{data.demoPreview.people} still published</span>
              </Link>
            ) : null}
            {data.demoPreview.library > 0 ? (
              <Link href="/admin/library" className="admin-task">
                <strong>Library</strong>
                <span>{data.demoPreview.library} still published</span>
              </Link>
            ) : null}
            {data.demoPreview.insights > 0 ? (
              <Link href="/admin/insights" className="admin-task">
                <strong>Insights</strong>
                <span>{data.demoPreview.insights} still published</span>
              </Link>
            ) : null}
            {data.demoPreview.photoAlbums > 0 ? (
              <Link href="/admin/photo-albums" className="admin-task">
                <strong>Photo albums</strong>
                <span>{data.demoPreview.photoAlbums} still published</span>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="admin-card">
        <h2 className="admin-card-title">Start here</h2>
        <div className="admin-task-grid">
          <Link href="/admin/settings" className="admin-task">
            <strong>Settings</strong>
            <span>Phone, email, address, social links</span>
          </Link>
          <Link href="/admin/content" className="admin-task">
            <strong>Site content</strong>
            <span>Logo, navigation, home, and about</span>
          </Link>
          <Link href="/admin/media" className="admin-task">
            <strong>Media library</strong>
            <span>Upload photos used across the site</span>
          </Link>
          <Link href="/admin/programs" className="admin-task">
            <strong>Programs</strong>
            <span>Titles, covers, and descriptions</span>
          </Link>
          <Link href="/admin/events" className="admin-task">
            <strong>Events</strong>
            <span>Dates, capacity, and registration</span>
          </Link>
          <Link href="/admin/insights" className="admin-task">
            <strong>Insights</strong>
            <span>Articles, essays, and reflections</span>
          </Link>
        </div>
        <details className="admin-more">
          <summary>More before launch</summary>
          <ul className="admin-check-list">
            <li>
              <Link href="/admin/content?q=trustees.members">Replace trustee names</Link>
            </li>
            <li>
              <Link href="/admin/content?q=contact.map">Add the contact map</Link>
            </li>
            <li>
              <Link href="/admin/content?q=site.partners">Partner and award logos</Link>
            </li>
            <li>
              <Link href="/admin/content?q=videos.items">Real video links</Link>
            </li>
            <li>
              <Link href="/admin/content?q=transparency.reports">Transparency PDFs</Link>
            </li>
            <li>
              <Link href="/admin/content">SEO titles and descriptions</Link>
            </li>
            <li>
              <Link href="/admin/system">System and database</Link>
            </li>
          </ul>
        </details>
      </section>
    </div>
  )
}
