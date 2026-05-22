'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  contactsExportUrl,
  type AdminContactMessage,
  fetchAdminContactMessages,
} from '../../../lib/admin-api'

export default function AdminContactPage() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await fetchAdminContactMessages()
        setMessages(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <AdminShell title="Contact messages">
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        <a href={contactsExportUrl()} className="content-cta-link">
          Download contacts CSV
        </a>
      </p>
      {error ? <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p> : null}
      <div className="admin-card">
        {loading ? (
          <p>Loading messages…</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id}>
                  <td>
                    <strong>{message.name}</strong>
                    <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>{message.email}</div>
                  </td>
                  <td>{message.subject}</td>
                  <td style={{ maxWidth: '20rem' }}>{message.message}</td>
                  <td>{new Date(message.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
