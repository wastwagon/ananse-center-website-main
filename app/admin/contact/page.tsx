'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import { formatAdminWhen } from '../../../components/admin/AdminStatus'
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
      <div className="admin-page-tools">
        <p className="admin-help">Messages sent from the public contact form.</p>
        <a href={contactsExportUrl()} className="admin-btn admin-btn--ghost">
          Download CSV
        </a>
      </div>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="admin-empty">No messages yet.</p>
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
                    <a className="admin-meta" href={`mailto:${message.email}`}>
                      {message.email}
                    </a>
                  </td>
                  <td>{message.subject}</td>
                  <td className="admin-clamp" title={message.message}>
                    {message.message}
                  </td>
                  <td>{formatAdminWhen(message.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
