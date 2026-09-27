import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import ShareBar from '../../../../components/ShareBar'
import CmsRichText from '../../../../components/CmsRichText'
import CardCover from '../../../../components/CardCover'
import { fetchLibraryItems, fetchPersonBySlug } from '../../../../lib/api'
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
    title: person.name,
    description: person.roleTitle || cmsPlainExcerpt(person.bio, 160),
    path: `/people/${slug}`,
    ogImage: resolvePersonImage(person) ?? images.hero.about,
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
  const relatedLibrary = await fetchLibraryItems({ person: slug }).catch(() => [])
  const relatedEvents = person.events ?? []
  const relatedInsights = person.insights ?? []

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
                  alt={person.name}
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
              <h1 className="content-page-title">{person.name}</h1>
              {person.roleTitle ? (
                <p className="page-body-text text-body-md">{person.roleTitle}</p>
              ) : null}
              {person.cohortLabel ? (
                <p className="page-body-text text-body-sm">{person.cohortLabel}</p>
              ) : null}
              {person.expertise ? <p className="page-body-text">{person.expertise}</p> : null}
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
            </div>
          </div>

          {person.bio ? (
            <CmsRichText body={person.bio} className="content-prose-body" />
          ) : null}
          <ShareBar title={person.name} path={`/people/${person.slug}`} />
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
    </article>
  )
}
