import ContentPageHero from './ContentPageHero'
import LocalizedLink from './LocalizedLink'

type CmsPageShellProps = {
  badge: string
  title: string
  lead?: string
  children: React.ReactNode
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export default function CmsPageShell({
  badge,
  title,
  lead,
  children,
  primaryCta,
  secondaryCta,
}: CmsPageShellProps) {
  return (
    <article className="content-page">
      <ContentPageHero badge={badge} title={title} lead={lead} />
      <section className="page-section page-section--muted section-reveal">
        <div className="page-section-container content-prose">
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
