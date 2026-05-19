/** Long-form event detail copy — seeded into Event rows (not duplicated on the public site). */
export type EventDetailSeed = {
  venue: string
  storyTitle: string
  storyBody: string
  highlights: string[]
}

export const EVENT_DETAIL_SEED: Record<string, EventDetailSeed> = {
  'ananse-storytelling-festival': {
    venue: 'National Theatre of Ghana',
    storyTitle: 'The Threads of Our Ancestors',
    storyBody:
      'When the evening fires are lit and the night sky blankets Accra, the timeless tradition of storytelling takes center stage. The Ananse Storytelling Festival is a celebration of our oral history, where griots and master storytellers gather to weave tales of triumphs, cautionary wisdom, and laughter.\n\nJust as the legendary Ananse spins his web, these stories connect generations. Through vibrant performances and communal sharing, we keep the heartbeat of our heritage alive, ensuring that our children inherit the profound wisdom of their forebears.',
    highlights: [
      'Mesmerizing performances by renowned African storytellers.',
      'Interactive workshops on the art of oral history.',
      'A vibrant marketplace of traditional crafts and literature.',
      'Evening bonfire sessions under the stars.',
    ],
  },
  'kente-weaving-workshop-series': {
    venue: 'Ashanti Cultural Center',
    storyTitle: 'Mastering the Loom of Kings',
    storyBody:
      "Kente is more than just cloth; it is the woven language of the Ashanti kings. In this immersive workshop nestled in the heart of Kumasi, you will trace the rich history of the royal loom and the intricate meanings behind every color and pattern.\n\nUnder the patient guidance of master weavers, your hands will learn the rhythm of the loom. By the end of this journey, you won't just hold a piece of fabric—you will carry forward a sacred tradition that speaks of pride, resilience, and artistry.",
    highlights: [
      'Hands-on loom training from authentic Ashanti weavers.',
      'Deep dive into the symbolism of Kente colors and geometric designs.',
      'Take home your own hand-woven Kente strip.',
      'Exclusive tours of historic weaving villages.',
    ],
  },
  'diaspora-reconnection-retreat': {
    venue: 'Elmina Heritage Resort',
    storyTitle: 'The Journey Back Home',
    storyBody:
      'For centuries, the shores of Cape Coast bore witness to departures that fractured communities. Today, they welcome back the children of the diaspora with open arms. This retreat is a profound journey of healing, reflection, and spiritual reconnection to the motherland.\n\nThrough guided solemn visits to historic sites, soul-nourishing discussions, and joyous cultural ceremonies, we mend the broken threads. This is a sanctuary where you can reclaim your roots, find peace, and celebrate the enduring resilience of the African spirit.',
    highlights: [
      'Solemn and restorative guided tours of the Cape Coast Castle.',
      'Traditional naming ceremonies welcoming you back to your heritage.',
      'Intimate group reflections and healing circles.',
      'Celebratory feasts featuring indigenous culinary traditions.',
    ],
  },
  'contemporary-african-art-exhibition': {
    venue: 'Accra Arts Center',
    storyTitle: 'Visions of a New Africa',
    storyBody:
      'The canvas of Africa is constantly evolving. This month-long exhibition puts a spotlight on the bold, vibrant, and thought-provoking works of both emerging and established African artists who are redefining our global narrative.\n\nFrom striking visual arts to interactive digital installations, the exhibition challenges conventional perspectives while honoring deep-rooted heritages. It is a stunning visual dialogue that bridges our rich past with a boundless, innovative future.',
    highlights: [
      'Curated galleries featuring over 50 contemporary African artists.',
      'Artist meet-and-greets and live creation sessions.',
      'Panel discussions on the intersection of modern art and identity.',
      'Exclusive previews and art auction evenings.',
    ],
  },
  'traditional-drumming-dance-festival': {
    venue: 'Tamale Jubilee Park',
    storyTitle: 'The Rhythm of the Northern Spirit',
    storyBody:
      'When the drums sound in the Northern Region, they do not just make noise; they call the spirit home. This festival is an explosive celebration of rhythm, where the pulsating beats of the talking drums command every heartbeat, and every dance step honors our ancestors.\n\nSurrounded by the vibrant energy of the community, you will witness spectacular choreographies that tell stories of harvest, war, and love. It is an unforgettable immersion into the raw, powerful expressions of Ghanaian culture.',
    highlights: [
      'Live, thunderous drum circles and competitive dance showcases.',
      'Workshops on traditional drumming techniques.',
      'Grand processions showcasing diverse regional customs.',
      'Community feasts highlighting Northern Ghanaian cuisine.',
    ],
  },
  'cultural-heritage-symposium': {
    venue: 'University of Ghana',
    storyTitle: 'The Council of Wisdom',
    storyBody:
      'When the elders gather beneath the expansive branches of the Baobab tree, their words carry the weight of worlds. This symposium brings together leading scholars, historians, and cultural custodians to navigate the shifting sands of our time.\n\nThrough profound discussion and shared intellect, we pull the vital threads of ancient wisdom to seamlessly weave innovative solutions for tomorrow. It is an intellectual gathering that challenges, inspires, and elevates our collective understanding of African heritage.',
    highlights: [
      'Thought-provoking keynotes from leading African scholars.',
      'Dynamic panel discussions challenging modern paradigms.',
      'Interactive open forums prioritizing deep intellectual exchange.',
      'Networking with visionaries dedicated to heritage and progress.',
    ],
  },
}
