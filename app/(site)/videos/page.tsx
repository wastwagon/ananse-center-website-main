import Link from 'next/link'
import HeroSplit from '../../../components/HeroSplit'
import { images } from '../../../lib/images'

const videos = [
  {
    title: 'MARRIAGE & RELATIONSHIPS',
    url: 'https://www.youtube.com/embed/PhoTnWHzY_Y',
  },
  {
    title: 'THE MINDSET OF INTEGRITY',
    url: 'https://www.youtube.com/embed/bfTzodebHUT16mkYt',
  },
  {
    title: 'HEALED WOUNDS BUT UGLY SCARS',
    url: 'https://www.youtube.com/embed/1-O0vTxDXbs',
  },
  {
    title: 'THE NEED FOR EXCELLENCE',
    url: 'https://www.youtube.com/embed/OiTjdPM1S94',
  },
  {
    title: 'EMPOWERING MINDS, SHAPING FUTURES',
    url: 'https://www.youtube.com/embed/o9f0173B9b8',
  },
  {
    title: 'THE MINDSET OF FAILURE',
    url: 'https://www.youtube.com/embed/PLEsQPe0PR9FcXays',
  },
  {
    title: 'TOP OF THE TOP TEN',
    url: 'https://www.youtube.com/embed/1ipkq8F_Nkc',
  },
  {
    title: 'UNCOMFORTABLE GRACE',
    url: 'https://www.youtube.com/embed/-ZhF1JNx5oc',
  },
]

export default function VideosPage() {
  return (
    <div>
      <HeroSplit
        compact
        imageSrc={images.hero.videos}
        imageAlt="Videos from The Ananse Center"
        title={
          <>
            Watch Our <span className="text-accent">Stories</span>
          </>
        }
        description="Explore talks, workshops, and community moments — a window into our programs and cultural impact across Ghana and the diaspora."
        primaryCta={{ label: 'Get in Touch', href: '/contact#form' }}
        secondaryCta={{ label: 'View Events', href: '/events' }}
        stats={[
          { value: '8+', label: 'Featured Talks' },
          { value: 'YouTube', label: 'Channel' },
          { value: 'Free', label: 'To Watch' },
          { value: 'Share', label: 'With Community' },
        ]}
      />

      <section className="page-section bg-white" style={{ paddingTop: '2rem' }}>
        <div className="page-section-container">
          <div className="grid-1col grid-md-2col grid-lg-3col">
            {videos.map((video, index) => {
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
                <Link href={watchUrl} target="_blank" rel="noopener noreferrer" key={index} className="block group">
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
          <h2 className="page-cta-heading">Want to See More?</h2>
          <p className="page-cta-body">
            Join our community and stay updated with our latest events, videos, and stories.
          </p>
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
