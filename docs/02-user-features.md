# User Features

Complete list of what a visitor can do on the website.

## Global Navigation

| Feature | Description |
|---------|-------------|
| Select city | Switch between Bratislava and Košice — all content changes |
| Select year | Browse current or past editions (2021–2025) |
| Switch language | Slovak ↔ English toggle |
| Side menu | Drawer navigation with links + social media (Instagram, Facebook) |
| Scroll to top | Floating button after scrolling down |
| Festival date banner | Always-visible date info (e.g., "3. – 5. október 2025 Bratislava") |

## Core Features (per city/year)

### Browse Artists

- Masonry grid of artist cards (image + name on hover)
- Filter by 4 categories:
  - Full weekend availability
  - Time-limited
  - Available today
  - Paid entry
- Pagination
- Click through to artist detail

### Artist Detail Page

- Artist image
- Name and work title
- Bio text (in selected language)
- Location marker (color-coded circle with number)
- Performance dates and times
- Audio recordings (MP3 player) — if available
- Genre/category label

### Interactive Map

- Shows art installation locations on a map
- Year-specific implementations (different map data each year)
- Location markers match artist color-coding

### Partners

- Grid of sponsor/partner logos
- Organized by 11 categories:
  1. General Partner
  2. Main Partner
  3. Partner
  4. Official Partner
  5. Support
  6. Regional Partner
  7. IT Partner
  8. Delivery Partner
  9. Main Media Partner
  10. Other Media Partner
  11. Appreciation

### Tickets

- Sale status indicator (on/off)
- External purchase links (separate for BA and KE)

### Practical Info

- Expandable accordion panels
- City-specific content (different info for BA vs KE)

### Volunteers

- Information page about volunteering
- City-specific, markdown content

## Static / Global Pages

| Page | Content |
|------|---------|
| Homepage | City selection, festival branding |
| About (O Bielej Noci) | Rich text about the festival |
| Contact | Team members grid — photo, name, role, email |
| Support Us | How to support the festival (markdown) |
| Press | Press kit download (zip archive) |
| Archive | Links to past editions (2021–2024 + Humenné) |
| Mobile App | App store links + app screenshots |
| Articles | News articles with rich text content |
| COVID-19 | Pandemic info (legacy, likely to be removed) |

## Push Notifications (Mobile App)

- Users receive push notifications targeted by city (BA or KE)
- Triggered when organizers publish a notification in the admin panel
- Requires Firebase integration

## What Users CANNOT Do

- No user accounts or login
- No comments or user-generated content
- No favorites or saved artists
- No ticket purchase on-site (external links only)
- No itinerary/route planning
- No social sharing buttons
- No calendar export (iCal)
