# Biela Noc — Hosting & Cost Analysis

## Traffic Profile

- **Festival days** (3–4 nights/year): ~100,000 visitors/day
- **Rest of year**: negligible (a few visits/day)
- **Monthly peak**: ~300–400k visits concentrated in one weekend

## Current Monthly Cost: $0

All services run on free tiers.

---

## Services

| Service | Role | Free Tier Limits |
|---------|------|-----------------|
| [Vercel](https://vercel.com) (Hobby) | App hosting, CDN, serverless | 100 GB bandwidth/mo |
| [Neon](https://neon.tech) (Free) | PostgreSQL 17 database | 0.5 GB storage, 191 compute-hours/mo, auto-suspend |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) (Free) | Media storage (S3-compatible) | 10 GB storage, 10M reads/mo, **zero egress fees** |
| [Firebase](https://firebase.google.com/) (Spark) | Push notifications (FCM) | Unlimited sends |
| [GitHub](https://github.com) (Free) | Source code, CI/CD | 2,000 Actions minutes/mo |
| Google Analytics | Traffic analytics | Free |

---

## Bandwidth Split (Festival Weekend, 300k visitors)

Images are served directly from Cloudflare R2 CDN, not through Vercel. This keeps Vercel bandwidth low.

| Traffic type | Served by | Estimated load | Free limit |
|---|---|---|---|
| HTML + JS/CSS (static pages) | Vercel edge CDN | ~50–100 GB | 100 GB/mo |
| Images (artist photos, maps) | Cloudflare R2 CDN | ~150–600 GB | No bandwidth cap (zero egress) |
| API/DB queries | Neon (via serverless) | Minimal (pages are static) | 191 compute-hrs |

---

## Why It Scales to 100k/day at $0

1. **Static generation** — all pages pre-built as HTML, served from edge CDN. No server-side render per visitor.
2. **Images bypass Vercel** — R2 public CDN handles all media, Vercel only serves HTML/JS.
3. **R2 zero egress** — unlike AWS S3, Cloudflare charges per-request only, not per-GB transferred.
4. **Neon auto-suspends** — database sleeps between festivals, uses almost no compute hours.
5. **Edge caching** — 100k visitors hitting the same cached page = 1 render, not 100k renders.

---

## Cost Scenarios

| Scenario | When | Estimated Cost |
|----------|------|---------------|
| Normal year (festivals within limits) | Edge cache hit rate >95% | **$0/year** |
| R2 reads spike (20–30M requests) | Festival weekend with many image loads | **$3–7** one-time |
| Vercel bandwidth exceeded | Unlikely, but if >100 GB HTML/JS served | **$20/month** (Pro plan, upgrade for Oct only) |
| Worst-case annual total | Everything above combined | **$25/year** |

---

## Overage Pricing (If Limits Exceeded)

| Service | What triggers payment | Price |
|---------|----------------------|-------|
| Vercel | >100 GB bandwidth/mo | Pro plan: $20/mo (can upgrade/downgrade monthly) |
| Cloudflare R2 | >10M reads/mo | $0.36 per million reads |
| Cloudflare R2 | >10 GB stored | $0.015/GB/mo |
| Neon | >0.5 GB storage or need always-on | Launch plan: $19/mo |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Vercel 100 GB hit | Site may throttle | Monitor during festival; upgrade to Pro ($20) if needed, downgrade after |
| R2 read spike | Small overage charge | Even 50M reads = $14. Budget-safe. |
| Neon cold start | ~1–2s on first visit after long idle | Only affects first visitor of the day, then DB stays warm |
| DDoS / bot traffic | Bandwidth waste | Cloudflare built-in DDoS protection; Vercel basic protection |
| Vercel Hobby commercial use | ToS technically requires Pro for commercial | Festival is non-profit/cultural — likely fine, but Pro is $20 if needed |

---

## Comparison: Old vs New Setup

| | Old (Strapi + VPS) | New (Next.js + Payload + Serverless) |
|---|---|---|
| Monthly cost | ~$10–50/mo (always running) | $0 (sleeps when idle) |
| Annual cost | ~$120–600 | $0–25 |
| Handles 100k/day | Probably not without upgrade | Yes, by design (static + CDN) |
| Admin downtime risk | VPS crashes, manual restart | Auto-scales, no single point of failure |
| Media delivery | Through app server (bottleneck) | Direct CDN (Cloudflare global network) |

---

## Summary

> **Annual hosting cost: $0–25.** The architecture is designed so that the festival's peak traffic (100k visitors/day) is handled entirely by edge CDN caches and Cloudflare's free media delivery. The database and serverless functions are barely touched because all public pages are pre-generated static HTML.
