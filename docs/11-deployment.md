# Production Deployment

## Free Hosting Stack (Recommended)

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Vercel** | App hosting, CDN, edge | 100GB bandwidth/mo, serverless functions |
| **Neon** | PostgreSQL 17 | 0.5GB storage, autoscaling to zero |
| **Cloudflare R2** | Media storage (S3-compatible) | 10GB storage, 10M reads/mo |

Total cost: **$0/month** for a festival website with moderate traffic.

## Vercel Setup (Primary)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import the GitHub repository `bielanoc/bielanoc-web`
3. Framework preset is auto-detected as **Next.js**
4. Add environment variables (see table below)
5. Deploy — Vercel handles builds, CDN, SSL, and edge routing

### Custom domain

1. In Vercel project → **Settings → Domains**
2. Add `bielanoc.sk`
3. Update DNS: set A record to `76.76.21.21` or CNAME to `cname.vercel-dns.com`
4. SSL certificate is provisioned automatically

### Automatic deployments

- Every push to `main` triggers a production deploy
- Pull requests get preview deployments with unique URLs

## Docker (Alternative)

For self-hosted or VPS deployment:

```bash
docker build -t bielanoc-web .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e PAYLOAD_SECRET="..." \
  -e S3_ENDPOINT="..." \
  -e S3_BUCKET="..." \
  -e S3_ACCESS_KEY="..." \
  -e S3_SECRET_KEY="..." \
  -e NEXT_PUBLIC_SITE_URL="https://bielanoc.sk" \
  -e NEXT_PUBLIC_GA_ID="G-XXXXXXX" \
  bielanoc-web
```

### Health Check

The container includes a health check endpoint at `/api/health` that returns `{"status":"ok"}`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Yes | Random string for JWT signing |
| `S3_ENDPOINT` | Yes | Cloudflare R2 endpoint |
| `S3_BUCKET` | Yes | R2 bucket name |
| `S3_ACCESS_KEY` | Yes | R2 access key ID |
| `S3_SECRET_KEY` | Yes | R2 secret access key |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL (for sitemap, OG tags) |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | No | Firebase credentials for push notifications |

## Database

- **Provider:** Neon (serverless PostgreSQL 17)
- **Migrations:** Run `pnpm generate:migrations` after schema changes, then deploy
- Payload auto-runs migrations on startup

## Media Storage

- **Provider:** Cloudflare R2 (S3-compatible)
- Configure bucket CORS to allow uploads from admin domain
- Set public access or use signed URLs

## DNS & SSL

1. Point `bielanoc.sk` A record to hosting provider
2. SSL is automatic (Vercel) or via Cloudflare proxy

## Content Migration

Run the migration script to import data from the old Strapi database:

```bash
pnpm tsx scripts/migrate-strapi.ts path/to/dump.sql
```

This imports artists, filters, partners, contacts, dates, MP3 records, routes, and notifications. Media files (images, audio) must be uploaded separately via the admin panel.
