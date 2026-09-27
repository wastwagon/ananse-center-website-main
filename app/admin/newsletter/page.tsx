'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import { AdminStatus, formatAdminWhen } from '../../../components/admin/AdminStatus'
import {
  fetchNewsletterSubscribers,
  newsletterExportUrl,
  sendNewsletter,
  type NewsletterSubscriber,
} from '../../../lib/admin-api'

export default function AdminNewsletterPage() {
  const [rows, setRows] = useState<NewsletterSubscriber[]>([])
  const [smtpConfigured, setSmtpConfigured] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const result = await fetchNewsletterSubscribers()
        setRows(result.data)
        setSmtpConfigured(result.smtpConfigured)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscribers')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function onSend(event: FormEvent) {
    event.preventDefault()
    setSending(true)
    setNotice(null)
    setError(null)
    try {
      const result = await sendNewsletter({ subject, body })
      setNotice(
        result.recipients === 0
          ? 'No subscribed addresses to send to.'
          : `Sent ${result.sent} of ${result.recipients}.${result.failed ? ` ${result.failed} failed.` : ''}`,
      )
      if (result.sent > 0) {
        setSubject('')
        setBody('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send')
    } finally {
      setSending(false)
    }
  }

  const active = rows.filter((row) => row.status === 'subscribed').length

  return (
    <AdminShell title="Newsletter">
      <div className="admin-page-tools">
        <p className="admin-help">
          Addresses from the public signup. Messages go out through SMTP, one email per subscriber, with an unsubscribe link.
        </p>
        <a href={newsletterExportUrl()} className="admin-btn admin-btn--ghost">
          Download CSV
        </a>
      </div>
      {smtpConfigured ? (
        <p className="admin-help">SMTP is configured. {active} subscribed address{active === 1 ? '' : 'es'}.</p>
      ) : (
        <p className="admin-error">
          SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and NOTIFY_FROM_EMAIL, then restart the API. Signups are still saved.
        </p>
      )}
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-help">{notice}</p> : null}

      <form className="admin-card admin-form" onSubmit={onSend}>
        <h2 className="admin-card-title">Send an update</h2>
        <label className="admin-field">
          <span>Subject</span>
          <input
            className="admin-input"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            required
            minLength={3}
            maxLength={140}
          />
        </label>
        <label className="admin-field">
          <span>Message</span>
          <textarea
            className="admin-input"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            minLength={10}
            rows={8}
          />
        </label>
        <button type="submit" className="admin-btn" disabled={sending || !smtpConfigured}>
          {sending ? 'Sending…' : 'Send to subscribers'}
        </button>
      </form>

      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Loading subscribers…</p>
        ) : rows.length === 0 ? (
          <p className="admin-empty">No subscribers yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td>
                    <AdminStatus value={row.status === 'subscribed' ? 'subscribed' : 'unsubscribed'} />
                  </td>
                  <td>{formatAdminWhen(row.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
