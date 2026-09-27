import SkipLink from '../../components/SkipLink'
import Navbar from '../../components/Navbar'
import MobileBottomNav from '../../components/MobileBottomNav'
import Footer from '../../components/Footer'
import JsonLd from '../../components/JsonLd'
import { I18nProvider } from '../../components/I18nProvider'
import SectionRevealInit from '../../components/SectionRevealInit'
import AnalyticsBeacon from '../../components/AnalyticsBeacon'
import { getCmsTexts, parseCmsJson, type CmsHeroCta } from '../../lib/cms/content'
import {
  DEFAULT_MOBILE_NAV,
  resolvePrimaryNav,
  resolveSheetNav,
  type CmsMobileNavLink,
  type CmsNavLink,
} from '../../lib/cms/nav'
import { resolveCmsImage } from '../../lib/images'
import { getPublicSiteProfile } from '../../lib/site-profile'
import { site as leadershipSite } from '../../lib/site'
import { organizationJsonLd, websiteJsonLd } from '../../lib/structured-data'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, chromeCms] = await Promise.all([
    getPublicSiteProfile(),
    getCmsTexts([
      'site.footer.mission',
      'site.footer.cta.primary',
      'site.footer.cta.secondary',
      'site.logo',
      'site.nav.primary',
      'site.nav.mobile',
      'site.nav.sheet',
    ] as const),
  ])

  const storedFooterPrimary = parseCmsJson<CmsHeroCta>(chromeCms['site.footer.cta.primary'], {
    label: 'Get involved',
    href: '/get-involved',
  })
  const storedFooterSecondary = parseCmsJson<CmsHeroCta>(chromeCms['site.footer.cta.secondary'], {
    label: 'Support',
    href: '/support',
  })
  const footerPrimaryCta = /support our mission|donate/i.test(storedFooterPrimary.label)
    ? { label: 'Get involved', href: '/get-involved' }
    : storedFooterPrimary
  const footerSecondaryCta = /get in touch|contact/i.test(storedFooterSecondary.label)
    ? { label: 'Support', href: '/support' }
    : storedFooterSecondary
  const storedPrimary = parseCmsJson<CmsNavLink[]>(chromeCms['site.nav.primary'], [])
  const primaryNav = resolvePrimaryNav(storedPrimary)
  const storedMobile = parseCmsJson<CmsMobileNavLink[]>(chromeCms['site.nav.mobile'], [])
  const mobileNavLinks = storedMobile.some((link) => link.href.startsWith('/support') || link.href.startsWith('/contact'))
    ? DEFAULT_MOBILE_NAV
    : storedMobile.length
      ? storedMobile
      : DEFAULT_MOBILE_NAV
  const sheetLinks = resolveSheetNav(parseCmsJson<CmsNavLink[]>(chromeCms['site.nav.sheet'], []))
  const rawLogo = resolveCmsImage(chromeCms['site.logo'], '/ananse-logo.png')
  const logoSrc =
    rawLogo === '/ananse-wordmark.svg' || rawLogo.endsWith('/ananse-wordmark.svg')
      ? '/ananse-logo.png'
      : rawLogo

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
        <Navbar logoSrc={logoSrc} primaryLinks={primaryNav} sheetLinks={sheetLinks} />
        <main id="main-content" className="site-main flex-grow">
          {children}
        </main>
        <Footer
          site={profile.site}
          contact={profile.contact}
          social={profile.social}
          impactStats={profile.impactStats}
          footerMission={
            /arts|cultural memory|heritage preservation/i.test(chromeCms['site.footer.mission'])
              ? leadershipSite.footerMission
              : chromeCms['site.footer.mission']
          }
          footerPrimaryCta={footerPrimaryCta}
          footerSecondaryCta={footerSecondaryCta}
          logoSrc={logoSrc}
        />
        <MobileBottomNav links={mobileNavLinks} />
      </div>
    </I18nProvider>
  )
}
