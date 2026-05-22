import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson, splitParagraphs } from '../../../lib/cms/content'
import { DEFAULT_ARCHIVE_ITEMS, type CmsArchiveItem } from '../../../lib/cms/static-pages'
import { fetchArchiveRecords, type ApiArchiveRecord } from '../../../lib/api'

export const metadata = buildPageMetadata({
  title: 'Digital Archives',
  description:
    'Digitized cultural heritage with community-centered metadata at The Ananse Center.',
  path: '/archives',
})

function ArchiveGrid({ items }: { items: ApiArchiveRecord[] }) {
  return (
    <div className="grid-cards grid-cards--stack-narrow">
      {items.map((item) => (
        <article key={item.id ?? item.title} className="premium-card">
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
  )
}

export default async function ArchivesPage() {
  const cms = await getCmsTexts([
    'archives.badge',
    'archives.heading',
    'archives.lead',
    'archives.body',
    'archives.items',
  ] as const)

  const dbItems = await fetchArchiveRecords()
  const fallback = parseCmsJson<CmsArchiveItem[]>(cms['archives.items'], DEFAULT_ARCHIVE_ITEMS)
  const items: ApiArchiveRecord[] =
    dbItems.length > 0
      ? dbItems
      : fallback.map((item, index) => ({
          id: `cms-${index}`,
          title: item.title,
          culture: item.culture,
          era: item.era,
          description: item.description,
          rightsNote: item.rightsNote,
          tags: [],
        }))

  return (
    <LocalizedCmsPageShell
      i18nKey="page.archives"
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
      <ArchiveGrid items={items} />
    </LocalizedCmsPageShell>
  )
}
