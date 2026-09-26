import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import {
  fetchLibraryItems,
  fetchLibraryLinkedArticles,
} from '../../../lib/api'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images, resolveLibraryCoverImage, resolveNewsCoverImage } from '../../../lib/images'
import { LIBRARY_EMPTY, LIBRARY_MASTER, LIBRARY_PHOTO_SHELF, LIBRARY_SHELVES } from '../../../lib/leadership/copy'
import LibraryListingClient from './LibraryListingClient'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Library',
    description:
      'The ANANSE Library gathers what is kept: listen, watch, read, and photographs. Lectures, conversations, reflections, and episodes in one place.',
    path: '/library',
    ogImage: images.hero.programs,
  })
}

export default async function LibraryPage() {
  const [libraryRows, linkedArticles] = await Promise.all([
    fetchLibraryItems(),
    fetchLibraryLinkedArticles(),
  ])

  const libraryItems = libraryRows.map((item, index) => ({
    key: item.id,
    title: item.title,
    description: item.description,
    shelf: item.shelf,
    collection: item.collection,
    dateLabel: item.dateLabel,
    episodeNumber: item.episodeNumber,
    href: `/library/${item.slug}`,
    cover: resolveLibraryCoverImage(item, index),
    featured: item.featured,
    kind: 'library' as const,
  }))

  const readLinked = linkedArticles.map((post, index) => ({
    key: `linked-${post.id}`,
    title: post.title,
    description: post.excerpt,
    shelf: 'read',
    collection: post.contentType || post.category || 'Articles',
    dateLabel: post.date,
    episodeNumber: null,
    href: post.isExternal ? post.href : `/insights/${post.slug}`,
    external: post.isExternal,
    cover: resolveNewsCoverImage(post, index),
    featured: Boolean(post.featured),
    kind: 'linked-article' as const,
  }))

  const items = [...libraryItems, ...readLinked]

  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.programs}
        imageAlt="The ANANSE Library"
        title={
          <>
            The ANANSE <span className="text-accent">Library</span>
          </>
        }
        description={LIBRARY_MASTER.kicker}
        primaryCta={{ label: 'Midday Reflection archive', href: '/library/midday-reflection' }}
        secondaryCta={{ label: 'Photo galleries', href: '/library/photos' }}
        stats={[]}
      />

      <section className="page-section section-reveal bg-white py-16">
        <div className="page-section-container page-section-narrow">
          <p className="page-body-text">{LIBRARY_MASTER.lead}</p>
          <p className="page-body-text">{LIBRARY_MASTER.body}</p>
          <p className="page-body-text">{LIBRARY_MASTER.closing}</p>
        </div>
      </section>

      <section className="page-section section-reveal bg-slate-50 py-16">
        <div className="page-section-container page-section-narrow">
          <p className="page-body-text">
            The shelves below are collections ANANSE named. They are views of the library, not separate piles of content. One record can hold audio, video, and a transcript, found by program, topic, speaker, and date.
          </p>
        </div>
      </section>

      <section className="page-section section-reveal bg-slate-50 py-16">
        <div className="page-section-container">
          <LibraryListingClient readMore="Open record" empty={LIBRARY_EMPTY} items={items} />
        </div>
      </section>

      <section className="page-section section-reveal bg-white py-16">
        <div className="page-section-container">
          <div className="grid-cards">
            {LIBRARY_SHELVES.map((shelf) => (
              <article key={shelf.title} className="premium-card">
                <h2 className="premium-card-title">{shelf.title}</h2>
                <ul className="about-focus-list">
                  {shelf.items.map((item) => (
                    <li key={item}>
                      {item === 'Midday Reflection' ? (
                        <LocalizedLink href="/library/midday-reflection">{item}</LocalizedLink>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <article className="premium-card">
              <h2 className="premium-card-title">{LIBRARY_PHOTO_SHELF.title}</h2>
              <ul className="about-focus-list">
                {LIBRARY_PHOTO_SHELF.items.map((item) => (
                  <li key={item}>
                    <LocalizedLink href="/library/photos">{item}</LocalizedLink>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
