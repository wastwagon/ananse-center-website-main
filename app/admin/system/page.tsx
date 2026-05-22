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
    <AdminShell title="System & database">
      {loading ? <p>Loading system status…</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {status ? (
        <>
          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Production checklist (API env)</h2>
            <p className="admin-help">
              Recommended Coolify settings for a live site. See <code>COOLIFY.md</code> and{' '}
              <code>config/coolify-production.env.example</code>.
            </p>
            <ul className="admin-list">
              <li>
                HTTPS site URL:{' '}
                {status.productionChecklist.httpsSiteUrl ? '✓' : '✗ set NEXT_PUBLIC_SITE_URL=https://…'}
              </li>
              <li>
                Strong JWT secret:{' '}
                {status.productionChecklist.jwtSecretStrong
                  ? '✓'
                  : '✗ ADMIN_JWT_SECRET 32+ chars'}
              </li>
              <li>
                Skip seed on boot:{' '}
                {status.productionChecklist.skipSeedAfterFirstDeploy
                  ? '✓ SKIP_PRISMA_SEED=true'
                  : '○ first deploy only — then set true'}
              </li>
              <li>
                System UI locked:{' '}
                {status.productionChecklist.systemOpsLocked
                  ? '✓ ADMIN_ALLOW_SYSTEM_OPS not enabled'
                  : '✗ enable only for emergencies'}
              </li>
              <li>
                CORS configured:{' '}
                {status.productionChecklist.corsConfigured ? '✓' : '✗ set CORS_ORIGIN'}
              </li>
              <li>
                Trust proxy:{' '}
                {status.productionChecklist.trustProxy ? '✓ TRUST_PROXY=true' : '○ optional behind Coolify'}
              </li>
            </ul>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Deployment automation</h2>
            <ul className="admin-list">
              <li>
                <strong>Migrations on deploy:</strong>{' '}
                {status.autoMigrateOnDeploy ? 'Yes (API container runs prisma migrate deploy)' : 'No'}
              </li>
              <li>
                <strong>Seed on deploy:</strong>{' '}
                {status.autoSeedOnDeploy
                  ? 'Yes (unless SKIP_PRISMA_SEED=true)'
                  : 'Skipped (SKIP_PRISMA_SEED=true)'}
              </li>
              <li>
                <strong>Environment:</strong> {status.environment}
              </li>
              <li>
                <strong>Manual system ops:</strong>{' '}
                {status.systemOpsAllowed ? 'Allowed' : 'Blocked in production'}
              </li>
            </ul>
            {!status.systemOpsAllowed ? (
              <p className="admin-help">
                To enable migrate/seed buttons in production, set{' '}
                <code>ADMIN_ALLOW_SYSTEM_OPS=true</code> on the API service.
              </p>
            ) : null}
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-value">{status.counts.events}</span>
              <span className="admin-stat-label">Events</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{status.counts.contactMessages}</span>
              <span className="admin-stat-label">Messages</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{status.counts.donations}</span>
              <span className="admin-stat-label">Donations</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{status.counts.adminUsers}</span>
              <span className="admin-stat-label">Admin users</span>
            </div>
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
