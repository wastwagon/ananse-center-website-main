import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson, splitParagraphs } from '../../../lib/cms/content'
import { DEFAULT_FINANCIAL_REPORTS, type CmsFinancialReport } from '../../../lib/cms/static-pages'
import LocalizedLink from '../../../components/LocalizedLink'

export const metadata = buildPageMetadata({
  title: 'Financial Transparency',
  description: 'How The Ananse Center allocates resources and reports impact to donors and partners.',
  path: '/transparency',
})

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
      <div className="content-prose-body">
        {splitParagraphs(cms['transparency.body']).map((p) => (
          <p key={p.slice(0, 48)} className="page-body-text content-prose-p">
            {p}
          </p>
        ))}
      </div>
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
