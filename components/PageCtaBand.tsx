import LocalizedLink from './LocalizedLink'

type CtaItem = {
  label: string
  href: string
  variant?: 'primary' | 'outline-white'
}

type PageCtaBandProps = {
  heading: string
  body: string
  primary: CtaItem
  secondary?: CtaItem
}

export default function PageCtaBand({ heading, body, primary, secondary }: PageCtaBandProps) {
  return (
    <section className="page-cta-section section-reveal">
      <div className="page-section-container page-cta-inner">
        <h2 className="page-cta-heading">{heading}</h2>
        <p className="page-cta-body">{body}</p>
        <div className="page-cta-buttons">
          <LocalizedLink
            href={primary.href}
            className={`page-cta-btn ${primary.variant === 'outline-white' ? 'btn-outline-white' : 'btn-primary'}`}
          >
            {primary.label}
          </LocalizedLink>
          {secondary ? (
            <LocalizedLink
              href={secondary.href}
              className={`page-cta-btn ${secondary.variant === 'primary' ? 'btn-primary' : 'btn-outline-white'}`}
            >
              {secondary.label}
            </LocalizedLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}
