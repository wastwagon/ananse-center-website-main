import { eventIconForType } from '../lib/event-icons'

type EventTypeIconProps = {
  type: string
  size?: number
  className?: string
}

export default function EventTypeIcon({ type, size = 20, className = 'program-card-icon' }: EventTypeIconProps) {
  const Icon = eventIconForType(type)
  return (
    <div className={className} style={{ marginBottom: 0 }} aria-hidden>
      <Icon size={size} strokeWidth={1.75} />
    </div>
  )
}
