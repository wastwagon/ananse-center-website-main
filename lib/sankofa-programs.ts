import { fetchPrograms, type ApiProgram } from './api'
import type { LucideIcon } from 'lucide-react'
import { programIconForKey } from './program-icons'
export type SankofaProgramCard = {
  icon: LucideIcon
  title: string
  description: string
  href: string
}

const fallbackSankofa: SankofaProgramCard[] = [
  {
    icon: programIconForKey('UserCircle'),
    title: 'Sankofa Mentorship',
    description: 'Emerging leaders paired with mentors for culturally grounded leadership.',
    href: '/programs',
  },
  {
    icon: programIconForKey('Bird'),
    title: 'Sankofa Mediation',
    description: 'Conflict resolution blending tradition and modern practice.',
    href: '/programs',
  },
  {
    icon: programIconForKey('BookOpen'),
    title: 'Sankofa Resources',
    description: 'African-centered education, research, and learning archives.',
    href: '/programs',
  },
  {
    icon: programIconForKey('Music'),
    title: 'Sankofa Music',
    description: 'Community building through music, rhythm, and shared celebration.',
    href: '/programs',
  },
  {
    icon: programIconForKey('Salad'),
    title: 'Sankofa Kitchen & Health',
    description: 'Nutrition and wellness workshops grounded in NEWSTART principles.',
    href: '/programs',
  },
  {
    icon: programIconForKey('Sun'),
    title: 'Sankofa Sabbath & Volunteering',
    description: 'Rest, renewal, and service-learning for purposeful living.',
    href: '/programs',
  },
]

function mapProgram(program: ApiProgram): SankofaProgramCard {
  return {
    icon: programIconForKey(program.iconKey),
    title: program.title,
    description: program.description,
    href: '/programs',
  }
}

export async function getSankofaProgramsForHome(): Promise<SankofaProgramCard[]> {
  try {
    const data = await fetchPrograms('sankofa')
    if (!data.length) return fallbackSankofa
    return data.map(mapProgram)
  } catch {
    return fallbackSankofa
  }
}
