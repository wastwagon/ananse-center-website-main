import { getSiteIntegrations } from '../lib/site-integrations'

export default async function SiteAnalytics() {
  const { googleAnalyticsId } = await getSiteIntegrations()
  const id = googleAnalyticsId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
  if (!id) return null

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', { anonymize_ip: true });
          `,
        }}
      />
    </>
  )
}
