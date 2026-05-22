'use client'

import { FormEvent, useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  fetchAdminSettings,
  updateAdminSettings,
  type AdminSettingsPatch,
  type ImpactStat,
  type SiteSettings,
} from '../../../lib/admin-api'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [patch, setPatch] = useState<AdminSettingsPatch>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await fetchAdminSettings()
        setSettings(data)
        setPatch({
          maintenanceMode: data.maintenanceMode,
          maintenanceTitle: data.maintenanceTitle,
          maintenanceMessage: data.maintenanceMessage,
          siteName: data.site.name,
          siteShortName: data.site.shortName,
          siteTagline: data.site.tagline,
          siteLocation: data.site.location,
          contactPhone: data.contact.phone,
          contactPhoneHref: data.contact.phoneHref,
          contactEmail: data.contact.email,
          programsEmail: data.contact.programsEmail,
          contactHours: data.contact.hours,
          contactAddress: data.contact.address,
          impactStats: data.impactStats,
          socialFacebook: data.social.facebook,
          socialInstagram: data.social.instagram,
          socialYoutube: data.social.youtube,
          socialTwitter: data.social.twitter,
          lmsPortalUrl: data.integrations?.lmsPortalUrl ?? '',
          googleAnalyticsId: data.integrations?.googleAnalyticsId ?? '',
          legacyRedirectHost: data.integrations?.legacyRedirectHost ?? '',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  function updateField<K extends keyof AdminSettingsPatch>(key: K, value: AdminSettingsPatch[K]) {
    setPatch((prev) => ({ ...prev, [key]: value }))
  }

  function updateImpactStat(index: number, field: keyof ImpactStat, value: string) {
    setPatch((prev) => {
      const stats = [...(prev.impactStats ?? [])]
      stats[index] = { ...stats[index], [field]: value }
      return { ...prev, impactStats: stats }
    })
  }

  function addImpactStat() {
    setPatch((prev) => ({
      ...prev,
      impactStats: [...(prev.impactStats ?? []), { value: '', label: '' }],
    }))
  }

  function removeImpactStat(index: number) {
    setPatch((prev) => ({
      ...prev,
      impactStats: (prev.impactStats ?? []).filter((_, i) => i !== index),
    }))
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const { data } = await updateAdminSettings(patch)
      setSettings(data)
      setNotice(
        data.maintenanceMode
          ? 'Maintenance mode enabled. Public visitors will see the maintenance page.'
          : 'Settings saved.',
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
        <form className="admin-form" onSubmit={onSubmit}>
          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Public site visibility</h2>
            <p className="admin-help">
              Toggle between live production and under-construction mode. Admin and API routes stay
              available while maintenance is on.
            </p>

            <label className="admin-toggle-row">
              <input
                type="checkbox"
                checked={patch.maintenanceMode ?? false}
                onChange={(e) => updateField('maintenanceMode', e.target.checked)}
              />
              <span>
                <strong>Under construction / maintenance</strong>
                <small>
                  {patch.maintenanceMode
                    ? 'Visitors see the maintenance page only'
                    : 'Public website is live for everyone'}
                </small>
              </span>
            </label>

            <div className="admin-field">
              <label htmlFor="maintenanceTitle">Maintenance headline</label>
              <input
                id="maintenanceTitle"
                value={patch.maintenanceTitle ?? ''}
                onChange={(e) => updateField('maintenanceTitle', e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="maintenanceMessage">Maintenance message</label>
              <textarea
                id="maintenanceMessage"
                value={patch.maintenanceMessage ?? ''}
                onChange={(e) => updateField('maintenanceMessage', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Site identity</h2>
            <p className="admin-help">Used in the header, footer, and page metadata.</p>

            <div className="admin-field">
              <label htmlFor="siteName">Full name</label>
              <input
                id="siteName"
                value={patch.siteName ?? ''}
                onChange={(e) => updateField('siteName', e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="siteShortName">Short name</label>
              <input
                id="siteShortName"
                value={patch.siteShortName ?? ''}
                onChange={(e) => updateField('siteShortName', e.target.value)}
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="siteTagline">Tagline</label>
              <input
                id="siteTagline"
                value={patch.siteTagline ?? ''}
                onChange={(e) => updateField('siteTagline', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="siteLocation">Location label</label>
              <input
                id="siteLocation"
                value={patch.siteLocation ?? ''}
                onChange={(e) => updateField('siteLocation', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Contact</h2>
            <p className="admin-help">
              Shown in the top bar and footer. Long-form page copy is edited under Site content.
            </p>

            <div className="admin-field">
              <label htmlFor="contactPhone">Phone (display)</label>
              <input
                id="contactPhone"
                value={patch.contactPhone ?? ''}
                onChange={(e) => updateField('contactPhone', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="contactPhoneHref">Phone link (tel:)</label>
              <input
                id="contactPhoneHref"
                value={patch.contactPhoneHref ?? ''}
                onChange={(e) => updateField('contactPhoneHref', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="contactEmail">General email</label>
              <input
                id="contactEmail"
                type="email"
                value={patch.contactEmail ?? ''}
                onChange={(e) => updateField('contactEmail', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="programsEmail">Programs email</label>
              <input
                id="programsEmail"
                type="email"
                value={patch.programsEmail ?? ''}
                onChange={(e) => updateField('programsEmail', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="contactHours">Hours</label>
              <input
                id="contactHours"
                value={patch.contactHours ?? ''}
                onChange={(e) => updateField('contactHours', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="contactAddress">Postal address</label>
              <textarea
                id="contactAddress"
                rows={4}
                value={patch.contactAddress ?? ''}
                onChange={(e) => updateField('contactAddress', e.target.value)}
                placeholder="Organization name and mailing address (line breaks allowed)"
              />
            </div>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Footer impact metrics</h2>
            <p className="admin-help">Shown in the footer strip on every public page.</p>
            {(patch.impactStats ?? []).map((stat, index) => (
              <div
                key={`impact-${index}`}
                className="admin-field"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem' }}
              >
                <input
                  aria-label={`Impact value ${index + 1}`}
                  placeholder="500+"
                  value={stat.value}
                  onChange={(e) => updateImpactStat(index, 'value', e.target.value)}
                />
                <input
                  aria-label={`Impact label ${index + 1}`}
                  placeholder="Lives Impacted"
                  value={stat.label}
                  onChange={(e) => updateImpactStat(index, 'label', e.target.value)}
                />
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost admin-btn--sm"
                  onClick={() => removeImpactStat(index)}
                  disabled={(patch.impactStats?.length ?? 0) <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={addImpactStat}
              disabled={(patch.impactStats?.length ?? 0) >= 8}
            >
              Add metric
            </button>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Integrations</h2>
            <p className="admin-help">
              LMS portal, Google Analytics, and legacy-domain redirect. Values set in Coolify
              (NEXT_PUBLIC_LMS_PORTAL_URL, NEXT_PUBLIC_GA_MEASUREMENT_ID, LEGACY_SITE_HOST) take
              precedence when non-empty; save here to persist in the database.
            </p>
            <div className="admin-field">
              <label htmlFor="lmsPortalUrl">LMS portal URL</label>
              <input
                id="lmsPortalUrl"
                type="url"
                placeholder="https://lms.example.com"
                value={patch.lmsPortalUrl ?? ''}
                onChange={(e) => updateField('lmsPortalUrl', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="googleAnalyticsId">Google Analytics measurement ID</label>
              <input
                id="googleAnalyticsId"
                placeholder="G-XXXXXXXXXX"
                value={patch.googleAnalyticsId ?? ''}
                onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="legacyRedirectHost">Legacy site hostname (301 to NEXT_PUBLIC_SITE_URL)</label>
              <input
                id="legacyRedirectHost"
                placeholder="anansecenter.oceancyber.site"
                value={patch.legacyRedirectHost ?? ''}
                onChange={(e) => updateField('legacyRedirectHost', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Social links</h2>

            <div className="admin-field">
              <label htmlFor="socialFacebook">Facebook</label>
              <input
                id="socialFacebook"
                type="url"
                value={patch.socialFacebook ?? ''}
                onChange={(e) => updateField('socialFacebook', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="socialInstagram">Instagram</label>
              <input
                id="socialInstagram"
                type="url"
                value={patch.socialInstagram ?? ''}
                onChange={(e) => updateField('socialInstagram', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="socialYoutube">YouTube</label>
              <input
                id="socialYoutube"
                type="url"
                value={patch.socialYoutube ?? ''}
                onChange={(e) => updateField('socialYoutube', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label htmlFor="socialTwitter">X / Twitter</label>
              <input
                id="socialTwitter"
                type="url"
                value={patch.socialTwitter ?? ''}
                onChange={(e) => updateField('socialTwitter', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-actions">
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>

          {settings ? (
            <p className="admin-help" style={{ marginTop: '1rem' }}>
              Last updated: {new Date(settings.updatedAt).toLocaleString()}
            </p>
          ) : null}
        </form>
      ) : null}
    </AdminShell>
  )
}
