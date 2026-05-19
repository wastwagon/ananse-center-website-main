#!/usr/bin/env python3
"""Replace inline hero-split blocks with HeroSplit component."""
from pathlib import Path

REPLACEMENTS = {
    'programs': '''      <HeroSplit
        compact
        imageSrc={images.hero.programs}
        imageAlt="Ananse Center programs"
        title={
          <>
            Our <span className="text-accent">Transformative Programs</span>
          </>
        }
        description="Hands-on arts, culture, and leadership experiences that connect you to African heritage and community."
        primaryCta={{ label: 'Browse Programs', href: '/programs#catalog' }}
        secondaryCta={{ label: 'Apply Now', href: '/contact#form' }}
        stats={[
          { value: '6+', label: 'Program Tracks' },
          { value: '500+', label: 'Participants' },
          { value: '15+', label: 'Communities' },
          { value: '100%', label: 'Cultural Focus' },
        ]}
      />

''',
    'events': '''      <HeroSplit
        compact
        imageSrc={images.hero.events}
        imageAlt="Cultural festivals at Ananse Center"
        title={
          <>
            Events & <span className="text-accent">Gatherings</span>
          </>
        }
        description="Festivals, workshops, and retreats that bring preservation, joy, and Pan-African connection to life."
        primaryCta={{ label: 'View Calendar', href: '/events#calendar' }}
        secondaryCta={{ label: 'Volunteer', href: '/contact#form' }}
        stats={[
          { value: '45+', label: 'Gatherings' },
          { value: '1.2K+', label: 'Annual Guests' },
          { value: '15+', label: 'Communities' },
          { value: '2025', label: 'Season' },
        ]}
      />

''',
    'support': '''      <HeroSplit
        compact
        imageSrc={images.hero.support}
        imageAlt="Support The Ananse Center"
        title={
          <>
            Support Our <span className="text-accent">Mission</span>
          </>
        }
        description="Your gift preserves African heritage and funds arts education, mentorship, and community programs across Ghana and the diaspora."
        primaryCta={{ label: 'Donate Now', href: '/support#donate' }}
        secondaryCta={{ label: 'Partner With Us', href: '/contact#form' }}
        stats={[
          { value: '100%', label: 'Program Focus' },
          { value: '$10K+', label: 'Monthly Reach' },
          { value: '25+', label: 'Artisans Supported' },
          { value: 'You', label: 'Make It Possible' },
        ]}
      />

''',
}

IMPORTS = {
    'programs': '''import HeroSplit from '../../components/HeroSplit'
import FeatureIcon from '../../components/FeatureIcon'
import { images } from '../../lib/images'
import type { LucideIcon } from 'lucide-react'
import {
  Palette,
  Music,
  BookOpen,
  Frame,
  PersonStanding,
  Award,
  Wrench,
  Globe,
  Users,
  Sprout,
} from 'lucide-react'
''',
    'events': '''import HeroSplit from '../../components/HeroSplit'
import { images } from '../../lib/images'
''',
    'support': '''import HeroSplit from '../../components/HeroSplit'
import FeatureIcon from '../../components/FeatureIcon'
import { images } from '../../lib/images'
import { social } from '../../lib/site'
import type { LucideIcon } from 'lucide-react'
import { Palette, Users, GraduationCap, Package, HandHeart, Building2, Scroll } from 'lucide-react'
''',
}


def replace_hero(path: Path, key: str):
    text = path.read_text()
    start = text.find('      {/* ─── Hero ─── */}')
    if start == -1:
        start = text.find('      {/* ── HERO:')
    end_markers = [
        '      {/* ─── Filter & Catalog ─── */}',
        '      {/* ─── Featured Section ─── */}',
        '      {/* ─── Impact Section ─── */}',
    ]
    end = -1
    for m in end_markers:
        i = text.find(m)
        if i != -1 and (end == -1 or i < end):
            end = i
    if start == -1 or end == -1:
        print(f'skip {path}: markers not found', start, end)
        return
    text = text[:start] + REPLACEMENTS[key] + text[end:]
    imp = IMPORTS[key]
    if 'HeroSplit' not in text.split('export default')[0]:
        # insert after first import block line
        idx = text.find('\n\n/* ═')
        if idx == -1:
            idx = text.find('\n\nconst ')
        text = text[:idx] + '\n' + imp + text[idx:]
    path.write_text(text)
    print('ok', path.name)


root = Path(__file__).resolve().parents[1]
replace_hero(root / 'app/programs/page.tsx', 'programs')
replace_hero(root / 'app/events/page.tsx', 'events')
replace_hero(root / 'app/support/page.tsx', 'support')
