# Task List

Implementation tasks ordered by dependency and priority.

## Phase 1: Foundation

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| 1.1 | Project scaffolding | Initialize Next.js 15 + Payload CMS 3 + TypeScript + pnpm | — |
| 1.2 | Database setup | Connect to Neon PostgreSQL, configure Payload DB adapter | 1.1 |
| 1.3 | Storage setup | Configure Cloudflare R2 as S3-compatible media storage | 1.1 |
| 1.4 | Vercel deployment | Connect GitHub repo to Vercel, verify deploy works | 1.1, 1.2 |
| 1.5 | Environment config | `.env.example`, environment variable documentation | 1.1 |
| 1.6 | Tailwind + dark theme | Base styling, custom font (HW Clin), dark theme setup | 1.1 |
| 1.7 | Internationalization | Configure Payload locales (sk, en), language toggle | 1.1 |

## Phase 2: Data Model (Payload Collections)

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| 2.1 | Artist collection | Fields, localization, relations, admin UI | 1.2, 1.7 |
| 2.2 | Filter collection | Slug, title, color, icon, artist relation | 1.2 |
| 2.3 | Route collection | Title, city, artist relation | 1.2 |
| 2.4 | Date Entry collection | DateTime fields, artist relation | 1.2 |
| 2.5 | MP3 Record collection | Title, file upload, artist relation | 1.2, 1.3 |
| 2.6 | Partner collection | Logo, category enum, year, city flags | 1.2, 1.3 |
| 2.7 | Contact collection | Name, role, email, photo, ordering | 1.2, 1.3 |
| 2.8 | Article collection | Rich text, localized, draft/publish | 1.2, 1.7 |
| 2.9 | Notification collection | Title, body, city, publish hook | 1.2 |
| 2.10 | Ticket global | Sale toggle, links per city | 1.2 |
| 2.11 | Practical Info global | Repeatable sections per city, localized | 1.2, 1.7 |
| 2.12 | Volunteers global | Per-city rich text | 1.2, 1.7 |
| 2.13 | Support Us global | Localized rich text | 1.2, 1.7 |
| 2.14 | Press Kit global | Zip file upload | 1.2, 1.3 |
| 2.15 | App Settings global | Promo image | 1.2, 1.3 |

## Phase 3: Public Pages (Frontend)

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| 3.1 | Layout (nav, footer, side menu) | Responsive shell, language toggle, city/year context | 1.6 |
| 3.2 | Homepage | City selection, festival branding | 3.1 |
| 3.3 | Artist list page | Masonry grid, filters, pagination | 3.1, 2.1, 2.2 |
| 3.4 | Artist detail page | Full info, audio player, dates, location | 3.3, 2.4, 2.5 |
| 3.5 | Map page | Interactive map with artist locations | 3.1, 2.1 |
| 3.6 | Partners page | Logo grid by category | 3.1, 2.6 |
| 3.7 | Tickets page | Sale status, external links | 3.1, 2.10 |
| 3.8 | Practical Info page | Accordion panels | 3.1, 2.11 |
| 3.9 | Volunteers page | Markdown content | 3.1, 2.12 |
| 3.10 | Contact page | Team grid | 3.1, 2.7 |
| 3.11 | About page | Rich text content | 3.1 |
| 3.12 | Support Us page | Markdown content | 3.1, 2.13 |
| 3.13 | Press page | Zip download | 3.1, 2.14 |
| 3.14 | Archive page | Links to past editions | 3.1 |
| 3.15 | Article detail page | Rich text article | 3.1, 2.8 |
| 3.16 | Mobile App page | App store links | 3.1 |
| 3.17 | Scroll to top button | FAB component | 3.1 |

## Phase 4: Integrations

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| 4.1 | Firebase push notifications | Send on notification publish | 2.9 |
| 4.2 | Sitemap generation | Dynamic sitemap for SEO | Phase 3 |
| 4.3 | Open Graph meta tags | Social sharing previews | Phase 3 |
| 4.4 | Analytics | Google Analytics or Plausible | Phase 3 |

## Phase 5: Polish & Launch

| # | Task | Description | Depends On |
|---|------|-------------|------------|
| 5.1 | Content migration | Export from old Strapi, import to Payload | Phase 2, Phase 3 |
| 5.2 | Performance audit | Lighthouse, Core Web Vitals | Phase 3 |
| 5.3 | Accessibility audit | Keyboard nav, screen reader, contrast | Phase 3 |
| 5.4 | Production deployment | Set up production hosting, DNS, SSL | Phase 3, Phase 4 |
| 5.5 | Admin user training | Guide for content editors | 5.4 |
| 5.6 | Domain cutover | Point bielanoc.sk to new hosting | 5.4 |

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
