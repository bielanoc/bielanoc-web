# Infrastructure

## Development Environment

### Services (all free tier)

| Service | Purpose | Account |
|---------|---------|---------|
| GitHub (`bielanoc/bielanoc-web`) | Code, CI/CD | Organization |
| Vercel | App hosting | Connect to GitHub repo |
| Neon | PostgreSQL database | Free plan: 0.5 GB |
| Cloudflare R2 | Media/file storage | Free plan: 10 GB |

### Local Development

Prerequisites:
- Node.js 20+
- pnpm
- Docker (optional, for local PostgreSQL)

```bash
git clone https://github.com/bielanoc/bielanoc-web.git
cd bielanoc-web
pnpm install
cp .env.example .env.local
# Fill in Neon DB URL + R2 credentials
pnpm dev
```

### Environment Variables

```
# Database
DATABASE_URL=postgresql://...

# Payload
PAYLOAD_SECRET=random-secret-string

# Storage (S3-compatible)
S3_ENDPOINT=https://...r2.cloudflarestorage.com
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=bielanoc-media
S3_PUBLIC_URL=https://pub-....r2.dev

# Firebase (push notifications)
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY_BASE64=...
FIREBASE_CLIENT_EMAIL=...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## CI/CD Pipeline (GitHub Actions)

### On Pull Request
- Lint (ESLint)
- Type check (TypeScript)
- Build check

### On Push to Main
- Build
- Deploy to Vercel (automatic via Vercel GitHub integration)

### Database Migrations
- Payload handles migrations automatically
- Migration files committed to repo
- Applied on deployment

## Production (Future)

### Option A: Azure (if nonprofit approved)
- Azure Container Apps (app)
- Azure Database for PostgreSQL (DB)
- Azure Blob Storage (media)
- Azure CDN (delivery)
- ~0€/month with nonprofit credits

### Option B: VPS + Coolify
- Hetzner/Slovak VPS (~5-7€/month)
- Coolify dashboard for deployment
- Built-in PostgreSQL
- MinIO for S3-compatible storage

### Migration from Dev to Prod
1. Export database: `pg_dump` from Neon
2. Import to production PostgreSQL
3. Copy media files from R2 to production storage
4. Update DNS to point to new host
5. Update environment variables
6. Change GitHub Actions deploy target

Estimated effort: 4-6 hours.

## Backup Strategy (Production)

- Database: daily automated backups (managed service feature)
- Media: object storage is durable by design
- Code: GitHub is the source of truth
- Consider: weekly full backup to separate location

## Domain & DNS

- Domain: `bielanoc.sk` (verify ownership with organization)
- DNS management: wherever the domain is registered
- SSL: automatic via hosting provider (Vercel/Azure/Coolify all handle this)
