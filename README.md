# Biela Noc — Festival Website

Website and content management system for the Biela Noc (White Night) contemporary art festival in Bratislava and Košice, Slovakia.

## Status

✅ **Ready for launch**

- [x] Phase 1: Foundation (Next.js 15 + Payload CMS 3 + PostgreSQL + Tailwind)
- [x] Phase 2: Data Model (11 collections, 7 globals)
- [x] Phase 3: Public Pages (frontend)
- [x] Phase 4: Integrations (push notifications, SEO, analytics)
- [x] Phase 5: Polish & Launch (performance, a11y, migration, deployment)

See [docs/](./docs/) for full specification.

## Hosting

All free tier — $0/month:

| Service | Role | Free Tier Limits |
|---------|------|-----------------|
| **Vercel** | App hosting + CDN | 100GB bandwidth/mo, serverless |
| **Neon** | PostgreSQL 17 database | 0.5GB storage, autoscaling |
| **Cloudflare R2** | Media storage (images, audio) | 10GB storage, 10M reads/mo |

## Stack

- **Next.js 15** — React framework with SSR
- **Payload CMS 3.84** — Headless CMS (runs inside Next.js)
- **PostgreSQL 17** — Database (Neon)
- **Tailwind CSS 4** — Styling
- **TypeScript 5** — Language
- **Cloudflare R2** — Media storage (S3-compatible)

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          ← Public website
│   │   ├── [year]/[city]/   ← Dynamic year/city routes
│   │   ├── layout.tsx       ← Frontend layout
│   │   └── page.tsx         ← Homepage
│   └── (payload)/           ← Admin panel (auto-generated)
│       └── admin/
├── collections/             ← Payload content types
│   ├── Artists.ts
│   ├── Partners.ts
│   ├── Filters.ts
│   ├── Routes.ts
│   ├── DateEntries.ts
│   ├── MP3Records.ts
│   ├── Contacts.ts
│   ├── Articles.ts
│   ├── Notifications.ts
│   ├── Users.ts
│   └── Media.ts
├── globals/                 ← Payload single-instance content
│   ├── FestivalSettings.ts
│   ├── TicketSettings.ts
│   ├── PracticalInfo.ts
│   ├── Volunteers.ts
│   ├── SupportUs.ts
│   ├── PressKit.ts
│   └── AboutPage.ts
└── payload.config.ts        ← Main CMS configuration
```

## Development

```bash
git clone https://github.com/bielanoc/bielanoc-web.git
cd bielanoc-web
pnpm install
cp .env.example .env.local
# Fill in DATABASE_URL and PAYLOAD_SECRET
pnpm dev
```

Then open:
- `http://localhost:3000` — Public website
- `http://localhost:3000/admin` — Admin panel (create first user on initial visit)

## Content Migration

Migration script (`scripts/migrate-strapi.ts`) imports data from the old Strapi PostgreSQL dump.

**Migrated automatically (text data):**

| Collection | Records | Notes |
|------------|---------|-------|
| Artists | 415 | All editions (2020–2025), both cities |
| Filters | 3 | Colored category chips |
| Partners | 101 | All categories and years |
| Contacts | 14 | Team members |
| Date Entries | 79 | Event schedules |
| MP3 Records | 17 | Audio metadata |
| Routes | 1 | Walking route |
| Notifications | 236 | Push notification history |

**Not migrated (requires manual upload):**

| Data | Reason | Action |
|------|--------|--------|
| Artist images | Binary files not in SQL dump | Upload via admin panel or R2 bucket |
| Partner logos | Binary files not in SQL dump | Upload via admin panel or R2 bucket |
| Contact photos | Binary files not in SQL dump | Upload via admin panel |
| MP3 audio files | Binary files not in SQL dump | Upload via admin panel |
| Practical Info | Was stored as Strapi components (complex structure) | Re-enter in admin |
| Volunteers text | City-specific rich text | Re-enter in admin |
| Ticket settings | Dynamic config, not historical data | Configure in admin |
| About / Support Us | Rich text globals | Re-enter in admin |

Run migration:
```bash
node --env-file=.env.local --import tsx scripts/migrate-strapi.ts path/to/dump.sql
```

## Documentation

| Document | Description |
|----------|-------------|
| [01 - Project Overview](docs/01-project-overview.md) | What this project is |
| [02 - User Features](docs/02-user-features.md) | What visitors can do |
| [03 - Data Model](docs/03-data-model.md) | Content types and relationships |
| [04 - Pages and Routes](docs/04-pages-and-routes.md) | URL structure and navigation |
| [05 - Design and UI](docs/05-design-and-ui.md) | Visual identity and components |
| [06 - Technical Decisions](docs/06-technical-decisions.md) | Stack choices and rationale |
| [07 - Admin Features](docs/07-admin-features.md) | What organizers do in the CMS |
| [08 - Infrastructure](docs/08-infrastructure.md) | Hosting, CI/CD, deployment |
| [09 - Task List](docs/09-task-list.md) | Implementation plan |
| [10 - Admin Guide](docs/10-admin-guide.md) | CMS guide for content editors |
| [11 - Deployment](docs/11-deployment.md) | Production deployment instructions |

## License

MIT
