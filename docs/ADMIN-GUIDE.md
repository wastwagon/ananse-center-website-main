# ANANSE Admin — short guide

For **ANANSE Center for Leadership Development** staff. Login: **`/admin/login`**. Change the default password on first use; add editors under **Users**.

**Full inventory:** [DAY-1-INVENTORY.md](./DAY-1-INVENTORY.md) · **Deploy:** [COOLIFY.md](../COOLIFY.md)

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
- **Published** off = draft

Wisdom Nuggets, study PDFs, book lists, and **recorded** conversations belong in **Library**, not Insights.

---

## 4. Library (listen / watch / read)

**Admin → Library**

- **Shelf:** listen, watch, or read  
- **Collection:** must match the approved shelf lists (e.g. Midday Reflection, Excellence Lectures, Wisdom Nuggets)  
- One record can hold **audio + video + transcript + further study + wisdom nugget**  
- Link **program** and **person** (speaker) when relevant  
- Midday episodes: set episode number, scripture/theme, and media URLs  

**Midday Reflection:** program page `/programs/midday-reflection` ↔ archive `/library/midday-reflection`.

---

## 5. Photo albums

**Admin → Photo albums**

- Collection: Events, Lectures, Conferences, Mentorship, People, Community Engagement, Special Programs, Historical Archive  
- Add images via gallery field; set cover, date label, place, optional program/event link  
- Public URL: `/library/photos/[slug]`

---

## 6. People

**Admin → People**

- **Groups:** Leadership, Mentors, Speakers & Faculty, Fellows/Participants, Partners (multi-select allowed)  
- **Organization partners:** check “organization”, add logo, optional website — no personal contact fields  
- **Published** only when permission is documented internally

---

## 7. Events

**Admin → Events**

- **Delivery:** in person, online, or hybrid  
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
