import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import ShareBar from '../../../../components/ShareBar'
import CmsRichText from '../../../../components/CmsRichText'
import CardCover from '../../../../components/CardCover'
import {
  fetchLibraryItems,
  fetchPersonBySlug,
  fetchPhotoAlbumBySlug,
  fetchPhotoAlbums,
} from '../../../../lib/api'
import { applyRelatedItems } from '../../../../lib/related-overrides'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { images, resolvePersonImage } from '../../../../lib/images'
import { cmsPlainExcerpt } from '../../../../lib/cms/richtext'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReturnType<typeof buildPageMetadata>> {
  const { slug } = await params
  const person = await fetchPersonBySlug(slug)
  if (!person) {
    return buildPageMetadata({ title: 'People', path: `/people/${slug}` })
  }
  return buildPageMetadata({
    title: person.seoTitle?.trim() || person.displayName || person.name,
    description: person.seoDescription?.trim() || person.roleTitle || cmsPlainExcerpt(person.bio, 160),
    path: `/people/${slug}`,
    ogImage: person.shareImageUrl || resolvePersonImage(person) || images.hero.about,
    noindex: person.noindex,
  })
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const person = await fetchPersonBySlug(slug)
  if (!person) notFound()

  const image = resolvePersonImage(person)
  const displayName = person.displayName?.trim() || person.name
  const socialLinks = (person.socialLinks ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, href] = line.split('|').map((part) => part.trim())
      if (href && /^https?:\/\//i.test(href)) return { label: label || 'Profile', href }
      if (/^https?:\/\//i.test(line)) return { label: 'Profile', href: line }
      return null
    })
    .filter((link): link is { label: string; href: string } => Boolean(link))
  const pinned = person.relatedPinned
  const hidden = person.relatedHidden
  const relatedLibrary = applyRelatedItems(
    await fetchLibraryItems({ person: slug }).catch(() => []),
    pinned?.library,
    hidden?.library,
  )
  const relatedEvents = applyRelatedItems(person.events ?? [], pinned?.events, hidden?.events)
  const relatedInsights = applyRelatedItems(
    person.insights ?? [],
    pinned?.insights,
    hidden?.insights,
  )
  const albumsAutomatic = await fetchPhotoAlbums({ person: slug }).catch(() => [])
  const pinnedAlbumSlugs = (pinned?.albums ?? []).filter(
    (albumSlug) => !albumsAutomatic.some((album) => album.slug === albumSlug),
  )
  const pinnedAlbumExtras = (
    await Promise.all(pinnedAlbumSlugs.map((albumSlug) => fetchPhotoAlbumBySlug(albumSlug)))
  ).filter((album): album is NonNullable<typeof album> => Boolean(album))
  const relatedAlbums = applyRelatedItems(
    albumsAutomatic,
    pinned?.albums,
    hidden?.albums,
    pinnedAlbumExtras,
  )
  const expertiseTopics = person.expertiseTopics ?? []

  const initials = person.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <article className="content-page people-detail-page">
      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <LocalizedLink href="/people" className="program-card-link">
            ← ANANSE people
          </LocalizedLink>

          <div className="people-detail-hero">
            {image ? (
              <div
                className={`people-detail-media${person.isOrganization ? ' people-detail-media--org' : ''}`}
              >
                <CardCover
                  src={image}
                  alt={person.photoAlt || displayName}
                  sizes="(max-width: 767px) 100vw, 288px"
                  fit={person.isOrganization ? 'contain' : 'cover'}
                />
              </div>
            ) : (
              <div className="people-detail-media" aria-hidden>
                <span className="people-detail-initials">{initials}</span>
              </div>
            )}
            <div>
              {person.groups.length ? (
                <div className="people-detail-groups">
                  {person.groups.map((group) => (
                    <LocalizedLink
                      key={group}
                      href={`/people?group=${encodeURIComponent(group)}`}
                      className="people-detail-group-chip"
                    >
                      {group}
                    </LocalizedLink>
                  ))}
                </div>
              ) : null}
              <h1 className="content-page-title">{displayName}</h1>
              {person.preferredName?.trim() && person.preferredName.trim() !== person.name ? (
                <p className="page-body-text text-body-sm">{person.name}</p>
              ) : null}
              {person.roleTitle ? (
                <p className="page-body-text text-body-md">{person.roleTitle}</p>
              ) : null}
              {person.cohortLabel ? (
                <p className="page-body-text text-body-sm">{person.cohortLabel}</p>
              ) : null}
              {person.expertise ? <p className="page-body-text">{person.expertise}</p> : null}
              {expertiseTopics.length > 0 ? (
                <div className="people-detail-groups">
                  {expertiseTopics.map((topic) => (
                    <span key={topic} className="people-detail-group-chip">
                      {topic}
                    </span>
                  ))}
                </div>
              ) : null}
              {person.isOrganization && person.organizationName ? (
                <p className="page-body-text text-body-sm">{person.organizationName}</p>
              ) : null}
              {person.websiteUrl ? (
                <p className="page-body-text" style={{ marginTop: '0.75rem' }}>
                  <a href={person.websiteUrl} className="content-cta-link" rel="noopener noreferrer">
                    Visit website
                  </a>
                </p>
              ) : null}
              {socialLinks.length > 0 ? (
                <ul className="about-focus-list">
                  {socialLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="content-cta-link" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {person.bio ? (
            <CmsRichText body={person.bio} className="content-prose-body" />
          ) : null}
          {person.fullBio?.trim() ? (
            <CmsRichText body={person.fullBio} className="content-prose-body" />
          ) : null}
          <ShareBar title={displayName} path={`/people/${person.slug}`} />
          {person.programs && person.programs.length > 0 ? (
            <div className="people-detail-panel">
              <h2 className="page-section-heading">Programs</h2>
              <ul className="about-focus-list">
                {person.programs.map((program) => (
                  <li key={program.id}>
                    <LocalizedLink href={`/programs/${program.slug}`}>{program.title}</LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {relatedInsights.length > 0 ? (
            <div className="people-detail-panel">
              <h2 className="page-section-heading">Insights</h2>
              <ul className="about-focus-list">
                {relatedInsights.map((item) => (
                  <li key={item.id}>
                    <LocalizedLink href={`/insights/${item.slug}`}>{item.title}</LocalizedLink>
                    {item.date ? ` · ${item.date}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      {relatedLibrary.length > 0 ? (
        <section className="page-section page-section--muted section-reveal">
          <div className="page-section-container">
            <h2 className="page-section-heading">Talks and writings</h2>
            <p className="page-body-text">Library items linked to this person.</p>
            <ul className="about-focus-list">
              {relatedLibrary.map((item) => (
                <li key={item.id}>
                  <LocalizedLink href={item.href || `/library/${item.slug}`}>{item.title}</LocalizedLink>
                  {item.collection ? ` · ${item.collection}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {relatedEvents.length > 0 ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container">
            <h2 className="page-section-heading">Related gatherings</h2>
            <p className="page-body-text">Events where this person is listed as a contributor.</p>
            <ul className="about-focus-list">
              {relatedEvents.map((event) => (
                <li key={event.id}>
                  <LocalizedLink href={`/events/${event.slug}`}>{event.title}</LocalizedLink>
                  {' · '}
                  {[event.role, event.date].filter(Boolean).join(' · ')}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {relatedAlbums.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <h2 className="page-section-heading">Photo galleries</h2>
            <p className="page-body-text">Albums featuring this person.</p>
            <ul className="about-focus-list">
              {relatedAlbums.map((album) => (
                <li key={album.id}>
                  <LocalizedLink href={`/library/photo-gallery/${album.slug}`}>
                    {album.title}
                  </LocalizedLink>
                  {album.collection ? ` · ${album.collection}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  )
}
