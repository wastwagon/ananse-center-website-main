import Link from 'next/link'
import HeroSplit from '../../../components/HeroSplit'
import { renderSplitHeroTitle } from '../../../lib/cms/hero'
import {
  DEFAULT_VIDEOS_HERO_CTA_PRIMARY,
  DEFAULT_VIDEOS_HERO_CTA_SECONDARY,
  DEFAULT_VIDEOS_HERO_STATS,
  DEFAULT_VIDEOS_HERO_TITLE,
  DEFAULT_VIDEOS_ITEMS,
  getCmsTexts,
  parseCmsJson,
  type CmsHeroCta,
  type CmsHeroStat,
  type CmsHeroTitle,
  type CmsVideoItem,
} from '../../../lib/cms/content'
import { images } from '../../../lib/images'

export default async function VideosPage() {
  const cms = await getCmsTexts([
    'videos.hero.lead',
    'videos.hero.title',
    'videos.hero.stats',
    'videos.hero.cta.primary',
    'videos.hero.cta.secondary',
    'videos.items',
    'videos.cta.heading',
    'videos.cta.body',
  ] as const)

  const heroTitle = parseCmsJson<CmsHeroTitle>(cms['videos.hero.title'], DEFAULT_VIDEOS_HERO_TITLE)
  const heroStats = parseCmsJson<CmsHeroStat[]>(cms['videos.hero.stats'], DEFAULT_VIDEOS_HERO_STATS)
  const heroPrimaryCta = parseCmsJson<CmsHeroCta>(cms['videos.hero.cta.primary'], DEFAULT_VIDEOS_HERO_CTA_PRIMARY)
  const heroSecondaryCta = parseCmsJson<CmsHeroCta>(cms['videos.hero.cta.secondary'], DEFAULT_VIDEOS_HERO_CTA_SECONDARY)
  const videos = parseCmsJson<CmsVideoItem[]>(cms['videos.items'], DEFAULT_VIDEOS_ITEMS)

  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.videos}
        imageAlt="Videos from The Ananse Center"
        title={renderSplitHeroTitle(heroTitle)}
        description={cms['videos.hero.lead']}
        primaryCta={heroPrimaryCta}
        secondaryCta={heroSecondaryCta}
        stats={heroStats}
      />

      <section className="page-section bg-white" style={{ paddingTop: '2rem' }}>
        <div className="page-section-container">
          <div className="grid-cards">
            {videos.map((video) => {
              let watchUrl = video.url
              if (video.url.includes('/embed/')) {
                const id = video.url.split('/embed/')[1]
                if (id.startsWith('PL')) {
                  watchUrl = `https://www.youtube.com/playlist?list=${id}`
                } else {
                  watchUrl = `https://www.youtube.com/watch?v=${id}`
                }
              }

              return (
                <Link
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={`${video.title}-${video.url}`}
                  className="block group"
                >
                  <article className="premium-card h-full relative transition-all group-hover:border-f59e0b">
                    <div className="absolute inset-0 z-10 w-full h-full" aria-hidden />
                    <div className="premium-card-image-wrapper" style={{ height: 'auto', aspectRatio: '16/9' }}>
                      <iframe
                        src={video.url}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        loading="lazy"
                      />
                    </div>
                    <div className="premium-card-header" style={{ marginBottom: '0.75rem' }}>
                      <span className="premium-card-featured-label">Video</span>
                    </div>
                    <h3 className="premium-card-title group-hover:text-accent transition-colors">{video.title}</h3>
                  </article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-cta-section">
        <div className="page-section-container page-cta-inner">
          <h2 className="page-cta-heading">{cms['videos.cta.heading']}</h2>
          <p className="page-cta-body">{cms['videos.cta.body']}</p>
          <div className="page-cta-buttons">
            <Link href="/events" className="btn-primary page-cta-btn">
              View Events
            </Link>
            <Link href="/contact#form" className="btn-outline-white page-cta-btn">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
