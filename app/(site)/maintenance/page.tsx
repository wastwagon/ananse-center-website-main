import Link from 'next/link'
import { getCmsText } from '../../../lib/cms/content'
import { getServerApiUrl } from '../../../lib/server-api-url'

async function getMaintenanceCopy() {
  try {
    const response = await fetch(`${getServerApiUrl()}/api/v1/site/status`, { cache: 'no-store' })
    if (!response.ok) return null
    return (await response.json()) as {
      maintenanceTitle: string
      maintenanceMessage: string
    }
  } catch {
    return null
  }
}

export default async function MaintenancePage() {
  const [copy, maintenanceBadge] = await Promise.all([
    getMaintenanceCopy(),
    getCmsText('site.maintenance.badge'),
  ])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600 mb-3">
          {maintenanceBadge}
        </p>
        <h1 className="heading-section mb-4">
          {copy?.maintenanceTitle || "We'll be back soon"}
        </h1>
        <p className="text-muted mb-8" style={{ color: '#475569', lineHeight: 1.7 }}>
          {copy?.maintenanceMessage ||
            'The Ananse Center website is undergoing scheduled updates. Thank you for your patience.'}
        </p>
        <Link href="/admin/login" className="btn-primary inline-flex">
          Admin sign in
        </Link>
      </div>
    </div>
  )
}
