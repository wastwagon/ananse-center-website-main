import { ImageResponse } from 'next/og'
import { site } from '../lib/site'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: 8,
          color: '#0f172a',
          fontSize: 18,
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
