import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import { fetchProgramBySlug } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { programIconForKey } from '../../../../lib/program-icons'
import { cardImageSizes, resolveProgramCoverImage } from '../../../../lib/images'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = await fetchProgramBySlug(slug)
  if (!program) {
    return buildPageMetadata({ title: 'Program', path: `/programs/${slug}` })
  }
  return buildPageMetadata({
    title: program.title,
    description: program.description,
    path: `/programs/${slug}`,
    ogImage: program.coverImageUrl ?? undefined,
  })
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const program = await fetchProgramBySlug(slug)
  if (!program) notFound()

  const Icon = programIconForKey(program.iconKey)
  const cover = resolveProgramCoverImage(program)

  return (
    <article className="content-page">
      <section className="content-page-hero section-reveal">
        <div className="page-section-container content-page-hero-inner">
          <span className="section-badge">{program.category}</span>
          <h1 className="content-page-hero-title">{program.title}</h1>
          <p className="content-page-hero-lead">{program.description.slice(0, 220)}…</p>
        </div>
      </section>
      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose">
          {cover ? (
            <div className="card-image-wrapper mb-section">
              <Image src={cover} alt={program.title} fill className="object-cover" sizes={cardImageSizes} />
            </div>
          ) : null}
          <div className="premium-card-header">
            <div className="premium-card-icon-box">
              <Icon size={22} />
            </div>
          </div>
          <p className="page-body-text content-prose-p">{program.description}</p>
          {program.features.length > 0 ? (
            <ul className="content-highlight-list">
              {program.features.map((feature) => (
                <li key={feature} className="content-highlight-item">
                  <span className="content-highlight-mark" aria-hidden>
                    ✦
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="content-actions">
            <LocalizedLink href="/contact#form" className="btn-primary">
              Apply now
            </LocalizedLink>
            <LocalizedLink href="/programs" className="btn-outline">
              All programs
            </LocalizedLink>
          </div>
        </div>
      </section>
    </article>
  )
}
