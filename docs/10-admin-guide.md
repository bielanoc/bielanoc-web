# Admin Guide

Quick reference for content editors using the Payload CMS admin panel.

## Access

- **URL:** `https://your-domain.com/admin`
- **First visit:** Create your admin account (email + password)

## Managing Artists

1. Go to **Content → Artists** in the sidebar
2. Click **Create New**
3. Fill required fields: **Name**, **Year**, **City**
4. Optional: upload image, set coordinates (for map), link filters/dates/records
5. Set **Status → Published** when ready (drafts are hidden from the public site)

### Artist fields

| Field | Purpose |
|-------|---------|
| Name | Artist or collective name |
| Work | Title of the artwork/installation (shown on cards) |
| Image | Portrait/artwork photo (3:4 ratio recommended) |
| Place | Venue or location description |
| Latitude/Longitude | Coordinates for the map page |
| Genre | Category (e.g., "inštalácia", "performance") |
| Year | Festival edition |
| City | BA or KE |
| Hierarchy | Sort order (lower = shown first) |
| Paid | Checkbox for paid events |
| Filters | Link to filter categories (colored dots) |
| Dates | Link to date entries (shown on detail page) |
| Records | Link to MP3 audio records |

## Managing Partners

1. Go to **Content → Partners**
2. Upload the partner logo (required)
3. Set category, year, and city flags (BA/KE)
4. Optionally add external link

## Managing Filters

Filters appear as colored chips on the artist list page.

1. Go to **Content → Filters**
2. Each filter needs: **Title**, **Slug** (URL-safe), **Color** (hex)
3. Then link filters to artists via the artist edit page

## Managing Practical Info

1. Go to **Globals → Practical Info**
2. Add/edit sections per city (accordion panels on the public page)
3. Each section has a title and rich text body

## Managing Tickets

1. Go to **Globals → Ticket Settings**
2. Toggle sale on/off per city
3. Set external purchase links and descriptive text

## Sending Notifications

1. Go to **Content → Notifications**
2. Create new with title, description, and target city
3. On publish, a push notification is automatically sent to the city's subscriber topic

## Media Uploads

- Supported formats: JPG, PNG, WebP, SVG, MP3, ZIP
- Images are stored in Cloudflare R2
- Recommended image sizes: artists 600×800px, partners 300×200px

## Tips

- Use **Preview** to see how content will look before publishing
- The **Versions** tab shows edit history for any document
- Duplicate an existing artist to quickly create similar entries
- Sort artists by changing the **Hierarchy** number (0 = top)
