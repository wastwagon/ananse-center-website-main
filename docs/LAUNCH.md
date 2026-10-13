# Redeploy on Coolify (Stage D)

This site **already runs** on the client’s Coolify stack (`docker-compose.yml` at the repo root). Stage D is **not** a new Coolify project and does **not** need new Coolify credentials for day-to-day deploy.

**What to do:** push (or sync) this repo to the **existing** Coolify application, then **Redeploy with rebuild** for `web` and `backend`.

**Env reference:** [config/coolify-production.env.example](../config/coolify-production.env.example)  
**Variable guide:** [COOLIFY.md](../COOLIFY.md)

Local `docker-compose.dev.yml` (`ananse-*-dev` on ports 3035 / 4035) is **preview only**. It is separate from production.

---

## Before redeploy

- [ ] Confirm Coolify is still pointed at this repo and root `docker-compose.yml`
- [ ] Keep existing production env (do **not** paste a fresh example over live secrets unless rotating them)
- [ ] After leadership content is safe on prod: `SKIP_PRISMA_SEED=true` so redeploys do not wipe content
- [ ] Rebuild **web** whenever `NEXT_PUBLIC_*` values change

---

## Redeploy sequence

### 1. Ship code

1. Push the Stage A–D work to the remote Coolify already watches (or sync the same way you usually update this app).
2. In Coolify → this **existing** application → **Redeploy** with **rebuild** for **web** and **backend**.
3. Confirm `GET /api/v1/health` and `GET /api/health` on the live host.

### 2. Database

1. On every backend container start, `docker-entrypoint.sh` runs `prisma migrate deploy` (all migrations under `backend/prisma/migrations`), then — unless `SKIP_PRISMA_SEED=true` — runs `prisma db seed` to completion before the API listens.
2. Do **not** leave seeding on after real content is live. Set `SKIP_PRISMA_SEED=true` (and usually `SEED_DEMO_PREVIEW=false`) so later redeploys only migrate. Stage C / demo upserts are for empty or handover databases.
3. Leave `ADMIN_ALLOW_SYSTEM_OPS=false` in production.

### 3. After redeploy smoke-test

1. Home / About / Programs / Library / Insights / People / Get Involved / Support.
2. `/admin/login` with the **existing** admin account.
3. Admin → Settings — confirm site name is ANANSE Center for Leadership Development.
4. Donate only if Paystack keys are already configured on this app.
5. Admin → **Site content** → **Sync registry** if chrome keys changed.
6. Optional: set `SKIP_PRISMA_SEED=true` and redeploy backend after seed is no longer needed.

---

## Smoke tests

| Check | Action |
|-------|--------|
| Home | `/` — leadership copy, no arts campus framing |
| Primary nav | About, Programs, Library, Events, Insights, People, Get Involved |
| Insights | `/insights` |
| Library | `/library` (Listen / Watch / Read + Photo Gallery) |
| Events | `/events` |
| Search | `/search?q=leadership` (no News/Archives hits) |
| Get Involved | `/get-involved#contact` — form + address/map panel |
| Contact redirect | `/contact` → `/get-involved#contact` |
| Donate | Only if Paystack already live |
| Mobile | Bottom nav + sheet scroll |
| Admin | News path redirects to Insights; Archives marked legacy |
| Publishing | Admin → Insights/Events/Library/People/Programs/Albums: **Draft** → public list/search hide (+ slug 404 if never published); **Published** → visible; **Scheduled** past → live after API boot / ~1 min; **noindex** → sitemap/lists hide, direct URL still loads |
| Junctions | Insight with 2+ programs shows both under Connected; Event ↔ Insight links appear on both detail pages |

---

## Not required

- Creating a new Coolify application
- New Coolify API tokens for the agent
- Re-entering Postgres / JWT / admin secrets (unless rotating them)
- Changing DNS (unless the live hostname itself is changing)

---

## Handback

1. [DAY-1-INVENTORY.md](./DAY-1-INVENTORY.md)
2. [ADMIN-GUIDE.md](./ADMIN-GUIDE.md)
3. Existing admin URL and login (password manager — not chat)
4. Empty areas still awaiting client materials: events, people, Midday media, albums

Monthly hosting and Paystack fees remain with the client per contract.
