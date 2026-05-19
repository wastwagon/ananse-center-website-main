'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import { fetchNewsletterSubscribers, type NewsletterSubscriber } from '../../../lib/admin-api'

export default function AdminNewsletterPage() {
  const [rows, setRows] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await fetchNewsletterSubscribers()
        setRows(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscribers')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <AdminShell title="Newsletter">
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        Email addresses collected from the events page newsletter form.
      </p>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-card">
        {loading ? (
          <p>Loading subscribers…</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={2}>No subscribers yet.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.email}</td>
                    <td>{new Date(row.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
