import type { LucideIcon } from 'lucide-react'

type FeatureIconProps = {
  icon: LucideIcon
  variant?: 'gold' | 'slate' | 'white'
  size?: number
}

export default function FeatureIcon({ icon: Icon, variant = 'gold', size = 20 }: FeatureIconProps) {
  return (
    <span className={`feature-icon feature-icon--${variant}`} aria-hidden>
      <Icon size={size} strokeWidth={1.75} />
    </span>
  )
}
