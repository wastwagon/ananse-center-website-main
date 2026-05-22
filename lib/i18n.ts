/** i18n — UI chrome strings (CMS page copy stays English until translated in admin). */
export const defaultLocale = 'en' as const
export type Locale = 'en' | 'fr'
export const locales: readonly Locale[] = ['en', 'fr'] as const

const messages: Record<Locale, Record<string, string>> = {
  en: {
    'global.band.eyebrow': 'Worldwide community',
    'global.band.heading': 'Serving Ghana and the diaspora',
    'global.band.body':
      'Programs, events, and partnerships connect Accra with Pan-African communities across the Americas, Europe, and beyond.',
    'global.band.cta': 'Join our newsletter',
    'nav.home': 'Home',
    'nav.programs': 'Programs',
    'nav.events': 'Events',
    'nav.donate': 'Donate',
    'nav.contact': 'Contact',
    'nav.about': 'About',
    'nav.videos': 'Videos',
    'nav.privacy': 'Privacy',
    'nav.terms': 'Terms',
    'nav.more': 'More',
    'nav.donateNow': 'Donate Now',
    'nav.repatriation': 'Repatriation',
    'nav.visit': 'Visit',
    'nav.admissions': 'Admissions',
    'nav.community': 'Community',
    'nav.news': 'News',
    'nav.resources': 'Resources',
    'nav.archives': 'Archives',
    'nav.trustees': 'Trustees',
    'nav.transparency': 'Transparency',
    'nav.search': 'Search',
    'nav.partnerships': 'Partnerships',
    'footer.impact': 'Our impact',
    'footer.explore': 'Explore',
    'footer.connect': 'Connect',
    'locale.label': 'Language',
    'policy.contact': 'Contact us',
    'policy.home': 'Return home',
    'maintenance.admin': 'Admin sign in',
    'legal.badge': 'Legal',
    'notFound.badge': 'Page not found',
    'notFound.title': 'This page could not be found',
    'notFound.lead': 'The link may be outdated or the page may have moved. Try the home page or contact us.',
  },
  fr: {
    'global.band.eyebrow': 'Communauté mondiale',
    'global.band.heading': 'Au service du Ghana et de la diaspora',
    'global.band.body':
      'Programmes, événements et partenariats reliant Accra aux communautés panafricaines des Amériques, d\'Europe et d\'ailleurs.',
    'global.band.cta': 'Rejoindre notre newsletter',
    'nav.home': 'Accueil',
    'nav.programs': 'Programmes',
    'nav.events': 'Événements',
    'nav.donate': 'Don',
    'nav.contact': 'Contact',
    'nav.about': 'À propos',
    'nav.videos': 'Vidéos',
    'nav.privacy': 'Confidentialité',
    'nav.terms': 'Conditions',
    'nav.more': 'Plus',
    'nav.donateNow': 'Faire un don',
    'nav.repatriation': 'Rapatriement',
    'nav.visit': 'Visite',
    'nav.admissions': 'Admissions',
    'nav.community': 'Communauté',
    'nav.news': 'Actualités',
    'nav.resources': 'Ressources',
    'nav.archives': 'Archives',
    'nav.trustees': 'Administrateurs',
    'nav.transparency': 'Transparence',
    'nav.search': 'Recherche',
    'nav.partnerships': 'Partenariats',
    'footer.impact': 'Notre impact',
    'footer.explore': 'Explorer',
    'footer.connect': 'Contact',
    'locale.label': 'Langue',
    'policy.contact': 'Nous contacter',
    'policy.home': "Retour à l'accueil",
    'maintenance.admin': 'Connexion admin',
    'legal.badge': 'Juridique',
    'privacy.heading': 'Politique de confidentialité',
    'privacy.lead':
      'Le Centre Ananse pour les arts et la culture respecte votre vie privée. Cette page sera mise à jour avec notre politique complète avant le lancement public.',
    'privacy.body':
      'Nous collectons les informations que vous soumettez via les formulaires de contact et les inscriptions à la newsletter uniquement pour répondre aux demandes et partager les actualités des programmes. Nous ne vendons pas de données personnelles.',
    'terms.heading': "Conditions d'utilisation",
    'terms.lead':
      'En utilisant ce site, vous acceptez ces conditions. Le texte juridique complet sera publié avant le lancement. La participation aux programmes est soumise à des accords d\'inscription distincts.',
    'terms.body':
      'Le contenu de ce site est fourni à titre informatif. Les images et récits représentent notre mission ; les dates et offres spécifiques peuvent changer.',
    'notFound.badge': 'Page introuvable',
    'notFound.title': 'Cette page est introuvable',
    'notFound.lead':
      'Le lien est peut-être obsolète ou la page a été déplacée. Essayez l\'accueil ou contactez-nous.',
  },
}

/** Prefer French UI copy when locale is fr and a translation exists. */
export function localizedUiText(key: string, cmsFallback: string, locale: Locale): string {
  if (locale === defaultLocale) return cmsFallback
  const translated = t(key, locale)
  return translated !== key ? translated : cmsFallback
}

export function parseLocale(value: string | null | undefined): Locale {
  return value === 'fr' ? 'fr' : defaultLocale
}

export function t(key: string, locale: Locale = defaultLocale): string {
  return messages[locale][key] ?? messages.en[key] ?? key
}
