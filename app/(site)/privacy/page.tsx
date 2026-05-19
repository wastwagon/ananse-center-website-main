import Link from 'next/link'
import { site } from '../../../lib/site'
import { getCmsTexts } from '../../../lib/cms/content'

export const metadata = {
  title: `Privacy Policy | ${site.shortName}`,
}

export default async function PrivacyPage() {
  const cms = await getCmsTexts([
    'legal.badge',
    'privacy.heading',
    'privacy.lead',
    'privacy.body',
  ] as const)

  return (
    <div className="page-section bg-white">
      <div className="page-section-container legal-page">
        <span className="section-badge">{cms['legal.badge']}</span>
        <h1 className="page-section-heading">{cms['privacy.heading']}</h1>
        <p className="page-body-text legal-lead">{cms['privacy.lead']}</p>
        <p className="page-body-text">{cms['privacy.body']}</p>
        <div className="legal-cta-row">
          <Link href="/contact#form" className="btn-primary page-inline-cta">
            Contact us
          </Link>
          <Link href="/" className="btn-outline page-inline-cta">
            Return home
          </Link>
        </div>
      </div>
    </div>
  )
}
