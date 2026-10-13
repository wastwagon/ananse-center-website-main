# ANANSE Admin — short guide

For **ANANSE Center for Leadership Development** staff. Login: **`/admin/login`**. Change the default password on first use; add editors under **Users**.

**Full inventory:** [DAY-1-INVENTORY.md](./DAY-1-INVENTORY.md) · **Replace demo samples:** [HANDOVER-DEMO.md](./HANDOVER-DEMO.md) · **Deploy:** [COOLIFY.md](../COOLIFY.md)

---

## 0. First review (demo pack)

The site ships with `demo-*` sample people, events, Midday episodes, library items, and photo albums so every template is visible. Each invented item says *Preview sample — for layout only…*

**Before go-live:** unpublish or delete all `demo-*` records and enter real ANANSE materials using the same fields. Step-by-step: [HANDOVER-DEMO.md](./HANDOVER-DEMO.md).

---

## 1. Four content “homes” (do not mix them up)

| Public area | Meaning | Admin |
|-------------|---------|--------|
| **Programs** | Activities people join | `/admin/programs` |
| **Events** | Gatherings (same page after the date) | `/admin/events` |
| **Insights** | Thinking & writing **by topic** | `/admin/insights` |
| **Library** | What is **kept** — listen, watch, read, photos | `/admin/library`, `/admin/photo-albums` |

**People** = community profiles (`/admin/people`), not a staff directory. Publish only with permission. **Never** add personal phone numbers or email on profiles.

**Featured** is editorial (chosen in Admin), not the same as “most recent.”

---

## 2. First-day settings

1. **Settings** — site name, phone, email, address, hours, Facebook, Instagram, YouTube, X, **LinkedIn**, **WhatsApp**  
2. **Site content** → `site.logo` (upload in **Media** first)  
3. **Site content** → **Sync registry** once after deploy (adds new SEO/nav keys)  
4. **System** — confirm production checklist; fix env warnings with your host (OceanCyber)

---

## 3. Insights (articles)

**Admin → Insights**

- **Content type:** Articles, Essays, Leadership Reflections, Perspectives, Conversations (written), Special Reflections  
- **Topics:** pick from the 13 topics (filters on `/insights`, not menu items)  
- **Featured:** pin to the featured row on the listing  
- **Also in Library Read:** same article appears under Library → Read shelf  
- Cover image: Media picker  
- **Primary category** required to publish; topics still power filters  
- **Programs:** primary + “Also appears on” for multi-program links  
- **Linked gatherings:** optional EventInsight links (also editable from Events)  
- **Publishing:** Draft / In review / Scheduled / Published / Archived (Scheduled needs a publish time). Only Published (and due Scheduled) appear on public lists; `noindex` hides from lists/search/sitemap but direct URL still works with robots noindex.  
- **Related content:** optional pinned/hidden slugs to override automatic related lists  
- **Embeds:** in Full story, use **Embed** for YouTube, Vimeo, Spotify, or SoundCloud

Wisdom Nuggets, study PDFs, book lists, and **recorded** conversations belong in **Library**, not Insights.

---

## 4. Library (listen / watch / read)

**Admin → Library**

- **Shelf:** listen, watch, or read  
- **Collection:** must match the approved shelf lists (e.g. Midday Reflection, Excellence Lectures, Wisdom Nuggets)  
- One record can hold **audio + video + transcript + further study + wisdom nugget**  
- Optional **download** file (media picker or external URL) for PDFs and attachments  
- Link **program** and **person** (speaker) when relevant  
- Midday episodes: set episode number, scripture/theme, and media URLs  
- Same **Publishing** and **Related content** sections as Insights

**Midday Reflection:** program page `/programs/midday-reflection` ↔ archive `/library/midday-reflection`.

---

## 5. Photo albums

**Admin → Photo albums**

- Collection: Events, Lectures, Conferences, Mentorship, People, Community Engagement, Special Programs, Historical Archive  
- Add images via gallery field; set cover, date label, place, optional program/event/**people** links  
- Public URL: `/library/photo-gallery/[slug]` (older `/library/photos` links redirect here)  
- Same **Publishing** and **Related content** sections as Insights

---

## 6. People

**Admin → People**

- **Groups:** Leadership, Mentors, Speakers & Faculty, Fellows/Participants, Partners (multi-select allowed)  
- **Organization partners:** check “organization”, add logo, optional website — no personal contact fields  
- Set **Publishing → Published** only when permission is documented internally

---

## 7. Events

**Admin → Events**

- **Delivery:** in person, online, or hybrid  
- Same **Publishing** and **Related content** sections as Insights
- **Status:** upcoming, postponed, cancelled, completed (registration closes when cancelled/completed)  
- **Program link:** ties gathering to one of the ten programs  
- Cover + rich story; registration form on public detail page  

After the date, the event page **stays** as a record (including media/recording if added).

---

## 8. Programs

**Admin → Programs**

- Keep titles and short descriptions aligned with the ten ANANSE programs  
- Related **events** appear on the program detail page when linked

---

## 9. Site content & SEO

**Admin → Site content**

- Heroes, home sections, about copy, footer, nav (`site.nav.primary`, mobile tabs, sheet menu)  
- Hide sections not ready: `home.sections.visible`, `about.sections.visible`, etc.  
- **SEO** section: titles/descriptions for home, about, programs, events, insights, library, people, get involved  

---

## 10. Media & accessibility

1. Upload images/audio/video in **Media**  
2. Pick files in forms (covers, gallery, JSON image fields)  
3. Set **alt text** on heroes and meaningful photos (`*.imageAlt` keys or cover alt in Admin)  
4. When the client supplies transcripts, paste into Library **transcript** (or body)

---

## 11. Donations & maintenance

- **Paystack:** live keys only in server environment — not in Admin  
- **Maintenance mode:** Settings (shows maintenance page to public; Admin still works)  
- **Launch readiness** on Dashboard: clear placeholder warnings before go-live

---

## 12. Quick troubleshooting

| Issue | Check |
|-------|--------|
| New menu page 404 | Deploy latest web build |
| API errors on site | `GET /api/v1/health`, Coolify backend logs |
| Donate button inactive | `PAYSTACK_*` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`; rebuild **web** after public key change |
| Old arts copy on footer | Site content `site.footer.mission` or re-save from leadership defaults |
| Search missing new item | Item **published**? Reindex not required — search reads DB |

For engineering or hosting changes, contact **OceanCyber**.
