# Original Design Reference

Detailed documentation of the original Biela Noc website (Nuxt.js 2 + Vuetify) for reproducing the same user experience in the new Next.js build.

---

## Tech Stack (Original)

- **Framework**: Nuxt.js 2.18.1 (Vue.js)
- **UI Library**: Vuetify 2.7.2
- **Backend**: Strapi API
- **Smooth scroll**: Lenis
- **Layout**: vue-masonry-css
- **i18n**: nuxt-i18n (sk/en)

---

## Homepage (2025)

### Layout
Two-column full-height grid. Each column represents a city. On screens < 1200px it stacks to single column.

### Bratislava (Left Column)
- Background color: `#8094F7` (periwinkle blue)
- Main image: `/static/homepage/2025/ba.png`
- Hover image: `/static/homepage/2025/ba_hover.png`
- Text: "3 - 5 oktober 2025 Bratislava"
- Hover effect: main image fades out (opacity 0), hover image fades in (opacity 1), transition 0.3s ease

### Kosice (Right Column)
- Background color: `#B2BCAC` (sage green)
- Main image: `/static/homepage/2025/ke.png`
- Hover image: `/static/homepage/2025/ke_hover.png`
- Text: "10 - 12 oktober 2025 Kosice"
- Same hover behavior as BA

### Previous Year Designs
- **2024**: CSS custom properties with animated gradient color transitions (0.75s), same two-city layout
- **2023**: Video backgrounds (`NB_web_ico1.mp4`, `NB_web_ico2.mp4`) with hover-to-play, fallback poster images

---

## Navigation

### Header (NavBar)
- Fixed position, dark background
- Padding: `20px 40px` (desktop), `5px 10px` (mobile)
- **Left**: Logo "Biela noc" + tagline below ("Festival sucasneho umenia" / "Festival of contemporary art")
- **Right**: Language selector (SK/EN with underline on active) + hamburger menu button (40px)
- Logo font size: `1.5rem` (desktop), `1rem` (mobile)

### Side Menu (Right Drawer)
- **Background**: `linear-gradient(0deg, #000000 0%, #0500FF 100%)` (black to blue, bottom to top)
- **Width**: Full on mobile, drawer panel on desktop
- Navigation items are h2 headings with hover underline animation (white)
- Sale/ticket button with white outline when available
- Social links at bottom: Instagram, Facebook

### Menu Items (in order)
1. Program / Schedule
2. Mapa / Na stiahnutie (Map/Download)
3. Aplikacia (App)
4. Prakticke info (Info)
5. O Bielej noci (About)
6. Dobrovolnici (Volunteers)
7. Partneri (Partners)
8. Press/Media
9. Podporte nas (Support/Become a partner)
10. Archiv (Archive)
11. Kontakt (Contact)

---

## Logo & Branding

### Main Logo
- File: `/static/logo-bn.svg`
- Style: Minimalist white text, "Biela noc"
- Used in header (navbar)

### City Badges
- `/static/BA@2x.png` — Bratislava badge
- `/static/KE@2x.png` — Kosice badge
- `/static/BN-BA.png`, `/static/BN-KE.png` — City branding variants

---

## Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Background | Black | `#000000` |
| Primary text | White | `#ffffff` |
| Accent (both cities) | Lime green | `#8ebc35` |
| 2025 BA background | Periwinkle blue | `#8094F7` |
| 2025 KE background | Sage green | `#B2BCAC` |
| Side menu gradient start | Blue | `#0500FF` |
| Side menu gradient end | Black | `#000000` |
| Star yellow | Yellow | `#F5E455` |
| Star red | Red | `#FF5555` |
| Star purple | Purple | `#FF2AC4` |
| Star blue | Blue | `#5555FF` |

---

## Typography

### Font Family: HW Clin
Located in `/app/frontend/assets/fonts/`:
- HW Clin Regular — body text
- HW Clin Bold — headings (h1-h5)
- HW Clin Medium — UI elements
- HW Clin Light — subtle text
- HW Clin SemiBold — emphasis
- Italic variants for each weight

### Sizing
- Root: `20px`
- HTML fallback: `16px`
- Logo: `1.5rem` (responsive to `1rem`)
- H2: `24px`
- Letter spacing: `1px` globally

---

## Animations & Effects

