# Biela Noc — Festival Website

Website and content management system for the Biela Noc (White Night) contemporary art festival in Bratislava and Košice, Slovakia.

## Status

🚧 **Rewrite in progress** — see [docs/](./docs/) for full specification.

## Stack

- **Next.js 15** — React framework with SSR
- **Payload CMS 3** — Headless CMS (runs inside Next.js)
- **PostgreSQL** — Database
- **Tailwind CSS** — Styling
- **TypeScript** — Language

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

## Development

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## License

MIT
