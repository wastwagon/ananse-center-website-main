import SkipLink from '../../components/SkipLink'
import TopBar from '../../components/TopBar'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell flex flex-col flex-grow">
      <SkipLink />
      <TopBar />
      <Navbar />
      <main id="main-content" className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}
