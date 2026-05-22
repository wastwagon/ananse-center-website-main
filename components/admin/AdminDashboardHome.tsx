'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchAdminDashboard, type AdminDashboardData } from '../../lib/admin-api'

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

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-value">{data.events.published}</span>
          <span className="admin-stat-label">Published events</span>
          <span className="admin-stat-meta">{data.events.total} total</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{data.contactMessages.new}</span>
          <span className="admin-stat-label">New messages</span>
          <span className="admin-stat-meta">{data.contactMessages.total} total</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{data.donations.successful}</span>
          <span className="admin-stat-label">Successful donations</span>
          <span className="admin-stat-meta">{data.donations.total} total</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{data.inbox.pendingStories}</span>
          <span className="admin-stat-label">Stories to review</span>
          <Link href="/admin/inbox" className="admin-stat-meta">
            Open inbox
          </Link>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{data.inbox.newRegistrations}</span>
          <span className="admin-stat-label">Event RSVPs</span>
          <Link href="/admin/inbox" className="admin-stat-meta">
            View registrations
          </Link>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Quick actions</h2>
        <div className="admin-actions">
          <Link href="/admin/events" className="admin-btn admin-btn--primary">
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
          <Link href="/admin/system" className="admin-btn admin-btn--ghost">
            System & database
          </Link>
        </div>
      </div>
    </>
  )
}
