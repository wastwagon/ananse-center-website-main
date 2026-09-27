import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchInsightBySlug, fetchInsights, fetchLibraryItems } from '../../../../lib/api'
import ShareBar from '../../../../components/ShareBar'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { resolveNewsCoverImage } from '../../../../lib/images'
import { cmsPlainExcerpt } from '../../../../lib/cms/richtext'

function looksLikeDateLabel(value: string) {
  return /\d/.test(value) && /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i.test(value)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReturnType<typeof buildPageMetadata>> {
  const { slug } = await params
  const post = await fetchInsightBySlug(slug)
  if (!post) {
    return buildPageMetadata({ title: 'Insights', path: `/insights/${slug}` })
  }
  return buildPageMetadata({
    title: post.title,
    description: cmsPlainExcerpt(post.excerpt, 160),
    path: `/insights/${slug}`,
    ogImage: resolveNewsCoverImage(post),
  })
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetchInsightBySlug(slug)
  if (!post) notFound()

  if (post.isExternal && post.href) {
    redirect(post.href)
  }

  const contentType = post.contentType || post.category || 'Articles'
  const typeBrowseHref = `/insights?type=${encodeURIComponent(contentType)}`
  const primaryTopic = post.topics?.[0]
  const [relatedInsights, relatedLibrary] = await Promise.all([
    primaryTopic ? fetchInsights({ topic: primaryTopic }).catch(() => []) : Promise.resolve([]),
    primaryTopic
      ? fetchLibraryItems({ topic: primaryTopic }).catch(() => [])
      : Promise.resolve([]),
  ])
  const moreInsights = relatedInsights.filter((item) => item.slug !== post.slug).slice(0, 6)
  const moreLibrary = relatedLibrary.slice(0, 6)

  const cover = resolveNewsCoverImage(post)
  const dateIsCalendar = Boolean(post.date && looksLikeDateLabel(post.date))
  const heroMeta = [contentType, post.date, post.author].filter(Boolean).join(' · ')

  return (
    <article className="insights-detail">
      <section className="event-detail-hero">
        <Image
          src={cover}
          alt={`${post.title} — insight from ANANSE Center for Leadership Development`}
          fill
          priority
          className="event-detail-hero-image"
          sizes="100vw"
          unoptimized={cover.startsWith('/api/')}
        />
        <div className="event-detail-hero-scrim" aria-hidden />
        <div className="event-detail-hero-content page-section-container">
          <div className="event-detail-hero-inner">
            <div className="insights-detail-hero-badges">
              <span className="section-badge">{contentType}</span>
              {post.featured ? <span className="section-badge">Featured</span> : null}
            </div>
            <h1 className="hero-page-title">{post.title}</h1>
            {post.subtitle ? <p className="page-body-text">{post.subtitle}</p> : null}
            {heroMeta ? (
              <div className="event-detail-meta">
                <span className="event-detail-meta-item">{heroMeta}</span>
              </div>
            ) : null}
            <div className="insights-detail-hero-actions">
              <LocalizedLink href={typeBrowseHref} className="hero-page-btn hero-page-btn--primary">
                Browse {contentType}
              </LocalizedLink>
              <LocalizedLink href="/insights" className="hero-page-btn hero-page-btn--ghost">
                All Insights
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="insights-detail-overview">
            <div className="insights-detail-story">
              <span className="section-badge">{contentType}</span>
              <h2 className="page-section-heading">About this insight</h2>
              {post.excerpt &&
              post.body &&
              cmsPlainExcerpt(post.body) !== cmsPlainExcerpt(post.excerpt) &&
              !cmsPlainExcerpt(post.body).startsWith(cmsPlainExcerpt(post.excerpt)) ? (
                <CmsRichText body={post.excerpt} className="page-body-text insights-detail-lead" />
              ) : null}
              <CmsRichText body={post.body || post.excerpt} className="content-prose-body" />

              {post.topics?.length ? (
                <div className="insights-detail-panel">
                  <h3 className="insights-detail-panel-title">Topics</h3>
                  <div className="insights-detail-topic-grid">
                    {post.topics.map((topic) => (
                      <LocalizedLink
                        key={topic}
                        href={`/insights?topic=${encodeURIComponent(topic)}`}
                        className="insights-detail-topic-chip"
                      >
                        {topic}
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <aside className="insights-detail-aside">
              <div className="insights-detail-aside-card">
                <p className="insights-detail-aside-label">Continue</p>
                <p className="insights-detail-aside-title">{post.title}</p>
                <ul className="insights-detail-glance-list">
                  <li>
                    <strong>Type</strong>
                    <span>{contentType}</span>
                  </li>
                  {post.date ? (
                    <li>
                      <strong>{dateIsCalendar ? 'Published' : 'Series'}</strong>
                      <span>{post.date}</span>
                    </li>
                  ) : null}
                  {post.author ? (
                    <li>
                      <strong>Author</strong>
                      <span>
                        {post.authorPerson ? (
                          <LocalizedLink href={`/people/${post.authorPerson.slug}`}>{post.author}</LocalizedLink>
                        ) : (
                          post.author
                        )}
                      </span>
                    </li>
                  ) : null}
                  {post.program ? (
                    <li>
                      <strong>Program</strong>
                      <span>
                        <LocalizedLink href={`/programs/${post.program.slug}`}>{post.program.title}</LocalizedLink>
                      </span>
                    </li>
                  ) : null}
                </ul>
                <LocalizedLink href={typeBrowseHref} className="btn-primary insights-detail-aside-cta">
                  Browse {contentType}
                </LocalizedLink>
                <LocalizedLink href="/insights" className="btn-outline insights-detail-aside-secondary">
                  All Insights
                </LocalizedLink>
                <LocalizedLink
                  href="/library?shelf=read"
                  className="btn-outline insights-detail-aside-secondary"
                >
                  Library reading
                </LocalizedLink>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {moreInsights.length > 0 || moreLibrary.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            {moreInsights.length > 0 ? (
              <div className="insights-detail-related-block">
                <div className="insights-section-intro">
                  <span className="section-badge">More insights</span>
                  <h2 className="page-section-heading">
                    {primaryTopic ? `More on ${primaryTopic}` : 'Related insights'}
                  </h2>
                </div>
                <div className="insights-detail-link-grid">
                  {moreInsights.map((item) => (
                    <LocalizedLink
                      key={item.slug}
                      href={item.href || `/insights/${item.slug}`}
                      className="insights-detail-link-card"
                    >
                      <span className="insights-detail-link-title">{item.title}</span>
                      <span className="insights-detail-link-meta">
                        {[item.contentType, item.date].filter(Boolean).join(' · ')}
                      </span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}

            {moreLibrary.length > 0 ? (
              <div className="insights-detail-related-block">
                <div className="insights-section-intro">
                  <span className="section-badge">Library</span>
                  <h2 className="page-section-heading">Related reading</h2>
                  <p className="page-body-text">
                    Resources from the Library connected to the same topic.
                  </p>
                </div>
                <div className="insights-detail-link-grid">
                  {moreLibrary.map((item) => (
                    <LocalizedLink
                      key={item.id}
                      href={item.href || `/library/${item.slug}`}
                      className="insights-detail-link-card"
                    >
                      <span className="insights-detail-link-title">{item.title}</span>
                      {item.collection ? (
                        <span className="insights-detail-link-meta">{item.collection}</span>
                      ) : null}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}

            <ShareBar title={post.title} path={`/insights/${post.slug}`} />
            <div className="insights-detail-footer-actions">
              <LocalizedLink href="/insights" className="btn-primary">
                All Insights
              </LocalizedLink>
              <LocalizedLink href="/library" className="btn-outline">
                Visit the Library
              </LocalizedLink>
            </div>
          </div>
        </section>
      ) : (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <ShareBar title={post.title} path={`/insights/${post.slug}`} />
            <div className="insights-detail-footer-actions">
              <LocalizedLink href="/insights" className="btn-primary">
                All Insights
              </LocalizedLink>
              <LocalizedLink href="/library" className="btn-outline">
                Visit the Library
              </LocalizedLink>
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
