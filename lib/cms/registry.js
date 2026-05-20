"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTENT_KEYS = exports.CONTENT_REGISTRY = void 0;
exports.isContentKey = isContentKey;
exports.getRegistryEntry = getRegistryEntry;
exports.CONTENT_REGISTRY = {
    'home.hero.lead': {
        label: 'Home — hero lead',
        section: 'home',
        defaultBody: 'Preserving heritage, restoring identity, and developing the next generation of Pan-African leaders through Sankofa arts and culture programs in Ghana and across the diaspora.',
    },
    'home.story': {
        label: 'Home — our story (paragraphs)',
        section: 'home',
        hint: 'Separate paragraphs with a blank line.',
        defaultBody: 'In Akan tradition, Ananse the spider weaves webs that connect generations — stories that heal, teach, and unite.\n\nOur center is a gathering place where ancestral wisdom meets contemporary creativity: for students finding pathways to heritage, for the diaspora returning home, and for communities celebrating who we are.',
    },
    'about.mission': {
        label: 'About — mission summary',
        section: 'about',
        defaultBody: 'We weave wisdom into solutions by connecting cultural knowledge with practical programs that empower youth and communities.',
    },
    'about.hero.lead': {
        label: 'About — hero description',
        section: 'about',
        defaultBody: 'Rooted in tradition and reaching toward the future — a beacon for cultural preservation, healing, and Pan-African leadership in Ghana.',
    },
    'programs.hero.lead': {
        label: 'Programs — hero description',
        section: 'programs',
        defaultBody: 'Six flagship Sankofa initiatives developing whole persons — spiritually, academically, and as community leaders.',
    },
    'events.hero.lead': {
        label: 'Events — hero description',
        section: 'events',
        defaultBody: 'Festivals, workshops, and retreats that bring our mission to life — join gatherings across Ghana and the diaspora.',
    },
    'support.hero.lead': {
        label: 'Support — hero description',
        section: 'support',
        defaultBody: 'Your generosity sustains arts education, community programs, and cultural leadership development.',
    },
    'contact.hero.lead': {
        label: 'Contact — hero description',
        section: 'contact',
        defaultBody: 'We would love to hear from you — partnerships, programs, visits, and press inquiries are welcome.',
    },
    'videos.hero.lead': {
        label: 'Videos — hero description',
        section: 'videos',
        defaultBody: 'Stories, performances, and teachings from The Ananse Center community.',
    },
    'site.footer.mission': {
        label: 'Site — footer mission',
        section: 'site',
        defaultBody: 'Preserving cultural memory and restoring identity through arts education, community programs, and Pan-African leadership development in Ghana and across the diaspora.',
    },
};
exports.CONTENT_KEYS = Object.keys(exports.CONTENT_REGISTRY);
function isContentKey(key) {
    return key in exports.CONTENT_REGISTRY;
}
function getRegistryEntry(key) {
    return exports.CONTENT_REGISTRY[key];
}
