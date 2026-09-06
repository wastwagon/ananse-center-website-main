import SkipLink from '../../components/SkipLink'
import TopBar from '../../components/TopBar'
import Navbar from '../../components/Navbar'
import MobileBottomNav from '../../components/MobileBottomNav'
import Footer from '../../components/Footer'
import JsonLd from '../../components/JsonLd'
import { I18nProvider } from '../../components/I18nProvider'
import SectionRevealInit from '../../components/SectionRevealInit'
import AnalyticsBeacon from '../../components/AnalyticsBeacon'
import { getCmsTexts, parseCmsJson, type CmsHeroCta } from '../../lib/cms/content'
import {
  DEFAULT_FOOTER_PROGRAM_LINKS,
  DEFAULT_FOOTER_QUICK_LINKS,
  DEFAULT_MOBILE_NAV,
  DEFAULT_PRIMARY_NAV,
  DEFAULT_SHEET_NAV,
  type CmsMobileNavLink,
  type CmsNavLink,
} from '../../lib/cms/nav'
import { resolveCmsImage } from '../../lib/images'
import { getPublicSiteProfile } from '../../lib/site-profile'
import { organizationJsonLd, websiteJsonLd } from '../../lib/structured-data'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, chromeCms] = await Promise.all([
    getPublicSiteProfile(),
    getCmsTexts([
      'site.footer.mission',
      'site.footer.cta.primary',
      'site.footer.cta.secondary',
      'site.footer.quickLinks',
      'site.footer.programLinks',
      'site.logo',
      'site.nav.primary',
      'site.nav.mobile',
      'site.nav.sheet',
    ] as const),
  ])

  const footerPrimaryCta = parseCmsJson<CmsHeroCta>(chromeCms['site.footer.cta.primary'], {
    label: 'Support Our Mission',
    href: '/support',
  })
  const footerSecondaryCta = parseCmsJson<CmsHeroCta>(chromeCms['site.footer.cta.secondary'], {
    label: 'Get In Touch',
    href: '/contact#form',
  })
  const primaryNav = parseCmsJson<CmsNavLink[]>(chromeCms['site.nav.primary'], DEFAULT_PRIMARY_NAV)
  const quickLinks = parseCmsJson<CmsNavLink[]>(
    chromeCms['site.footer.quickLinks'],
    DEFAULT_FOOTER_QUICK_LINKS,
  )
  const programLinks = parseCmsJson<CmsNavLink[]>(
    chromeCms['site.footer.programLinks'],
    DEFAULT_FOOTER_PROGRAM_LINKS,
  )
  const mobileNavLinks = parseCmsJson<CmsMobileNavLink[]>(chromeCms['site.nav.mobile'], DEFAULT_MOBILE_NAV)
  const sheetLinks = parseCmsJson<CmsNavLink[]>(chromeCms['site.nav.sheet'], DEFAULT_SHEET_NAV)
  const logoSrc = resolveCmsImage(chromeCms['site.logo'], '/ananse-logo.png')

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const structuredData = siteUrl
    ? [organizationJsonLd(siteUrl), websiteJsonLd(siteUrl)]
    : null

  return (
    <I18nProvider>
      <div className="site-shell site-shell--mobile-nav flex flex-col flex-grow">
        {structuredData ? <JsonLd data={structuredData} /> : null}
        <SectionRevealInit />
        <AnalyticsBeacon />
        <SkipLink />
        <TopBar contact={profile.contact} social={profile.social} />
        <Navbar logoSrc={logoSrc} primaryLinks={primaryNav} sheetLinks={sheetLinks} />
        <main id="main-content" className="site-main flex-grow">
          {children}
        </main>
        <Footer
          site={profile.site}
          contact={profile.contact}
          social={profile.social}
          impactStats={profile.impactStats}
          footerMission={chromeCms['site.footer.mission']}
          footerPrimaryCta={footerPrimaryCta}
          footerSecondaryCta={footerSecondaryCta}
          logoSrc={logoSrc}
          quickLinks={quickLinks}
          programLinks={programLinks}
        />
        <MobileBottomNav links={mobileNavLinks} />
      </div>
    </I18nProvider>
  )
}
