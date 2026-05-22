'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  fetchAdminInboxCommunity,
  fetchAdminInboxRegistrations,
  type CommunitySubmissionRow,
  type EventRegistrationRow,
} from '../../../lib/admin-api'

export default function AdminInboxPage() {
  const [registrations, setRegistrations] = useState<EventRegistrationRow[]>([])
  const [stories, setStories] = useState<CommunitySubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const [regRes, storyRes] = await Promise.all([
          fetchAdminInboxRegistrations(),
          fetchAdminInboxCommunity(),
        ])
        setRegistrations(regRes.data)
        setStories(storyRes.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load inbox')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <AdminShell title="Inbox">
      {loading ? <p>Loading inbox…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Event registrations</h2>
            <p className="admin-help">RSVPs submitted from public event pages.</p>
            {registrations.length === 0 ? (
              <p className="admin-help">No registrations yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((row) => (
                      <tr key={row.id}>
                        <td>{row.eventSlug}</td>
                        <td>{row.name}</td>
                        <td>
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        </td>
                        <td>{row.phone ?? '—'}</td>
                        <td>{new Date(row.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Community stories</h2>
            <p className="admin-help">Visitor-submitted spotlight stories awaiting review.</p>
            {stories.length === 0 ? (
              <p className="admin-help">No community submissions yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.title}</strong>
                          <p className="admin-help" style={{ marginTop: '0.35rem' }}>
                            {row.body.slice(0, 160)}
                            {row.body.length > 160 ? '…' : ''}
                          </p>
                        </td>
                        <td>{row.name}</td>
                        <td>
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        </td>
                        <td>{row.status}</td>
                        <td>{new Date(row.createdAt).toLocaleString()}</td>
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
