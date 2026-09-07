import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_CSO_DIRECTORY, type CmsCsoEntry } from '../../../lib/cms/static-pages'

export async function generateMetadata() {
  return buildCmsMetadata('resources')
}

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
      wide
    >
      <div className="directory-grid">
        {entries.map((entry) => (
          <article key={entry.name} className="directory-card">
            <div className="directory-card-bar" aria-hidden />
            <div className="directory-card-body">
              <h3 className="directory-card-title">{entry.name}</h3>
              <p className="directory-card-region">{entry.region}</p>
              <p className="directory-card-focus">{entry.focus}</p>
              {entry.website ? (
                <a href={entry.website} className="directory-card-link" target="_blank" rel="noopener noreferrer">
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
