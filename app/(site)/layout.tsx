import SkipLink from '../../components/SkipLink'
import TopBar from '../../components/TopBar'
import Navbar from '../../components/Navbar'
import MobileBottomNav from '../../components/MobileBottomNav'
import Footer from '../../components/Footer'
import JsonLd from '../../components/JsonLd'
import { I18nProvider } from '../../components/I18nProvider'
import SectionRevealInit from '../../components/SectionRevealInit'
import { getCmsText } from '../../lib/cms/content'
import { getPublicSiteProfile } from '../../lib/site-profile'
import { organizationJsonLd, websiteJsonLd } from '../../lib/structured-data'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, footerMission] = await Promise.all([
    getPublicSiteProfile(),
    getCmsText('site.footer.mission'),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''

  const structuredData = siteUrl
    ? [organizationJsonLd(siteUrl), websiteJsonLd(siteUrl)]
    : null

  return (
    <I18nProvider>
      <div className="site-shell site-shell--mobile-nav flex flex-col flex-grow">
        {structuredData ? <JsonLd data={structuredData} /> : null}
        <SectionRevealInit />
        <SkipLink />
        <TopBar contact={profile.contact} social={profile.social} />
        <Navbar />
        <main id="main-content" className="site-main flex-grow">
          {children}
        </main>
        <Footer
          site={profile.site}
          contact={profile.contact}
          social={profile.social}
          impactStats={profile.impactStats}
          footerMission={footerMission}
        />
        <MobileBottomNav />
      </div>
    </I18nProvider>
  )
}
