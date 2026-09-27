'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import AdminRowActions from '../../../components/admin/AdminRowActions'
import { AdminStatus, formatAdminWhen } from '../../../components/admin/AdminStatus'
import {
  fetchAdminInboxCommunity,
  fetchAdminInboxRegistrations,
  fetchAdminInboxTimeline,
  updateCommunitySubmissionStatus,
  updateEventRegistrationStatus,
  type CommunitySubmissionRow,
  type EventRegistrationRow,
  type InboxTimelineItem,
} from '../../../lib/admin-api'

const TIMELINE_LABELS: Record<InboxTimelineItem['kind'], string> = {
  contact: 'Contact',
  donation: 'Donation',
  registration: 'Registration',
  community: 'Community',
  newsletter: 'Newsletter',
}

export default function AdminInboxPage() {
  const [timeline, setTimeline] = useState<InboxTimelineItem[]>([])
  const [registrations, setRegistrations] = useState<EventRegistrationRow[]>([])
  const [stories, setStories] = useState<CommunitySubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [timelineRes, regRes, storyRes] = await Promise.all([
        fetchAdminInboxTimeline(),
        fetchAdminInboxRegistrations(),
        fetchAdminInboxCommunity(),
      ])
      setTimeline(timelineRes.data)
      setRegistrations(regRes.data)
      setStories(storyRes.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inbox')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function setRegistrationStatus(id: string, status: 'new' | 'reviewed') {
    setNotice(null)
    try {
      await updateEventRegistrationStatus(id, status)
      setNotice('Registration updated.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  async function setStoryStatus(id: string, status: 'published' | 'rejected' | 'pending') {
    setNotice(null)
    try {
      await updateCommunitySubmissionStatus(id, status)
      setNotice(status === 'published' ? 'Story published on Community page.' : 'Status updated.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <AdminShell title="Inbox">
      <div className="admin-page-tools">
        <p className="admin-help">Messages, registrations, and stories waiting for a response.</p>
      </div>
      {loading ? <p className="admin-empty">Loading inbox…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      {!loading && !error ? (
        <>
          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Recent activity</h2>
            {timeline.length === 0 ? (
              <p className="admin-empty">No activity yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Type</th>
                      <th>Title</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {timeline.map((row) => (
                      <tr key={`${row.kind}-${row.id}`}>
                        <td>{formatAdminWhen(row.at)}</td>
                        <td>
                          <span className="admin-badge admin-badge--neutral">{TIMELINE_LABELS[row.kind]}</span>
                        </td>
                        <td>
                          <strong>{row.title}</strong>
                          {row.summary ? <span className="admin-meta">{row.summary}</span> : null}
                        </td>
                        <td>
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        </td>
                        <td>
                          <AdminStatus value={row.status} />
                        </td>
                        <td>
                          <AdminRowActions items={[{ label: 'Open', href: row.adminPath }]} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Event registrations</h2>
            <p className="admin-help">RSVPs submitted from public event pages.</p>
            {registrations.length === 0 ? (
              <p className="admin-empty">No registrations yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>When</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.eventTitle || row.eventSlug}</strong>
                          {row.eventTitle ? <span className="admin-meta">{row.eventSlug}</span> : null}
                        </td>
                        <td>{row.name}</td>
                        <td>
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        </td>
                        <td>
                          <AdminStatus value={row.status} />
                        </td>
                        <td>{formatAdminWhen(row.createdAt)}</td>
                        <td>
                          {row.status !== 'reviewed' ? (
                            <AdminRowActions
                              items={[
                                {
                                  label: 'Mark reviewed',
                                  onClick: () => void setRegistrationStatus(row.id, 'reviewed'),
                                },
                              ]}
                            />
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Community stories</h2>
            <p className="admin-help">
              Approve submissions to show on the public Community Spotlight page.
            </p>
            {stories.length === 0 ? (
              <p className="admin-empty">No community submissions yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.title}</strong>
                          {row.org ? <span className="admin-meta">{row.org}</span> : null}
                          <span className="admin-meta admin-clamp">{row.body}</span>
                        </td>
                        <td>
                          {row.name}
                          <a className="admin-meta" href={`mailto:${row.email}`}>
                            {row.email}
                          </a>
                        </td>
                        <td>
                          <AdminStatus value={row.status} />
                        </td>
                        <td>
                          <AdminRowActions
                            items={[
                              ...(row.status !== 'published'
                                ? [{ label: 'Publish', onClick: () => void setStoryStatus(row.id, 'published') }]
                                : []),
                              ...(row.status !== 'rejected'
                                ? [
                                    {
                                      label: 'Reject',
                                      tone: 'danger' as const,
                                      onClick: () => void setStoryStatus(row.id, 'rejected'),
                                    },
                                  ]
                                : []),
                              ...(row.status !== 'pending'
                                ? [{ label: 'Mark pending', onClick: () => void setStoryStatus(row.id, 'pending') }]
                                : []),
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </AdminShell>
  )
}
