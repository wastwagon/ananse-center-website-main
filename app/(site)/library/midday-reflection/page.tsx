import LocalizedLink from '../../../../components/LocalizedLink'
import HeroSplit from '../../../../components/HeroSplit'
import { fetchMiddayReflectionEpisodes } from '../../../../lib/api'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { images, resolveLibraryCoverImage } from '../../../../lib/images'
import { HOME_MIDDAY } from '../../../../lib/leadership/copy'
import { cmsPlainExcerpt } from '../../../../lib/cms/richtext'
import MiddayArchiveClient from './MiddayArchiveClient'

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Midday Reflection archive',
    description:
      'Episodes of Midday Reflection — Scripture, wisdom, and everyday living. Audio, video, and transcripts in the Library.',
    path: '/library/midday-reflection',
    ogImage: images.hero.programs,
  })
}

export default async function MiddayReflectionArchivePage() {
  const episodes = await fetchMiddayReflectionEpisodes()

  return (
    <div className="library-page">
      <HeroSplit
        compact
        priority
        imageSrc={images.hero.programs}
        imageAlt="Midday Reflection archive"
        title={
          <>
            Midday <span className="text-accent">Reflection</span>
          </>
        }
        description={HOME_MIDDAY.kicker}
        primaryCta={{ label: 'Midday program', href: '/programs/midday-reflection' }}
        secondaryCta={{ label: 'The Library', href: '/library' }}
        stats={[]}
      />

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="library-section-intro">
            <span className="section-badge">Library · Listen</span>
            <h2 className="page-section-heading">Episode archive</h2>
            <p className="page-body-text">
              Scripture, wisdom, character, relationships, leadership, faith, and everyday living —
              gathered as episodes you can open, hear, and revisit.
            </p>
          </div>

          {(() => {
            const cards = episodes.map((episode, index) => ({
              id: episode.id,
              slug: episode.slug,
              title: episode.title,
              excerpt: cmsPlainExcerpt(episode.description),
              meta: [
                episode.dateLabel?.toLowerCase().includes('episode')
                  ? ''
                  : episode.episodeNumber != null
                    ? `Episode ${episode.episodeNumber}`
                    : '',
                episode.dateLabel,
                episode.scriptureTheme,
              ]
                .filter(Boolean)
                .join(' · '),
              cover: resolveLibraryCoverImage(episode, index),
              searchText: [
                episode.title,
                episode.scriptureTheme,
                episode.dateLabel,
                episode.episodeNumber != null ? `Episode ${episode.episodeNumber}` : '',
                ...(episode.topics ?? []),
                cmsPlainExcerpt(episode.description),
              ]
                .filter(Boolean)
                .join(' '),
            }))
            return <MiddayArchiveClient episodes={cards} empty={HOME_MIDDAY.empty} />
          })()}

          <div className="library-detail-actions">
            <LocalizedLink href="/programs/midday-reflection" className="btn-outline">
              Midday Reflection program
            </LocalizedLink>
            <LocalizedLink href="/library?shelf=listen" className="btn-outline">
              Browse Listen
            </LocalizedLink>
          </div>
        </div>
      </section>
    </div>
  )
}
