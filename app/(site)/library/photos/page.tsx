import HeroSplit from '../../../../components/HeroSplit'
import { fetchPhotoAlbums } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { images, resolvePhotoAlbumCover } from '../../../../lib/images'
import { LIBRARY_PHOTO_SHELF, PHOTO_ALBUMS_EMPTY } from '../../../../lib/leadership/copy'
import PhotoAlbumsListingClient from './PhotoAlbumsListingClient'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Photo galleries',
    description: 'Photographs from ANANSE events, lectures, mentorship, and community engagement.',
    path: '/library/photos',
    ogImage: images.hero.events,
  })
}

export default async function PhotoAlbumsPage() {
  const albums = await fetchPhotoAlbums()

  const items = albums.map((album, index) => ({
    key: album.id,
    title: album.title,
    description: album.description,
    collection: album.collection,
    dateLabel: album.dateLabel,
    place: album.place,
    href: `/library/photos/${album.slug}`,
    cover: resolvePhotoAlbumCover(album, index),
    imageCount: album.images.length,
    featured: album.featured,
  }))

  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.events}
        imageAlt="ANANSE photo galleries"
        title={
          <>
            Photo <span className="text-accent">galleries</span>
          </>
        }
        description={`${LIBRARY_PHOTO_SHELF.title} — events, lectures, mentorship, and community life at ANANSE.`}
        primaryCta={{ label: 'The Library', href: '/library' }}
        secondaryCta={{ label: 'Events', href: '/events' }}
        stats={[]}
      />
      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="library-section-intro">
            <span className="section-badge">Photos</span>
            <h2 className="page-section-heading">Galleries</h2>
            <p className="page-body-text">
              Browse albums from events, lectures, mentorship, and community life at ANANSE.
            </p>
          </div>
          <PhotoAlbumsListingClient
            viewAlbum="View gallery"
            empty={PHOTO_ALBUMS_EMPTY}
            items={items}
          />
        </div>
      </section>
    </div>
  )
}
