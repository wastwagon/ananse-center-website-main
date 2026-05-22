import { buildSimpleCmsPageMetadata, loadLabeledRows } from '../../../lib/cms-page-factory'
import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { getCmsTexts } from '../../../lib/cms/content'

export const metadata = buildSimpleCmsPageMetadata({
  path: '/visit',
  metaTitle: 'Visit',
  metaDescription:
    'Plan your visit to The Ananse Center in Akatakyiwa, Central Region, Ghana — near diaspora heritage sites.',
  badgeKey: 'visit.badge',
  headingKey: 'visit.heading',
  leadKey: 'visit.lead',
  bodyKey: 'visit.body',
  primaryCta: { label: 'Contact us', href: '/contact#form' },
  secondaryCta: { label: 'View events', href: '/events' },
})

export default async function VisitPage() {
  const cms = await getCmsTexts(['visit.badge', 'visit.heading', 'visit.lead', 'visit.body', 'visit.directions'] as const)
  const directions = await loadLabeledRows('visit.directions', [
    { label: 'Region', value: 'Central Region, Ghana' },
    { label: 'Community', value: 'Akatakyiwa' },
  ])

  return (
    <LocalizedCmsPageShell
      i18nKey="page.visit"
      badge={cms['visit.badge']}
      title={cms['visit.heading']}
      lead={cms['visit.lead']}
      primaryCta={{ label: 'Schedule a visit', href: '/contact#form' }}
      secondaryCta={{ label: 'Repatriation resources', href: '/repatriation' }}
    >
      <div className="content-prose-body">
        {cms['visit.body'].split('\n\n').map((p) => (
          <p key={p.slice(0, 40)} className="page-body-text content-prose-p">
            {p}
          </p>
        ))}
      </div>
      <div className="detail-info-grid">
        {directions.map((row) => (
          <div key={row.label} className="detail-info-card">
            <p className="detail-info-label">{row.label}</p>
            <p className="detail-info-value">{row.value}</p>
          </div>
        ))}
      </div>
    </LocalizedCmsPageShell>
  )
}
