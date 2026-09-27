import Image from 'next/image'
import LocalizedLink from '../../components/LocalizedLink'
import HeroPremium from '../../components/HeroPremium'
import CardCover from '../../components/CardCover'
import { buildCmsMetadata } from '../../lib/cms/seo'
import { cmsIconForKey } from '../../lib/cms-icons'
import { cardImageSizes, images, resolveLibraryCoverImage, resolvePersonImage, resolveProgramCoverImage } from '../../lib/images'
import {
  fetchEvents,
  fetchInsights,
  fetchLibraryItems,
  fetchMiddayReflectionEpisodes,
  fetchPeople,
  fetchPrograms,
  type ApiEvent,
  type ApiInsightPost,
  type ApiLibraryItem,
  type ApiPerson,
} from '../../lib/api'
import {
  GET_INVOLVED_PATHS,
  HOME_EXPLORE,
  HOME_HERO,
  HOME_INSIGHTS,
  HOME_MIDDAY,
  HOME_PEOPLE,
  HOME_PROGRAMS_INTRO,
  HOME_WELCOME,
  HOME_WHATS_NEW,
  HOME_WHY,
} from '../../lib/leadership/copy'
import { withoutLegacyArtsEvents } from '../../lib/leadership/legacy-events'
import { programSummary, selectLeadershipPrograms } from '../../lib/leadership/programs'
import { cmsPlainExcerpt } from '../../lib/cms/richtext'
import { formatEventDateDisplay } from '../../lib/format'

export async function generateMetadata() {
  return buildCmsMetadata('home', { ogImage: images.hero.home })
}

function isUpcoming(event: ApiEvent) {
  if (event.eventStatus === 'cancelled' || event.eventStatus === 'postponed') return false
  if (!event.startsAt) return true
  return new Date(event.startsAt).getTime() >= Date.now() - 12 * 60 * 60 * 1000
}

const HOME_INVOLVE = GET_INVOLVED_PATHS.filter((path) => path.id !== 'contact')

