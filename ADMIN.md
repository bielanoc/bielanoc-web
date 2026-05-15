# Biela Noc — Admin Guide (Payload CMS)

Admin panel: `https://your-domain.com/admin`

Login with your email/password (Users collection).

---

## Starting a New Year (e.g. 2026)

No code changes needed. Just:

1. **Festival Settings** — set `currentYear` to `2026`
2. **Add artists** — create new artist entries with year = `2026`, city = `ba` or `ke`
3. **Add partners** — create partner entries with year = `2026`, check `bratislava` / `kosice`

The frontend automatically:
- Shows the newest year in the dropdown (based on existing artists)
- Defaults the homepage links to `currentYear` from Festival Settings

---

## Collections

### Artists (Content)

The main content — each festival artwork/performance is one artist entry.

| Field | Description |
|-------|-------------|
| **name** | Artist/collective name |
| **work** | Title of the artwork (localized SK/EN) |
| **image** | Main photo (upload) |
| **description** | Rich text about the artwork (localized) |
| **place** | Location name, e.g. "Primaciálne námestie" (localized) |
| **latitude / longitude** | GPS coordinates — required for the map page |
| **performance** | Performance time info (localized) |
| **genre** | Art genre label (localized) |
| **year** | Festival year (2020–2030) |
| **city** | `ba` (Bratislava) or `ke` (Košice) |
| **hierarchy** | Display order — lower number = shows first |
| **paid** | Checkbox — marks paid entry events |
| **filters** | Relation to Filters (color categories shown on artist grid) |
| **routes** | Relation to Routes (walking routes) |
| **dates** | Inline array — each entry has start/end datetime and display toggle |
| **records** | Relation to MP3 Records (audio guides) |

**Dates (inline array):**

Each artist has a `dates` array directly on their record. Each entry has:
- **start** — Date and time when the performance begins
- **end** — Date and time when the performance ends
- **display** — Whether to show this date on the frontend

For multi-night events (e.g. installations running Fri–Sun), create one entry per night:
- Night 1: Oct 10, 19:00 → Oct 11, 00:00
- Night 2: Oct 11, 19:00 → Oct 12, 00:00
- Night 3: Oct 12, 19:00 → Oct 13, 00:00

Times are stored in UTC. The admin date picker converts your local time automatically.
The frontend displays times in Europe/Bratislava timezone.

**Tips:**
- Set `hierarchy` to control display order on the artists page
- GPS coordinates must be set for the artist to appear on the map
- Use drafts to prepare content before publishing
- The `work` and `place` fields should be translated in both SK and EN locales

### Partners (Content)

Festival sponsors and partners.

| Field | Description |
|-------|-------------|
| **name** | Partner/company name |
| **logo** | Logo image (upload, required) |
| **link** | External URL (website) |
| **category** | Partner tier (determines display section and order) |
| **year** | Festival year |
| **bratislava** | Show on BA pages |
| **kosice** | Show on KE pages |

Categories (display order on page):
1. Generálny partner
2. Hlavný partner
3. Partner
4. Oficiálny partner
5. Podpora
6. Regionálny partner
7. IT Partner
8. Delivery partner
9. Hlavný mediálny partner
10. Mediálny partner
11. Appreciation

### Contacts (Content)

Team members shown on the contact page.

| Field | Description |
|-------|-------------|
| **name** | Person name |
| **role** | Job title (localized) |
| **email** | Contact email |
| **photo** | Profile photo |
| **orderRank** | Display order (lower = first) |

### Filters (Config)

Color-coded categories for the artist grid (e.g. "Light art", "Performance", "Music").

| Field | Description |
|-------|-------------|
| **title** | Filter label shown to visitors (localized) |
| **slug** | URL-safe identifier (e.g. `light-art`) — must be unique |
| **color** | Hex color code (e.g. `#FF5555`) — used for dots and buttons |

Assign filters to artists via the artist's `filters` field.

Filters only appear on the artists page if at least one artist on that page has the filter assigned.

### Routes (Content)

Walking routes grouping artists geographically.

| Field | Description |
|-------|-------------|
| **title** | Route name (localized) |
| **city** | `ba` or `ke` |

### MP3 Records (Content)

Audio guide files linked to artists.

Upload MP3 files to Media first, then create records here and link them to artists via the artist's `records` field.

### Notifications (Content)

Push notifications sent to the mobile app.

| Field | Description |
|-------|-------------|
| **title** | Notification title |
| **description** | Notification body text |
| **city** | Target city (`ba` or `ke`) |

**Important:** Notifications are sent immediately on creation. There is no undo.

### Articles (Content)

General articles/news (with drafts support).

