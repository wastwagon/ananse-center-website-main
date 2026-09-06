import LocalizedCmsPageShell from '../../../components/LocalizedCmsPageShell'
import { buildCmsMetadata } from '../../../lib/cms/seo'
import { getCmsTexts, parseCmsJson, type CmsHeroCta } from '../../../lib/cms/content'
import { DEFAULT_NEWS, type CmsNewsItem } from '../../../lib/cms/static-pages'
import { fetchNewsPosts } from '../../../lib/api'
import { resolveNewsCoverImage } from '../../../lib/images'
import NewsListingClient from './NewsListingClient'

export async function generateMetadata() {
  return buildCmsMetadata('news')
}

export default async function NewsPage() {
  const cms = await getCmsTexts([
    'news.badge',
    'news.heading',
    'news.lead',
    'news.items',
    'news.readMore',
    'news.empty',
    'news.cta.primary',
    'news.cta.secondary',
  ] as const)
  const dbPosts = await fetchNewsPosts()
  const cmsItems = parseCmsJson<CmsNewsItem[]>(cms['news.items'], DEFAULT_NEWS)
  const primaryCta = parseCmsJson<CmsHeroCta>(cms['news.cta.primary'], {
    label: 'Subscribe',
    href: '/events#newsletter',
  })
  const secondaryCta = parseCmsJson<CmsHeroCta>(cms['news.cta.secondary'], {
    label: 'Community spotlight',
    href: '/community',
  })

  const items =
    dbPosts.length > 0
      ? dbPosts.map((post, index) => ({
          key: post.id,
          date: post.date,
          title: post.title,
          excerpt: post.excerpt,
          author: post.author || '',
          category: post.category || 'News',
          featured: Boolean(post.featured),
          href: post.isExternal ? post.href : `/news/${post.slug}`,
          external: post.isExternal,
          cover: resolveNewsCoverImage(post, index),
        }))
      : cmsItems.map((item, index) => ({
          key: item.title,
          date: item.date,
          title: item.title,
          excerpt: item.excerpt,
          author: '',
          category: 'News',
          featured: index === 0,
          href: item.href ?? '',
          external: Boolean(item.href?.startsWith('http')),
          cover: resolveNewsCoverImage({}, index),
        }))

  return (
    <LocalizedCmsPageShell
      i18nKey="page.news"
      badge={cms['news.badge']}
      title={cms['news.heading']}
      lead={cms['news.lead']}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
    >
      <NewsListingClient
        readMore={cms['news.readMore'] || 'Read more'}
        empty={cms['news.empty']}
        items={items}
      />
    </LocalizedCmsPageShell>
  )
}
