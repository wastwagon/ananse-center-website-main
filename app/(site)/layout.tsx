import SkipLink from '../../components/SkipLink'
import TopBar from '../../components/TopBar'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getCmsText } from '../../lib/cms/content'
import { getPublicSiteProfile } from '../../lib/site-profile'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [profile, footerMission] = await Promise.all([
    getPublicSiteProfile(),
    getCmsText('site.footer.mission'),
  ])

  return (
    <div className="site-shell flex flex-col flex-grow">
      <SkipLink />
      <TopBar contact={profile.contact} social={profile.social} />
      <Navbar />
      <main id="main-content" className="flex-grow pt-24">
        {children}
      </main>
      <Footer
        site={profile.site}
        contact={profile.contact}
        social={profile.social}
        impactStats={profile.impactStats}
        footerMission={footerMission}
      />
    </div>
  )
}
