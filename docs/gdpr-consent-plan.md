# GDPR / Cookie Consent — Assessment & Implementation Plan

> Last updated: 2026-08-19. For the Biela Noc web (Next.js 15 + Payload).
> This is a plan for review — no code written yet.

## 1. Assessment — what the site processes today

### Functional / exempt (NO consent banner required)
| What | Where | Type | Notes |
|---|---|---|---|
| `locale` cookie (`sk`/`en`) | `src/app/(frontend)/actions.ts` | Cookie, 1y, `sameSite=lax` | Strictly functional (language) |
| `bielanoc-favorites` | `src/lib/useFavorites.ts` | localStorage | User's favorited artists, no PII |
| `bielanoc-debug` | `src/lib/useDebugSettings.ts` | localStorage | Dev-only |

These fall under "strictly necessary / functional" storage — exempt from prior consent under the ePrivacy Directive.

### Consent-required (the actual obligations)
| What | Where | Risk | Requirement |
|---|---|---|---|
| Google Analytics (`gtag`, `_ga`/`_gid`) | `src/components/Analytics.tsx` (env `NEXT_PUBLIC_GA_ID`) | Analytics cookies | **Prior opt-in consent** |
| Facebook / Meta Pixel (`fbq`, PageView) | `src/components/Analytics.tsx` (env `NEXT_PUBLIC_FB_PIXEL_ID`) | Marketing + **US data transfer to Meta** | **Prior opt-in consent** |
| Map tiles from CartoCDN (`basemaps.cartocdn.com`) | `src/components/FestivalMapInner.tsx` | Sends visitor IP to Carto (3rd party) | Lower risk (functional/user-initiated); **disclose in privacy policy** |

**Current gap:** `Analytics.tsx` injects GA + Pixel `afterInteractive` the moment the env var is set — with **no consent gate**. If those env vars are enabled in production, the site is loading trackers without consent, which is non-compliant.

### Not present (good)
- No newsletter/subscribe form, no contact form → no email capture today. *(A newsletter field was floated in earlier planning — if added, it needs its own lawful basis, privacy notice, and a decision on storage/tooling.)*
- Fonts appear self-hosted → avoids the "Google Fonts leaks IP" issue.

### Deciding factor — resolved: build it regardless
Whether GA + Pixel are *currently* set in production is **not a blocker**. Guiding principle (per project owner): **be on the safe side and stay hosting-agnostic** — hosting may move off Vercel in future. So:
- Build the consent gate now whether or not the trackers are enabled today. If the env vars are empty, the gated `Analytics` component renders nothing — zero downside.
- **Do NOT geo-gate** the banner using host-specific geo headers (e.g. Vercel `request.geo`). Show consent to all visitors → portable + maximally compliant.

**Portability confirmed:** no `@vercel/*` packages, no `request.geo`/`x-vercel-*` usage, `next.config` uses `output: 'standalone'` (runs in any Node/Docker host). The consent solution below is entirely app-level and carries over to any host.

---

## 2. Implementation plan

### Approach
A lightweight **custom consent banner** (no heavy third-party CMP — overkill for a festival site), bilingual (SK/EN, reusing the existing `locale`), with three actions: **Accept all / Reject all / Settings**. Consent stored client-side; trackers load **only after** opt-in.

### Consent categories
- **Necessary** — always on, not toggleable (locale, favorites).
- **Analytics** — GA. Off by default.
- **Marketing** — Meta Pixel. Off by default.

### Work items

**A. Consent state + storage**
- New `src/lib/useConsent.ts` (client hook) — reads/writes a `bielanoc-consent` cookie (e.g. `{necessary:true, analytics:bool, marketing:bool, ts}`), 6–12 month expiry, `sameSite=lax`. Cookie (not just localStorage) so SSR can read it too.
- Custom event to broadcast consent changes across components (same pattern as `useDebugSettings`).

**B. Consent banner component**
- New `src/components/ConsentBanner.tsx` (client) — bottom banner shown until a choice is made. Buttons: Accept all / Reject all / Settings (expands per-category toggles). Localized strings in `i18n.ts`.
- Rendered in `src/app/(frontend)/layout.tsx`.
- Accessible (focusable, `role="dialog"`/region, keyboard-dismissable), styled to match the dark theme.

**C. Gate the trackers**
- Refactor `src/components/Analytics.tsx` → client component that reads consent and injects:
  - GA scripts only if `analytics` consent, **and**
  - Pixel only if `marketing` consent.
- Optionally add **Google Consent Mode v2** defaults (`ad_storage`/`analytics_storage = denied` until granted) for a cleaner GA integration. Simple path: just don't load until granted.
- Re-render/inject when consent changes (no full reload needed).

**D. Privacy & cookie policy page**
- New route `src/app/(frontend)/ochrana-osobnych-udajov/page.tsx` (+ EN). Content options:
  - **Recommended:** a Payload global/collection so the team edits legal text without a deploy.
  - Simpler: static localized content in the repo.
- Cookie table (name, purpose, duration, provider) covering: `locale`, `bielanoc-favorites`, GA (`_ga`/`_gid`), Meta Pixel, Carto map tiles.
- Add link in the **footer** and the **side menu**. Add a "Cookie settings" re-open link (footer) so users can change their choice later (legally required to be as easy to withdraw as to give).

**E. Legal content (needs the client, not a dev task)**
- Actual privacy-policy text (data controller identity, purposes, lawful basis, retention, rights, contact/DPO). The org must supply/approve this — I can scaffold a Slovak template with placeholders.

### Decisions needed before coding
*(Note: "are the trackers on today?" is intentionally NOT one of these — we build the gate regardless, safe side.)*
1. **Consent Mode v2 yes/no** for GA.
2. **Policy text source:** Payload-editable vs static.
3. **Map tiles:** keep Carto with disclosure (recommended) vs. treat as consent-gated.
4. Who provides the **legal privacy-policy text**.

### Suggested PR breakdown
1. PR 1 — consent hook + banner + gate `Analytics.tsx` (the compliance-critical part).
2. PR 2 — privacy/cookie policy page + footer/menu links + cookie table.

---

## 3. Bottom line
- The functional cookies are fine.
- **The one real risk is GA + Meta Pixel loading without consent.** Fixing that (env-gated consent banner) is the priority and is safe to build now even if the trackers are currently off.
- A privacy/cookie policy page is required regardless, and the legal text must come from the organisation.
