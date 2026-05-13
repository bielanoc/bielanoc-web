# Pages and Routes

## URL Structure

The site uses a dynamic `/:year/:city/` prefix for most content pages.

- Year format: `y2025`, `y2024`, etc.
- City format: `ba` (Bratislava), `ke` (Košice)

Example: `/y2025/ba/umelci` — Artists in Bratislava, 2025 edition

## Route Map

### Top-Level Pages

| Route | Page | Notes |
|-------|------|-------|
| `/` | Homepage | City selection, festival branding |
| `/o-bielej-noci` | About | Static rich text |
| `/kontakt` | Contact | Team members grid |
| `/podporte-nas` | Support Us | Markdown content |
| `/press` | Press Kit | Zip download |
| `/archive` | Archive | Links to past editions |
| `/app` | Mobile App | App store links |
| `/articles/:id` | Article Detail | Single article view |
| `/covid-19` | COVID Info | Legacy — may be removed |

### Dynamic Year/City Pages

| Route | Page | Notes |
|-------|------|-------|
| `/:year/:city/umelci` | Artist List | Masonry grid + filters |
| `/:year/:city/umelci/:id` | Artist Detail | Full artist page |
| `/:year/:city/mapa` | Map | Interactive installation map |
| `/:year/:city/partneri` | Partners | Logo grid by category |
| `/:year/:city/predaj` | Tickets | Sale status + links |
| `/:year/:city/info` | Practical Info | Accordion panels |
| `/:year/:city/dobrovolnici` | Volunteers | Markdown info page |

## Default Values

- Default year: latest edition (currently `y2025`)
- Default city: `ba` (Bratislava)
- If user navigates to `/` they choose city, then proceed to year/city routes

## Language

Language is NOT in the URL — it's stored as a preference (cookie/localStorage) and toggled via UI button. Content is served in the selected language.

## Navigation Flow

```
Homepage (choose city)
  → /:year/:city/ (implicit — goes to artists or map)
    → Artists list → Artist detail
    → Map
    → Partners
    → Tickets
    → Info
    → Volunteers
  → About
  → Contact
  → Support Us
  → Press
  → Archive → older /:year/:city/ routes
  → Mobile App
```

## SEO Considerations

Current system is an SPA (no SSR) — pages are not indexable by search engines for dynamic content. The new system should use server-side rendering for all public pages.
