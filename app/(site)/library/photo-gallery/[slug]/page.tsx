import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../../components/LocalizedLink'
import ShareBar from '../../../../../components/ShareBar'
import CmsRichText from '../../../../../components/CmsRichText'
import CardCover from '../../../../../components/CardCover'
import {
  fetchEvents,
  fetchEventsForProgram,
  fetchInsights,
  fetchLibraryItems,
  fetchPhotoAlbumBySlug,
  fetchPhotoAlbums,
} from '../../../../../lib/api'
import { buildPageMetadata } from '../../../../../lib/page-meta'
import { resolvePhotoAlbumCover } from '../../../../../lib/images'
import { cmsPlainExcerpt } from '../../../../../lib/cms/richtext'
import { applyRelatedItems } from '../../../../../lib/related-overrides'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReturnType<typeof buildPageMetadata>> {
  const { slug } = await params
  const album = await fetchPhotoAlbumBySlug(slug)
  if (!album) {
    return buildPageMetadata({ title: 'Photo galleries', path: `/library/photo-gallery/${slug}` })
  }
  return buildPageMetadata({
    title: album.seoTitle?.trim() || album.title,
    description: album.seoDescription?.trim() || cmsPlainExcerpt(album.description, 160),
    path: `/library/photo-gallery/${album.slug}`,
    ogImage: album.shareImageUrl || resolvePhotoAlbumCover(album),
    noindex: album.noindex,
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

  const [albumsRaw, libraryRaw, insightRows, eventsRaw] = await Promise.all([
    fetchPhotoAlbums(
      album.program?.slug
        ? { program: album.program.slug }
        : album.collection
          ? { collection: album.collection }
          : undefined,
    ).catch(() => []),
    album.program?.slug
      ? fetchLibraryItems({ program: album.program.slug }).catch(() => [])
      : album.event?.slug
        ? fetchLibraryItems({ event: album.event.slug }).catch(() => [])
        : Promise.resolve([]),
    album.program?.slug || album.event?.slug ? fetchInsights().catch(() => []) : Promise.resolve([]),
    album.program?.slug
      ? fetchEventsForProgram(album.program.slug).catch(() => [])
      : album.event?.slug
        ? fetchEvents().catch(() => []).then((rows) => rows.filter((row) => row.slug === album.event?.slug))
        : Promise.resolve([]),
  ])
  const pinned = album.relatedPinned
  const hidden = album.relatedHidden
  const relatedAlbums = applyRelatedItems(
    albumsRaw.filter((item) => item.slug !== album.slug),
    pinned?.albums,
    hidden?.albums,
  )
  const relatedLibrary = applyRelatedItems(libraryRaw, pinned?.library, hidden?.library)
  const relatedInsights = applyRelatedItems(
    insightRows.filter((row) =>
      album.program?.slug ? row.program?.slug === album.program.slug : false,
    ),
    pinned?.insights,
    hidden?.insights,
    insightRows,
  )
  const relatedEvents = applyRelatedItems(eventsRaw, pinned?.events, hidden?.events)

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
              <LocalizedLink href="/library/photo-gallery" className="library-back-link">
                ← Photo galleries
              </LocalizedLink>
              <h2 className="page-section-heading">About this gallery</h2>
              {album.description?.trim() ? (
                <CmsRichText body={album.description} className="content-prose-body" />
              ) : null}

              {album.images.length === 0 ? null : (
                <div className="library-photo-grid">
                  {album.images.map((image) => (
                    <figure key={image.id} className="library-photo-card">
                      <div className="library-photo-media">
                        <CardCover src={image.url} alt={image.alt || image.caption || album.title} />
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
                  {[meta, album.photographer?.trim() ? `Photographs: ${album.photographer}` : '']
                    .filter(Boolean)
                    .join(' · ') || 'ANANSE photo gallery'}
                  {album.rightsNote?.trim() ? ` · ${album.rightsNote}` : ''}
                  {album.images.length > 0
                    ? ` · ${album.images.length} photo${album.images.length === 1 ? '' : 's'}`
                    : ''}
                </p>
                <LocalizedLink href="/library/photo-gallery" className="btn-primary library-detail-aside-cta">
                  All galleries
                </LocalizedLink>
                <LocalizedLink href="/library" className="btn-outline library-detail-aside-secondary">
                  The Library
                </LocalizedLink>
                <ShareBar title={album.title} path={`/library/photo-gallery/${album.slug}`} />
              </div>
              {(album.program || album.event || (album.people && album.people.length > 0)) && (
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
                    {(album.people ?? []).map((person) => (
                      <li key={person.id}>
                        <LocalizedLink href={`/people/${person.slug}`}>{person.name}</LocalizedLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {relatedAlbums.length > 0 ||
      relatedLibrary.length > 0 ||
      relatedInsights.length > 0 ||
      relatedEvents.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            {relatedAlbums.length > 0 ? (
              <div className="library-detail-related-block">
                <div className="library-section-intro">
                  <span className="section-badge">More galleries</span>
                  <h2 className="page-section-heading">Related albums</h2>
                </div>
                <div className="library-detail-link-grid">
                  {relatedAlbums.map((item) => (
                    <LocalizedLink
                      key={item.id}
                      href={`/library/photo-gallery/${item.slug}`}
                      className="library-detail-link-card"
                    >
                      <span className="library-detail-link-title">{item.title}</span>
                      {item.collection ? (
                        <span className="library-detail-link-meta">{item.collection}</span>
                      ) : null}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
            {relatedLibrary.length > 0 ? (
              <div className="library-detail-related-block">
                <div className="library-section-intro">
                  <span className="section-badge">Library</span>
                  <h2 className="page-section-heading">Related library records</h2>
                </div>
                <div className="library-detail-link-grid">
                  {relatedLibrary.map((item) => (
                    <LocalizedLink
                      key={item.id}
                      href={item.href || `/library/${item.slug}`}
                      className="library-detail-link-card"
                    >
                      <span className="library-detail-link-title">{item.title}</span>
                      {item.collection ? (
                        <span className="library-detail-link-meta">{item.collection}</span>
                      ) : null}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
            {relatedInsights.length > 0 ? (
              <div className="library-detail-related-block">
                <div className="library-section-intro">
                  <span className="section-badge">Insights</span>
                  <h2 className="page-section-heading">Related insights</h2>
                </div>
                <div className="library-detail-link-grid">
                  {relatedInsights.map((item) => (
                    <LocalizedLink
                      key={item.slug}
                      href={item.href || `/insights/${item.slug}`}
                      className="library-detail-link-card"
                    >
                      <span className="library-detail-link-title">{item.title}</span>
                      <span className="library-detail-link-meta">
                        {[item.contentType, item.date].filter(Boolean).join(' · ')}
                      </span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
            {relatedEvents.length > 0 ? (
              <div className="library-detail-related-block">
                <div className="library-section-intro">
                  <span className="section-badge">Events</span>
                  <h2 className="page-section-heading">Related gatherings</h2>
                </div>
                <div className="library-detail-link-grid">
                  {relatedEvents.map((item) => (
                    <LocalizedLink
                      key={item.id}
                      href={`/events/${item.slug}`}
                      className="library-detail-link-card"
                    >
                      <span className="library-detail-link-title">{item.title}</span>
                      {item.date ? (
                        <span className="library-detail-link-meta">{item.date}</span>
                      ) : null}
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </article>
  )
}
