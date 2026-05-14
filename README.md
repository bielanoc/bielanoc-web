# Biela Noc — Festival Website

Website and content management system for the [Biela Noc](https://bielanoc-web.vercel.app/) (White Night) contemporary art festival in Bratislava and Košice, Slovakia.

## Live

- **Website:** https://bielanoc-web.vercel.app
- **Admin CMS:** https://bielanoc-web.vercel.app/admin

## Status

✅ **Deployed and live**

- [x] Phase 1: Foundation (Next.js 15 + Payload CMS 3 + PostgreSQL + Tailwind)
- [x] Phase 2: Data Model (11 collections, 7 globals)
- [x] Phase 3: Public Pages (frontend)
- [x] Phase 4: Integrations (push notifications, SEO, analytics)
- [x] Phase 5: Polish & Launch (performance, a11y, migration, deployment)

## Hosting

All free tier — $0/month:

| Service | Role | Free Tier Limits |
|---------|------|-----------------|
| [**Vercel**](https://vercel.com) | App hosting + CDN + serverless | 100GB bandwidth/mo |
| [**Neon**](https://neon.tech) | PostgreSQL 17 database | 0.5GB storage, autoscaling to zero |
| [**Cloudflare R2**](https://developers.cloudflare.com/r2/) | Media storage (S3-compatible) | 10GB storage, 10M reads/mo |

### URLs

| Resource | URL |
|----------|-----|
| Production app | `https://bielanoc-web.vercel.app` |
| Media (public) | `https://pub-bb450ef159ef4ef5acc99816228545a7.r2.dev` |
| R2 S3 API | `https://2b142d7f825a88e4a6cae8cd9983b3b5.r2.cloudflarestorage.com` |
| Database | Neon `ep-hidden-breeze-aq9cs9jk` (us-east-1) |

### Deployment

- Every push to `main` auto-deploys to production via Vercel
- Pull requests get preview deployments
- Environment variables configured in Vercel dashboard

## Stack

- **Next.js 15** — React framework with App Router, SSR
- **Payload CMS 3.84** — Headless CMS (embedded in Next.js, single deploy)
- **PostgreSQL 17** — Database (Neon serverless)
- **Tailwind CSS 4** — Styling
- **TypeScript 5** — Language
- **Cloudflare R2** — Media storage (S3-compatible, 3,300 files migrated)
- **Firebase Admin** — Push notifications

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          ← Public website
│   │   ├── [year]/[city]/   ← Dynamic year/city routes
│   │   ├── layout.tsx       ← Frontend layout (skip-to-content, nav, footer)
│   │   └── page.tsx         ← Homepage (city selection)
│   ├── (payload)/           ← Admin panel (auto-generated)
│   │   └── admin/
│   └── api/health/          ← Health check endpoint
├── collections/             ← Payload content types (11 collections)
├── globals/                 ← Payload single-instance content (7 globals)
├── components/              ← Shared React components
├── lib/                     ← Utilities (payload client, firebase, constants)
└── payload.config.ts        ← Main CMS configuration
```

## Development

```bash
git clone https://github.com/bielanoc/bielanoc-web.git
cd bielanoc-web
pnpm install
cp .env.example .env.local
# Fill in DATABASE_URL, PAYLOAD_SECRET, S3 credentials
pnpm dev
```

Then open:
- `http://localhost:3000` — Public website
- `http://localhost:3000/admin` — Admin panel (create first user on initial visit)

## Content Migration

Migration from the old Strapi CMS has been completed.

**Migrated (text data via `scripts/migrate-strapi.ts`):**

| Collection | Records | Status |
|------------|---------|--------|
| Artists | 415 | ✅ All editions (2020–2025), both cities |
| Filters | 3 | ✅ Colored category chips |
| Contacts | 12 | ✅ Team members |
| Date Entries | 78 | ✅ Event schedules |
| MP3 Records | 17 | ✅ Audio metadata |
| Routes | 1 | ✅ Walking route |
| Notifications | 236 | ✅ Push notification history |

**Media files (uploaded to R2):**

| Type | Count | Status |
|------|-------|--------|
| All media (images, logos, audio) | 3,300 | ✅ Uploaded to R2 |

**Media linked (via `scripts/migrate-media.ts` + `scripts/link-media.ts`):**

| Type | Count | Status |
|------|-------|--------|
| Media documents | 751 | ✅ Created in Payload (8 failed: PDFs, video, corrupt images) |
| Artist images | 413 | ✅ Linked to artist records (1 name mismatch) |
| Partner logos | 99 | ✅ Partners created with logos |
| Contact photos | 12 | ✅ Linked to contact records |
| MP3 audio files | 0 | ⚠️ Field name mismatch — needs manual fix |

**Media serving:**

Images are served directly from R2 public CDN (`NEXT_PUBLIC_S3_URL` + filename).
The frontend resolves URLs via `process.env.NEXT_PUBLIC_S3_URL/${filename}` rather
than Payload's `/api/media/file/` proxy (which doesn't work for externally-uploaded files).

**Still needs manual setup in admin:**

| Data | Action |
|------|--------|
| Practical Info | Re-enter per city in admin (was Strapi components) |
| Volunteers text | Re-enter per city in admin |
| Ticket settings | Configure in admin |
| About / Support Us | Re-enter rich text in admin |

**Run full migration (if needed again on fresh DB):**

```bash
# 1. Import text data (artists, filters, contacts, dates, notifications)
node --env-file=.env.local --import tsx scripts/migrate-strapi.ts path/to/dump.sql

# 2. Upload media files to R2
unzip bielanoc.zip -d /tmp/bielanoc-media
aws s3 sync /tmp/bielanoc-media/bielanoc/ s3://bielanoc-media/ \
  --endpoint-url https://2b142d7f825a88e4a6cae8cd9983b3b5.r2.cloudflarestorage.com \
  --region auto

# 3. Create media documents in Payload
node --env-file=.env.local --import tsx scripts/migrate-media.ts path/to/dump.sql

# 4. Link media to artists, contacts (by name matching)
node --env-file=.env.local --import tsx scripts/link-media.ts path/to/dump.sql
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
