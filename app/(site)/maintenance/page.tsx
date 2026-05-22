import Link from 'next/link'
import { getCmsText } from '../../../lib/cms/content'
import { getServerApiUrl } from '../../../lib/server-api-url'
import { t } from '../../../lib/i18n'
import { getServerLocale } from '../../../lib/locale-server'

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
  const [copy, maintenanceBadge, locale] = await Promise.all([
    getMaintenanceCopy(),
    getCmsText('site.maintenance.badge'),
    getServerLocale(),
  ])

  return (
    <div className="maintenance-page">
      <div className="maintenance-page-card section-reveal">
        <span className="section-badge">{maintenanceBadge}</span>
        <h1 className="content-page-hero-title">
          {copy?.maintenanceTitle || "We'll be back soon"}
        </h1>
        <p className="content-page-hero-lead">
          {copy?.maintenanceMessage ||
            'The Ananse Center website is undergoing scheduled updates. Thank you for your patience.'}
        </p>
        <Link href="/admin/login" className="btn-primary maintenance-page-btn">
          {t('maintenance.admin', locale)}
        </Link>
      </div>
    </div>
  )
}
