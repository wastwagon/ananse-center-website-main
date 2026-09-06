import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import CmsRichText from '../../../components/CmsRichText'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_FINANCIAL_REPORTS, type CmsFinancialReport } from '../../../lib/cms/static-pages'
import LocalizedLink from '../../../components/LocalizedLink'

export async function generateMetadata() {
  return buildCmsMetadata('transparency')
}

export default async function TransparencyPage() {
  const cms = await getCmsTexts([
    'transparency.badge',
    'transparency.heading',
    'transparency.lead',
    'transparency.body',
    'transparency.reports',
  ] as const)
  const reports = parseCmsJson<CmsFinancialReport[]>(cms['transparency.reports'], DEFAULT_FINANCIAL_REPORTS)

  return (
    <LocalizedCmsPageShell
      i18nKey="page.transparency"
      badge={cms['transparency.badge']}
      title={cms['transparency.heading']}
      lead={cms['transparency.lead']}
      primaryCta={{ label: 'Donate', href: '/support#donate' }}
      secondaryCta={{ label: 'Trustee Circle', href: '/trustees' }}
    >
      <CmsRichText body={cms['transparency.body']} className="content-prose-body" />
      <h2 className="content-block-title content-block-title--plain">Reports</h2>
      <ul className="content-highlight-list">
        {reports.map((report) => (
          <li key={report.year + report.title} className="content-highlight-item">
            <span className="content-highlight-mark" aria-hidden>
              {report.year}
            </span>
            {report.url.startsWith('http') ? (
              <a
                href={report.url}
                className="content-cta-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {report.title}
                {/\.pdf($|\?)/i.test(report.url) ? ' (PDF)' : ''}
              </a>
            ) : (
              <LocalizedLink href={report.url} className="content-cta-link">
                {report.title}
              </LocalizedLink>
            )}
          </li>
        ))}
      </ul>
    </LocalizedCmsPageShell>
  )
}
