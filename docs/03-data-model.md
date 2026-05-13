# Data Model

Implemented in Payload CMS 3. Localized fields support Slovak (default) + English via Payload's built-in localization. All collections and globals are defined in `src/collections/` and `src/globals/`.

**Status: ✅ Fully implemented** (Phase 2 complete)

## Collection Types (multiple entries)

### Artist

The main content type — an art installation or performance.

| Field | Type | Notes |
|-------|------|-------|
| name | text | Required |
| work | text | Name of the artwork (localized) |
| image | media | Main image |
| description | richtext | (localized) |
| place | text | Location name |
| latitude | float | Map coordinate |
| longitude | float | Map coordinate |
| performance | enum | Performance type |
| genre | text | (localized) |
| hierarchy | integer | Display ordering |
| year | enum | 2020–2030 |
| city | enum | Bratislava / Košice |
| paid | boolean | Whether entry requires payment |
| routes | relation (M2M) | → Route |
| mp3_records | relation (M2M) | → MP3 Record |
| filters | relation (M2M) | → Filter |
| dates | relation (M2M) | → Date Entry |

### Date Entry (Dátumy)

Schedule entries for when an artist is active.

| Field | Type | Notes |
|-------|------|-------|
| dateText | text | Human-readable date label |
| start | datetime | Start time |
| end | datetime | End time |
| display | boolean | Whether to show publicly |
| artists | relation (M2M) | → Artist |

### Filter

Categories for filtering artists.

| Field | Type | Notes |
|-------|------|-------|
| slug | uid | URL-friendly identifier |
| title | text | Display name |
| color | text | Hex color code |
| icon | media | Filter icon |
| artists | relation (M2M) | → Artist |

### Route

A curated walking route through installations.

| Field | Type | Notes |
|-------|------|-------|
| title | text | Route name |
| city | enum | Bratislava / Košice |
| artists | relation (M2M) | → Artist |

### MP3 Record

Audio recordings associated with artists.

| Field | Type | Notes |
|-------|------|-------|
| title | text | Track title |
| description | text | |
| file | media | Audio file |
| artists | relation (M2M) | → Artist |

### Partner

Festival sponsors and partners.

| Field | Type | Notes |
|-------|------|-------|
| name | text | Partner name |
| logo | media | Logo image |
| link | text | External URL |
| category | enum | General, Main, Partner, Official, Support, Regional, ITPartner, Delivery, MainMedia, OtherMedia, Appreciation |
| year | enum | 2020–2030 |
| bratislava | boolean | Shown in BA |
| kosice | boolean | Shown in KE |

### Contact

Team member displayed on contact page.

| Field | Type | Notes |
|-------|------|-------|
| name | text | Full name |
| role | text | Job title |
| email | email | |
| photo | media | Portrait |
| orderRank | integer | Display ordering |

### Article

News/blog posts.

| Field | Type | Notes |
|-------|------|-------|
| title | text | (localized) |
| content | richtext | (localized) |
| publishedAt | datetime | Draft/publish support |

### Notification

Push notifications sent to mobile app users.

| Field | Type | Notes |
|-------|------|-------|
| title | text | Notification title |
| description | text | Notification body |
| city | enum | Bratislava / Košice |
| publishedAt | datetime | When to send |

## Single Types (one instance)

### Ticket Settings

| Field | Type | Notes |
|-------|------|-------|
| saleEnabled | boolean | Toggle ticket sales |
| linkBA | text | Purchase URL for Bratislava |
| linkKE | text | Purchase URL for Košice |
| textBA | richtext | Additional text for BA |
| textKE | richtext | Additional text for KE |

### BN Pass (one per city: BA, KE)

| Field | Type | Notes |
|-------|------|-------|
| title | text | |
| content | richtext | |

### Volunteers (one per city: BA, KE)

| Field | Type | Notes |
|-------|------|-------|
| title | text | |
| content | richtext | |

### Practical Info (one per city: BA, KE)

| Field | Type | Notes |
|-------|------|-------|
| sections | repeatable component | Each section has: title (localized), text (localized), icon |

### Support Us

| Field | Type | Notes |
|-------|------|-------|
| content | richtext | (localized) |

### Promopack (Press Kit)

| Field | Type | Notes |
|-------|------|-------|
| archive | media | Zip file for download |

### App Settings

| Field | Type | Notes |
|-------|------|-------|
| photo | media | App promotion image |

### Carousel (Homepage)

| Field | Type | Notes |
|-------|------|-------|
| items | dynamic zone | YouTube videos OR slides (image + title + link) |

## Relationships Diagram

```
Artist ←M2M→ Filter
Artist ←M2M→ Route
Artist ←M2M→ MP3 Record
Artist ←M2M→ Date Entry

Partner → year, city (via booleans)
Notification → city
Route → city
```

## Enums

### City
- Bratislava
- Košice

### Year
- 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030

### Partner Category
- General, Main, Partner, Official, Support, Regional, ITPartner, Delivery, MainMedia, OtherMedia, Appreciation

### Performance Type
- (values not explicitly defined in schema — investigate during implementation)
