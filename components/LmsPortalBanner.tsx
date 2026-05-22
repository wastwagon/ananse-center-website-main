import { getCmsTexts } from '../lib/cms/content'
import { getSiteIntegrations } from '../lib/site-integrations'

export default async function LmsPortalBanner() {
  const [cms, integrations] = await Promise.all([
    getCmsTexts(['programs.lms.label', 'programs.lms.hint'] as const),
    getSiteIntegrations(),
  ])

  if (!integrations.lmsPortalUrl) return null

  return (
    <section className="page-section section-reveal bg-white">
      <div className="page-section-container">
        <div className="lms-portal-banner">
          <div>
            <h2 className="page-section-heading section-heading-sm">{cms['programs.lms.label']}</h2>
            <p className="page-body-text text-body-md">{cms['programs.lms.hint']}</p>
          </div>
          <a
            href={integrations.lmsPortalUrl}
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open LMS Portal
          </a>
        </div>
      </div>
    </section>
  )
}
