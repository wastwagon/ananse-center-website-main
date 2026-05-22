import CmsPageShell from '../../../components/CmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson, splitParagraphs } from '../../../lib/cms/content'
import { DEFAULT_ARCHIVE_ITEMS, type CmsArchiveItem } from '../../../lib/cms/static-pages'

export const metadata = buildPageMetadata({
  title: 'Digital Archives',
  description:
    'Digitized cultural heritage with community-centered metadata at The Ananse Center.',
  path: '/archives',
})

export default async function ArchivesPage() {
  const cms = await getCmsTexts([
    'archives.badge',
    'archives.heading',
    'archives.lead',
    'archives.body',
    'archives.items',
  ] as const)
  const items = parseCmsJson<CmsArchiveItem[]>(cms['archives.items'], DEFAULT_ARCHIVE_ITEMS)

  return (
    <CmsPageShell
      badge={cms['archives.badge']}
      title={cms['archives.heading']}
      lead={cms['archives.lead']}
      primaryCta={{ label: 'Research inquiry', href: '/contact#form' }}
      secondaryCta={{ label: 'Explore programs', href: '/programs' }}
    >
      <div className="content-prose-body">
        {splitParagraphs(cms['archives.body']).map((p) => (
          <p key={p.slice(0, 48)} className="page-body-text content-prose-p">
            {p}
          </p>
        ))}
      </div>
      <div className="grid-cards grid-cards--stack-narrow">
        {items.map((item) => (
          <article key={item.title} className="premium-card">
            <span className="insight-card-tag">
              {item.culture} · {item.era}
            </span>
            <h3 className="premium-card-title">{item.title}</h3>
            <p className="premium-card-description">{item.description}</p>
            <p className="page-body-text text-body-sm">
              <strong>Rights:</strong> {item.rightsNote}
            </p>
          </article>
        ))}
      </div>
    </CmsPageShell>
  )
}
