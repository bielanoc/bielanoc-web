# User Features

Complete list of what a visitor can do on the website.

**Legend:** ✅ Working | ⚠️ Partially working | ❌ Not yet implemented

## Global Navigation

| Feature | Status | Description |
|---------|--------|-------------|
| Select city | ❌ | Switch between Bratislava and Košice — URL works but no UI switcher |
| Select year | ❌ | Browse current or past editions (2021–2025) — URL works but no UI switcher |
| Switch language | ❌ | Slovak ↔ English toggle — Payload has locales, frontend has no toggle |
| Side menu | ✅ | Drawer navigation with links |
| Social links in menu | ❌ | Instagram + Facebook at bottom of menu |
| Scroll to top | ⚠️ | May exist but needs verification |
| Festival date banner | ❌ | Always-visible date info |
| Ticket button in menu | ❌ | Conditional button when sales are active |

## Core Features (per city/year)

### Browse Artists

| Feature | Status | Notes |
|---------|--------|-------|
| Grid of artist cards | ✅ | 4-column responsive grid |
| Artist images | ✅ | Served from R2 CDN |
| Filter by category | ✅ | Colored filter chips |
| Hover effect | ⚠️ | Border change only — old had image zoom 1.1x |
| Click to detail | ✅ | |

### Artist Detail Page

| Feature | Status | Notes |
|---------|--------|-------|
| Artist image | ✅ | Full-width left column |
| Name and work title | ✅ | |
| Description (artist bio) | ❌ | Data exists in DB but not displayed |
| Description (work) | ❌ | Data exists in DB but not displayed |
| Place / location | ✅ | |
| Performance dates/times | ✅ | |
| Genre label | ✅ | |
| Audio recordings (MP3) | ⚠️ | Native `<audio>` controls — files not linked yet |
| Paid entry indicator | ✅ | |
| Back navigation | ✅ | Text link "← Späť na zoznam" |

### Interactive Map

| Feature | Status | Notes |
|---------|--------|-------|
| Map display | ✅ | Leaflet with dark tiles |
| Artist markers | ✅ | Color-coded pins |
| Map images (static) | ❌ | Old had downloadable map images per year |
| Download button | ❌ | |
| Lightbox zoom | ❌ | Old used PhotoSwipe |

### Partners

| Feature | Status | Notes |
|---------|--------|-------|
| Logo grid | ✅ | Grouped by category |
| Partner logos | ❌ | Partners not created in DB yet |
| External links | ✅ | Click logo → partner website |

### Tickets

| Feature | Status | Notes |
|---------|--------|-------|
| Sale status | ✅ | On/off toggle from CMS |
| Purchase links | ✅ | External links per city |
| Ticket info text | ⚠️ | Needs content in admin |

### Practical Info

| Feature | Status | Notes |
|---------|--------|-------|
| Accordion panels | ✅ | Native `<details>` elements |
| City-specific content | ✅ | Structure ready |
| Content | ❌ | Needs manual entry in admin |

### Volunteers

| Feature | Status | Notes |
|---------|--------|-------|
| Rich text content | ✅ | Structure ready |
| Content | ❌ | Needs manual entry in admin |

## Static / Global Pages

| Page | Status | Notes |
|------|--------|-------|
| Homepage | ✅ | Aurora background + city selection |
| About (O Bielej Noci) | ⚠️ | Page exists, needs content + photos in admin |
| Contact | ✅ | Team grid with photos (12 contacts linked) |
| Support Us | ⚠️ | Page exists, needs content in admin |
| Press | ✅ | Zip download |
| Archive | ⚠️ | Page exists, needs cover images per year |
| Mobile App | ✅ | App store links |
| Articles | ✅ | Rich text articles |

## Push Notifications (Mobile App)

| Feature | Status | Notes |
|---------|--------|-------|
| Firebase integration | ✅ | afterChange hook on Notifications collection |
| City targeting | ✅ | Topics per city (BA/KE) |

## Visual / UX Differences from Old Site

| Old Feature | New Approach | Impact |
|-------------|--------------|--------|
| Homepage carousel with video | Aurora canvas animation | Intentional redesign |
| Black→Blue gradient side menu | Plain black narrow menu | Less branded, more minimal |
| Image zoom on artist hover | Border color change only | Less kinetic |
| Custom audio player | Native HTML5 `<audio>` | More accessible, less designed |
| Expansion panel icons | No icons | Simplified |
| Page fade transitions | Instant navigation | Faster perceived speed |
| Wide side menu (1000px) | Narrow (320px) | Less immersive |

## What Users CANNOT Do

- No user accounts or login
- No comments or user-generated content
- No favorites or saved artists
- No ticket purchase on-site (external links only)
- No itinerary/route planning
- No social sharing buttons
- No calendar export (iCal)
