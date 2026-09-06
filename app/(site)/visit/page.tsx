import { loadLabeledRows } from '../../../lib/cms-page-factory'
import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import CmsRichText from '../../../components/CmsRichText'
import { getCmsTexts } from '../../../lib/cms/content'
import { buildCmsMetadata } from '../../../lib/cms/seo'

export async function generateMetadata() {
  return buildCmsMetadata('visit')
}

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
      <CmsRichText body={cms['visit.body']} className="content-prose-body" />
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
