import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchPersonBySlug } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { images, resolvePersonImage } from '../../../../lib/images'

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
    description: person.roleTitle || person.bio.slice(0, 160),
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

  return (
    <article className="content-page">
      <section className="page-section section-reveal">
        <div className="page-section-container content-prose">
          <LocalizedLink href="/people" className="program-card-link">
            ← ANANSE people
          </LocalizedLink>

          <div className="two-col-section" style={{ marginTop: '1.5rem', alignItems: 'start' }}>
            {image ? (
              <div
                className="premium-card-image-wrapper"
                style={{ position: 'relative', minHeight: '280px', borderRadius: '12px' }}
              >
                <Image
                  src={image}
                  alt={person.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 899px) 100vw, 360px"
                  unoptimized={image.startsWith('/api/')}
                  priority
                />
              </div>
            ) : null}
            <div>
              {person.groups.length ? (
                <p className="insight-card-tag">{person.groups.join(' · ')}</p>
              ) : null}
              <h1 className="content-page-title">{person.name}</h1>
              {person.roleTitle ? (
                <p className="page-body-text text-body-md">{person.roleTitle}</p>
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
            </div>
          </div>

          {person.bio ? (
            <CmsRichText body={person.bio} className="content-prose-body" />
          ) : null}
        </div>
      </section>
    </article>
  )
}
