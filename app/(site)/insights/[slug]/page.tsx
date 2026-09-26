import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchInsightBySlug } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { resolveNewsCoverImage } from '../../../../lib/images'

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
    description: post.excerpt,
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

  const cover = resolveNewsCoverImage(post)
  const hasCover = Boolean(post.coverImageUrl)
  const metaLine = [post.contentType, post.date, post.author].filter(Boolean).join(' · ')

  return (
    <article className="content-page">
      {hasCover ? (
        <section className="event-detail-hero">
          <Image
            src={cover}
            alt={post.title}
            fill
            priority
            className="event-detail-hero-image"
            sizes="100vw"
            unoptimized={cover.startsWith('/api/')}
          />
          <div className="event-detail-hero-scrim" aria-hidden />
          <div className="event-detail-hero-content page-section-container">
            <div className="event-detail-hero-inner">
              {post.contentType ? <span className="section-badge">{post.contentType}</span> : null}
              <h1 className="hero-page-title">{post.title}</h1>
              {metaLine ? (
                <div className="event-detail-meta">
                  <span className="event-detail-meta-item">{metaLine}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <LocalizedLink href="/insights" className="program-card-link">
            ← ANANSE Insights
          </LocalizedLink>
          {!hasCover ? (
            <>
              {metaLine ? (
                <p className="insight-card-tag" style={{ marginTop: '1rem' }}>
                  {metaLine}
                </p>
              ) : null}
              <h1 className="content-page-title">{post.title}</h1>
            </>
          ) : (
            <div style={{ height: '1rem' }} />
          )}
          {post.topics?.length ? (
            <ul className="about-focus-list" style={{ marginBottom: '1.5rem' }}>
              {post.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          ) : null}
          <CmsRichText body={post.body || post.excerpt} className="content-prose-body" />
        </div>
      </section>
    </article>
  )
}
