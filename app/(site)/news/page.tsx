import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import LocalizedLink from '../../../components/LocalizedLink'
import { buildPageMetadata } from '../../../lib/page-meta'
import { getCmsTexts, parseCmsJson } from '../../../lib/cms/content'
import { DEFAULT_NEWS, type CmsNewsItem } from '../../../lib/cms/static-pages'

export const metadata = buildPageMetadata({
  title: 'News & Updates',
  description: 'News, partnerships, and announcements from The Ananse Center.',
  path: '/news',
})

export default async function NewsPage() {
  const cms = await getCmsTexts(['news.badge', 'news.heading', 'news.lead', 'news.items'] as const)
  const items = parseCmsJson<CmsNewsItem[]>(cms['news.items'], DEFAULT_NEWS)

  return (
    <LocalizedCmsPageShell
      i18nKey="page.news"
      badge={cms['news.badge']}
      title={cms['news.heading']}
      lead={cms['news.lead']}
      primaryCta={{ label: 'Subscribe', href: '/events#newsletter' }}
      secondaryCta={{ label: 'Community spotlight', href: '/community' }}
    >
      <ul className="content-highlight-list">
        {items.map((item) => (
          <li key={item.title} className="content-highlight-item">
            <span className="content-highlight-mark" aria-hidden>
              {item.date}
            </span>
            <div>
              <h3 className="premium-card-title" style={{ marginBottom: '0.35rem' }}>
                {item.title}
              </h3>
              <p className="page-body-text text-body-md">{item.excerpt}</p>
              {item.href ? (
                <LocalizedLink href={item.href} className="program-card-link">
                  Read more →
                </LocalizedLink>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </LocalizedCmsPageShell>
  )
}
