# Design and UI

## Visual Identity

| Element | Value |
|---------|-------|
| Background | Black (#000000) |
| Primary color | White (#FFFFFF) |
| Accent color | Lime green (#8EBC35) — used for both cities |
| Font family | "HW Clin" (custom) — Regular, Medium, Bold weights |
| Base font size | 20px |
| Theme | Dark mode only |

## Color System

### Star/Decoration Colors
- Yellow: #F5E455
- Red: #FF5555
- Purple: #FF2AC4
- Blue: #5555FF

### Filter Colors
Each filter has its own color (defined in CMS), displayed as colored dots next to artist cards.

### Location Circle Colors
Artists have color-coded circular markers based on genre/category, supporting multi-color gradients.

## Layout Patterns

### Masonry Grid (Artists)
- 4 columns on desktop (>1264px)
- 3 columns on large tablet (960–1264px)
- 2 columns on tablet (600–960px)
- 1 column on mobile (<600px)

### Responsive Breakpoints
- 600px — mobile/tablet boundary
- 650px — small adjustments
- 720px — mid tablet
- 960px — tablet/desktop boundary
- 1200px — standard desktop
- 1264px — wide desktop
- 1400px — max content width

## Components

### Navigation
- **Navbar**: Logo (left), language toggle (right), hamburger menu icon (right)
- **Side menu**: Full-height right drawer with nav links + ticket button + social icons
- **Footer**: Simple copyright text, hidden on homepage

### Artist Card
- Image fills card
- Title overlay appears on hover (white text on dark overlay)
- Location circle in corner

### Location Circle
- Circular marker with number inside
- Supports single color or multi-color gradient border
- Used on both artist cards and map

### Filter Dots
- Small colored circles
- Active: filled with color
- Inactive: border only

### Info Expansion Panel
- Accordion-style panels
- Title + expand icon
- Content is rich text with optional icon

### Audio Player
- Simple play/pause button
- Shows track title
- Inline in artist detail page

### Button to Top
- Floating action button (bottom-right)
- Appears after 300px scroll
- Smooth scroll to top on click

## Animations
- Fade transitions between pages
- Hover effects on artist cards (title overlay)
- Smooth scrolling (Lenis library)

## Typography
- Headings: HW Clin Bold
- Body: HW Clin Regular
- All uppercase for some UI elements (buttons, nav)

## Mobile Considerations
- Side menu drawer instead of horizontal nav
- Single-column artist grid
- Touch-friendly button sizes
- Full-width images
