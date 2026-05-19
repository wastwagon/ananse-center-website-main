import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { eventImageForSlug } from '../../../../lib/images'

const EVENT_DB: Record<string, { title: string, date: string, location: string, venue: string, storyData: { title: string, paragraphs: string[], highlights: string[] } }> = {
  'ananse-storytelling-festival': {
    title: "Ananse Storytelling Festival",
    date: "March 15-17, 2025",
    location: "Accra, Ghana",
    venue: "National Theatre of Ghana",
    storyData: {
      title: "The Threads of Our Ancestors",
      paragraphs: [
        "When the evening fires are lit and the night sky blankets Accra, the timeless tradition of storytelling takes center stage. The Ananse Storytelling Festival is a celebration of our oral history, where griots and master storytellers gather to weave tales of triumphs, cautionary wisdom, and laughter.",
        "Just as the legendary Ananse spins his web, these stories connect generations. Through vibrant performances and communal sharing, we keep the heartbeat of our heritage alive, ensuring that our children inherit the profound wisdom of their forebears."
      ],
      highlights: [
        "Mesmerizing performances by renowned African storytellers.",
        "Interactive workshops on the art of oral history.",
        "A vibrant marketplace of traditional crafts and literature.",
        "Evening bonfire sessions under the stars."
      ]
    }
  },
  'kente-weaving-workshop-series': {
    title: "Kente Weaving Workshop Series",
    date: "Every Saturday in April 2025",
    location: "Kumasi, Ghana",
    venue: "Ashanti Cultural Center",
    storyData: {
      title: "Mastering the Loom of Kings",
      paragraphs: [
        "Kente is more than just cloth; it is the woven language of the Ashanti kings. In this immersive workshop nestled in the heart of Kumasi, you will trace the rich history of the royal loom and the intricate meanings behind every color and pattern.",
        "Under the patient guidance of master weavers, your hands will learn the rhythm of the loom. By the end of this journey, you won't just hold a piece of fabric—you will carry forward a sacred tradition that speaks of pride, resilience, and artistry."
      ],
      highlights: [
        "Hands-on loom training from authentic Ashanti weavers.",
        "Deep dive into the symbolism of Kente colors and geometric designs.",
        "Take home your own hand-woven Kente strip.",
        "Exclusive tours of historic weaving villages."
      ]
    }
  },
  'diaspora-reconnection-retreat': {
    title: "Diaspora Reconnection Retreat",
    date: "May 10-12, 2025",
    location: "Cape Coast, Ghana",
    venue: "Elmina Heritage Resort",
    storyData: {
      title: "The Journey Back Home",
      paragraphs: [
        "For centuries, the shores of Cape Coast bore witness to departures that fractured communities. Today, they welcome back the children of the diaspora with open arms. This retreat is a profound journey of healing, reflection, and spiritual reconnection to the motherland.",
        "Through guided solemn visits to historic sites, soul-nourishing discussions, and joyous cultural ceremonies, we mend the broken threads. This is a sanctuary where you can reclaim your roots, find peace, and celebrate the enduring resilience of the African spirit."
      ],
      highlights: [
        "Solemn and restorative guided tours of the Cape Coast Castle.",
        "Traditional naming ceremonies welcoming you back to your heritage.",
        "Intimate group reflections and healing circles.",
        "Celebratory feasts featuring indigenous culinary traditions."
      ]
    }
  },
  'contemporary-african-art-exhibition': {
    title: "Contemporary African Art Exhibition",
    date: "June 1-30, 2025",
    location: "Accra, Ghana",
    venue: "Accra Arts Center",
    storyData: {
      title: "Visions of a New Africa",
      paragraphs: [
        "The canvas of Africa is constantly evolving. This month-long exhibition puts a spotlight on the bold, vibrant, and thought-provoking works of both emerging and established African artists who are redefining our global narrative.",
        "From striking visual arts to interactive digital installations, the exhibition challenges conventional perspectives while honoring deep-rooted heritages. It is a stunning visual dialogue that bridges our rich past with a boundless, innovative future."
      ],
      highlights: [
        "Curated galleries featuring over 50 contemporary African artists.",
        "Artist meet-and-greets and live creation sessions.",
        "Panel discussions on the intersection of modern art and identity.",
        "Exclusive previews and art auction evenings."
      ]
    }
  },
  'traditional-drumming-dance-festival': {
    title: "Traditional Drumming & Dance Festival",
    date: "July 20-22, 2025",
    location: "Tamale, Ghana",
    venue: "Tamale Jubilee Park",
    storyData: {
      title: "The Rhythm of the Northern Spirit",
      paragraphs: [
        "When the drums sound in the Northern Region, they do not just make noise; they call the spirit home. This festival is an explosive celebration of rhythm, where the pulsating beats of the talking drums command every heartbeat, and every dance step honors our ancestors.",
        "Surrounded by the vibrant energy of the community, you will witness spectacular choreographies that tell stories of harvest, war, and love. It is an unforgettable immersion into the raw, powerful expressions of Ghanaian culture."
      ],
      highlights: [
        "Live, thunderous drum circles and competitive dance showcases.",
        "Workshops on traditional drumming techniques.",
        "Grand processions showcasing diverse regional customs.",
        "Community feasts highlighting Northern Ghanaian cuisine."
      ]
    }
  },
  'cultural-heritage-symposium': {
    title: "Cultural Heritage Symposium",
    date: "September 5-7, 2025",
    location: "Accra, Ghana",
    venue: "University of Ghana",
    storyData: {
      title: "The Council of Wisdom",
      paragraphs: [
        "When the elders gather beneath the expansive branches of the Baobab tree, their words carry the weight of worlds. This symposium brings together leading scholars, historians, and cultural custodians to navigate the shifting sands of our time.",
        "Through profound discussion and shared intellect, we pull the vital threads of ancient wisdom to seamlessly weave innovative solutions for tomorrow. It is an intellectual gathering that challenges, inspires, and elevates our collective understanding of African heritage."
      ],
      highlights: [
        "Thought-provoking keynotes from leading African scholars.",
        "Dynamic panel discussions challenging modern paradigms.",
        "Interactive open forums prioritizing deep intellectual exchange.",
        "Networking with visionaries dedicated to heritage and progress."
      ]
    }
  }
};

