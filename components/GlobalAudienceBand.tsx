'use client'

import { Globe } from 'lucide-react'
import { useI18n } from './I18nProvider'
import LocalizedLink from './LocalizedLink'

export default function GlobalAudienceBand() {
  const { translate } = useI18n()

  return (
    <section className="global-audience-band section-reveal" aria-labelledby="global-audience-heading">
      <div className="page-section-container">
        <div className="global-audience-band-inner">
          <div className="global-audience-band-icon" aria-hidden>
            <Globe size={28} strokeWidth={1.5} />
          </div>
          <div className="global-audience-band-copy">
            <p className="global-audience-band-eyebrow">{translate('global.band.eyebrow')}</p>
            <h2 id="global-audience-heading" className="global-audience-band-heading">
              {translate('global.band.heading')}
            </h2>
            <p className="global-audience-band-body">{translate('global.band.body')}</p>
          </div>
          <LocalizedLink href="/events#newsletter" className="btn-primary global-audience-band-cta">
            {translate('global.band.cta')}
          </LocalizedLink>
        </div>
      </div>
    </section>
  )
}
