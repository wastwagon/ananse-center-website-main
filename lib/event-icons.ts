import {
  Drama,
  Scissors,
  Leaf,
  Image,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react'

const iconsByType: Record<string, LucideIcon> = {
  Festival: Drama,
  Workshop: Scissors,
  Retreat: Leaf,
  Exhibition: Image,
  Symposium: GraduationCap,
}

export function eventIconForType(type: string): LucideIcon {
  return iconsByType[type] ?? Drama
}
