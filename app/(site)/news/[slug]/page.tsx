import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import { fetchNewsPostBySlug } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { splitParagraphs } from '../../../../lib/cms/content'

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
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetchNewsPostBySlug(slug)
  if (!post) notFound()

  const paragraphs = splitParagraphs(post.body || post.excerpt)

  return (
    <article className="content-page">
      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <LocalizedLink href="/news" className="program-card-link">
            ← News & updates
          </LocalizedLink>
          {post.date ? (
            <p className="insight-card-tag" style={{ marginTop: '1rem' }}>
              {post.date}
            </p>
          ) : null}
          <h1 className="content-page-title">{post.title}</h1>
          {paragraphs.map((para) => (
            <p key={para.slice(0, 40)} className="page-body-text text-body-md">
              {para}
            </p>
          ))}
        </div>
      </section>
    </article>
  )
}