### Stars Background
- Random positioned colored dots across the viewport
- 4 color variants (yellow, red, purple, blue)
- Size: 8px on desktop, 4px on mobile
- Fixed positioning (doesn't scroll with content)
- Defined in `_stars.scss`

### Smooth Scroll
- Library: Lenis
- Injected globally into Vue instance
- Scroll-to-top resets to position 0

### Page Transitions
- Fade enter/leave: `opacity 0.5s`

### Hover Effects
- Image cards: opacity transition `0.3s ease`
- Nav links: underline width grows from 0 to full `0.3s`
- Homepage 2024: gradient color animation `0.75s`

---

## Layout & Spacing

### Main Content Area
- Margin-top from fixed header:
  - Desktop: `98px`
  - 720px: `88px`
  - 650px: `58px`
  - 420px: `68px`
  - 340px: `88px`

### Content Max Width
- General: `1400px`

### Responsive Breakpoints
| Breakpoint | Description |
|-----------|-------------|
| > 1264px | Wide desktop |
| > 1200px | Standard desktop |
| 960-1200px | Tablet/desktop |
| 600-960px | Tablet |
| 420-600px | Mobile |
| < 420px | Small mobile |
| < 340px | Very small |

---

## Key Components

### Artist Card (Masonry Grid)
- Image fills card
- Title overlay on hover (white text + dark gradient)
- Location circle marker in corner (numbered)
- 4 cols (>1264px), 3 cols (960-1264px), 2 cols (600-960px), 1 col (<600px)

### Contact Cards
- Width: `300px`
- Border: `1px solid #ffffff`
- Image: `300px x 200px` cover
- Layout: Masonry grid

### Info Expansion Panel (Accordion)
- Background: `#000000`
- Border: `#ffffff solid 2px` (top and bottom)
- Expand/collapse with icon

### Button to Top
- Fixed bottom-right
- White background, black chevron icon
- Appears after 300px scroll
- Smooth scroll animation

---

## Static Assets Inventory

### Images
```
/static/logo-bn.svg              — Main logo
/static/BA@2x.png                — BA city badge
/static/KE@2x.png                — KE city badge
/static/BN-BA.png                — BA branding
/static/BN-KE.png                — KE branding
/static/bratislava.png           — City photo
/static/kosice.png               — City photo
/static/favicon.png              — Favicon
/static/AppStore.svg             — App Store badge
/static/GooglePlay.svg           — Google Play badge
/static/baMap.jpg                — BA map image
/static/BN_KE_2021_mapa.jpg     — KE map image
```

### Homepage 2025
```
/static/homepage/2025/ba.png        — BA main image
/static/homepage/2025/ba_hover.png  — BA hover image
/static/homepage/2025/ke.png        — KE main image
/static/homepage/2025/ke_hover.png  — KE hover image
```

### Videos
```
/static/NB_web_ico1.mp4    — BA video (2023 homepage)
/static/NB_web_ico2.mp4    — KE video (2023 homepage)
```

### Partner Logos
50+ SVG files in `/static/Logos/` including: ESET, Eurovea, Siemens, RTVS, SNM, SME, etc.

### Cover/OG Images
```
/static/cover/               — Year-specific OG images for social sharing
```

---

## Routing (Original)

| Path | Page |
|------|------|
| `/` | Homepage (city picker) |
| `/y{year}/{city}/umelci` | Artists list |
| `/y{year}/{city}/umelci/{id}` | Artist detail |
| `/y{year}/{city}/mapa` | Map |
| `/y{year}/{city}/dobrovolnici` | Volunteers |
| `/y{year}/{city}/partneri` | Partners |
| `/y{year}/{city}/predaj` | Tickets |
| `/y{year}/{city}/info` | Practical info |
| `/o-bielej-noci` | About |
| `/kontakt` | Contact |
| `/press` | Press/Media |
| `/podporte-nas` | Support |
| `/app` | Mobile app |
| `/archive` | Archive |

---

## SEO & Meta

- Title template: "Biela noc | %s"
- Default title: "Biela noc | Medzinarodny festival sucasneho umenia"
- Language: `sk`
- OG tags: url, type, title, description, image
- Favicon: `/favicon.png`

---

## Differences vs. Current New Build

| Feature | Original | Current New Build |
|---------|----------|-------------------|
| Homepage | Two-column city picker (colored bgs + hover images) | Aurora animation |
| Side menu bg | Blue-to-black gradient | Plain black gradient |
| Font | HW Clin (custom) | System fonts |
| Logo in header | Yes (logo-bn.svg) | No |
| Stars animation | Background dots | Not implemented |
| Smooth scroll | Lenis library | Native |
| Artist hover | Title appears on hover | Title always visible |
| Homepage 2023 | Video backgrounds | N/A |