export default async function Home() {
  let programs = selectLeadershipPrograms([])
  let middayEpisodes: ApiLibraryItem[] = []
  let listenItems: ApiLibraryItem[] = []
  let watchItems: ApiLibraryItem[] = []
  let insights: ApiInsightPost[] = []
  let events: ApiEvent[] = []
  let people: ApiPerson[] = []

  try {
    ;[programs, middayEpisodes, listenItems, watchItems, insights, events, people] = await Promise.all([
      fetchPrograms('catalog').then(selectLeadershipPrograms).catch(() => selectLeadershipPrograms([])),
      fetchMiddayReflectionEpisodes().catch(() => []),
      fetchLibraryItems({ shelf: 'listen' }).catch(() => []),
      fetchLibraryItems({ shelf: 'watch' }).catch(() => []),
      fetchInsights().catch(() => []),
      fetchEvents()
        .then(withoutLegacyArtsEvents)
        .catch(() => []),
      fetchPeople({ featured: true }).catch(() => []),
    ])
  } catch {
    programs = selectLeadershipPrograms([])
  }

  const latestMidday = middayEpisodes[0] ?? null
  const latestAudio =
    listenItems.find((item) => item.collection !== 'Midday Reflection') ?? listenItems[0] ?? null
  const latestVideo = watchItems[0] ?? null
  const latestInsight = insights[0] ?? null
  const upcomingEvent =
    events.filter(isUpcoming).sort((a, b) => {
      const aTime = a.startsAt ? new Date(a.startsAt).getTime() : Number.MAX_SAFE_INTEGER
      const bTime = b.startsAt ? new Date(b.startsAt).getTime() : Number.MAX_SAFE_INTEGER
      return aTime - bTime
    })[0] ??
    events.find((event) => event.featured) ??
    null

  const featuredPeople = people.filter((person) => person.featured).slice(0, 4)
  const featuredInsights = insights.filter((item) => item.featured).slice(0, 3)

  const featuredPrograms = programs

  const whatsNewSlots = [
    {
      key: 'audio',
      label: 'Latest audio',
      cta: 'Listen',
      item: latestAudio
        ? {
            title: latestAudio.title,
            body: cmsPlainExcerpt(latestAudio.description),
            href: latestAudio.href || `/library/${latestAudio.slug}`,
            meta: latestAudio.collection,
          }
        : null,
    },
    {
      key: 'video',
      label: 'Latest video',
      cta: 'Watch',
      item: latestVideo
        ? {
            title: latestVideo.title,
            body: cmsPlainExcerpt(latestVideo.description),
            href: latestVideo.href || `/library/${latestVideo.slug}`,
            meta: latestVideo.collection,
          }
        : null,
    },
    {
      key: 'insight',
      label: 'Latest insight',
      cta: 'Read insight',
      item: latestInsight
        ? {
            title: latestInsight.title,
            body: cmsPlainExcerpt(latestInsight.excerpt),
            href: latestInsight.href || `/insights/${latestInsight.slug}`,
            meta: latestInsight.contentType || latestInsight.category || 'Insight',
          }
        : null,
    },
    {
      key: 'event',
      label: 'Upcoming event',
      cta: 'View event',
      item: upcomingEvent
        ? {
            title: upcomingEvent.title,
            body: cmsPlainExcerpt(upcomingEvent.description),
            href: `/events/${upcomingEvent.slug}`,
            meta: upcomingEvent.date || formatEventDateDisplay(upcomingEvent.startsAt || ''),
          }
        : null,
    },
  ].filter((slot) => slot.item)

  return (
    <div>
      <HeroPremium
        lead={HOME_HERO.lead}
        imageSrc={images.hero.home}
        imageAlt="ANANSE Center for Leadership Development"
        title={{ line1: HOME_HERO.line1, accent: HOME_HERO.accent }}
        stats={HOME_HERO.stats}
        trustLine={HOME_HERO.trust}
        primaryCta={HOME_HERO.primary}
        secondaryCta={HOME_HERO.secondary}
        scrollHref="#welcome"
        scrollLabel="Scroll to welcome"
      />

      <section id="welcome" className="page-section bg-white section-reveal">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">Welcome to ANANSE</span>
          <h2 className="page-section-heading">{HOME_WELCOME.heading}</h2>
          {HOME_WELCOME.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <div className="page-cta-buttons">
            <LocalizedLink href="/about" className="btn-primary">
              Learn more about ANANSE
            </LocalizedLink>
            <LocalizedLink href="/about#the-ananse-story" className="btn-outline">
              Read the ANANSE story
            </LocalizedLink>
          </div>
        </div>
      </section>

      <section id="explore" className="page-section page-section--muted section-reveal">
        <div className="page-section-container">
          <span className="section-badge">{HOME_EXPLORE.heading}</span>
          <h2 className="page-section-heading">{HOME_EXPLORE.lead}</h2>
          <p className="page-body-text">There is always something new to discover at ANANSE.</p>
          <div className="grid-cards">
            {HOME_EXPLORE.links.map((link) => (
              <article key={link.label} className="premium-card">
                <h3 className="premium-card-title">{link.label}</h3>
                <p className="premium-card-description">{link.hint}</p>
                <LocalizedLink href={link.href} className="btn-secondary premium-card-cta">
                  {link.label}
                </LocalizedLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="page-section page-section--muted ananse-network-pattern section-reveal">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">Programs</span>
              <h2 className="page-section-heading">{HOME_PROGRAMS_INTRO.heading}</h2>
              <p className="page-body-text">{HOME_PROGRAMS_INTRO.lead}</p>
              <p className="page-body-text">{HOME_PROGRAMS_INTRO.body}</p>
            </div>
            <LocalizedLink href="/programs" className="btn-outline page-section-cta-link">
              Explore all programs
            </LocalizedLink>
          </div>
          <div className="grid-cards">
            {featuredPrograms.map((program) => {
              const Icon = cmsIconForKey(program.iconKey)
              const cover = resolveProgramCoverImage(program)
              return (
                <article key={program.slug} className="premium-card">
                  <div className="premium-card-image-wrapper premium-card-image-wrapper--card-top">
                    <CardCover src={cover} alt={program.title} />
                  </div>
                  <div className="premium-card-header">
                    <div className="premium-card-icon-box">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                  </div>
                  <h3 className="premium-card-title">{program.title}</h3>
                  <p className="premium-card-description">{programSummary(program.description)}</p>
                  <LocalizedLink href={`/programs/${program.slug}`} className="btn-secondary premium-card-cta">
                    Explore {program.title}
                  </LocalizedLink>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {latestMidday ? (
        <section id="midday-reflection" className="page-section bg-white section-reveal">
          <div className="page-section-container page-section-narrow">
            <span className="section-badge">Midday Reflection</span>
            <h2 className="page-section-heading">{HOME_MIDDAY.kicker}</h2>
            <p className="page-body-text">{HOME_MIDDAY.paragraphs[0]}</p>

            <article className="midday-episode-card">
              <div className="midday-episode-media">
                <Image
                  src={resolveLibraryCoverImage(latestMidday, 3)}
                  alt={`Midday Reflection — ${latestMidday.title}`}
                  fill
                  sizes="(max-width: 767px) 100vw, 42rem"
                  className="midday-episode-photo"
                />
                <div className="midday-episode-media-shade" aria-hidden />
                <span className="midday-episode-media-badge">Listen</span>
              </div>
              <div className="midday-episode-body">
                <p className="midday-episode-meta">
                  {latestMidday.dateLabel ||
                    (latestMidday.episodeNumber != null
                      ? `Episode ${latestMidday.episodeNumber}`
                      : 'Latest episode')}
                </p>
                <h3 className="midday-episode-title">{latestMidday.title}</h3>
                {latestMidday.scriptureTheme ? (
                  <p className="midday-episode-scripture">
                    <span>Scripture / theme</span>
                    {latestMidday.scriptureTheme}
                  </p>
                ) : null}
                <p className="midday-episode-desc">{cmsPlainExcerpt(latestMidday.description)}</p>
                <div className="page-cta-buttons">
                  <LocalizedLink
                    href={latestMidday.href || `/library/${latestMidday.slug}`}
                    className="btn-primary midday-episode-cta"
                  >
                    Listen to this episode
                  </LocalizedLink>
                  {latestMidday.videoUrl ? (
                    <LocalizedLink
                      href={`${latestMidday.href || `/library/${latestMidday.slug}`}#library-media`}
                      className="btn-outline"
                    >
                      Watch this episode
                    </LocalizedLink>
                  ) : null}
                  {latestMidday.transcript ? (
                    <LocalizedLink
                      href={`${latestMidday.href || `/library/${latestMidday.slug}`}#library-transcript`}
                      className="btn-outline"
                    >
                      Read the transcript
                    </LocalizedLink>
                  ) : null}
                </div>
              </div>
            </article>

            <div className="page-cta-buttons" style={{ marginTop: '1.25rem' }}>
              <LocalizedLink href="/programs/midday-reflection" className="btn-primary">
                Explore Midday Reflection
              </LocalizedLink>
              <LocalizedLink href="/library/midday-reflection" className="btn-outline">
                Episode archive
              </LocalizedLink>
            </div>
          </div>
        </section>
      ) : null}

      <section id="what-is-new" className="page-section page-section--muted ananse-network-pattern section-reveal">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">What is new</span>
              <h2 className="page-section-heading">{HOME_WHATS_NEW.heading}</h2>
              <p className="page-body-text">{HOME_WHATS_NEW.lead}</p>
            </div>
            <LocalizedLink href="/events" className="btn-outline page-section-cta-link">
              See all gatherings
            </LocalizedLink>
          </div>
          {whatsNewSlots.length > 0 ? (
            <div className="grid-cards">
              {whatsNewSlots.map((slot) => (
                <article key={slot.key} className="premium-card">
                  <p className="insight-card-tag">{slot.label}</p>
                  <h3 className="premium-card-title">{slot.item!.title}</h3>
                  {slot.item!.meta ? (
                    <p className="premium-card-description">{slot.item!.meta}</p>
                  ) : null}
                  <p className="premium-card-description">{slot.item!.body}</p>
                  <LocalizedLink href={slot.item!.href} className="btn-secondary premium-card-cta">
                    {slot.cta}
                  </LocalizedLink>
                </article>
              ))}
            </div>
          ) : (
            <p className="page-body-text">{HOME_WHATS_NEW.body}</p>
          )}
        </div>
      </section>

      <section id="insights" className="page-section bg-white section-reveal">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">Insights</span>
              <h2 className="page-section-heading">{HOME_INSIGHTS.kicker}</h2>
              {HOME_INSIGHTS.paragraphs.slice(0, 1).map((paragraph) => (
                <p key={paragraph} className="page-body-text">
                  {paragraph}
                </p>
              ))}
            </div>
            <LocalizedLink href="/insights" className="btn-outline page-section-cta-link">
              Explore ANANSE Insights
            </LocalizedLink>
          </div>
          {featuredInsights.length > 0 ? (
            <div className="grid-cards">
              {featuredInsights.map((insight) => (
                <article key={insight.slug} className="premium-card">
                  <p className="insight-card-tag">{insight.contentType || insight.category || 'Insight'}</p>
                  <h3 className="premium-card-title">{insight.title}</h3>
                  <p className="premium-card-description">{cmsPlainExcerpt(insight.excerpt)}</p>
                  <LocalizedLink
                    href={insight.href || `/insights/${insight.slug}`}
                    className="btn-secondary premium-card-cta"
                  >
                    Read insight
                  </LocalizedLink>
                </article>
              ))}
            </div>
          ) : (
            <p className="page-body-text">{HOME_INSIGHTS.closing}</p>
          )}
        </div>
      </section>

      <section id="why-ananse" className="page-section page-section--muted section-reveal">
        <div className="page-section-container page-section-narrow">
          <span className="section-badge">{HOME_WHY.heading}</span>
          <h2 className="page-section-heading">{HOME_WHY.kicker}</h2>
          {HOME_WHY.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <div className="page-cta-buttons">
            <LocalizedLink href="/about#the-ananse-story" className="btn-primary">
              Read the ANANSE story
            </LocalizedLink>
            <LocalizedLink href="/about#eaglesonline" className="btn-outline">
              Explore EAGLESonline
            </LocalizedLink>
          </div>
        </div>
      </section>

      <section id="people" className="page-section bg-white section-reveal">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">People</span>
              <h2 className="page-section-heading">{HOME_PEOPLE.heading}</h2>
              <p className="page-body-text">{HOME_PEOPLE.paragraphs[0]}</p>
            </div>
            <LocalizedLink href="/people" className="btn-outline page-section-cta-link">
              Meet the ANANSE community
            </LocalizedLink>
          </div>
          {featuredPeople.length > 0 ? (
            <div className="portrait-grid portrait-grid--home">
              {featuredPeople.map((person, index) => {
                const photo = resolvePersonImage(person, index)
                const isOrg = Boolean(person.isOrganization)
                const href = `/people/${person.slug}`
                const cta = isOrg ? 'View partner' : 'View profile'
                return (
                  <article
                    key={person.slug}
                    className={`portrait-card${person.featured ? ' portrait-card--featured' : ''}`}
                  >
                    <div className={`portrait-card-media${isOrg ? ' portrait-card-media--org' : ''}`}>
                      {photo ? (
                        <CardCover
                          src={photo}
                          alt={person.name}
                          sizes="(max-width: 640px) 50vw, 220px"
                          fit={isOrg ? 'contain' : 'cover'}
                        />
                      ) : (
                        <span className="portrait-card-initials" aria-hidden>
                          {person.name
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0]?.toUpperCase() ?? '')
                            .join('')}
                        </span>
                      )}
                    </div>
                    <div className="portrait-card-body">
                      {person.groups[0] ? (
                        <p className="portrait-card-group">{person.groups[0]}</p>
                      ) : null}
                      <h3 className="portrait-card-name">
                        <LocalizedLink href={href}>{person.name}</LocalizedLink>
                      </h3>
                      {person.roleTitle ? (
                        <p className="portrait-card-role">{person.roleTitle}</p>
                      ) : null}
                      <LocalizedLink href={href} className="content-cta-link">
                        {cta}
                      </LocalizedLink>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="page-body-text">{HOME_PEOPLE.paragraphs[1]}</p>
          )}
          </div>
        </section>

      <section id="get-involved" className="page-section page-section--muted ananse-network-pattern section-reveal">
        <div className="page-section-container">
          <div className="section-header-split">
            <div>
              <span className="section-badge">How to take part</span>
              <h2 className="page-section-heading">Be part of the ANANSE journey.</h2>
              <p className="page-body-text">There are many ways to connect, contribute, and grow with ANANSE.</p>
            </div>
            <LocalizedLink href="/get-involved" className="btn-outline page-section-cta-link">
              All ways to take part
            </LocalizedLink>
          </div>
          <div className="grid-cards">
            {HOME_INVOLVE.map((path) => (
              <article key={path.id} className="premium-card">
                <h3 className="premium-card-title">{path.title}</h3>
                <p className="premium-card-description">{path.body}</p>
                <LocalizedLink
                  href={path.href.startsWith('#') ? `/get-involved${path.href}` : path.href}
                  className="btn-secondary premium-card-cta"
                >
                  {path.cta}
                </LocalizedLink>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
