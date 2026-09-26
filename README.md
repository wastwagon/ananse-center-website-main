# ANANSE Center for Leadership Development

Public website and admin CMS for **ANANSE Center for Leadership Development** (EAGLESonline). Programs, events, insights, library, people, and site copy are edited in Admin without code changes.

| Doc | Purpose |
|-----|---------|
| [docs/DAY-1-INVENTORY.md](docs/DAY-1-INVENTORY.md) | What ships on go-live (routes, admin, content caps) |
| [docs/ADMIN-GUIDE.md](docs/ADMIN-GUIDE.md) | Short staff guide (Insights, Library, People, Events) |
| [docs/LAUNCH.md](docs/LAUNCH.md) | Coolify go-live checklist |
| [COOLIFY.md](COOLIFY.md) | Environment variables |
| [docs/CMS-HANDOVER.md](docs/CMS-HANDOVER.md) | Extended CMS reference (legacy arts notes may remain) |

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Site: http://localhost:3035
- Admin: http://localhost:3035/admin/login
- API health: http://localhost:4035/api/v1/health
