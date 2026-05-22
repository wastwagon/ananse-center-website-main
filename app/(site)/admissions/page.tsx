import CmsPageShell from '../../../components/CmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson, splitParagraphs } from '../../../lib/cms/content'
import { DEFAULT_FACULTY, type CmsFaculty } from '../../../lib/cms/static-pages'
import type { CmsLabeledValue } from '../../../lib/cms/registry'
import LocalizedLink from '../../../components/LocalizedLink'
import LmsPortalBanner from '../../../components/LmsPortalBanner'

export const metadata = buildPageMetadata({
  title: 'Admissions & Fees',
  description: 'Apply to Sankofa programs at The Ananse Center — schedules, fees, and faculty.',
  path: '/admissions',
})

export default async function AdmissionsPage() {
  const cms = await getCmsTexts([
    'admissions.badge',
    'admissions.heading',
    'admissions.lead',
    'admissions.body',
    'admissions.fees',
    'admissions.faculty',
  ] as const)
  const fees = parseCmsJson<CmsLabeledValue[]>(cms['admissions.fees'], [])
  const faculty = parseCmsJson<CmsFaculty[]>(cms['admissions.faculty'], DEFAULT_FACULTY)

  return (
    <>
      <CmsPageShell
        badge={cms['admissions.badge']}
        title={cms['admissions.heading']}
        lead={cms['admissions.lead']}
        primaryCta={{ label: 'Apply now', href: '/contact#form' }}
        secondaryCta={{ label: 'Browse programs', href: '/programs' }}
      >
        <div className="content-prose-body">
          {splitParagraphs(cms['admissions.body']).map((p) => (
            <p key={p.slice(0, 48)} className="page-body-text content-prose-p">
              {p}
            </p>
          ))}
        </div>
        <h2 className="content-block-title content-block-title--plain">Fees (indicative)</h2>
        <div className="flex-column flex-column--snug">
          {fees.map((row) => (
            <div key={row.label} className="transparency-row">
              <span className="text-body-md">{row.label}</span>
              <span className="text-body-md" style={{ fontWeight: 700 }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <h2 className="content-block-title content-block-title--plain">Faculty</h2>
        <div className="grid-cards grid-cards--stack-narrow">
          {faculty.map((f) => (
            <article key={f.name} className="premium-card">
              <h3 className="premium-card-title">{f.name}</h3>
              <span className="insight-card-tag">{f.title}</span>
              <p className="premium-card-description">{f.expertise}</p>
            </article>
          ))}
        </div>
        <p className="page-body-text text-body-md">
          Ready to enroll?{' '}
          <LocalizedLink href="/contact#form" className="content-cta-link">
            Submit an inquiry
          </LocalizedLink>
          .
        </p>
      </CmsPageShell>
      <LmsPortalBanner />
    </>
  )
}
