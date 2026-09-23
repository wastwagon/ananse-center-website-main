# The Ananse Center for Arts and Culture

Public website and admin CMS. Day-to-day copy, photos, events, programs, news, the contact map, and partner logos are edited in Admin. No code change is required when real content is ready.

**Handover for the center team (urgent):** [docs/CMS-HANDOVER.md](docs/CMS-HANDOVER.md)

**Production deploy:** [COOLIFY.md](COOLIFY.md)

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Site: http://localhost:3035
- Admin: http://localhost:3035/admin/login
- API health: http://localhost:4035/api/v1/health
