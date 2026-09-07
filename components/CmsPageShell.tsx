import ContentPageHero from './ContentPageHero'
import LocalizedLink from './LocalizedLink'

type CmsPageShellProps = {
  badge: string
  title: string
  lead?: string
  children: React.ReactNode
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  /** Wider layout for directories and card grids (not long-form prose). */
  wide?: boolean
}

export default function CmsPageShell({
  badge,
  title,
  lead,
  children,
  primaryCta,
  secondaryCta,
  wide = false,
}: CmsPageShellProps) {
  return (
    <article className={`content-page${wide ? ' content-page--wide' : ''}`}>
      <ContentPageHero badge={badge} title={title} lead={lead} />
      <section className="page-section page-section--muted section-reveal">
        <div className={`page-section-container${wide ? ' content-prose content-prose--wide' : ' content-prose'}`}>
          {children}
          {primaryCta || secondaryCta ? (
            <div className="content-actions">
              {primaryCta ? (
                <LocalizedLink href={primaryCta.href} className="btn-primary">
                  {primaryCta.label}
                </LocalizedLink>
              ) : null}
              {secondaryCta ? (
                <LocalizedLink href={secondaryCta.href} className="btn-outline">
                  {secondaryCta.label}
                </LocalizedLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </article>
  )
}
