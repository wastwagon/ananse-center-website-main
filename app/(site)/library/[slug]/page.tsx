import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchLibraryItemBySlug } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { resolveLibraryCoverImage } from '../../../../lib/images'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReturnType<typeof buildPageMetadata>> {
  const { slug } = await params
  const item = await fetchLibraryItemBySlug(slug)
  if (!item) {
    return buildPageMetadata({ title: 'Library', path: `/library/${slug}` })
  }
  return buildPageMetadata({
    title: item.title,
    description: item.description,
    path: `/library/${item.slug}`,
    ogImage: resolveLibraryCoverImage(item),
  })
}

export default async function LibraryItemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await fetchLibraryItemBySlug(slug)
  if (!item) notFound()

  const cover = resolveLibraryCoverImage(item)
  const hasCover = Boolean(item.coverImageUrl)
  const metaParts = [
    item.collection,
    item.dateLabel,
    item.episodeNumber != null ? `Episode ${item.episodeNumber}` : '',
    item.scriptureTheme,
  ].filter(Boolean)

  return (
    <article className="content-page">
      {hasCover ? (
        <section className="event-detail-hero">
          <Image
            src={cover}
            alt={item.title}
            fill
            priority
            className="event-detail-hero-image"
            sizes="100vw"
            unoptimized={cover.startsWith('/api/')}
          />
          <div className="event-detail-hero-scrim" aria-hidden />
          <div className="event-detail-hero-content page-section-container">
            <div className="event-detail-hero-inner">
              <span className="section-badge">{item.shelf} · {item.collection}</span>
              <h1 className="hero-page-title">{item.title}</h1>
              {metaParts.length ? (
                <div className="event-detail-meta">
                  <span className="event-detail-meta-item">{metaParts.join(' · ')}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <LocalizedLink href="/library" className="program-card-link">
            ← The Library
          </LocalizedLink>

          {!hasCover ? (
            <>
              {metaParts.length ? (
                <p className="insight-card-tag" style={{ marginTop: '1rem' }}>
                  {metaParts.join(' · ')}
                </p>
              ) : null}
              <h1 className="content-page-title">{item.title}</h1>
            </>
          ) : (
            <div style={{ height: '1rem' }} />
          )}

          {item.description ? <p className="page-body-text">{item.description}</p> : null}

          {item.audioUrl ? (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 className="page-subsection-heading">Listen</h2>
              <audio controls preload="none" src={item.audioUrl} className="w-full max-w-xl">
                Your browser does not support audio playback.
              </audio>
            </div>
          ) : null}

          {item.videoUrl ? (
            <div style={{ margin: '1.5rem 0' }}>
              <h2 className="page-subsection-heading">Watch</h2>
              <video controls preload="metadata" src={item.videoUrl} className="w-full max-w-3xl rounded-lg">
                Your browser does not support video playback.
              </video>
            </div>
          ) : null}

          {item.body ? <CmsRichText body={item.body} className="content-prose-body" /> : null}

          {item.transcript ? (
            <>
              <h2 className="page-subsection-heading">Transcript</h2>
              <CmsRichText body={item.transcript} className="content-prose-body" />
            </>
          ) : null}

          {item.wisdomNugget ? (
            <>
              <h2 className="page-subsection-heading">Wisdom nugget</h2>
              <CmsRichText body={item.wisdomNugget} className="content-prose-body" />
            </>
          ) : null}

          {item.furtherStudy ? (
            <>
              <h2 className="page-subsection-heading">Further study</h2>
              <CmsRichText body={item.furtherStudy} className="content-prose-body" />
            </>
          ) : null}

          {item.program ? (
            <p className="page-body-text" style={{ marginTop: '1.5rem' }}>
              Related program:{' '}
              <LocalizedLink href={`/programs/${item.program.slug}`} className="content-cta-link">
                {item.program.title}
              </LocalizedLink>
            </p>
          ) : null}

          {item.person ? (
            <p className="page-body-text">
              Speaker:{' '}
              <LocalizedLink href={`/people/${item.person.slug}`} className="content-cta-link">
                {item.person.name}
              </LocalizedLink>
            </p>
          ) : null}
        </div>
      </section>
    </article>
  )
}
