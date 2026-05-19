import Link from 'next/link'
import { site } from '../../../lib/site'

export const metadata = {
  title: `Privacy Policy | ${site.shortName}`,
}

export default function PrivacyPage() {
  return (
    <div className="page-section bg-white">
      <div className="page-section-container legal-page">
        <span className="section-badge">Legal</span>
        <h1 className="page-section-heading">Privacy Policy</h1>
        <p className="page-body-text legal-lead">
          {site.name} respects your privacy. This page will be updated with our full policy before
          public launch. For questions, contact us directly.
        </p>
        <p className="page-body-text">
          We collect information you submit through contact forms and newsletter sign-ups solely to
          respond to inquiries and share program updates. We do not sell personal data.
        </p>
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
