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

**Secondary / legacy routes** (not in main menu): archives, visit, admissions, repatriation, trustees, transparency, videos, community, partnerships, resources — carried over from the prior arts site. They **redirect or render leadership-safe placeholder copy**; they are **not** content-ready ANANSE pages. Do not treat as primary IA.

---

## Admin (`/admin/login`)

| Area | Path | What you manage |
|------|------|-----------------|
| Dashboard | `/admin` | Launch readiness, KPIs |
| Site content | `/admin/content` | Copy, heroes, nav, footer, SEO keys, section visibility |
| Media | `/admin/media` | Uploads for covers, logos, gallery |
| Programs | `/admin/programs` | Ten program catalog entries |
| Events | `/admin/events` | Schedule, delivery, status, registration, covers |
| **Insights** | `/admin/insights` | Articles, topics, content types, featured, Library Read link (`/admin/news` redirects here) |
| Inbox | `/admin/inbox` | Community stories, event RSVPs |
| Contact | `/admin/contact` | Form messages |
| Newsletter | `/admin/newsletter` | Subscribers (**store only** — no sending yet) |
| Donations | `/admin/donations` | Paystack records |
| Analytics | `/admin/analytics` | Self-hosted pageviews |
| Settings | `/admin/settings` | Contact, social (incl. LinkedIn, WhatsApp), integrations |
| Users | `/admin/users` | Staff accounts |
| System | `/admin/system` | Production checklist, env warnings |

---

## Content entered (Stage C + demo handover pack)

| Type | Cap | Status for client review |
|------|-----|--------------------------|
| Insights | 8 | Seeded from approved institutional copy (edit/replace as needed) |
| Library (Read) | part of 15 | Stage C study / wisdom items from approved copy |
| Library (Listen/Watch + Midday) | part of 15 | **`demo-*` samples** — replace with real episodes and media |
| Events | 8 | **`demo-*` samples** (incl. past, postponed, cancelled) — replace with real dates |
| People | 12 | **`demo-*` samples** — replace with agreed profiles + permission |
| Photo albums | 4 | **`demo-*` samples** — replace with approved photographs |

All invented public samples say *Preview sample — for layout only…* and use `demo-` slugs. See [HANDOVER-DEMO.md](./HANDOVER-DEMO.md).

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

## What the client still supplies (after reviewing this pack)

1. Real Midday media, lectures, events, people (with permission), and photo albums — enter in Admin using the same fields shown by the demo records  
2. Production domain DNS + server access (see [LAUNCH.md](./LAUNCH.md))  
3. Live Paystack keys when ready to accept online gifts  
4. Logo, favicon, hero photography, counsel-reviewed Privacy/Terms  
5. Real contact address, map pin, social URLs (incl. LinkedIn / WhatsApp) in **Settings**

---

## Related docs

- **Replace demo → real:** [HANDOVER-DEMO.md](./HANDOVER-DEMO.md)  
- Short admin guide: [ADMIN-GUIDE.md](./ADMIN-GUIDE.md)  
- Detailed CMS handover (legacy arts notes may remain): [CMS-HANDOVER.md](./CMS-HANDOVER.md)  
- Coolify deploy: [../COOLIFY.md](../COOLIFY.md)  
- Go-live steps: [LAUNCH.md](./LAUNCH.md)
