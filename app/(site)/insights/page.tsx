import HeroSplit from '../../../components/HeroSplit'
import { fetchInsights } from '../../../lib/api'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images, resolveNewsCoverImage } from '../../../lib/images'
import { HOME_INSIGHTS, INSIGHTS_EMPTY } from '../../../lib/leadership/copy'
import InsightsListingClient from './InsightsListingClient'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Insights',
    description:
      'ANANSE Insights gathers writing by topic — articles, essays, reflections, and perspectives on leadership, character, and service.',
    path: '/insights',
    ogImage: images.hero.videos,
  })
}

export default async function InsightsPage() {
  const posts = await fetchInsights()

  const items = posts.map((post, index) => ({
    key: post.id,
    date: post.date,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author || '',
    contentType: post.contentType || post.category || 'Articles',
    topics: post.topics ?? [],
    featured: Boolean(post.featured),
    href: post.isExternal ? post.href : `/insights/${post.slug}`,
    external: post.isExternal,
    cover: resolveNewsCoverImage(post, index),
  }))

  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.videos}
        imageAlt="ANANSE Insights"
        title={
          <>
            ANANSE <span className="text-accent">Insights</span>
          </>
        }
        description={HOME_INSIGHTS.kicker}
        primaryCta={{ label: 'Visit the Library', href: '/library' }}
        secondaryCta={{ label: 'Explore programs', href: '/programs' }}
        stats={[]}
      />
      <section className="page-section section-reveal bg-white py-16">
        <div className="page-section-container page-section-narrow">
          {HOME_INSIGHTS.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          {HOME_INSIGHTS.closing ? (
            <p className="page-body-text">{HOME_INSIGHTS.closing}</p>
          ) : null}
        </div>
      </section>
      <section className="page-section section-reveal bg-slate-50 py-16">
        <div className="page-section-container">
          <InsightsListingClient
            readMore="Read insight"
            empty={INSIGHTS_EMPTY}
            items={items}
          />
        </div>
      </section>
    </div>
  )
}
