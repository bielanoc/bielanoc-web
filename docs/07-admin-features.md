# Admin Features

What organizers need to do via the admin panel (Payload CMS).

## Content Management

### Artists
- Create/edit/delete artists
- Upload images
- Set location (lat/lon) for map
- Assign to year, city, filters, routes
- Add performance dates
- Upload audio recordings
- Set paid/free status
- Control display order (hierarchy field)
- Draft/publish workflow

### Partners
- Add/remove partners per year
- Upload logos
- Assign category (11 types)
- Toggle city visibility (BA/KE or both)
- Set external link

### Articles
- Write news articles with rich text editor
- Bilingual content (SK/EN tabs)
- Draft/publish workflow

### Notifications
- Create push notifications
- Target by city (BA, KE, or both)
- Publishing triggers Firebase push to mobile app

### Contacts
- Manage team members
- Upload photos
- Set display order

### Tickets
- Toggle sale on/off
- Set purchase URLs per city
- Add descriptive text

### Practical Info
- Manage accordion sections per city
- Each section: title, text, icon
- Bilingual

### Volunteers
- Update volunteer info per city
- Markdown/rich text content

### Press Kit
- Upload zip archive for download

### Filters
- Define filter categories
- Set color and icon
- Assign artists to filters

### Routes
- Define walking routes
- Assign artists to routes

### Carousel / Homepage
- Manage homepage media (videos, slides)
- Currently unused/commented out — evaluate whether to keep

## Admin Workflows

### Yearly Edition Setup
Each year, organizers need to:
1. Create new artists for the year
2. Add new partners (or carry over)
3. Update practical info
4. Update ticket links
5. Update volunteer info
6. Set festival dates

### During Festival
- Send push notifications
- Publish articles
- Toggle "available today" filters

### After Festival
- Edition automatically becomes archive
- Content remains browsable under its year

## Access Control

Current system has no role differentiation — single admin level.

Consider for new system:
- **Admin**: full access (site owner)
- **Editor**: can manage content but not system settings
- Useful for handover and multi-person teams

## Media Management

- Image upload with automatic optimization
- Support for: JPG, PNG, SVG (logos), MP3 (audio), ZIP (press kit)
- S3-compatible storage backend
- CDN delivery for fast loading
