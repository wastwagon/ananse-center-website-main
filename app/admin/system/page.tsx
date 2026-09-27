'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import {
  fetchSystemStatus,
  runAdminMigrate,
  runAdminSeed,
  type SystemStatus,
} from '../../../lib/admin-api'

export default function AdminSystemPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<'migrate' | 'seed' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await fetchSystemStatus()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleMigrate() {
    if (!status) return
    const confirm = window.prompt(
      `Type ${status.confirmPhrases.migrate} to run database migrations:`,
    )
    if (confirm !== status.confirmPhrases.migrate) return

    setBusy('migrate')
    setError(null)
    setOutput(null)
    try {
      const result = await runAdminMigrate(confirm)
      setOutput(result.output || result.message)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed')
    } finally {
      setBusy(null)
    }
  }

  async function handleSeed() {
    if (!status) return
    const confirm = window.prompt(`Type ${status.confirmPhrases.seed} to seed the database:`)
    if (confirm !== status.confirmPhrases.seed) return

    setBusy('seed')
    setError(null)
    setOutput(null)
    try {
      const result = await runAdminSeed(confirm)
      setOutput(result.output || result.message)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seed failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <AdminShell title="System">
      <div className="admin-page-tools">
        <p className="admin-help">Launch checks, how deploys behave, and manual database tools.</p>
      </div>
      {loading ? <p className="admin-empty">Loading system status…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {status ? (
        <>
          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Launch checklist</h2>
            <p className="admin-help">Settings worth confirming before the public site goes live.</p>
            <ul className="admin-check-rows">
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.httpsSiteUrl ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                  {status.productionChecklist.httpsSiteUrl ? 'Ready' : 'Check'}
                </span>
                <span>
                  <strong>HTTPS site URL</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.httpsSiteUrl ? 'Public site uses a secure address.' : 'The public address should start with https.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.jwtSecretStrong ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                  {status.productionChecklist.jwtSecretStrong ? 'Ready' : 'Check'}
                </span>
                <span>
                  <strong>JWT secret</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.jwtSecretStrong ? 'Sign-in secret is long enough.' : 'Use a sign-in secret of at least 32 characters.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.skipSeedAfterFirstDeploy ? 'admin-badge--published' : 'admin-badge--neutral'}`}>
                  {status.productionChecklist.skipSeedAfterFirstDeploy ? 'Ready' : 'Note'}
                </span>
                <span>
                  <strong>Seed on boot</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.skipSeedAfterFirstDeploy ? 'Sample data is not reloaded on every boot.' : 'Turn sample data off after the first deploy.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.systemOpsLocked ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                  {status.productionChecklist.systemOpsLocked ? 'Ready' : 'Check'}
                </span>
                <span>
                  <strong>System tools</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.systemOpsLocked ? 'Manual migrate and seed stay locked.' : 'Lock manual database tools except for emergencies.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.corsConfigured ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                  {status.productionChecklist.corsConfigured ? 'Ready' : 'Check'}
                </span>
                <span>
                  <strong>CORS</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.corsConfigured ? 'Allowed browser origins are set.' : 'Set which sites may call this API.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.trustProxy ? 'admin-badge--published' : 'admin-badge--neutral'}`}>
                  {status.productionChecklist.trustProxy ? 'Ready' : 'Note'}
                </span>
                <span>
                  <strong>Trust proxy</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.trustProxy ? 'The API trusts the host proxy.' : 'Optional when the API sits behind a host proxy.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.paystackConfigured ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                  {status.productionChecklist.paystackConfigured ? 'Ready' : 'Check'}
                </span>
                <span>
                  <strong>Paystack</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.paystackConfigured ? 'Keys are present.' : 'Add live or test keys.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.paystackLiveKeys ? 'admin-badge--published' : 'admin-badge--neutral'}`}>
                  {status.productionChecklist.paystackLiveKeys ? 'Live' : 'Test'}
                </span>
                <span>
                  <strong>Paystack mode</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.paystackLiveKeys ? 'Using live keys.' : 'Test keys are fine on staging.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.searchIndexingAllowed ? 'admin-badge--published' : 'admin-badge--draft'}`}>
                  {status.productionChecklist.searchIndexingAllowed ? 'Ready' : 'Check'}
                </span>
                <span>
                  <strong>Search indexing</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.searchIndexingAllowed ? 'Search engines may index the public site.' : 'Search engines are still blocked.'}
                  </span>
                </span>
              </li>
              <li className="admin-check-row">
                <span className={`admin-badge ${status.productionChecklist.strictEnvValidation ? 'admin-badge--published' : 'admin-badge--neutral'}`}>
                  {status.productionChecklist.strictEnvValidation ? 'Ready' : 'Note'}
                </span>
                <span>
                  <strong>Strict environment checks</strong>
                  <span className="admin-meta">
                    {status.productionChecklist.strictEnvValidation ? 'The API stops on a critical configuration error.' : 'Optional. Stop the API on a critical configuration error when you want a hard check.'}
                  </span>
                </span>
              </li>
            </ul>
            {status.envWarnings.length > 0 ? (
              <div className="admin-notice admin-notice--warn" style={{ marginTop: '1rem' }}>
                <strong>Environment warnings</strong>
                <ul className="admin-list">
                  {status.envWarnings.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Deployment automation</h2>
            <ul className="admin-kv">
              <li>
                <span>Migrations on deploy</span>
                <strong>
                  {status.autoMigrateOnDeploy ? 'Yes, on API startup' : 'No'}
                </strong>
              </li>
              <li>
                <span>Seed on deploy</span>
                <strong>
                  {status.autoSeedOnDeploy ? 'Yes, unless seed is skipped' : 'Skipped'}
                </strong>
              </li>
              <li>
                <span>Environment</span>
                <strong>{status.environment}</strong>
              </li>
              <li>
                <span>Manual system tools</span>
                <strong>{status.systemOpsAllowed ? 'Allowed' : 'Blocked in production'}</strong>
              </li>
            </ul>
            {!status.systemOpsAllowed ? (
              <p className="admin-help">
              Manual migrate and seed are off on a live site. A super admin can turn them on for an emergency.
              </p>
            ) : null}
          </div>

          <div className="admin-kpi-grid">
            <article className="admin-kpi-card admin-kpi-card--amber admin-kpi-card--static">
              <span className="admin-kpi-label">Events</span>
              <strong className="admin-kpi-value">{status.counts.events}</strong>
            </article>
            <article className="admin-kpi-card admin-kpi-card--slate admin-kpi-card--static">
              <span className="admin-kpi-label">Messages</span>
              <strong className="admin-kpi-value">{status.counts.contactMessages}</strong>
            </article>
            <article className="admin-kpi-card admin-kpi-card--emerald admin-kpi-card--static">
              <span className="admin-kpi-label">Donations</span>
              <strong className="admin-kpi-value">{status.counts.donations}</strong>
            </article>
            <article className="admin-kpi-card admin-kpi-card--violet admin-kpi-card--static">
              <span className="admin-kpi-label">Admin users</span>
              <strong className="admin-kpi-value">{status.counts.adminUsers}</strong>
            </article>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Manual operations</h2>
            <p className="admin-help">
              Use these when you need to apply pending migrations or re-run seed data after changing
              environment variables. Both actions require typing a confirmation phrase.
            </p>
            <div className="admin-actions">
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={!status.systemOpsAllowed || busy !== null}
                onClick={() => void handleMigrate()}
              >
                {busy === 'migrate' ? 'Running migrations…' : 'Run migrations'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={!status.systemOpsAllowed || busy !== null}
                onClick={() => void handleSeed()}
              >
                {busy === 'seed' ? 'Seeding…' : 'Run database seed'}
              </button>
            </div>
          </div>

          {output ? (
            <pre className="admin-log-output" aria-live="polite">
              {output}
            </pre>
          ) : null}
        </>
      ) : null}
    </AdminShell>
  )
}
