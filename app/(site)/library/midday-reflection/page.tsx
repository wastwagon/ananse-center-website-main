import Image from 'next/image'
import LocalizedLink from '../../../../components/LocalizedLink'
import { fetchMiddayReflectionEpisodes } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { cardImageSizes, resolveLibraryCoverImage } from '../../../../lib/images'
import { HOME_MIDDAY } from '../../../../lib/leadership/copy'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Midday Reflection archive',
    description:
      'Episodes of Midday Reflection — Scripture, wisdom, and everyday living. Audio, video, and transcripts in the Library.',
    path: '/library/midday-reflection',
  })
}

export default async function MiddayReflectionArchivePage() {
  const episodes = await fetchMiddayReflectionEpisodes()

  return (
    <article className="content-page">
      <section className="content-page-hero section-reveal">
        <div className="page-section-container content-page-hero-inner">
          <span className="section-badge">Library · Listen</span>
          <h1 className="content-page-hero-title">Midday Reflection</h1>
          <p className="content-page-hero-lead">{HOME_MIDDAY.kicker}</p>
        </div>
      </section>

      <section className="page-section page-section--muted section-reveal py-16">
        <div className="page-section-container">
          <LocalizedLink href="/library" className="program-card-link">
            ← The Library
          </LocalizedLink>

          {episodes.length === 0 ? (
            <p className="page-body-text" style={{ marginTop: '1.5rem' }}>
              {HOME_MIDDAY.empty}
            </p>
          ) : (
            <div className="grid-cards grid-cards--stack-narrow" style={{ marginTop: '1.5rem' }}>
              {episodes.map((episode, index) => {
                const cover = resolveLibraryCoverImage(episode, index)
                const meta = [
                  episode.episodeNumber != null ? `Episode ${episode.episodeNumber}` : '',
                  episode.dateLabel,
                  episode.scriptureTheme,
                ]
                  .filter(Boolean)
                  .join(' · ')
                return (
                  <article key={episode.id} className="premium-card">
                    <div className="premium-card-image-wrapper">
                      <Image
                        src={cover}
                        alt={episode.title}
                        fill
                        className="object-cover"
                        sizes={cardImageSizes}
                        unoptimized={cover.startsWith('/api/')}
                      />
                    </div>
                    {meta ? <p className="premium-card-date">{meta}</p> : null}
                    <h2 className="premium-card-title">{episode.title}</h2>
                    <p className="premium-card-description">{episode.description}</p>
                    <LocalizedLink href={`/library/${episode.slug}`} className="btn-primary premium-card-cta">
                      Open episode
                    </LocalizedLink>
                  </article>
                )
              })}
            </div>
          )}

          <div className="content-actions" style={{ marginTop: '2rem' }}>
            <LocalizedLink href="/programs/midday-reflection" className="btn-primary">
              Midday Reflection program
            </LocalizedLink>
            <LocalizedLink href="/library" className="btn-outline">
              The Library
            </LocalizedLink>
          </div>
        </div>
      </section>
    </article>
  )
}
