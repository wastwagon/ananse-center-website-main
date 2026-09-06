import { ImageResponse } from 'next/og'
import { site } from '../lib/site'
import { getCmsText } from '../lib/cms/content'
import { loadCmsIconBytes } from '../lib/cms/icon-bytes'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon() {
  const cmsPath = await getCmsText('site.appleIcon')
  const cmsIcon = await loadCmsIconBytes(cmsPath)
  if (cmsIcon) {
    return new Response(cmsIcon.data, {
      headers: { 'Content-Type': cmsIcon.contentType },
    })
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0f172a, #1e293b)',
          borderRadius: 36,
          color: '#fde047',
          fontSize: 72,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {site.shortName.charAt(0)}
      </div>
    ),
    { ...size },
  )
}
