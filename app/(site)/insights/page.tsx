import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import { fetchInsights } from '../../../lib/api'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images, resolveNewsCoverImage } from '../../../lib/images'
import { HOME_INSIGHTS, INSIGHT_TOPICS_INTRO, INSIGHTS_EMPTY } from '../../../lib/leadership/copy'
import InsightsListingClient from './InsightsListingClient'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; topic?: string }>
}) {
  const { type, topic } = await searchParams
  const topicLabel = topic?.trim()
  const typeLabel = type?.trim()
  const title = topicLabel
    ? `${topicLabel} | Insights`
    : typeLabel
      ? `${typeLabel} | Insights`
      : 'Insights'
  const description = topicLabel
    ? `ANANSE Insights on ${topicLabel}.`
    : typeLabel
      ? `${typeLabel} from ANANSE Insights — writing on leadership, character, and service.`
      : 'ANANSE Insights gathers writing by topic — articles, essays, reflections, and perspectives on leadership, character, and service.'
  const path = topicLabel
    ? `/insights?topic=${encodeURIComponent(topicLabel)}`
    : typeLabel
      ? `/insights?type=${encodeURIComponent(typeLabel)}`
      : '/insights'
  return buildPageMetadata({
    title,
    description,
    path,
    ogImage: images.hero.videos,
  })
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; topic?: string }>
}) {
  const { type, topic } = await searchParams
  const posts = await fetchInsights()
  const activeTopic = topic?.trim() || ''

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
    <div className="insights-page">
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

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="insights-intro">
            <article className="insights-intro-card">
              <span className="section-badge">Insights</span>
              <h2 className="page-section-heading">{HOME_INSIGHTS.heading}</h2>
              <p className="insights-intro-tagline">{HOME_INSIGHTS.closing}</p>
              <p className="page-body-text">{HOME_INSIGHTS.paragraphs[0]}</p>
              <p className="page-body-text">{HOME_INSIGHTS.paragraphs[1]}</p>
              <p className="page-body-text insights-intro-note">{HOME_INSIGHTS.paragraphs[2]}</p>
            </article>
            <div className="insights-gateway-grid">
              {INSIGHT_TOPICS_INTRO.map((topicCard) => (
                <LocalizedLink
                  key={topicCard.title}
                  href={`/insights?topic=${encodeURIComponent(topicCard.title)}`}
                  className={`insights-gateway-card${activeTopic === topicCard.title ? ' insights-gateway-card--active' : ''}`}
                >
                  <span className="insights-gateway-kicker">Topic</span>
                  <span className="insights-gateway-title">{topicCard.title}</span>
                  <span className="insights-gateway-body">{topicCard.body}</span>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <InsightsListingClient
            readMore="Read insight"
            empty={INSIGHTS_EMPTY}
            items={items}
            initialType={type}
            initialTopic={topic}
          />
        </div>
      </section>
    </div>
  )
}
