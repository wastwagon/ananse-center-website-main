# Handover — replace demo content with real ANANSE data

This build shows the **architecture and templates** filled with clearly marked preview samples so your team can see every page type before inserting real materials.

## What is demo vs real

| Kind | How to recognise | Action |
|------|------------------|--------|
| **Demo samples** | Slugs start with `demo-`. Body text begins with *Preview sample — for layout only…* | Unpublish or delete in Admin, then create your own records with the same fields |
| **Institutional Insights / Library Read** | Stage C copy from approved About / identity text (no `demo-` slug) | Keep, edit, or replace — these use your words |
| **Programs / About / Get Involved** | Architecture copy you supplied | Edit wording in Admin → Site content / Programs as needed |

Skip demo seed on a clean production database: set `SEED_DEMO_PREVIEW=false` before seeding.

## Day-1 template checklist (what you should see)

Open each route and confirm the pattern, then swap in real data:

1. **Home** — Welcome, Explore (Learn / Listen / Watch / Engage), ten programs, Midday episode, What’s new, Insights, People, Get involved (**incl. Contact**)  
2. **About** — jumps for Who We Are, Who We Serve, Story, ANANSE & Africa, Vision & Mission, Core Values (seven as a list), EAGLESonline  
3. **Programs** — detail pages with Related gatherings, From the Library, Photo albums  
4. **Events** — upcoming / past / postponed / cancelled; registration; media + related library + albums on a past event  
5. **Library** — Listen / Watch / Read shelves + **Photo Gallery** tab; Midday archive with audio, video, transcript, wisdom nugget, further study  
6. **Insights** — topic filters; article page with “More on this topic”  
7. **People** — five groups; person page with Talks and writings + Related gatherings (no personal phone/email)  
8. **Photo galleries** — albums under `/library/photos`  
9. **Get Involved** — Learn, Attend, Mentor, Partner, Support, Share + Contact  
10. **Search** — finds programs, events, library, people, insights (not arts archives)  

## Admin: how to replace a demo record

1. Log in at `/admin/login`  
2. Open the matching area (People, Events, Library, Photo albums, Insights)  
3. Find the `demo-…` item → unpublish or delete  
4. **Create** a new item with your title, media, links, and permissions  
5. Link **program**, **person**, and (for albums) **event** so related sections fill automatically  
6. Use **Featured** only when you want editorial highlighting (not the same as “most recent”)

## Caps for the first migration batch

Aligned with the OceanCyber outline: up to **15** library pieces, **8** events, **8** Insights, **12** people (with permission), **4** photo albums. Further batches are quoted separately.

## Permissions

- People profiles go live only with agreement  
- No personal phone or email on public profiles  
- Mentor form = expression of interest, not a guaranteed match  

## Docs

- [DAY-1-INVENTORY.md](./DAY-1-INVENTORY.md)  
- [ADMIN-GUIDE.md](./ADMIN-GUIDE.md)  
- [LAUNCH.md](./LAUNCH.md)  

## OceanCyber polish status (preview)

Done on the preview stack: leadership CMS defaults, admin News→Insights, Get Involved contact panel, arts URL redirects, legacy static-page defaults cleared.

**Final sweep (complete on preview):** Study/Heal/Give defaults → Learn/Engage/Give; admin dashboard Insights check; content preview hrefs map to leadership routes; sitemap drops `/contact` (use Get Involved); i18n legacy page strings softened; DB journey keys patched.

**Still needs their Coolify access:** production redeploy + DNS smoke ([LAUNCH.md](./LAUNCH.md)).  
**Still needs their materials:** replace `demo-*` records, Paystack live keys, map embed URL, logo/photos with permission.
