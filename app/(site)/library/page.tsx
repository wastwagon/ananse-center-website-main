import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import {
  fetchLibraryItems,
  fetchLibraryLinkedArticles,
} from '../../../lib/api'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images, resolveLibraryCoverImage, resolveNewsCoverImage } from '../../../lib/images'
import { LIBRARY_EMPTY, LIBRARY_MASTER, LIBRARY_PHOTO_SHELF, LIBRARY_COLLECTION_BLURBS } from '../../../lib/leadership/copy'
import { LIBRARY_SHELVES } from '../../../lib/leadership/taxonomy'
import LibraryListingClient from './LibraryListingClient'

const LIBRARY_GATEWAYS = [
  {
    key: 'listen',
    title: 'Listen',
    href: '/library?shelf=listen',
    body: 'Lectures, Midday Reflection, conversations, interviews, and special programs.',
  },
  {
    key: 'watch',
    title: 'Watch',
    href: '/library?shelf=watch',
    body: 'Lectures, conferences, interviews, workshops, seminars, and events.',
  },
  {
    key: 'read',
    title: 'Read',
    href: '/library?shelf=read',
    body: 'Articles, essays, reflections, publications, study materials, and Wisdom Nuggets.',
  },
  {
    key: 'midday',
    title: 'Midday Reflection archive',
    href: '/library/midday-reflection',
    body: 'Weekly episodes of Scripture, wisdom, and everyday living.',
  },
  {
    key: 'photos',
    title: 'Photo galleries',
    href: '/library/photos',
    body: 'Photographs and memories from ANANSE events, programs, people, and activities.',
  },
] as const

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Library',
    description:
      'The ANANSE Library gathers what is kept: listen, watch, read, and photographs. Lectures, conversations, reflections, and episodes in one place.',
    path: '/library',
    ogImage: images.hero.programs,
  })
}

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ shelf?: string }>
}) {
  const { shelf: shelfParam } = await searchParams
  const [libraryRows, linkedArticles] = await Promise.all([
    fetchLibraryItems(),
    fetchLibraryLinkedArticles(),
  ])

  const libraryItems = libraryRows.flatMap((item, index) => {
    const shelves = new Set<string>([item.shelf])
    if (item.audioUrl) shelves.add('listen')
    if (item.videoUrl) shelves.add('watch')
    return [...shelves].map((shelf) => ({
      key: `${item.id}-${shelf}`,
      title: item.title,
      description: item.description,
      shelf,
      collection: item.collection,
      dateLabel: item.dateLabel,
      episodeNumber: item.episodeNumber,
      href: `/library/${item.slug}`,
      cover: resolveLibraryCoverImage(item, index),
      featured: item.featured,
      kind: 'library' as const,
    }))
  })

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
    <div className="library-page">
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

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="library-intro">
            <article className="library-intro-card">
              <span className="section-badge">The Library</span>
              <h2 className="page-section-heading">A place to begin</h2>
              <p className="library-intro-tagline">{LIBRARY_MASTER.closing}</p>
              <p className="page-body-text">{LIBRARY_MASTER.lead}</p>
              <p className="page-body-text">{LIBRARY_MASTER.body}</p>
              <p className="page-body-text library-intro-note">
                The shelves below are collections ANANSE named. They are views of the library, not
                separate piles of content. One record can hold audio, video, and a transcript, found by
                program, topic, speaker, and date.
              </p>
            </article>

            <div className="library-gateway-grid">
              {LIBRARY_GATEWAYS.map((gateway) => (
                <LocalizedLink key={gateway.key} href={gateway.href} className="library-gateway-card">
                  <span className="library-gateway-kicker">Explore</span>
                  <span className="library-gateway-title">{gateway.title}</span>
                  <span className="library-gateway-body">{gateway.body}</span>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="browse" className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <div className="library-section-intro">
            <span className="section-badge">Browse</span>
            <h2 className="page-section-heading">Listen, watch, and read</h2>
            <p className="page-body-text">
              Filter by shelf and collection to find lectures, conversations, reflections, and more.
            </p>
          </div>
          <LibraryListingClient
            readMore="Open record"
            empty={LIBRARY_EMPTY}
            items={items}
            initialShelfKey={shelfParam}
          />
        </div>
      </section>

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="library-section-intro">
            <span className="section-badge">Collections</span>
            <h2 className="page-section-heading">Named shelves</h2>
            <p className="page-body-text">
              Each shelf gathers the kinds of materials ANANSE keeps for learning and reflection.
            </p>
          </div>
          <div className="library-shelf-grid">
            {LIBRARY_SHELVES.map((shelf) => (
              <article key={shelf.key} className="library-shelf-card">
                <div className="library-shelf-card-head">
                  <h3 className="library-shelf-card-title">{shelf.title}</h3>
                  <LocalizedLink href={`/library?shelf=${shelf.key}`} className="library-shelf-card-link">
                    Browse {shelf.title}
                  </LocalizedLink>
                </div>
                <ul className="library-shelf-list">
                  {shelf.items.map((item) => (
                    <li key={item}>
                      {item === 'Midday Reflection' ? (
                        <LocalizedLink href="/library/midday-reflection">{item}</LocalizedLink>
                      ) : (
                        item
                      )}
                      {LIBRARY_COLLECTION_BLURBS[item] ? (
                        <span className="library-shelf-blurb">{LIBRARY_COLLECTION_BLURBS[item]}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <article className="library-shelf-card">
              <div className="library-shelf-card-head">
                <h3 className="library-shelf-card-title">{LIBRARY_PHOTO_SHELF.title}</h3>
                <LocalizedLink href="/library/photos" className="library-shelf-card-link">
                  Browse Galleries
                </LocalizedLink>
              </div>
              <ul className="library-shelf-list">
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
