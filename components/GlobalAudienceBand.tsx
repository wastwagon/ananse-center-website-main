import { Globe } from 'lucide-react'
import LocalizedLink from './LocalizedLink'
import { getCmsTexts, parseCmsJson, type CmsHeroCta } from '../lib/cms/content'

export default async function GlobalAudienceBand() {
  const cms = await getCmsTexts([
    'site.globalBand.eyebrow',
    'site.globalBand.heading',
    'site.globalBand.body',
    'site.globalBand.cta',
  ] as const)
  const cta = parseCmsJson<CmsHeroCta>(cms['site.globalBand.cta'], {
    label: 'Subscribe',
    href: '/events#newsletter',
  })

  return (
    <section className="global-audience-band section-reveal" aria-labelledby="global-audience-heading">
      <div className="page-section-container">
        <div className="global-audience-band-inner">
          <div className="global-audience-band-icon" aria-hidden>
            <Globe size={28} strokeWidth={1.5} />
          </div>
          <div className="global-audience-band-copy">
            <p className="global-audience-band-eyebrow">{cms['site.globalBand.eyebrow']}</p>
            <h2 id="global-audience-heading" className="global-audience-band-heading">
              {cms['site.globalBand.heading']}
            </h2>
            <p className="global-audience-band-body">{cms['site.globalBand.body']}</p>
          </div>
          <LocalizedLink href={cta.href} className="btn-primary global-audience-band-cta">
            {cta.label}
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
