'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import { fetchAdminAnalytics, type AdminAnalyticsData } from '../../../lib/admin-api'

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data: analytics } = await fetchAdminAnalytics()
        setData(analytics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      }
    })()
  }, [])

  const maxSeries = useMemo(() => {
    if (!data?.series14d.length) return 1
    return Math.max(1, ...data.series14d.map((d) => d.views))
  }, [data])

  return (
    <AdminShell title="Analytics">
      <p className="admin-help">
        First-party, self-hosted website analytics — pageviews stay on your server. No Google Analytics or
        third-party trackers.
      </p>

      {error ? <p className="admin-error">{error}</p> : null}

      {!data && !error ? <p style={{ color: '#64748b' }}>Loading analytics…</p> : null}

      {data ? (
        <>
          <div className="admin-kpi-grid">
            <article className="admin-kpi-card admin-kpi-card--amber">
              <span className="admin-kpi-label">Views today</span>
              <strong className="admin-kpi-value">{data.totals.viewsToday}</strong>
              <span className="admin-kpi-meta">{data.totals.uniquesToday} unique visitors</span>
            </article>
            <article className="admin-kpi-card admin-kpi-card--slate">
              <span className="admin-kpi-label">Last 7 days</span>
              <strong className="admin-kpi-value">{data.totals.views7d}</strong>
              <span className="admin-kpi-meta">{data.totals.uniques7d} unique visitors</span>
            </article>
            <article className="admin-kpi-card admin-kpi-card--emerald">
              <span className="admin-kpi-label">Last 30 days</span>
              <strong className="admin-kpi-value">{data.totals.views30d}</strong>
              <span className="admin-kpi-meta">Self-hosted · privacy-friendly</span>
            </article>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Pageviews · 14 days</h2>
            <div className="admin-chart" role="img" aria-label="Pageviews over the last 14 days">
              {data.series14d.map((point) => (
                <div key={point.date} className="admin-chart-col">
                  <div
                    className="admin-chart-bar"
                    style={{ height: `${Math.max(6, (point.views / maxSeries) * 100)}%` }}
                    title={`${point.date}: ${point.views} views`}
                  />
                  <span className="admin-chart-label">{point.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-analytics-split">
            <div className="admin-card">
              <h2 className="admin-card-title">Top pages · 30 days</h2>
              {data.topPages.length === 0 ? (
                <p className="admin-help">No pageviews yet — browse the public site to start collecting data.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th>Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPages.map((row) => (
                        <tr key={row.path}>
                          <td>
                            <code>{row.path}</code>
                          </td>
                          <td>{row.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="admin-card">
              <h2 className="admin-card-title">Top referrers · 30 days</h2>
              {data.topReferrers.length === 0 ? (
                <p className="admin-help">No external referrers recorded yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topReferrers.map((row) => (
                        <tr key={row.referrer}>
                          <td>{row.referrer}</td>
                          <td>{row.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </AdminShell>
  )
}
