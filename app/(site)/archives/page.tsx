import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import CmsRichText from '../../../components/CmsRichText'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_ARCHIVE_ITEMS, type CmsArchiveItem } from '../../../lib/cms/static-pages'
import ArchivesExplorer from '../../../components/ArchivesExplorer'
import { fetchArchiveRecords, type ApiArchiveRecord } from '../../../lib/api'

export async function generateMetadata() {
  return buildCmsMetadata('archives')
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
      <CmsRichText body={cms['archives.body']} className="content-prose-body" />
      <ArchivesExplorer items={items} />
    </LocalizedCmsPageShell>
  )
}
