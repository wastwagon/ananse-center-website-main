import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../../components/LocalizedLink'
import ShareBar from '../../../../../components/ShareBar'
import CmsRichText from '../../../../../components/CmsRichText'
import CardCover from '../../../../../components/CardCover'
import { fetchPhotoAlbumBySlug } from '../../../../../lib/api'
import { buildPageMetadata } from '../../../../../lib/page-meta'
import { resolvePhotoAlbumCover } from '../../../../../lib/images'
import { cmsPlainExcerpt } from '../../../../../lib/cms/richtext'

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
    description: cmsPlainExcerpt(album.description, 160),
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
    <article className="library-detail">
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
            <span className="section-badge">{album.collection || 'Photo gallery'}</span>
            <h1 className="hero-page-title">{album.title}</h1>
            {meta ? (
              <div className="event-detail-meta">
                <span className="event-detail-meta-item">{meta}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="library-detail-overview">
            <div className="library-detail-story">
              <LocalizedLink href="/library/photos" className="library-back-link">
                ← Photo galleries
              </LocalizedLink>
              <h2 className="page-section-heading">About this gallery</h2>
              {album.description ? (
                <CmsRichText body={album.description} className="content-prose-body" />
              ) : (
                <p className="page-body-text">
                  Photographs from ANANSE gatherings, learning, and community life.
                </p>
              )}

              {album.images.length === 0 ? (
                <p className="page-body-text library-photo-empty">
                  Photos for this album will appear here when they are published.
                </p>
              ) : (
                <div className="library-photo-grid">
                  {album.images.map((image) => (
                    <figure key={image.id} className="library-photo-card">
                      <div className="library-photo-media">
                        <CardCover src={image.url} alt={image.caption || album.title} />
                      </div>
                      {image.caption ? (
                        <figcaption className="library-photo-caption">{image.caption}</figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              )}
            </div>

            <aside className="library-detail-aside">
              <div className="library-detail-aside-card">
                <p className="library-detail-aside-label">Gallery</p>
                <p className="library-detail-aside-title">{album.title}</p>
                <p className="library-detail-aside-copy">
                  {meta || 'ANANSE photo gallery'}
                  {album.images.length > 0
                    ? ` · ${album.images.length} photo${album.images.length === 1 ? '' : 's'}`
                    : ''}
                </p>
                <LocalizedLink href="/library/photos" className="btn-primary library-detail-aside-cta">
                  All galleries
                </LocalizedLink>
                <LocalizedLink href="/library" className="btn-outline library-detail-aside-secondary">
                  The Library
                </LocalizedLink>
                <ShareBar title={album.title} path={`/library/photos/${album.slug}`} />
              </div>
              {(album.program || album.event) && (
                <div className="library-detail-aside-card library-detail-aside-card--muted">
                  <p className="library-detail-aside-label">Connected to</p>
                  <ul className="library-detail-glance-list">
                    {album.program ? (
                      <li>
                        <LocalizedLink href={`/programs/${album.program.slug}`}>
                          {album.program.title}
                        </LocalizedLink>
                      </li>
                    ) : null}
                    {album.event ? (
                      <li>
                        <LocalizedLink href={`/events/${album.event.slug}`}>
                          {album.event.title}
                        </LocalizedLink>
                      </li>
                    ) : null}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </article>
  )
}
