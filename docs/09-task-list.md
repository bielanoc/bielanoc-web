# Task List

Implementation tasks ordered by dependency and priority.

## Phase 1: Foundation ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Project scaffolding | ✅ Done | Next.js 15.5 + Payload 3.84 + TypeScript + pnpm |
| 1.2 | Database setup | ✅ Done | Neon PostgreSQL 17 (us-east-1) |
| 1.3 | Storage setup | ✅ Done | Cloudflare R2 (S3-compatible), public CDN |
| 1.4 | Vercel deployment | ✅ Done | Auto-deploy on push to main |
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

## Phase 5: Polish & Launch ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Content migration | ✅ Done | `scripts/migrate-strapi.ts` + `scripts/link-media.ts` |
| 5.2 | Media migration | ✅ Done | 751 docs, 413 artist images, 12 contact photos linked |
| 5.3 | Performance audit | ✅ Done | `next/image`, lazy loading, `loading="lazy"` on all images |
| 5.4 | Accessibility audit | ✅ Done | Skip-to-content, focus-visible, ARIA dialog, keyboard nav |
| 5.5 | Production deployment | ✅ Done | Vercel auto-deploy, Neon DB, R2 media |
| 5.6 | Admin user training | ✅ Done | `docs/10-admin-guide.md` |
| 5.7 | Domain cutover | ⏳ Pending | Point bielanoc.sk to new hosting (manual step) |

## Phase 6: Feature Parity (old site comparison)

Missing features identified by comparing with the old Nuxt/Vue site.

### High Priority

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.1 | Year/City navigation | ⏳ TODO | Users can't switch between BA/KE or browse older years from the UI. Need nav links or switcher in header/menu |
| 6.2 | SK/EN language switch | ⏳ TODO | Old site was fully bilingual. Payload already has sk/en locales — need frontend toggle + translated UI strings |
| 6.3 | Artist descriptions on detail page | ⏳ TODO | Display `descriptionArtist` and `descriptionWork` fields on artist detail page (data exists in DB) |
| 6.4 | Map images + download | ⏳ TODO | Old site had static map images per year with lightbox (PhotoSwipe) and download button. Need to upload map images to R2 and display them |
| 6.5 | Ticket sales button in menu | ⏳ TODO | Conditionally show "Predaj vstupeniek" button in side menu when sales are active |

### Medium Priority

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.6 | Artist card hover effect | ⏳ TODO | Old had image zoom 1.1x on hover. New just changes border color. Consider adding subtle zoom |
| 6.7 | Side menu style | ⏳ TODO | Old had black→blue gradient, wider (1000px), animated underlines on links. New is narrow plain black |
| 6.8 | Archive page cover images | ⏳ TODO | Old showed cover images for each year with hover scale. Need images in R2 |
| 6.9 | About page photos | ⏳ TODO | Old had atmospheric photos between text sections. Need images in R2 + CMS content |
| 6.10 | Partners creation | ⏳ TODO | Partners not created in DB yet (logo required). Need to run partner migration |
| 6.11 | MP3 file linking | ⏳ TODO | 0 MP3s linked — field name mismatch in morph table needs debugging |

### Low Priority

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.12 | Google Analytics | ⏳ TODO | `NEXT_PUBLIC_GA_ID` env var exists, need to verify script loads |
| 6.13 | Facebook Pixel | ⏳ TODO | Old had FB pixel tracking |
| 6.14 | Page transitions | ⏳ TODO | Old had fade transitions between pages. Consider Next.js View Transitions |
| 6.15 | Custom audio player styling | ⏳ TODO | Currently native `<audio>` controls. Old had custom styled play/pause |
| 6.16 | Scroll-to-top button | ⏳ TODO | Listed as done in Phase 3 but may need verification |
| 6.17 | Social links in side menu | ⏳ TODO | Instagram + Facebook at bottom of menu |
| 6.18 | Festival date banner | ⏳ TODO | Always-visible date info below header |

### Content (Manual — Admin CMS)

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.19 | Practical Info content | ⏳ Manual | Re-enter per city in admin (was Strapi component structure) |
| 6.20 | Volunteers text | ⏳ Manual | Re-enter per city in admin |
| 6.21 | Ticket settings | ⏳ Manual | Configure sale toggle, links, text per city |
| 6.22 | About / Support Us content | ⏳ Manual | Re-enter rich text in admin |

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
