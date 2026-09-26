import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../../components/LocalizedLink'
import CmsRichText from '../../../../../components/CmsRichText'
import { fetchPhotoAlbumBySlug } from '../../../../../lib/api'
import { buildPageMetadata } from '../../../../../lib/page-meta'
import { cardImageSizes, resolvePhotoAlbumCover } from '../../../../../lib/images'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReturnType<typeof buildPageMetadata>> {
  const { slug } = await params
  const album = await fetchPhotoAlbumBySlug(slug)
  if (!album) {
    return buildPageMetadata({ title: 'Photo galleries', path: `/library/photos/${slug}` })
  }
  return buildPageMetadata({
    title: album.title,
    description: album.description,
    path: `/library/photos/${album.slug}`,
    ogImage: resolvePhotoAlbumCover(album),
  })
}

export default async function PhotoAlbumDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const album = await fetchPhotoAlbumBySlug(slug)
  if (!album) notFound()

  const cover = resolvePhotoAlbumCover(album)
  const meta = [album.collection, album.dateLabel, album.place].filter(Boolean).join(' · ')

  return (
    <article className="content-page">
      <section className="event-detail-hero">
        <Image
          src={cover}
          alt={album.title}
          fill
          priority
          className="event-detail-hero-image"
          sizes="100vw"
          unoptimized={cover.startsWith('/api/')}
        />
        <div className="event-detail-hero-scrim" aria-hidden />
        <div className="event-detail-hero-content page-section-container">
          <div className="event-detail-hero-inner">
            <span className="section-badge">{album.collection}</span>
            <h1 className="hero-page-title">{album.title}</h1>
            {meta ? (
              <div className="event-detail-meta">
                <span className="event-detail-meta-item">{meta}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <LocalizedLink href="/library/photos" className="program-card-link">
            ← Photo galleries
          </LocalizedLink>

          {album.description ? (
            <CmsRichText body={album.description} className="content-prose-body" />
          ) : null}

          {album.program ? (
            <p className="page-body-text">
              Related program:{' '}
              <LocalizedLink href={`/programs/${album.program.slug}`} className="content-cta-link">
                {album.program.title}
              </LocalizedLink>
            </p>
          ) : null}

          {album.event ? (
            <p className="page-body-text">
              Related event:{' '}
              <LocalizedLink href={`/events/${album.event.slug}`} className="content-cta-link">
                {album.event.title}
              </LocalizedLink>
            </p>
          ) : null}

          {album.images.length === 0 ? (
            <p className="page-body-text" style={{ marginTop: '1.5rem' }}>
              Photos for this album will appear here when they are published.
            </p>
          ) : (
            <div
              className="grid-cards"
              style={{ marginTop: '2rem', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
            >
              {album.images.map((image) => (
                <figure key={image.id} className="premium-card p-0 overflow-hidden">
                  <div className="premium-card-image-wrapper" style={{ position: 'relative', minHeight: '200px' }}>
                    <Image
                      src={image.url}
                      alt={image.caption || album.title}
                      fill
                      className="object-cover"
                      sizes={cardImageSizes}
                      unoptimized={image.url.startsWith('/api/')}
                    />
                  </div>
                  {image.caption ? (
                    <figcaption className="page-body-text text-body-sm p-4">{image.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </article>
  )
}
