# Ananse Center Website — CMS Handover & Training Guide

Train the Ananse Center team to replace **placeholder** content with real content using Admin only. No coding is required for day-to-day updates.

Many seeded values are intentional placeholders (names, quotes, milestones, photos). Replace them when real assets are ready — the site stays usable in the meantime.

---

## 1. Access

| Item | Value |
|---|---|
| Public site | Local: `http://localhost:3035` · Production: your live URL |
| Admin | `/admin/login` |
| Admin email / password | From `.env`: `ADMIN_EMAIL` / `ADMIN_PASSWORD` |

**Security:** Change the admin password at handover. Add staff under **Admin → Users**.

---

## 2. Admin map (where to edit what)

| Goal | Where |
|---|---|
| Page copy, rich text, buttons, stats, menus, logo, favicon, heroes, SEO, section visibility | **Site Content** → `/admin/content` |
| Desktop navigation | `site.nav.primary` |
| Mobile bottom tabs | `site.nav.mobile` |
| Mobile “More” menu sheet | `site.nav.sheet` |
| Logo / favicon / Apple icon | `site.logo`, `site.favicon`, `site.appleIcon` |
| Footer mission, links, CTAs | `site.footer.*` |
| Global audience band (home) | `site.globalBand.*` |
| Events (dates, time, capacity, registration status, story, cover) | **Events** → `/admin/events` |
| Programs (catalog, covers, features) | **Programs** → `/admin/programs` |
| News / blog posts (rich text, cover, author, category, featured) | **News** → `/admin/news` |
| Self-hosted website analytics (pageviews, top pages) | **Analytics** → `/admin/analytics` |
| Photo uploads | **Media** → `/admin/media` |
| Phone, email, address, social, site name | **Settings** → `/admin/settings` |
| Trustees / board | `trustees.members` (+ `trustees.cta.*`) |

---

## 3. Editing Site Content

1. Open `/admin/content`
2. Filter by **section** and/or **search** the key
3. Click **Edit**
4. Use the editor shown in the **Editor** column:
   - **Rich text** — stories, mission, vision, long intros (Bold / H2 / lists / links)
   - **Image** — path field + **Choose from Media Library**
   - **JSON** — structured form editor (add/remove items). Use **Edit as raw JSON** if needed
   - **Text** — short labels
5. Keep **Published** on → **Save**
6. Optional: **Preview page** → hard-refresh the public site

### Sync after deployments
If new keys appear in code but not in the database, click **Sync registry** on `/admin/content`.

### Image paths
Upload in **Media**, then pick the file (URL like `/api/media/file/...`) into keys such as:

- `home.hero.image`, `about.hero.image`, `programs.hero.image`, `events.hero.image`
- `support.hero.image`, `contact.hero.image`, `videos.hero.image`
- `site.logo`, `site.favicon`, `site.appleIcon`
- `about.story.image`, `support.transparency.image`
- Optional `photoUrl` / `imageUrl` fields inside JSON cards

### JSON shapes (examples)

**Button / CTA**
```json
{ "label": "Donate Now", "href": "/support#donate" }
```

**Stats**
```json
[
  { "value": "500+", "label": "Lives Impacted" },
  { "value": "50+", "label": "Programs Delivered" }
]
```

**Nav / mobile tab**
```json
[
  { "label": "Home", "href": "/", "iconKey": "Home" },
  { "label": "Programs", "href": "/programs", "iconKey": "Sparkles" }
]
```

**Leadership / testimonial with optional photo**
```json
[
  {
    "name": "Full Name",
    "role": "Executive Director",
    "bio": "Short biography.",
    "initials": "FN",
    "photoUrl": "/api/media/file/YOUR_MEDIA_ID"
  }
]
```

**Section visibility** (missing keys default to visible)
```json
{
  "story": true,
  "testimonials": false,
  "cta": true
}
```

Keys: `home.sections.visible`, `about.sections.visible`, `programs.sections.visible`, `events.sections.visible`, `support.sections.visible`.

**SEO** (section filter: `seo`)
- `seo.home.title` / `seo.home.description` / `seo.home.ogImage`
- Same pattern for `about`, `programs`, `events`, `support`, `contact`, `videos`, and secondary pages

---

## 4. Priority checklist (replace placeholders first)

Anything marked **Placeholder** in Admin or below should be swapped for approved content before public launch.

### Settings (always)
- [ ] Phone, email, address, hours  
- [ ] Facebook / Instagram / YouTube / X (Twitter)  
- [ ] Site name / short name / tagline  

