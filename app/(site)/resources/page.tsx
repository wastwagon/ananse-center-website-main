import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_CSO_DIRECTORY, type CmsCsoEntry } from '../../../lib/cms/static-pages'

export const metadata = buildPageMetadata({
  title: 'CSO & Partner Directory',
  description:
    'Civil society and development partners in Ghana’s Central Region — a regional resource hub.',
  path: '/resources',
})

export default async function ResourcesPage() {
  const cms = await getCmsTexts([
    'resources.badge',
    'resources.heading',
    'resources.lead',
    'resources.entries',
  ] as const)
  const entries = parseCmsJson<CmsCsoEntry[]>(cms['resources.entries'], DEFAULT_CSO_DIRECTORY)

  return (
    <LocalizedCmsPageShell
      i18nKey="page.resources"
      badge={cms['resources.badge']}
      title={cms['resources.heading']}
      lead={cms['resources.lead']}
      primaryCta={{ label: 'List your organization', href: '/contact#form' }}
      secondaryCta={{ label: 'About our mission', href: '/about' }}
    >
      <div className="grid-cards grid-cards--stack-narrow">
        {entries.map((entry) => (
          <article key={entry.name} className="insight-card">
            <div className="insight-card-bar" />
            <div className="insight-card-body">
              <h3 className="insight-card-title">{entry.name}</h3>
              <p className="insight-card-date">{entry.region}</p>
              <p className="insight-card-description">{entry.focus}</p>
              {entry.website ? (
                <a href={entry.website} className="program-card-link" target="_blank" rel="noopener noreferrer">
                  Visit website →
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </LocalizedCmsPageShell>
  )
}
