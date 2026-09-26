import HeroSplit from '../../../components/HeroSplit'
import { fetchPeople } from '../../../lib/api'
import { buildPageMetadata } from '../../../lib/page-meta'
import { images, resolvePersonImage } from '../../../lib/images'
import { HOME_PEOPLE, PEOPLE_EMPTY } from '../../../lib/leadership/copy'
import PeopleListingClient from './PeopleListingClient'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'People',
    description:
      'The ANANSE community: leadership, mentors, speakers and faculty, fellows and participants, and partners. Profiles are published only with permission.',
    path: '/people',
    ogImage: images.hero.about,
  })
}

export default async function PeoplePage() {
  const people = await fetchPeople()

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
    <div>
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
      <section className="page-section section-reveal bg-white py-16">
        <div className="page-section-container page-section-narrow">
          {HOME_PEOPLE.paragraphs.map((paragraph) => (
            <p key={paragraph} className="page-body-text">
              {paragraph}
            </p>
          ))}
          <p className="page-body-text">
            People means the community, not a staff directory. Profiles are published only when the person, or the partner organization, has agreed. Personal phone numbers and email addresses are not shown.
          </p>
        </div>
      </section>
      <section className="page-section section-reveal bg-slate-50 py-16">
        <div className="page-section-container">
          <PeopleListingClient viewProfile="View profile" empty={PEOPLE_EMPTY} items={items} />
        </div>
      </section>
    </div>
  )
}