### Brand chrome
| Key | Notes |
|---|---|
| `site.logo` | Official logo |
| `site.favicon` / `site.appleIcon` | Optional; leave blank for generated letter mark |
| `site.nav.primary` | Desktop menu labels + hrefs |
| `site.nav.mobile` | Bottom tab bar (label, href, iconKey) |
| `site.nav.sheet` | Full mobile menu links |
| `site.footer.*` | Mission, quick links, program links, CTAs |
| `site.globalBand.*` | Worldwide community band on Home |

### Home
| Key | Replace with |
|---|---|
| `home.hero.lead` / `home.hero.trust` | Real short copy |
| `home.hero.cta.*` / `home.hero.stats` | Real CTAs + verified numbers |
| `home.hero.image` + `imageAlt` | Best campus / community photo |
| `home.story` | Official organization story (rich text) |
| `home.testimonials` | **Placeholder quotes** → approved stories (+ optional `photoUrl`) |
| `home.pillars` | Optional per-card `imageUrl` |
| `home.sections.visible` | Hide any section not ready |

### About
| Key | Replace with |
|---|---|
| `about.whoWeAre.body` | Real history |
| `about.mission` / `vision` | Official text |
| `about.timeline` | **Placeholder milestones** → real years |
| `about.team` | **Placeholder leaders** → real names, bios, `photoUrl` |
| `about.philosophy` | Optional `imageUrl` per card |
| `about.sections.visible` | Toggle sections |

### Programs
| Where | Replace with |
|---|---|
| `/admin/programs` | Real titles, descriptions, duration, level, features, covers |
| `programs.benefits` | Cards; optional `imageUrl`, `category` |
| `programs.testimonials` | **Placeholder** → approved quotes + `photoUrl` |
| `programs.sections.visible` | Toggle benefits / catalog / testimonials / CTA |

### Events
| Where | Replace with |
|---|---|
| `/admin/events` | Title, **date label**, starts/ends, time label, capacity, registration status |
| Story body | Rich text on the event form |
| Cover | Media picker on the event form |
| Status labels | `events.status.*` if wording should change |
| Newsletter | `events.newsletter.*` |
| Bottom CTAs | `events.cta.primary` / `secondary` |

**Date tip:** Prefer `August 15-17, 2026` or set **Starts at** / **Ends at**. Registration status: `auto` (from dates), `open`, `closed`, `waitlist`, `completed`.

### News & blog (`/admin/news`)
| Field | Notes |
|---|---|
| Title / slug | Slug auto-from title if blank |
| Date label | Display date on listing + detail |
| Author / category | Optional; defaults category `News` |
| Excerpt | Short summary on `/news` cards |
| Full story | Rich text editor → `/news/your-slug` |
| Cover image | Media picker (recommended) |
| Featured | Pins to top of listing |
| Published | Drafts stay off the public site |
| External link | Leave empty for on-site article; or paste an off-site URL |

Listing chrome (badge, heading, lead, CTAs, empty message): **Site Content → news.***  
Fallback JSON `news.items` is used only if zero posts exist in the database — prefer Admin → News.

**Seeded sample content:** 3 News + 3 Blog posts with cover images and full article pages ship for demo. Edit or replace them anytime under `/admin/news`. Filter on `/news` by All / News / Blog.

### Support / Contact / Videos
- Heroes, CTAs, donation tiers (`imageUrl` optional), other ways (`imageUrl`, `href`), transparency image  
- Videos grid: `videos.items` + `videos.card.badge`  
- Contact subjects: `contact.form.subjects`  

### Legal / secondary pages
- Privacy / Terms bodies (rich text) — currently placeholder legal copy  
- Visit, admissions, archives, partnerships, repatriation, transparency bodies  
- Trustees: `trustees.members` (**placeholder names**)  

### SEO
Walk section **seo** and set title + description (+ optional OG image) for each page before launch.

---

## 5. Images

### A. Event / program covers
1. Upload in **Media**  
2. Open event or program → choose cover → Save  

### B. Page heroes & CMS image keys
1. Upload in **Media**  
2. Paste URL into the matching `*.image` key  
3. Update `*.imageAlt`  

### C. Card / portrait photos inside JSON
Add `photoUrl` or `imageUrl` on the item (Media path). Structured JSON editor has an image picker for those fields.

### Photo guidance
- High resolution, people / workshops / campus  
- Consistent treatment  
- Always set alt text  
- Placeholder stock paths under `/images/` are fine until real photos arrive  

---

## 6. Events dating & registration

- Do not leave stale years that make the center look inactive  
- Good display labels: `August 15-17, 2026`, `Every Saturday in September`  
- Prefer filling **Starts at** / **Ends at** when you know exact schedule  
- Capacity is informational (set status to `waitlist` / `closed` manually when full)  
- Check `/events` after edits (Upcoming / Past / badges)  

