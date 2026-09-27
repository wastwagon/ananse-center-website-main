'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
import { AdminStatus, formatAdminWhen } from '../../../components/admin/AdminStatus'
import { donationsExportUrl, type AdminDonation, fetchAdminDonations } from '../../../lib/admin-api'

function formatAmount(amount: number, currency: string) {
  const value = amount / 100
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency || 'GHS',
  }).format(value)
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = useState<AdminDonation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await fetchAdminDonations()
        setDonations(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load donations')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <AdminShell title="Donations">
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-page-tools">
        <p className="admin-help">Gifts recorded on the site, ready to export for your records.</p>
        <a href={donationsExportUrl()} className="admin-btn admin-btn--ghost">
          Download CSV
        </a>
      </div>
      <div className="admin-card">
        {loading ? (
          <p className="admin-empty">Loading donations…</p>
        ) : donations.length === 0 ? (
          <p className="admin-empty">No donations recorded yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Donor</th>
                <th className="admin-num">Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>
                    <span className="admin-meta">{donation.reference}</span>
                  </td>
                  <td>
                    {donation.donorName || '—'}
                    <a className="admin-meta" href={`mailto:${donation.email}`}>
                      {donation.email}
                    </a>
                  </td>
                  <td className="admin-num">{formatAmount(donation.amount, donation.currency)}</td>
                  <td>
                    <AdminStatus value={donation.status} />
                  </td>
                  <td>{formatAdminWhen(donation.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
