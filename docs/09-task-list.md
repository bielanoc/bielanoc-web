# Task List

Implementation tasks ordered by dependency and priority.

## Phase 1: Foundation ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Project scaffolding | ✅ Done | Next.js 15.5 + Payload 3.84 + TypeScript + pnpm |
| 1.2 | Database setup | ✅ Done | Neon PostgreSQL 17 (us-east-1) |
| 1.3 | Storage setup | ⏳ Pending | Cloudflare R2 — not yet configured, using local for now |
| 1.4 | Vercel deployment | ⏳ Pending | GitHub repo ready, needs Vercel connection |
| 1.5 | Environment config | ✅ Done | `.env.example` with all vars documented |
| 1.6 | Tailwind + dark theme | ✅ Done | Tailwind CSS 4 + PostCSS configured |
| 1.7 | Internationalization | ✅ Done | Payload locales: sk (default), en |

## Phase 2: Data Model (Payload Collections) ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Artist collection | ✅ Done | Localized fields, relations to filters/routes/dates/records |
| 2.2 | Filter collection | ✅ Done | Slug, title (localized), color, icon |
| 2.3 | Route collection | ✅ Done | Title (localized), city |
| 2.4 | Date Entry collection | ✅ Done | dateText, start/end datetime, display toggle |
| 2.5 | MP3 Record collection | ✅ Done | Title, description, file upload |
| 2.6 | Partner collection | ✅ Done | 11 categories, year, BA/KE flags |
| 2.7 | Contact collection | ✅ Done | Name, role (localized), email, photo, orderRank |
| 2.8 | Article collection | ✅ Done | Localized title/content, draft/publish |
| 2.9 | Notification collection | ✅ Done | Title, description, city |
| 2.10 | Ticket global | ✅ Done | Sale toggle, links + text per city |
| 2.11 | Practical Info global | ✅ Done | Repeatable sections per city, localized |
| 2.12 | Volunteers global | ✅ Done | Rich text per city, localized |
| 2.13 | Support Us global | ✅ Done | Localized rich text |
| 2.14 | Press Kit global | ✅ Done | Zip file upload |
| 2.15 | About Page global | ✅ Done | Localized rich text (replaced App Settings) |
| 2.16 | Festival Settings global | ✅ Done | Current year, date info, social links |

## Phase 3: Public Pages (Frontend) ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Layout (nav, footer, side menu) | ✅ Done | Responsive shell, city/year context nav |
| 3.2 | Homepage | ✅ Done | City selection, festival branding |
| 3.3 | Artist list page | ✅ Done | Masonry grid, filter chips with colored dots |
| 3.4 | Artist detail page | ✅ Done | Image, info, dates, audio player |
| 3.5 | Map page | ✅ Done | Leaflet with dark tiles (Carto), artist markers |
| 3.6 | Partners page | ✅ Done | Logo grid grouped by category |
| 3.7 | Tickets page | ✅ Done | Sale toggle, external buy links |
| 3.8 | Practical Info page | ✅ Done | Accordion panels with `<details>` |
| 3.9 | Volunteers page | ✅ Done | Rich text per city |
| 3.10 | Contact page | ✅ Done | Team grid with photos |
| 3.11 | About page | ✅ Done | Rich text from global |
| 3.12 | Support Us page | ✅ Done | Rich text from global |
| 3.13 | Press page | ✅ Done | Zip download |
| 3.14 | Archive page | ✅ Done | Links to past editions |
| 3.15 | Article detail page | ✅ Done | Rich text article |
| 3.16 | Mobile App page | ✅ Done | App Store + Google Play links |
| 3.17 | Scroll to top button | ✅ Done | FAB component, appears after 300px scroll |

## Phase 4: Integrations ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Firebase push notifications | ✅ Done | afterChange hook on Notifications, topics per city |
| 4.2 | Sitemap generation | ✅ Done | Dynamic `/sitemap.xml` with all pages + artists + articles |
| 4.3 | Open Graph meta tags | ✅ Done | Global OG + per-artist image/description |
| 4.4 | Analytics | ✅ Done | Google Analytics via `NEXT_PUBLIC_GA_ID` env var |
| 4.5 | robots.txt | ✅ Done | Allows public, disallows /admin/ and /api/ |

## Phase 5: Polish & Launch

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Content migration | ✅ Done | Migration script: `scripts/migrate-strapi.ts` |
| 5.2 | Performance audit | ✅ Done | `next/image`, lazy loading, `loading="lazy"` on all images |
| 5.3 | Accessibility audit | ✅ Done | Skip-to-content, focus-visible, ARIA dialog, keyboard nav |
| 5.4 | Production deployment | ✅ Done | Dockerfile, health check, deployment docs |
| 5.5 | Admin user training | ✅ Done | `docs/10-admin-guide.md` |
| 5.6 | Domain cutover | ⏳ Pending | Point bielanoc.sk to new hosting (manual step) |

## Estimated Timeline

| Phase | Effort |
|-------|--------|
| Phase 1: Foundation | 2–3 days |
| Phase 2: Data Model | 3–4 days |
| Phase 3: Public Pages | 7–10 days |
| Phase 4: Integrations | 2–3 days |
| Phase 5: Polish & Launch | 3–5 days |
| **Total** | **~3–4 weeks** |

(Assumes one developer working part-time, ~4h/day)