---

## 7. Suggested training agenda (60–90 min)

1. Login & tour (10) — Dashboard, Content, Events, Programs, Media, Settings, News  
2. Settings (10) — Contact + social  
3. Brand chrome (10) — Logo, nav, footer, favicon  
4. Home hero + story (15) — Rich text + image + CTAs  
5. About + leadership placeholders (15)  
6. Programs + one cover (10)  
7. Events + schedule fields + Register (15)  
8. SEO + section visibility (5)  
9. Publish walkthrough on phone + desktop (10)  

---

## 8. Intentionally placeholder (change later)

These ship with clear placeholder / sample content so the site looks complete:

| Content | Keys / location |
|---|---|
| Leadership names | `about.team` |
| Board / trustees | `trustees.members` |
| Testimonials | `home.testimonials`, `programs.testimonials`, events highlight quote |
| Timeline milestones | `about.timeline` (+ lead text) |
| Impact stats | `home.hero.stats`, Settings impact stats — use **verified** numbers only |
| Legal policy text | `privacy.*`, `terms.*` |
| Contact map | `contact.map.*` (“coming soon” ok) |
| Hero / card photos | Stock `/images/...` until Media uploads |
| Partner logos / awards strip | Not built yet (Phase 2 if requested) |

---

## 9. Developer notes (your team)

```bash
# Full local stack
docker compose -f docker-compose.dev.yml up --build

# Site / API
http://localhost:3035
http://localhost:4035/api/v1/health

# Re-seed defaults (overwrites CMS bodies unless preserve flag is set)
docker exec ananse-backend-dev npm run db:seed
```

Protect custom edits during seed:
```bash
# backend env
CMS_PRESERVE_BODIES=1
```

Frontend registry: `lib/cms/registry.ts`  
Backend registry (keep in sync): `backend/src/cms/registry.ts`

---

## 10. Launch readiness (Admin dashboard)

On `/admin`, the **Launch readiness** card shows:

1. **Operations** — maintenance mode, contact email, published events/news, Paystack (online donate)
2. **Placeholder content** — CMS keys / news titles that still contain placeholder / “before launch” / “coming soon” copy

Clear both lists (or hide unfinished sections) before go-live.

### Forms QA (verified locally)

| Flow | Endpoint | Status |
|---|---|---|
| Contact | `POST /api/v1/contact` | Working |
| Newsletter | `POST /api/v1/newsletter/subscribe` | Working |
| Event RSVP | `POST /api/v1/events/register` | Working |
| Community story | `POST /api/v1/community/submit` | Working |
| Search | `GET /api/v1/search` | Working |
| News covers | `/api/media/file/:id` via site proxy | Working |
| Online donate | Paystack | **Requires keys** — until set, Support shows offline donate guidance |

Set in backend env (and matching public key for the web app):

```bash
PAYSTACK_SECRET_KEY=sk_live_...   # or sk_test_... for staging
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
```

Seed full demo News + Blog (3 each) after a fresh database:
```bash
docker exec ananse-backend-dev npm run db:seed:news
# or full seed (includes news when seed-assets are present)
docker exec ananse-backend-dev npm run db:seed
```

---

## 11. Handover sign-off

- [ ] Admin password changed  
- [ ] Settings contact + social verified  
- [ ] Logo (+ optional favicon) set  
- [ ] Nav / mobile nav reviewed  
- [ ] Home hero, story, CTAs updated  
- [ ] About Who We Are / mission / vision updated  
- [ ] Placeholder leadership + trustees replaced or sections hidden  
- [ ] Placeholder testimonials replaced or section hidden  
- [ ] ≥3 real programs with covers  
- [ ] ≥3 upcoming events with correct dates (+ status)  
- [ ] News / blog posts reviewed (covers + rich text)  
- [ ] Admin **Launch readiness** list empty (or intentional)  
- [ ] SEO titles/descriptions reviewed  
- [ ] Privacy / Terms reviewed by counsel  
- [ ] Donate + contact + event register tested  
- [ ] Mobile check completed  

---

## 12. Do / don’t

**Do**
- Title Case on buttons (`Donate Now`)  
- Use Media Library for photos  
- Hide unfinished sections with `*.sections.visible`  
- Keep JSON valid (use the structured editor)  

**Don’t**
- Leave fake leadership names live after launch  
- Publish unverified impact numbers  
- Leave old event years  
- Share admin passwords in chat — use a password manager  

---

Most storytelling, chrome, SEO, events, programs, and media updates are fully CMS-driven. If something cannot be changed from Admin, contact the development team.
