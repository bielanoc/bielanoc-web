# 2026 Redesign — Designer Notes & Gap Analysis

> Source: `graphic_new/Designer_canva_info/` (7 Canva screenshots from the designer team, in Slovak, annotated over old-site reference shots).
> Last reviewed: 2026-08-18. Status column reflects the codebase at that date.
> Legend: ✅ done · ⚠️ partial / needs work · ❌ missing

---

## 1 · Landing page (festival season)
**Designer wants:** split-screen 2-city landing ("of previous years"), hamburger menu (3 bars) with **EN/SK toggle next to it**, festival dates shown per city.

| Item | Status | Notes |
|---|---|---|
| Split-screen 2 cities | ✅ | `src/app/(frontend)/page.tsx` |
| Hamburger (3 bars) | ✅ | `src/components/FloatingMenuButton.tsx` |
| Date overlay per city | ✅ | `CityOverlay` in `page.tsx` (shipped PR #4) |
| EN/SK **next to** hamburger | ⚠️ | Toggle currently lives **inside** the menu (`SideMenu.tsx` line 127), not in the top bar |

## 2 · Umelci (artist grid)
**Designer wants:** one wide (landscape) photo per card, artist name over the photo, a number badge (order), and a **filter/type symbol** clearly visible. **Filters togglable per year & extendable:** `stále` (permanent), `časové` (timed), `obľúbené` (favorites), `platené` (paid), `neplatené` (unpaid).

| Item | Status | Notes |
|---|---|---|
| Wide photo + name + map number + favorite | ✅ | `src/components/ArtistFilters.tsx` grid |
| Type/filter symbol on card | ❌ | No type icon on cards today |
| Filter tabs | ⚠️ | Only **Všetky / Dnes / Obľúbené** exposed |
| Per-year, extendable filters (stále/časové/platené/neplatené) | ⚠️ | Data model already supports it: `filters` relationship collection, `paid` checkbox, `dates` array on `Artists.ts` — just not surfaced as filter tabs in the UI |

## 3 · Artwork detail (on click)
**Designer wants:** name, work, **country of origin**, **installation type** (varies), **address/location** linked to map + app, **map number**, **time info** (permanent 19–24:00 vs timed → feeds the "časové" filter), intro photo at original size. Then separate text blocks: **curatorial text, artist CV, support/credits info, buy-tickets button** (if paid, ideally at end of text). Texts separate for BA/KE.

| Item | Status | Notes |
|---|---|---|
| name / work / description / place / performance / genre / dates / paid | ✅ | `Artists.ts` |
| Country of origin | ❌ | No dedicated field |
| Installation-type label | ❌ | No dedicated field |
| Address → map link + map number | ⚠️ | Coords exist; explicit map-number + link treatment on detail TBD |
| Time display (permanent vs timed) | ⚠️ | `dates` array exists; not rendered as the designer describes |
| Curatorial text / CV / support | ❌ | Only single `description` richText today |
| Buy-tickets CTA on detail (when paid) | ❌ | Not present |
| Separate BA/KE texts | ✅ (by design) | BA & KE are separate artist docs (per-`city`), so texts are naturally independent |

## 4 · Partneri
**Designer wants:** logos **equal size & centered**, ability to **adjust size** (some partners want a size difference), **white & transparent** logos (team recolors color logos to white), ability to **add new sections and rename categories** (e.g. add "oficiálny partner", rename "mediálny partner" → "mediálni partneri").

| Item | Status | Notes |
|---|---|---|
| Equal-size centered logo tiles | ✅ | `partneri/page.tsx` (aspect 3:2, white/5 bg) |
| Per-partner size adjustment | ❌ | No size control |
| White/transparent logo handling | ❌ | Logos rendered as-is |
| Add/rename categories in CMS | ❌ | 11 categories **hardcoded** (duplicated in `Partners.ts` and `constants.ts`) — not editable by the team |

## 5 · Kontakt
**Designer wants:** **bigger rectangular team photos** (keep rectangular format), and below the contacts a space for **company / invoice / legal details** text.

| Item | Status | Notes |
|---|---|---|
| Team photos sizing | ⚠️ | Confirm current `kontakt/page.tsx` layout when tackled |
| Company/invoice/legal text block | ⚠️ | Add below contacts |

## 6 · Menu
**Designer wants:** **REMOVE the BA/KE + year switchers** from the menu (city is chosen on the landing page; to switch city, return to landing). Menu is **city-specific** (BA-only when in BA). Title reads "Bratislava 2025". Tickets button OK at top. Reference items: Program, Mapa, Praktické info, Partneri, Dobrovoľníci, O Bielej noci, Podporte nás, Archív, Kontakt + Instagram/Facebook at bottom.

| Item | Status | Notes |
|---|---|---|
| "Bratislava 2025" edition label | ✅ | Shipped PR #6 (`FloatingMenuButton.tsx`) — matches designer reference |
| Tickets button at top | ✅ | `SideMenu.tsx` (when sale enabled) |
| Instagram/Facebook at bottom | ✅ | Shipped PR #4 (icon buttons) |
| **Remove** BA/KE + year switchers | ⚠️ **CONFLICT** | We *just added* 2026 to the year switcher (PR #5) and it's still in `SideMenu.tsx` lines 98–128. Designer wants it gone. **Needs a decision** — see open question below. If removed, past years reach via the `Archív` menu link |

## 7 · Landing page (off-season / during the year)
**Designer wants:** **aftermovie video** hero on top, **date line** below it (e.g. "2.–4. 10. 2026 Bratislava | 9.–11. 10. 2026 Košice"), then **News** (articles, same as subpages).

| Item | Status | Notes |
|---|---|---|
| Video aftermovie hero | ❌ | `OffFestivalHome.tsx` uses a static `bannerUrl` `<Image>` |
| Date line | ❌ | Not present off-season |
| News / articles | ✅ | Articles already rendered |

---

## Open questions for the designer team
(see the accompanying clarification email: `clarification-email-sk.md`)

1. **Menu switchers (note #6):** remove BA/KE + year switchers as drawn, or keep them? If removed, is `Archív` the only path to past editions — is that acceptable?
2. **Per-year filters (note #2):** should the festival team be able to turn filters on/off per year in the CMS, or is a fixed set fine? Which are needed for 2026?
3. **Artwork detail fields (note #3):** confirm the exact new fields (country, installation type, CV, support) and whether curatorial text / CV / support are always separate blocks or optional.
4. **Partner logos (note #4):** are white/transparent versions delivered by the team per partner, or should the site auto-treat color logos? How is per-partner sizing expected to work (few "large" partners vs everyone equal)?
5. **Off-season date line (note #7):** static text or driven by the existing FestivalSettings date fields?

## Sequencing suggestion (for when scope is confirmed)
1. **CMS foundations first** (unblocks the team): editable partner categories; per-year filter config; new artist fields.
2. **Frontend surfacing:** artist grid filters + type symbol; artwork detail layout; partner logo treatment.
3. **Menu / EN-SK placement** (needs the decision above).
4. **Off-season landing** (video hero + date line).
5. **Contact page** polish.
