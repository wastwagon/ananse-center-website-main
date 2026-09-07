import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'Admin | The Ananse Center',
  },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
