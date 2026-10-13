import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import ShareBar from '../../../../components/ShareBar'
import HeroSplit from '../../../../components/HeroSplit'
import CmsRichText from '../../../../components/CmsRichText'
import { cmsHtmlAfterFirstBlock, looksLikeHtml } from '../../../../lib/cms/richtext'
import {
  fetchEventsForProgram,
  fetchInsights,
  fetchLibraryItems,
  fetchPeople,
  fetchPhotoAlbums,
  fetchProgramBySlug,
  fetchPrograms,
} from '../../../../lib/api'
import {
  LEGACY_ARTS_PROGRAM_SLUGS,
  neighborPrograms,
  programNarrative,
  programSummary,
  resolveLeadershipProgram,
  selectLeadershipPrograms,
} from '../../../../lib/leadership/programs'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { programIconForKey } from '../../../../lib/program-icons'
import { resolveProgramCoverImage } from '../../../../lib/images'
import { deliveryModeLabel, eventStatusLabel } from '../../../../lib/leadership/taxonomy'
import { applyRelatedItems } from '../../../../lib/related-overrides'
import InquiryForm from '../../../../components/InquiryForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if ((LEGACY_ARTS_PROGRAM_SLUGS as readonly string[]).includes(slug)) {
    return buildPageMetadata({ title: 'Program', path: `/programs/${slug}` })
  }
  const live = await fetchProgramBySlug(slug).catch(() => null)
  const program = resolveLeadershipProgram(live, slug)
  if (!program) {
    return buildPageMetadata({ title: 'Program', path: `/programs/${slug}` })
  }
  return buildPageMetadata({
    title: program.seoTitle?.trim() || program.title,
    description: program.seoDescription?.trim() || program.summary?.trim() || programSummary(program.description),
    path: `/programs/${slug}`,
    ogImage: program.shareImageUrl || resolveProgramCoverImage(program),
    noindex: program.noindex,
  })
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if ((LEGACY_ARTS_PROGRAM_SLUGS as readonly string[]).includes(slug)) notFound()
  const live = await fetchProgramBySlug(slug).catch(() => null)
  const program = resolveLeadershipProgram(live, slug)
  if (!program) notFound()

  const [eventsRaw, libraryRaw, albumsRaw, catalogPrograms, insightRows, peopleRows] =
    await Promise.all([
      fetchEventsForProgram(program.slug).catch(() => []),
      fetchLibraryItems({ program: program.slug }).catch(() => []),
      fetchPhotoAlbums({ program: program.slug }).catch(() => []),
      fetchPrograms('catalog').catch(() => []),
      fetchInsights().catch(() => []),
      fetchPeople().catch(() => []),
    ])
  const pinned = program.relatedPinned
  const hidden = program.relatedHidden
  const relatedEvents = applyRelatedItems(eventsRaw, pinned?.events, hidden?.events)
  const relatedLibrary = applyRelatedItems(libraryRaw, pinned?.library, hidden?.library)
  const relatedAlbums = applyRelatedItems(albumsRaw, pinned?.albums, hidden?.albums)
  const relatedInsights = applyRelatedItems(
    insightRows.filter((item) => item.program?.slug === program.slug),
    pinned?.insights,
    hidden?.insights,
    insightRows,
  )
  const relatedPeople = applyRelatedItems(
    peopleRows.filter((person) => person.programs?.some((item) => item.slug === program.slug)),
    pinned?.people,
    hidden?.people,
    peopleRows,
  )

  const Icon = programIconForKey(program.iconKey)
  const cover = resolveProgramCoverImage(program)
  const isRichDescription = looksLikeHtml(program.description)
  const narrative = programNarrative(program.description)
  const summary = program.summary?.trim() || narrative.summary
  const tagline = program.tagline?.trim() || narrative.tagline
  const body = narrative.body
  const ctaLabel = program.ctaLabel?.trim() || (program.slug === 'mentorship' ? 'Inquire about mentorship' : 'Get involved')
  const ctaHref = program.ctaHref?.trim() || (program.slug === 'mentorship' ? '/get-involved#mentor-form' : '/get-involved')
  const secondaryHref =
    program.slug === 'midday-reflection' ? '/library/midday-reflection' : '/programs'
  const secondaryLabel = program.slug === 'midday-reflection' ? 'Episode archive' : 'All programs'

  const catalog = selectLeadershipPrograms(catalogPrograms)
  const otherPrograms = neighborPrograms(program.slug, catalog, 3)

  return (
    <article className="program-detail">
      <HeroSplit
        compact
        priority
        imageSrc={cover}
        imageAlt={program.title}
        title={program.title}
        description={summary}
        primaryCta={{ label: ctaLabel, href: ctaHref }}
        secondaryCta={{ label: secondaryLabel, href: secondaryHref }}
        stats={[]}
      />

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="program-detail-overview">
            <div className="program-detail-story">
              <div className="program-detail-kicker">
                <span className="program-detail-icon" aria-hidden>
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <span className="section-badge">{program.category}</span>
              </div>
              <h2 className="page-section-heading">About this program</h2>
              {isRichDescription ? (
                <CmsRichText
                  body={cmsHtmlAfterFirstBlock(program.description)}
                  className="content-prose-body program-detail-body"
                />
              ) : (
                <>
                  {tagline ? <p className="program-detail-tagline">{tagline}</p> : null}
                  <div className="program-detail-body">
                    {body.map((paragraph) => (
                      <p key={paragraph} className="page-body-text">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>

            <aside className="program-detail-aside">
              <div className="program-detail-aside-card">
                <p className="program-detail-aside-label">Next steps</p>
                <p className="program-detail-aside-title">Take part</p>
                <p className="program-detail-aside-copy">
                  Learn, attend, mentor, or partner around this program. Financial support stays on
                  the Support page. Mentoring is an expression of interest.
                </p>
                <LocalizedLink href={ctaHref} className="btn-primary program-detail-aside-cta">
                  {ctaLabel}
                </LocalizedLink>
                {program.lead ? (
                  <p className="page-body-text">
                    Program lead:{' '}
                    <LocalizedLink href={`/people/${program.lead.slug}`}>{program.lead.name}</LocalizedLink>
                  </p>
                ) : null}
                {program.slug === 'midday-reflection' ? (
                  <LocalizedLink
                    href="/library/midday-reflection"
                    className="btn-outline program-detail-aside-secondary"
                  >
                    Episode archive
                  </LocalizedLink>
                ) : null}
                <LocalizedLink href="/programs" className="btn-outline program-detail-aside-secondary">
                  All programs
                </LocalizedLink>
                <ShareBar title={program.title} path={`/programs/${program.slug}`} />
              </div>
              {relatedEvents.length > 0 ||
              relatedLibrary.length > 0 ||
              relatedAlbums.length > 0 ||
              relatedInsights.length > 0 ||
              relatedPeople.length > 0 ? (
                <div className="program-detail-aside-card program-detail-aside-card--muted">
                  <p className="program-detail-aside-label">At a glance</p>
                  <ul className="program-detail-glance-list">
                    {relatedEvents.length > 0 ? (
                      <li>
                        {`${relatedEvents.length} related gathering${relatedEvents.length === 1 ? '' : 's'}`}
                      </li>
                    ) : null}
                    {relatedLibrary.length > 0 ? (
                      <li>
                        {`${relatedLibrary.length} library item${relatedLibrary.length === 1 ? '' : 's'}`}
                      </li>
                    ) : null}
                    {relatedAlbums.length > 0 ? (
                      <li>
                        {`${relatedAlbums.length} photo album${relatedAlbums.length === 1 ? '' : 's'}`}
                      </li>
                    ) : null}
                    {relatedInsights.length > 0 ? (
                      <li>
                        {`${relatedInsights.length} insight${relatedInsights.length === 1 ? '' : 's'}`}
                      </li>
                    ) : null}
                    {relatedPeople.length > 0 ? (
                      <li>
                        {`${relatedPeople.length} ${relatedPeople.length === 1 ? 'person' : 'people'}`}
                      </li>
                    ) : null}
                  </ul>
                </div>
              ) : null}
            </aside>
          </div>

          {program.features.length > 0 ? (
            <div className="program-detail-panel">
              <h3 className="program-detail-panel-title">What this program develops</h3>
              <p className="program-detail-panel-lead">
                Core themes that shape learning, mentoring, and practical growth in this program.
              </p>
              <div className="program-detail-feature-grid">
                {program.features.map((feature) => (
                  <article key={feature} className="program-detail-feature-card">
                    {looksLikeHtml(feature) ? (
                      <CmsRichText body={feature} className="program-detail-feature-title" />
                    ) : (
                      <h4 className="program-detail-feature-title">{feature}</h4>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ) : null}
          {program.topics && program.topics.length > 0 ? (
            <div className="program-detail-panel">
              <h3 className="program-detail-panel-title">Topics</h3>
              <p className="page-body-text">{program.topics.join(' · ')}</p>
            </div>
          ) : null}
        </div>
      </section>

      {relatedEvents.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="program-detail-section-intro">
              <span className="section-badge">Gatherings</span>
              <h2 className="page-section-heading">Related gatherings</h2>
              <p className="page-body-text">
                Lectures, conversations, and other gatherings linked to this program. Each page stays
                as the record after the date.
              </p>
            </div>
            <div className="program-detail-link-grid">
              {relatedEvents.map((event) => (
                <LocalizedLink
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="program-detail-link-card"
                >
                  <span className="program-detail-link-title">{event.title}</span>
                  <span className="program-detail-link-meta">
                    {event.date}
                    {event.eventStatus && event.eventStatus !== 'scheduled'
                      ? ` · ${eventStatusLabel(event.eventStatus)}`
                      : ''}
                    {event.deliveryMode ? ` · ${deliveryModeLabel(event.deliveryMode)}` : ''}
                  </span>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedLibrary.length > 0 ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container">
            <div className="program-detail-section-intro">
              <span className="section-badge">Library</span>
              <h2 className="page-section-heading">From the Library</h2>
              <p className="page-body-text">Listen, watch, and read items linked to this program.</p>
            </div>
            <div className="program-detail-link-grid">
              {relatedLibrary.map((item) => (
                <LocalizedLink
                  key={item.id}
                  href={item.href || `/library/${item.slug}`}
                  className="program-detail-link-card"
                >
                  <span className="program-detail-link-title">{item.title}</span>
                  {item.collection ? (
                    <span className="program-detail-link-meta">{item.collection}</span>
                  ) : null}
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedAlbums.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="program-detail-section-intro">
              <span className="section-badge">Photos</span>
              <h2 className="page-section-heading">Photo albums</h2>
            </div>
            <div className="program-detail-link-grid">
              {relatedAlbums.map((album) => (
                <LocalizedLink
                  key={album.id}
                  href={`/library/photo-gallery/${album.slug}`}
                  className="program-detail-link-card"
                >
                  <span className="program-detail-link-title">{album.title}</span>
                  {album.collection ? (
                    <span className="program-detail-link-meta">{album.collection}</span>
                  ) : null}
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedInsights.length > 0 ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container">
            <div className="program-detail-section-intro">
              <span className="section-badge">Insights</span>
              <h2 className="page-section-heading">From ANANSE Insights</h2>
              <p className="page-body-text">Writing linked to this program.</p>
            </div>
            <div className="program-detail-link-grid">
              {relatedInsights.map((item) => (
                <LocalizedLink
                  key={item.slug}
                  href={item.href || `/insights/${item.slug}`}
                  className="program-detail-link-card"
                >
                  <span className="program-detail-link-title">{item.title}</span>
                  <span className="program-detail-link-meta">
                    {[item.contentType, item.author].filter(Boolean).join(' · ')}
                  </span>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedPeople.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <div className="program-detail-section-intro">
              <span className="section-badge">People</span>
              <h2 className="page-section-heading">People in this program</h2>
              <p className="page-body-text">
                Profiles published with permission. Personal phone numbers and email addresses are not
                shown.
              </p>
            </div>
            <div className="program-detail-link-grid">
              {relatedPeople.map((person) => (
                <LocalizedLink
                  key={person.slug}
                  href={`/people/${person.slug}`}
                  className="program-detail-link-card"
                >
                  <span className="program-detail-link-title">{person.name}</span>
                  {person.roleTitle ? (
                    <span className="program-detail-link-meta">{person.roleTitle}</span>
                  ) : null}
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {program.slug === 'mentorship' ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            <InquiryForm
              id="mentor-inquiry"
              heading="Inquire about mentorship"
              intro="Mentorship at ANANSE is a relationship of walking alongside, not a transaction. Mentors and participants can write to ask how to take part."
              defaultSubject="Mentor — expression of interest"
              subjects={['Mentor — expression of interest', 'Mentorship participant inquiry']}
              messageLabel="What experience can you share, or what kind of mentoring are you seeking?"
              submitLabel="Send inquiry"
            />
          </div>
        </section>
      ) : null}

      {otherPrograms.length > 0 ? (
        <section className="page-section section-reveal bg-white">
          <div className="page-section-container">
            <div className="program-detail-section-intro">
              <span className="section-badge">Explore</span>
              <h2 className="page-section-heading">More programs</h2>
              <p className="page-body-text">Continue exploring ANANSE&apos;s leadership pathways.</p>
            </div>
            <div className="program-detail-link-grid program-detail-link-grid--3">
              {otherPrograms.map((item) => {
                const OtherIcon = programIconForKey(item.iconKey)
                return (
                  <LocalizedLink
                    key={item.id}
                    href={`/programs/${item.slug}`}
                    className="program-detail-link-card program-detail-link-card--program"
                  >
                    <span className="program-detail-link-icon" aria-hidden>
                      <OtherIcon size={18} strokeWidth={1.75} />
                    </span>
                    <span className="program-detail-link-title">{item.title}</span>
                    <span className="program-detail-link-meta">{programSummary(item.description)}</span>
                  </LocalizedLink>
                )
              })}
            </div>
            <div className="program-detail-actions program-detail-actions--footer">
              <LocalizedLink href="/programs" className="btn-outline">
                View all programs
              </LocalizedLink>
            </div>
          </div>
        </section>
      ) : null}
    </article>
  )
}
