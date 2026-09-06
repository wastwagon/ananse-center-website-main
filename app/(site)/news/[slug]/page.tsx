import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchNewsPostBySlug } from '../../../../lib/api'
import { getCmsTexts } from '../../../../lib/cms/content'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { resolveNewsCoverImage } from '../../../../lib/images'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReturnType<typeof buildPageMetadata>> {
  const { slug } = await params
  const post = await fetchNewsPostBySlug(slug)
  if (!post) {
    return buildPageMetadata({ title: 'News', path: `/news/${slug}` })
  }
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${slug}`,
    ogImage: resolveNewsCoverImage(post),
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, cms] = await Promise.all([
    fetchNewsPostBySlug(slug),
    getCmsTexts(['news.backLink'] as const),
  ])
  if (!post) notFound()

  const cover = resolveNewsCoverImage(post)
  const hasCover = Boolean(post.coverImageUrl)

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
              {post.category ? <span className="section-badge">{post.category}</span> : null}
              <h1 className="hero-page-title">{post.title}</h1>
              <div className="event-detail-meta">
                {post.date ? <span className="event-detail-meta-item">{post.date}</span> : null}
                {post.author ? <span className="event-detail-meta-item">{post.author}</span> : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <LocalizedLink href="/news" className="program-card-link">
            {cms['news.backLink'] || '← News & updates'}
          </LocalizedLink>
          {!hasCover ? (
            <>
              {post.date || post.author || post.category ? (
                <p className="insight-card-tag" style={{ marginTop: '1rem' }}>
                  {[post.category, post.date, post.author].filter(Boolean).join(' · ')}
                </p>
              ) : null}
              <h1 className="content-page-title">{post.title}</h1>
            </>
          ) : (
            <div style={{ height: '1rem' }} />
          )}
          <CmsRichText body={post.body || post.excerpt} className="content-prose-body" />
        </div>
      </section>
    </article>
  )
}
