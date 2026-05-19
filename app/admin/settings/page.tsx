'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  fetchAdminSettings,
  updateAdminSettings,
  type SiteSettings,
} from '../../../lib/admin-api'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await fetchAdminSettings()
        setSettings(data)
        setTitle(data.maintenanceTitle)
        setMessage(data.maintenanceMessage)
        setMaintenanceMode(data.maintenanceMode)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const { data } = await updateAdminSettings({
        maintenanceMode,
        maintenanceTitle: title,
        maintenanceMessage: message,
      })
      setSettings(data)
      setNotice(
        data.maintenanceMode
          ? 'Maintenance mode enabled. Public visitors will see the maintenance page.'
          : 'Site is live. Visitors can access the public website.',
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell title="Site settings">
      {loading ? <p>Loading settings…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}

      {!loading ? (
        <div className="admin-card">
          <h2 className="admin-card-title">Public site visibility</h2>
          <p className="admin-help">
            Toggle between live production and under-construction (maintenance) mode. Admin and API
            routes stay available while maintenance is on.
          </p>

          <form className="admin-form" onSubmit={onSubmit}>
            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
              <span>
                <strong>Under construction / maintenance</strong>
                <small>
                  {maintenanceMode
                    ? 'Visitors see the maintenance page only'
                    : 'Public website is live for everyone'}
                </small>
              </span>
            </label>

            <div className="admin-field">
              <label htmlFor="maintenanceTitle">Maintenance headline</label>
              <input
                id="maintenanceTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="maintenanceMessage">Maintenance message</label>
              <textarea
                id="maintenanceMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <div className="admin-actions">
              <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          </form>

          {settings ? (
            <p className="admin-help" style={{ marginTop: '1rem' }}>
              Last updated: {new Date(settings.updatedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
      ) : null}
    </AdminShell>
  )
}
