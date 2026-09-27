import { notFound } from 'next/navigation'
import LocalizedLink from '../../../../components/LocalizedLink'
import HeroSplit from '../../../../components/HeroSplit'
import CmsRichText from '../../../../components/CmsRichText'
import { fetchLibraryItemBySlug, fetchLibraryItems, fetchInsights } from '../../../../lib/api'
import ShareBar from '../../../../components/ShareBar'
import { buildPageMetadata } from '../../../../lib/page-meta'
import { resolveLibraryCoverImage } from '../../../../lib/images'
import { cmsPlainExcerpt } from '../../../../lib/cms/richtext'

function shelfCtaLabel(shelf: string) {
  if (shelf === 'listen') return 'Listen'
  if (shelf === 'watch') return 'Watch'
  if (shelf === 'read') return 'Read'
  return 'Open record'
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReturnType<typeof buildPageMetadata>> {
  const { slug } = await params
  const item = await fetchLibraryItemBySlug(slug)
  if (!item) {
    return buildPageMetadata({ title: 'Library', path: `/library/${slug}` })
  }
  return buildPageMetadata({
    title: item.title,
    description: cmsPlainExcerpt(item.description, 160),
    path: `/library/${item.slug}`,
    ogImage: resolveLibraryCoverImage(item),
  })
}

export default async function LibraryItemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = await fetchLibraryItemBySlug(slug)
  if (!item) notFound()

  const [programItems, speakerItems, insightRows] = await Promise.all([
    item.program?.slug
      ? fetchLibraryItems({ program: item.program.slug }).catch(() => [])
      : Promise.resolve([]),
    item.person?.slug
      ? fetchLibraryItems({ person: item.person.slug }).catch(() => [])
      : Promise.resolve([]),
    item.program?.slug ? fetchInsights().catch(() => []) : Promise.resolve([]),
  ])
  const moreFromProgram = programItems.filter((row) => row.slug !== item.slug).slice(0, 6)
  const speakerIds = new Set(moreFromProgram.map((row) => row.slug))
  const moreFromSpeaker = speakerItems
    .filter((row) => row.slug !== item.slug && !speakerIds.has(row.slug))
    .slice(0, 6)
  const relatedInsights = insightRows
    .filter((row) => row.program?.slug === item.program?.slug)
    .slice(0, 6)

  const cover = resolveLibraryCoverImage(item)
  const metaParts = [
    item.collection,
    item.dateLabel,
    item.episodeNumber != null ? `Episode ${item.episodeNumber}` : '',
    item.scriptureTheme,
  ].filter(Boolean)
  const shelfLabel = item.shelf.charAt(0).toUpperCase() + item.shelf.slice(1)
  const browseHref = `/library?shelf=${encodeURIComponent(item.shelf)}`
  const heroLead =
    cmsPlainExcerpt(item.description, 180) || `${shelfLabel} · ${item.collection}`

  return (
    <article className="library-detail">
      <HeroSplit
        compact
        priority
        imageSrc={cover}
        imageAlt={item.title}
        title={item.title}
        description={heroLead}
        primaryCta={{ label: `Browse ${shelfLabel}`, href: browseHref }}
        secondaryCta={{ label: 'The Library', href: '/library' }}
        stats={[]}
      />

      <section className="page-section section-reveal bg-white">
        <div className="page-section-container">
          <div className="library-detail-overview">
            <div className="library-detail-story">
              <div className="library-detail-kicker">
                <span className="section-badge">
                  {shelfLabel} · {item.collection}
                </span>
              </div>
              {metaParts.length > 0 ? (
                <p className="library-detail-meta">{metaParts.join(' · ')}</p>
              ) : null}
              <h2 className="page-section-heading">About this record</h2>
              {item.description ? (
                <CmsRichText body={item.description} className="content-prose-body" />
              ) : null}

              {(item.audioUrl || item.videoUrl) && (
                <div id="library-media" className="library-detail-media">
                  {item.audioUrl ? (
                    <div className="library-detail-media-block">
                      <h3 className="library-detail-media-title">Listen</h3>
                      <audio controls preload="none" src={item.audioUrl} className="library-detail-audio">
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  ) : null}
                  {item.videoUrl ? (
                    <div className="library-detail-media-block">
                      <h3 className="library-detail-media-title">Watch</h3>
                      <video
                        controls
                        preload="metadata"
                        src={item.videoUrl}
                        className="library-detail-video"
                      >
                        Your browser does not support video playback.
                      </video>
                    </div>
                  ) : null}
                </div>
              )}

              {item.body ? (
                <div className="library-detail-rich">
                  <CmsRichText body={item.body} className="content-prose-body" />
                </div>
              ) : null}

              {item.transcript ? (
                <div id="library-transcript" className="library-detail-panel">
                  <h3 className="library-detail-panel-title">Transcript</h3>
                  <CmsRichText body={item.transcript} className="content-prose-body" />
                </div>
              ) : null}

              {item.wisdomNugget ? (
                <div className="library-detail-panel library-detail-panel--accent">
                  <h3 className="library-detail-panel-title">Wisdom nugget</h3>
                  <CmsRichText body={item.wisdomNugget} className="content-prose-body" />
                </div>
              ) : null}

              {item.furtherStudy ? (
                <div className="library-detail-panel">
                  <h3 className="library-detail-panel-title">Further study</h3>
                  <CmsRichText body={item.furtherStudy} className="content-prose-body" />
                </div>
              ) : null}
            </div>

            <aside className="library-detail-aside">
              <div className="library-detail-aside-card">
                <p className="library-detail-aside-label">Record</p>
                <p className="library-detail-aside-title">{item.title}</p>
                <p className="library-detail-aside-copy">
                  {[shelfLabel, item.collection].filter(Boolean).join(' · ')}
                </p>
                <LocalizedLink href={browseHref} className="btn-primary library-detail-aside-cta">
                  Browse {shelfLabel}
                </LocalizedLink>
                <LocalizedLink href="/library" className="btn-outline library-detail-aside-secondary">
                  The Library
                </LocalizedLink>
              </div>

              {(item.program || item.person || item.event || item.insight) && (
                <div className="library-detail-aside-card library-detail-aside-card--muted">
                  <p className="library-detail-aside-label">Connected to</p>
                  <ul className="library-detail-glance-list">
                    {item.program ? (
                      <li>
                        <LocalizedLink href={`/programs/${item.program.slug}`}>
                          {item.program.title}
                        </LocalizedLink>
                      </li>
                    ) : null}
                    {item.person ? (
                      <li>
                        <LocalizedLink href={`/people/${item.person.slug}`}>
                          {item.person.name}
                        </LocalizedLink>
                      </li>
                    ) : null}
                    {item.event ? (
                      <li>
                        <LocalizedLink href={`/events/${item.event.slug}`}>{item.event.title}</LocalizedLink>
                      </li>
                    ) : null}
                    {item.insight ? (
                      <li>
                        <LocalizedLink href={`/insights/${item.insight.slug}`}>{item.insight.title}</LocalizedLink>
                      </li>
                    ) : null}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {moreFromProgram.length > 0 || moreFromSpeaker.length > 0 || relatedInsights.length > 0 ? (
        <section className="page-section section-reveal bg-slate-50">
          <div className="page-section-container">
            {moreFromProgram.length > 0 ? (
              <div className="library-detail-related-block">
                <div className="library-section-intro">
                  <span className="section-badge">Program</span>
                  <h2 className="page-section-heading">More from this program</h2>
                </div>
                <div className="library-detail-link-grid">
                  {moreFromProgram.map((row) => (
                    <LocalizedLink
                      key={row.id}
                      href={row.href || `/library/${row.slug}`}
                      className="library-detail-link-card"
                    >
                      <span className="library-detail-link-title">{row.title}</span>
                      <span className="library-detail-link-meta">
                        {[row.collection, shelfCtaLabel(row.shelf)].filter(Boolean).join(' · ')}
                      </span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
            {moreFromSpeaker.length > 0 ? (
              <div className="library-detail-related-block">
                <div className="library-section-intro">
                  <span className="section-badge">Speaker</span>
                  <h2 className="page-section-heading">More from this speaker</h2>
                </div>
                <div className="library-detail-link-grid">
                  {moreFromSpeaker.map((row) => (
                    <LocalizedLink
                      key={row.id}
                      href={row.href || `/library/${row.slug}`}
                      className="library-detail-link-card"
                    >
                      <span className="library-detail-link-title">{row.title}</span>
                      <span className="library-detail-link-meta">
                        {[row.collection, shelfCtaLabel(row.shelf)].filter(Boolean).join(' · ')}
                      </span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
            {relatedInsights.length > 0 ? (
              <div className="library-detail-related-block">
                <div className="library-section-intro">
                  <span className="section-badge">Insights</span>
                  <h2 className="page-section-heading">Related insights</h2>
                </div>
                <div className="library-detail-link-grid">
                  {relatedInsights.map((row) => (
                    <LocalizedLink
                      key={row.slug}
                      href={row.href || `/insights/${row.slug}`}
                      className="library-detail-link-card"
                    >
                      <span className="library-detail-link-title">{row.title}</span>
                      <span className="library-detail-link-meta">
                        {[row.contentType, row.date].filter(Boolean).join(' · ')}
                      </span>
                    </LocalizedLink>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      <section className="page-section section-reveal bg-white">
        <div className="page-section-container page-section-narrow">
          <ShareBar title={item.title} path={`/library/${item.slug}`} />
        </div>
      </section>
    </article>
  )
}
