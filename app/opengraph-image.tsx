import { ImageResponse } from 'next/og'
import { site } from '../lib/site'

export const runtime = 'edge'
export const alt = site.name
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 45%, #78350f 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#fde047',
            marginBottom: 20,
          }}
        >
          {site.shortName}
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 28, marginTop: 24, color: '#e2e8f0', maxWidth: 820 }}>
          {site.tagline}
        </div>
        <div style={{ fontSize: 22, marginTop: 40, color: '#f59e0b' }}>{site.location}</div>
      </div>
    ),
    { ...size },
  )
}
