'use client'

import { useEffect, useState } from 'react'
import AdminShell from '../../../components/admin/AdminShell'
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
      {error ? <p className="admin-error" style={{ marginBottom: '1rem' }}>{error}</p> : null}
      <p className="admin-help" style={{ marginBottom: '1rem' }}>
        <a href={donationsExportUrl()} className="content-cta-link">
          Download donations CSV
        </a>{' '}
        for CRM import (set CRM_WEBHOOK_URL for live sync).
      </p>
      <div className="admin-card">
        {loading ? (
          <p>Loading donations…</p>
        ) : donations.length === 0 ? (
          <p>No donations recorded yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.reference}</td>
                  <td>
                    {donation.donorName || '—'}
                    <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>{donation.email}</div>
                  </td>
                  <td>{formatAmount(donation.amount, donation.currency)}</td>
                  <td>{donation.status}</td>
                  <td>{new Date(donation.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  )
}
