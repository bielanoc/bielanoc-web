# Biela Noc 2026 — Redesign & Feature Handoff

Living tracking document for the 2026 website redesign and the feature requests from
Monika Grančičová (managing director). Update as work progresses.

- **Branch:** `redesign-2026`
- **Started:** 2026-08-18
- **Design source:** `graphic_new/WEB/` (2 mockups: home hero + "Darujte 2%").
  Authoritative sources not yet accessible: Canva presentation (`canva.link/39msx7a5hfczbi3`)
  and Google Drive graphics folder.
- **Related docs:** `docs/reply-monika-2026.md` (reply draft to Monika)

---

## Design summary (from mockups)

- **Theme:** dark / black background (matches current site).
- **Accent:** coral/orange `#ff6b4a` (was lime green `#8ebc35`).
- **Fonts:** Sugo Pro Display (logo/headings) + Barlow Semi Condensed (nav/body).
- **Header:** horizontal top nav — DOMOV · PARTNERI 2026 · DARUJTE 2% · AKTUALITY · ARCHÍV · KONTAKTY,
  plus newsletter email input + social icons (IG, FB, TikTok, YouTube, Vimeo).
- **Hero:** two event cards (Bratislava / Košice) with city name + dates, giant "2026" numeral motif.
- ⚠️ Mockup button reads "subscibe" (typo) — use "Odoberať" / "Subscribe".

---

## Status legend
✅ Done · 🔨 In progress · ⏳ Blocked · ⬜ Not started

---

## Phase 1 — Landing page (Monika's ASAP priority)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 1.1 | Coral accent color `#ff6b4a` | ✅ | `globals.css`, `BrandingSettings.ts` default, `layout.tsx` fallback, `FestivalMapInner.tsx`, `LocationPicker.tsx` |
| 1.2 | Barlow Semi Condensed font (self-host) | ✅ | Copied to `public/fonts/`, `@font-face` added in `globals.css`. Not yet applied to body — pending header design |
| 1.3 | Sugo Pro Display font | ⏳ | **License blocker** — provided license is desktop-only, not webfont. Only Regular weight on disk. Need designer confirmation |
| 1.4 | Horizontal top nav Header component | ⏳ | Blocked on nav-paradigm decision (replace vs coexist with SideMenu) |
| 1.5 | Event cards hero (city + dates + "2026" motif) | ⬜ | Dates already exist: `dateInfoBA`/`dateInfoKE` in FestivalSettings |

## Phase 2 — Navigation & social

| # | Item | Status | Notes |
|---|------|--------|-------|
| 2.1 | Nav paradigm decision | ⏳ | **Hard blocker.** SideMenu owns city/year/language switchers |
| 2.2 | Add TikTok/YouTube/Vimeo social fields | ✅ | Added to `NavigationSettings.ts` (`socialTiktok`, `socialYoutube`, `socialVimeo`); types regenerated |
| 2.3 | Render 5 social icons (SVG) | ⬜ | Currently IG+FB text links only, in SideMenu |

## Phase 3 — Newsletter (net-new)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 3.1 | Newsletter backend decision | ⏳ | **Hard blocker.** Payload collection vs external (Mailchimp/Brevo — needs account/API key) |
| 3.2 | Subscribe form UI | ⬜ | Fix "subscibe" typo |
| 3.3 | Storage / integration | ⬜ | Depends on 3.1 |

## Phase 4 — "Darujte 2%" page

| # | Item | Status | Notes |
|---|------|--------|-------|
| 4.1 | Expand `SupportUs` global (intro, "prečo nás podporiť", activities gallery) | ⬜ | Currently single richText `content` field |
| 4.2 | Rebuild `/podporte-nas` page | ⬜ | |

## Phase 5 — Content-model requests (from email)

| # | Item | Status | Notes |
|---|------|--------|-------|
| 5.1 | Buttons inside richText (Google form, GoOut, artist links) | ⬜ | Lexical has no BlocksFeature yet — add custom Button block |
| 5.2 | Per-city switching on all subpages | ⬜ | Only Volunteers has `contentBA`/`contentKE` today. Generalize + "applies to both/BA/KE" toggle |
| 5.3 | Map PDF download | ⬜ | No PDF upload field on Routes/map today. `mapa` page uses Leaflet (interactive) |

## Phase 6 — Confirm & re-style existing features

| # | Item | Status | Notes |
|---|------|--------|-------|
| 6.1 | Audio guide (MP3) | ✅ exists | `MP3Records` collection, linked via `Artists.records`. Re-style only |
| 6.2 | Push notifications | ✅ exists | `Notifications` collection + `sendPushNotification` (firebase-admin) |
| 6.3 | GoOut ticket links | ✅ exists | `TicketSettings.linkBA` / `linkKE` |
| 6.4 | Press downloads | ✅ exists | `PressKit` global with `archive` ZIP upload |

---

## Open decisions (blocking)

1. **Nav paradigm** — top bar replaces the hamburger `SideMenu`, or coexists (drawer kept for
   mobile + city/year/language switchers)?
2. **Newsletter backend** — Payload collection (self-contained) or external service
   (Mailchimp/Brevo, needs account + API key)?
3. **Sugo Pro font** — confirm webfont license + obtain Bold weight (question for designer Samuel Hagara, 0919 312 416).

## Non-blocking follow-ups

- Get final visuals from Canva/Drive (more pages, mobile layouts, exact spacing).
- Call Samuel Hagara re: visual + font.
- Confirm to Monika that audio guide / push / press / GoOut already work (see `docs/reply-monika-2026.md`).

---

## Changelog

- **2026-08-18** — Branch `redesign-2026` created. Phase 1.1 (coral color), 1.2 (Barlow font
  registered), 2.2 (social fields) done. Types regenerated, typecheck clean. PR #1 opened.
- **2026-08-18** — CI fixes surfaced by first PR run:
  - e2e was timing out (120s covered `pnpm build && pnpm start`); split build into its own
    CI step so Playwright's `webServer` only starts the prebuilt server (timeout 180s).
  - Fixed pre-existing a11y violations the newly-running e2e exposed (unrelated to the color
    change): year `<select>` in SideMenu missing accessible name (added `aria-label` +
    `selectYear` i18n string); low-contrast greys in Footer (`white/40`→`white/60`) and
    MapPageClient (`white/30`,`white/40`→`white/60`) to meet WCAG AA 4.5:1.
  - **Note:** Vercel check fails on all PRs — private org repo on Vercel Hobby plan (billing,
    not code). Needs plan upgrade or integration change, out of band.