// Fallback logic for unaccounted slugs
const getEventContent = (slug: string) => {
  if (EVENT_DB[slug]) return EVENT_DB[slug];

  const title = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title,
    date: "To Be Announced",
    location: "To Be Announced",
    venue: "Ananse Core Center",
    storyData: {
      title: "The Unfolding Tale",
      paragraphs: [
        "Every gathering is a vital new thread in the vast, continuous fabric of our community. We step into the circle not merely to witness, but to actively participate in the ongoing creation of our shared narrative.",
        "Guided by the enduring spirit of Ananse, the ultimate storyteller, we embrace the unexpected twists and profound connections that blossom when people come together with fully open hearts and minds."
      ],
      highlights: [
        "Immersive storytelling and community sharing sessions.",
        "Valuable opportunities to connect deeply with fellow attendees.",
        "A welcoming environment celebrating our collective heritage.",
        "Memorable, transformative experiences that resonate long after you leave."
      ]
    }
  };
};

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-950 text-xl font-medium text-white">
        Event not found
      </div>
    );
  }
  
  const event = getEventContent(slug);
  const storyData = event.storyData;

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-slate-950 text-xl font-medium text-white">
        Event not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-body">
      
      <section className="event-detail-hero">
        <Image
          src={eventImageForSlug(slug)}
          alt=""
          fill
          priority
          className="event-detail-hero-image"
          sizes="100vw"
        />
        <div className="event-detail-hero-scrim" aria-hidden />
        <div className="event-detail-hero-content page-section-container">
          <div className="event-detail-hero-inner">
            <span className="section-badge">Gathering</span>
            <h1 className="hero-page-title">{event.title}</h1>
            <div className="event-detail-meta">
              <span className="event-detail-meta-item">
                <Calendar size={16} className="text-accent" />
                {event.date}
              </span>
              <span className="event-detail-meta-item">
                <MapPin size={16} className="text-accent" />
                {event.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: CONTENT ── */}
      <section className="page-section bg-white py-16">
        <div className="page-section-container">
          
          {/* Story */}
          <div className="mb-12 animate-slide-up [animation-fill-mode:both] [animation-delay:100ms]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] mb-6 border-l-4 border-accent pl-4 font-heading">
              {storyData.title}
            </h2>
            <div className="space-y-6">
              {storyData.paragraphs.map((p, idx) => (
                <p key={idx} className="text-base leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid-cards mb-12 animate-slide-up [animation-fill-mode:both] [animation-delay:200ms]">
            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">When</h3>
              <p className="text-[#1A1A1A] text-lg font-medium">{event?.date}</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:border-primary-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Where</h3>
              <p className="text-[#1A1A1A] text-lg font-medium">{event?.location}</p>
              <p className="text-slate-500 mt-1 text-sm">{event?.venue}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-16 animate-slide-up [animation-fill-mode:both] [animation-delay:300ms]">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6 font-heading">Experience Highlights</h3>
            <ul className="space-y-4">
              {storyData.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <span className="text-accent mt-1 flex-shrink-0 text-xl leading-none transition-transform duration-300 ease-out group-hover:scale-125">✦</span>
                  <span className="text-slate-600 text-base leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center pt-10 border-t border-slate-100 mt-10 animate-slide-up [animation-fill-mode:both] [animation-delay:400ms]">
            <Link href="/contact#form" className="btn-primary hero-cta-primary">
              Reserve Your Place
            </Link>
            <p className="mt-6 text-sm text-slate-500">
              Have questions? <Link href="/contact#form" className="text-accent font-medium hover:underline">Contact our team</Link>
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
