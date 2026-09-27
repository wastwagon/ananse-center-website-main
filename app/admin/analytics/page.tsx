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
      <div className="admin-page-tools">
        <p className="admin-help">
          Pageviews stay on this server. Nothing is sent to a third-party tracker.
        </p>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      {!data && !error ? <p className="admin-empty">Loading analytics…</p> : null}

      {data ? (
        <>
          <div className="admin-kpi-grid">
            <article className="admin-kpi-card admin-kpi-card--amber admin-kpi-card--static">
              <span className="admin-kpi-label">Views today</span>
              <strong className="admin-kpi-value">{data.totals.viewsToday}</strong>
              <span className="admin-kpi-meta">{data.totals.uniquesToday} unique visitors</span>
            </article>
            <article className="admin-kpi-card admin-kpi-card--slate admin-kpi-card--static">
              <span className="admin-kpi-label">Last 7 days</span>
              <strong className="admin-kpi-value">{data.totals.views7d}</strong>
              <span className="admin-kpi-meta">{data.totals.uniques7d} unique visitors</span>
            </article>
            <article className="admin-kpi-card admin-kpi-card--emerald admin-kpi-card--static">
              <span className="admin-kpi-label">Last 30 days</span>
              <strong className="admin-kpi-value">{data.totals.views30d}</strong>
              <span className="admin-kpi-meta">Counted on this server</span>
            </article>
          </div>

          <div className="admin-card admin-card--spaced">
            <h2 className="admin-card-title">Pageviews, last 14 days</h2>
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
              <h2 className="admin-card-title">Top pages, 30 days</h2>
              {data.topPages.length === 0 ? (
                <p className="admin-empty">No pageviews yet. Open the public site to start the count.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Path</th>
                        <th className="admin-num">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPages.map((row) => (
                        <tr key={row.path}>
                          <td>
                            <span className="admin-meta">{row.path}</span>
                          </td>
                          <td className="admin-num">{row.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="admin-card">
              <h2 className="admin-card-title">Top referrers, 30 days</h2>
              {data.topReferrers.length === 0 ? (
                <p className="admin-empty">No outside referrers yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th className="admin-num">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topReferrers.map((row) => (
                        <tr key={row.referrer}>
                          <td>{row.referrer}</td>
                          <td className="admin-num">{row.views}</td>
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
