import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import CmsRichText from '../../../components/CmsRichText'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_FACULTY, type CmsFaculty } from '../../../lib/cms/static-pages'
import type { CmsLabeledValue } from '../../../lib/cms/registry'
import LocalizedLink from '../../../components/LocalizedLink'
import LmsPortalBanner from '../../../components/LmsPortalBanner'

export async function generateMetadata() {
  return buildCmsMetadata('admissions')
}

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
      <LocalizedCmsPageShell
        i18nKey="page.admissions"
        badge={cms['admissions.badge']}
        title={cms['admissions.heading']}
        lead={cms['admissions.lead']}
        primaryCta={{ label: 'Apply now', href: '/contact#form' }}
        secondaryCta={{ label: 'Browse programs', href: '/programs' }}
      >
        <CmsRichText body={cms['admissions.body']} className="content-prose-body" />
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
      </LocalizedCmsPageShell>
      <LmsPortalBanner />
    </>
  )
}
