# Biela Noc — Festival Website

Website and content management system for the Biela Noc (White Night) contemporary art festival in Bratislava and Košice, Slovakia.

## Status

🚧 **Rewrite in progress**

- [x] Phase 1: Foundation (Next.js 15 + Payload CMS 3 + PostgreSQL + Tailwind)
- [x] Phase 2: Data Model (11 collections, 7 globals)
- [ ] Phase 3: Public Pages (frontend)
- [ ] Phase 4: Integrations (push notifications, SEO, analytics)
- [ ] Phase 5: Polish & Launch

See [docs/](./docs/) for full specification.

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

## License

MIT
