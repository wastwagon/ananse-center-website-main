import LocalizedLink from '../../../components/LocalizedLink'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getPublicSiteProfile } from '../../../lib/site-profile'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Accessibility',
    description:
      'How to use the ANANSE Center for Leadership Development website, and how to tell us if something gets in the way.',
    path: '/accessibility',
  })
}

export default async function AccessibilityPage() {
  const profile = await getPublicSiteProfile()

  return (
    <article className="content-page">
      <section className="content-page-hero section-reveal">
        <div className="page-section-container content-page-hero-inner">
          <span className="section-badge">Accessibility</span>
          <h1 className="content-page-hero-title">Accessibility</h1>
          <p className="content-page-hero-lead">
            ANANSE Center for Leadership Development wants this website to be readable and usable on a phone and on a computer, including with a keyboard and with text that can be resized.
          </p>
        </div>
      </section>
      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose page-section-narrow">
          <h2 className="page-subsection-heading">What you can expect</h2>
          <ul className="content-highlight-list">
            <li className="content-highlight-item">Pages use headings so the structure can be followed.</li>
            <li className="content-highlight-item">Menus can be opened with a keyboard. On a phone, the full menu scrolls.</li>
            <li className="content-highlight-item">Long menus on a computer scroll vertically instead of running off the screen.</li>
            <li className="content-highlight-item">Forms name their fields. A message tells you whether a form was received.</li>
            <li className="content-highlight-item">Meaningful images are given a short text description as they are added.</li>
          </ul>
          <h2 className="page-subsection-heading">If something gets in the way</h2>
          <p className="page-body-text content-prose-p">
            Write to{' '}
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a> and describe the page and the barrier. We will reply and correct what we can.
          </p>
          <p className="page-body-text content-prose-p">
            This page describes the present site. It is not a formal certification. ANANSE can replace this wording with its own accessibility statement.
          </p>
          <div className="content-actions">
            <LocalizedLink href="/get-involved#contact" className="btn-primary">
              Contact
            </LocalizedLink>
          </div>
        </div>
      </section>
    </article>
  )
}
