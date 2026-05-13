# Technical Decisions

## Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 15 | SSR for SEO, React ecosystem, Payload integration |
| CMS | Payload CMS 3 | Self-hosted, TypeScript, runs inside Next.js |
| Database | PostgreSQL | Proven, portable, rich query support |
| Styling | Tailwind CSS | Utility-first, fast development, good dark mode support |
| Media storage | Cloudflare R2 (dev) → Azure Blob / S3 (prod) | S3-compatible API, easy migration |
| Maps | Leaflet or Mapbox GL | TBD during implementation |
| Language | TypeScript | End-to-end type safety |
| Package manager | pnpm | Fast, disk-efficient |

## Architecture: Single Application

Payload CMS 3 runs as a plugin inside the Next.js app. One codebase, one deployment.

```
Browser request
  → Next.js server component
    → Payload Local API (direct DB query)
      → PostgreSQL
  → Rendered HTML returned to browser
```

No REST API calls from frontend to backend. No separate services to deploy.

Admin panel is auto-generated at `/admin`.

## Hosting Strategy

### Development Phase (free)

| Service | Purpose |
|---------|---------|
| GitHub (private repo) | Code, CI/CD |
| Vercel (free tier) | App hosting |
| Neon (free tier) | PostgreSQL |
| Cloudflare R2 (free tier) | Media storage |

### Production Phase (TBD)

Options being considered:
- Azure (nonprofit credits)
- Coolify on VPS
- Slovak hosting provider

Migration path: Docker image + pg_dump + file copy. Half-day effort.

## Portability Rules

To ensure we can move hosting later without rewriting:

1. No Vercel-specific features (no Edge Runtime, no Vercel Blob, no Vercel KV)
2. Standard `next build && next start` — must work in Docker
3. S3-compatible storage adapter (works with R2, AWS, Azure, MinIO)
4. Environment variables for all configuration
5. No vendor-specific CDN features

## Internationalization

- Payload's built-in localization (field-level, not document-level)
- Two locales: `sk` (default), `en`
- Language toggle in UI, stored in cookie
- URL does NOT include locale prefix

## Year/City Scoping

- URL pattern: `/:year/:city/...`
- Year: `y2025`, `y2024`, etc.
- City: `ba`, `ke`
- Default: latest year + Bratislava
- All content is queryable by year and city

## Authentication

- Admin panel: email/password (Payload built-in)
- Public site: no authentication required
- No user accounts for visitors

## SEO

- Server-side rendering for all public pages
- Dynamic sitemap generation
- Open Graph meta tags for social sharing
- Structured data (JSON-LD) for events

## Performance

- Next.js Image optimization (WebP, responsive sizes)
- Static generation for archive pages (ISR)
- Server components by default (no unnecessary client JS)
- Lazy loading for below-fold content
