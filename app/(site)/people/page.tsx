import LocalizedLink from '../../../components/LocalizedLink'
import HeroSplit from '../../../components/HeroSplit'
import { fetchPeople } from '../../../lib/api'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images, resolvePersonImage } from '../../../lib/images'
import { HOME_PEOPLE, PEOPLE_EMPTY } from '../../../lib/leadership/copy'
import PeopleListingClient from './PeopleListingClient'

const PEOPLE_GATEWAYS = [
  {
    title: 'All People',
    group: 'All People',
    href: '/people',
    kicker: 'Community',
    body: 'Leadership, mentors, speakers, fellows, and partners in one place.',
  },
  {
    title: 'Leadership',
    group: 'Leadership',
    href: '/people?group=Leadership',
    kicker: 'Leading the ANANSE journey',
    body: 'People responsible for guiding ANANSE’s vision, mission, programs, and development.',
  },
  {
    title: 'Mentors',
    group: 'Mentors',
    href: '/people?group=Mentors',
    kicker: 'Wisdom shared. Potential developed.',
    body: 'Experience, perspective, encouragement, accountability, and practical wisdom offered to others.',
  },
  {
    title: 'Speakers & Faculty',
    group: 'Speakers & Faculty',
    href: '/people?group=Speakers%20%26%20Faculty',
    kicker: 'Voices that teach. Ideas that inspire.',
    body: 'People from different fields whose teaching and conversation become part of the ANANSE record.',
  },
  {
    title: 'Fellows and Participants',
    group: 'Fellows and Participants',
    href: '/people?group=Fellows%20and%20Participants',
    kicker: 'Learning. Growing. Becoming.',
    body: 'People formed through ANANSE programs. Profiles are published with permission, not as a prestige list.',
  },
  {
    title: 'Partners',
    group: 'Partners',
    href: '/people?group=Partners',
    kicker: 'Working together for greater impact',
    body: 'Organizations and collaborators whose partnership reflects a real relationship with ANANSE.',
  },
] as const

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>
}) {
  const { group } = await searchParams
  const groupLabel = group?.trim()
  const title = groupLabel ? `${groupLabel} | People` : 'People'
  const description = groupLabel
    ? `${groupLabel} in the ANANSE community — profiles published only with permission.`
    : 'The ANANSE community: leadership, mentors, speakers and faculty, fellows and participants, and partners. Profiles are published only with permission.'
  return buildPageMetadata({
    title,
    description,
    path: groupLabel ? `/people?group=${encodeURIComponent(groupLabel)}` : '/people',
    ogImage: images.hero.about,
  })
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>
}) {
  const { group } = await searchParams
  const people = await fetchPeople()
  const activeGroup = group?.trim() || 'All People'

  const items = people.map((person, index) => ({
    key: person.id,
    name: person.name,
    roleTitle: person.roleTitle,
    bio: person.bio,
    groups: person.groups,
    href: `/people/${person.slug}`,
    websiteUrl: person.websiteUrl,
    image: resolvePersonImage(person, index),
    isOrganization: person.isOrganization,
    featured: person.featured,
  }))

  return (
    <div className="people-page">
      <HeroSplit
        compact
        imageSrc={images.hero.about}
        imageAlt="The ANANSE community"
        title={
          <>
            ANANSE <span className="text-accent">people</span>
          </>
        }
        description={HOME_PEOPLE.kicker}
        primaryCta={{ label: 'Get involved', href: '/get-involved' }}
        secondaryCta={{ label: 'About ANANSE', href: '/about' }}
        stats={[]}
      />

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="people-intro">
            <article className="people-intro-card">
              <span className="section-badge">People</span>
              <h2 className="page-section-heading">{HOME_PEOPLE.heading}</h2>
              <p className="people-intro-tagline">{HOME_PEOPLE.kicker}</p>
              {HOME_PEOPLE.paragraphs.map((paragraph) => (
                <p key={paragraph} className="page-body-text">
                  {paragraph}
                </p>
              ))}
              <p className="page-body-text people-intro-note">
                People means the community, not a staff directory. Profiles are published only when the
                person, or the partner organization, has agreed. Personal phone numbers and email
                addresses are not shown.
              </p>
            </article>
            <div className="people-gateway-grid">
              {PEOPLE_GATEWAYS.map((gateway) => (
                <LocalizedLink
                  key={gateway.group}
                  href={gateway.href}
                  className={`people-gateway-card${activeGroup === gateway.group ? ' people-gateway-card--active' : ''}`}
                >
                  <span className="people-gateway-kicker">{gateway.kicker}</span>
                  <span className="people-gateway-title">{gateway.title}</span>
                  <span className="people-gateway-body">{gateway.body}</span>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-section section-reveal bg-slate-50">
        <div className="page-section-container">
          <PeopleListingClient
            viewProfile="View profile"
            empty={PEOPLE_EMPTY}
            items={items}
            initialGroup={group}
          />
        </div>
      </section>
    </div>
  )
}
