import Link from 'next/link'
import { site } from '../../../lib/site'

export const metadata = {
  title: `Terms of Service | ${site.shortName}`,
}

export default function TermsPage() {
  return (
    <div className="page-section bg-white">
      <div className="page-section-container legal-page">
        <span className="section-badge">Legal</span>
        <h1 className="page-section-heading">Terms of Service</h1>
        <p className="page-body-text legal-lead">
          By using this website you agree to these terms. Full legal text will be published before
          launch. Program participation is subject to separate registration agreements.
        </p>
        <p className="page-body-text">
          Content on this site is for informational purposes. Images and stories represent our
          mission; specific dates and offerings may change.
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
