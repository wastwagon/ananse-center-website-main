# ANANSE website — day-1 inventory

**Organization:** ANANSE Center for Leadership Development (subsidiary of EAGLESonline)  
**Stack:** Next.js public site + Admin CMS, PostgreSQL, Fastify API, Paystack donations, Coolify/VPS deploy  
**As of:** Stage D handover (visual polish + launch prep)

This inventory describes what is **live in the product** on day one. Content counts reflect Stage C seed caps where applicable; empty areas are intentional until the client supplies dates, media, permissions, or photos.

---

## Public site (primary navigation)

| Route | Purpose |
|-------|---------|
| `/` | Home — welcome, ten programs, Midday placeholder, what’s new, Insights tease, why ANANSE, people, get involved |
| `/about` | Who we are, story, vision & mission, seven core values (list), EAGLESonline |
| `/programs` | Ten leadership programs (catalog + detail pages) |
| `/library` | Listen / Watch / Read shelves + collections; links to Midday archive and photo galleries |
| `/library/midday-reflection` | Midday Reflection episode archive (empty until episodes published) |
| `/library/photos` | Photo albums by collection (empty until albums published) |
| `/library/[slug]` | Library record detail (audio, video, transcript, study fields) |
| `/events` | Gatherings — list + month view, in-person/online, registration |
| `/events/[slug]` | Event detail + registration (page remains after date) |
| `/insights` | Articles & reflections — topic + content-type filters; featured ≠ latest |
| `/insights/[slug]` | Insight detail |
| `/people` | Community profiles — five groups; no personal phone/email |
| `/people/[slug]` | Person or partner organization profile |
| `/get-involved` | Learn, Attend, Mentor, Partner, Support, Share + contact |
| `/support` | Paystack giving (offline guidance until live keys) |
| `/contact` | Contact (also linked from Get Involved) |
| `/accessibility` | Accessibility statement |
| `/privacy`, `/terms` | Legal pages (counsel review recommended) |
| `/search` | Site search (programs, events, insights, library, people, albums, pages) |

**Redirects:** `/news` → Insights (legacy news URL).

**Secondary / legacy routes** (not in main menu): archives, visit, admissions, repatriation, trustees, transparency, videos, community, partnerships, resources — may still exist from the prior arts site; do not treat as ANANSE primary IA.

---

## Admin (`/admin/login`)

| Area | Path | What you manage |
|------|------|-----------------|
| Dashboard | `/admin` | Launch readiness, KPIs |
| Site content | `/admin/content` | Copy, heroes, nav, footer, SEO keys, section visibility |
| Media | `/admin/media` | Uploads for covers, logos, gallery |
| Programs | `/admin/programs` | Ten program catalog entries |
| Events | `/admin/events` | Schedule, delivery, status, registration, covers |
| **Insights** | `/admin/insights` | Articles, topics, content types, featured, Library Read link |
| **Library** | `/admin/library` | Multi-format items (listen/watch/read), Midday fields |
| **Photo albums** | `/admin/photo-albums` | Galleries + collections |
| **People** | `/admin/people` | Profiles (permission-based; no personal phone/email) |
| News | `/admin/news` | Legacy news UI (public listing is Insights) |
| Inbox | `/admin/inbox` | Community stories, event RSVPs |
| Contact | `/admin/contact` | Form messages |
| Newsletter | `/admin/newsletter` | Subscribers (**store only** — no sending yet) |
| Donations | `/admin/donations` | Paystack records |
| Analytics | `/admin/analytics` | Self-hosted pageviews |
| Settings | `/admin/settings` | Contact, social (incl. LinkedIn, WhatsApp), integrations |
| Users | `/admin/users` | Staff accounts |
| System | `/admin/system` | Production checklist, env warnings |

---

## Content entered (Stage C — from approved copy only)

| Type | Cap | Day-1 status |
|------|-----|----------------|
| Insights | 8 | Seeded from institutional About/identity copy |
| Library (Read / study) | 15 | Seeded text items (incl. wisdom nuggets on core values) |
| Events | 8 | **0** — awaiting client dates/titles |
| People | 12 | **0** — awaiting agreed list + permission |
| Photo albums | 4 | **0** — awaiting images/captions |
| Midday episodes | — | **0** — awaiting real audio/video/transcripts |

Arts-era news in the database was unpublished so it does not appear as ANANSE Insights.

---

## Integrations & forms

| Feature | Status |
|---------|--------|
| Contact form | Working |
| Event registration | Working |
| Mentor / Get Involved interest | Working |
| Newsletter signup | Stores only (no email send) |
| Paystack donate | Requires live/test keys in env |
| Google Analytics | Optional via Settings or `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| LMS portal link | Optional via Settings or env |
| Legacy domain 301 | Optional via `LEGACY_SITE_HOST` |

---

## What the client still supplies (post day-1)

1. Production domain DNS + Coolify access (see [LAUNCH.md](./LAUNCH.md))  
2. Live Paystack keys when ready to accept online gifts  
3. Events (up to 8), people (up to 12 with permission), Midday media, photo albums (up to 4)  
4. Logo, favicon, hero photography, counsel-reviewed Privacy/Terms  
5. Real contact address, map pin, social URLs in **Settings**

---

## Related docs

- Short admin guide: [ADMIN-GUIDE.md](./ADMIN-GUIDE.md)  
- Detailed CMS handover (legacy arts notes may remain): [CMS-HANDOVER.md](./CMS-HANDOVER.md)  
- Coolify deploy: [../COOLIFY.md](../COOLIFY.md)  
- Go-live steps: [LAUNCH.md](./LAUNCH.md)
