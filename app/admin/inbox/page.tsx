'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  fetchAdminInboxCommunity,
  fetchAdminInboxRegistrations,
  updateCommunitySubmissionStatus,
  updateEventRegistrationStatus,
  type CommunitySubmissionRow,
  type EventRegistrationRow,
} from '../../../lib/admin-api'

export default function AdminInboxPage() {
  const [registrations, setRegistrations] = useState<EventRegistrationRow[]>([])
  const [stories, setStories] = useState<CommunitySubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
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
      {loading ? <p>Loading inbox…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

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
                      <th>Status</th>
                      <th>When</th>
                      <th />
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
                        <td>{row.status}</td>
                        <td>{new Date(row.createdAt).toLocaleString()}</td>
                        <td>
                          {row.status !== 'reviewed' ? (
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost admin-btn--sm"
                              onClick={() => void setRegistrationStatus(row.id, 'reviewed')}
                            >
                              Mark reviewed
                            </button>
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
              <p className="admin-help">No community submissions yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.title}</strong>
                          {row.org ? (
                            <p className="admin-help" style={{ marginTop: '0.25rem' }}>
                              {row.org}
                            </p>
                          ) : null}
                          <p className="admin-help" style={{ marginTop: '0.35rem' }}>
                            {row.body.slice(0, 160)}
                            {row.body.length > 160 ? '…' : ''}
                          </p>
                        </td>
                        <td>
                          {row.name}
                          <br />
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        </td>
                        <td>{row.status}</td>
                        <td>
                          <div className="admin-actions" style={{ flexWrap: 'wrap' }}>
                            {row.status !== 'published' ? (
                              <button
                                type="button"
                                className="admin-btn admin-btn--primary admin-btn--sm"
                                onClick={() => void setStoryStatus(row.id, 'published')}
                              >
                                Publish
                              </button>
                            ) : null}
                            {row.status !== 'rejected' ? (
                              <button
                                type="button"
                                className="admin-btn admin-btn--ghost admin-btn--sm"
                                onClick={() => void setStoryStatus(row.id, 'rejected')}
                              >
                                Reject
                              </button>
                            ) : null}
                            {row.status !== 'pending' ? (
                              <button
                                type="button"
                                className="admin-btn admin-btn--ghost admin-btn--sm"
                                onClick={() => void setStoryStatus(row.id, 'pending')}
                              >
                                Pending
                              </button>
                            ) : null}
                          </div>
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