| Field | Description |
|-------|-------------|
| **title** | Article title (localized) |
| **content** | Rich text body (localized) |

### Media

All uploaded files (images, MP3s, PDFs). Files are stored in Cloudflare R2.

Supported: JPEG, PNG, WebP, SVG, MP3, PDF.

Images are automatically optimized by the frontend (WebP conversion, responsive sizing).

---

## Globals (Settings)

### Festival Settings

| Field | Description |
|-------|-------------|
| **currentYear** | The active festival year — used as default on the homepage |
| **dateInfoBA** | Date banner text for Bratislava (localized, e.g. "3. – 5. október 2025 Bratislava") |
| **dateInfoKE** | Date banner text for Košice (localized) |
| **socialInstagram** | Instagram URL |
| **socialFacebook** | Facebook URL |
| **debugMode** | Enable time simulation on the Program page (for testing live events) |
| **debugTime** | Simulated "now" time — only used when debugMode is on |

### Ticket Settings

| Field | Description |
|-------|-------------|
| **saleEnabled** | Toggle — shows/hides the ticket sale button in navigation |
| **linkBA** | Ticket purchase URL for Bratislava |
| **linkKE** | Ticket purchase URL for Košice |
| **textBA** | Additional info about BA tickets (localized rich text) |
| **textKE** | Additional info about KE tickets (localized rich text) |

### Practical Info

Accordion sections shown on the `/info` page, separated by city.

- **sectionsBA** — array of sections for Bratislava
- **sectionsKE** — array of sections for Košice

Each section has a `title` and `text` (rich text), both localized.

### Volunteers

Rich text content for the volunteers page, separated by city.

- **contentBA** — Bratislava volunteer info (localized)
- **contentKE** — Košice volunteer info (localized)

### About Page

Rich text content for the "O Bielej Noci" page (localized).

### Support Us

Rich text content for the "Podporte nás" page (localized).

### Press Kit

Content for the media/press page.

---

## Localization (SK / EN)

- Default locale: **Slovak (SK)**
- Secondary locale: **English (EN)**

Fields marked as "localized" have separate content per language. When editing:
1. Write the SK content first (it's the default)
2. Switch to EN locale using the language toggle in the top-right of the editor
3. Fill in the English translation

If EN is left empty, the frontend falls back to SK content.

**Localized fields:** work, description, place, performance, genre (on artists), section titles/text (practical info), ticket text, volunteer content, about page, articles.

---

## Common Tasks

### Enable/disable ticket sales
Festival Settings > Ticket Settings > toggle `saleEnabled`

### Change festival dates in the header banner
Festival Settings > `dateInfoBA` / `dateInfoKE`

### Reorder artists on the page
Edit artist > set `hierarchy` field (lower number = appears first)

### Add an artist to the map
Edit artist > fill in `latitude` and `longitude` fields. Use Google Maps to find coordinates.

### Send a push notification
Create a new entry in Notifications. It sends immediately to all app users subscribed to that city.

### Duplicate content for a new year
There is no bulk copy. Create new entries manually for the new year. Partners can often be duplicated by creating new entries with the same logo and updating the year.

---

## When Do Changes Appear?

**~5 seconds** after you save. The website uses caching for speed, but every save in the admin panel triggers an automatic cache refresh. Just save, wait a few seconds, and refresh the public page.

If for some reason a change doesn't appear after 30 seconds, it will appear within 1 hour at most (automatic background refresh).

---

## Admin Tools

Available at `/admin/tools/` in the sidebar:

| Tool | Purpose |
|------|---------|
| **Date Review** | Find artists missing date entries, highlights time info found in descriptions |
| **Image Review** | Find artists missing images, suggests matches from media library, one-click linking |

---

## URL Structure (Public Website)

| URL | Page |
|-----|------|
| `/` | Homepage (city selection) |
| `/y2025/ba/umelci` | Artist grid — Bratislava 2025 |
| `/y2025/ke/umelci` | Artist grid — Košice 2025 |
| `/y2025/ba/umelci/123` | Artist detail page (ID-based) |
| `/y2025/ba/program` | Program timeline (day tabs, live detection) |
| `/y2025/ba/mapa` | Interactive map |
| `/y2025/ba/info` | Practical info (accordion) |
| `/y2025/ba/partneri` | Partners page |
| `/y2025/ba/predaj` | Ticket sale page |
| `/y2025/ba/dobrovolnici` | Volunteers page |
| `/o-bielej-noci` | About page |
| `/kontakt` | Contact page |
| `/podporte-nas` | Support us page |
| `/search` | Search |
| `/app` | Mobile app download links |
| `/admin` | Payload CMS admin panel |

Years and cities are dynamic — content determines which combinations exist.
