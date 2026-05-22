import { ImageResponse } from 'next/og'
import { site } from '../lib/site'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
