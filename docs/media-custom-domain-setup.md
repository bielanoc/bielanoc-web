# Setup: `media.bielanoc.sk` (Cloudflare R2 custom domain) + Cloudflare DNS

Goal: serve site media (images + homepage background videos) from a **CDN-cached
custom domain** `media.bielanoc.sk` instead of the rate-limited, uncached R2
Public Development URL (`pub-…​.r2.dev`). This removes the `r2.dev` rate limit and
lets Cloudflare's free CDN absorb the festival traffic spike. **The website keeps
running on Vercel** — only DNS management moves to Cloudflare.

> **Why:** everything (incl. large background videos) is currently served through
> the `r2.dev` public URL, which Cloudflare rate-limits and does **not** cache.
> That is almost certainly what tripped during heavy testing in May 2026. A custom
> domain fixes it for free. Egress from R2 is always free.

---

## Current facts (verified 2026-08-20)

| Thing | Value |
| --- | --- |
| Domain registrar | **Websupport** (`WEBS-0001`, sk-nic handle) |
| Current nameservers | `ns1.websupport.sk`, `ns2.websupport.sk`, `ns3.websupport.sk` |
| DNSSEC | **Enabled** ⚠️ (must be disabled before moving nameservers) |
| Site host | Vercel — currently live at `bielanoc-web.vercel.app` |
| R2 bucket | `bielanoc-media`, location **Eastern Europe (EEUR)** |
| R2 S3 API endpoint | `https://2b142d7f825a88e4a6cae8cd9983b3b5.r2.cloudflarestorage.com/bielanoc-media` |
| Media env var | `NEXT_PUBLIC_S3_URL` (currently the `pub-…​.r2.dev` URL) |
| Code readiness | PR #15 already allows `media.bielanoc.sk` in `next/image` |

**Prerequisite:** access to the **Websupport account** that holds `bielanoc.sk`
(to change nameservers + DNSSEC) and to the **Vercel** and **Cloudflare** dashboards.

---

## ⚠️ Critical ordering rules

1. **DNSSEC first.** The domain has DNSSEC enabled at Websupport. Switching
   nameservers to Cloudflare *without disabling DNSSEC first* will take the whole
   domain **offline** (DNSSEC validation failure). Disable it, wait for it to
   clear, *then* change nameservers.
2. **Don't disable the `r2.dev` Public Development URL until the very end.** The
   live site serves media from `r2.dev` until the `NEXT_PUBLIC_S3_URL` env var is
   changed and redeployed. Killing the dev URL early = images/videos disappear on
   the live site.
3. **Vercel records stay "DNS only" (grey cloud)** in Cloudflare so Vercel keeps
   handling the site's SSL — avoids proxy/SSL conflicts. Only the media subdomain
   is proxied/cached (Cloudflare sets that up automatically).

---

## Phase 0 — Merge the code change

- [ ] Merge **PR #15** (`media-custom-domain`). Harmless: it only *allows*
      `media.bielanoc.sk` for `next/image` and keeps `r2.dev` as fallback. Nothing
      switches until the env var changes in Phase 5.

## Phase 1 — Disable DNSSEC at Websupport

- [ ] Log in to the **Websupport** admin (account that owns `bielanoc.sk`).
- [ ] Open the domain `bielanoc.sk` → DNS / DNSSEC settings.
- [ ] **Turn DNSSEC OFF.**
- [ ] Wait for it to propagate (can take a few hours; up to the DS record TTL).
      Do not proceed to Phase 3 until DNSSEC is confirmed off.

## Phase 2 — Add the zone in Cloudflare

- [ ] In **Cloudflare** dashboard → **Add a site** → enter `bielanoc.sk`.
- [ ] Choose the **Free** plan.
- [ ] Cloudflare scans existing DNS records. **Verify the imported records match
      what Websupport currently serves** (mail/MX, TXT/SPF, any subdomains). Add
      anything missing — especially email (MX) records, or email will break.
- [ ] Note the **two Cloudflare nameservers** it assigns
      (e.g. `xxx.ns.cloudflare.com`).

## Phase 3 — Point the site records at Vercel (in Cloudflare)

- [ ] In Vercel → project → **Settings → Domains** → add `bielanoc.sk` (and
      `www.bielanoc.sk`). Vercel shows the exact record(s) to create.
- [ ] In Cloudflare DNS, create those records:
  - Apex `bielanoc.sk` → per Vercel (usually `A 76.76.21.21` or a `CNAME`/ALIAS).
  - `www` → `CNAME cname.vercel-dns.com` (per Vercel).
- [ ] Set these Vercel records to **"DNS only" (grey cloud)**, not proxied.

## Phase 4 — Switch nameservers at Websupport

- [ ] Back in **Websupport**, open `bielanoc.sk` → nameserver settings.
- [ ] Replace `ns1/ns2/ns3.websupport.sk` with the **two Cloudflare nameservers**
      from Phase 2.
- [ ] Wait for propagation (Cloudflare emails "Active" when it detects the change;
      usually minutes–hours, up to 24h).
- [ ] Confirm in Vercel that `bielanoc.sk` shows a **valid domain / SSL issued**.
- [ ] (Optional but recommended) Re-enable **DNSSEC** — now from the Cloudflare
      side: Cloudflare → DNS → Settings → enable DNSSEC, then add the DS record it
      gives you back at Websupport.

## Phase 5 — Connect the R2 custom domain

- [ ] Cloudflare → **R2** → bucket `bielanoc-media` → **Settings → Custom Domains**
      → **Connect Domain** → `media.bielanoc.sk`.
- [ ] Cloudflare auto-creates the DNS record (proxied/orange) + SSL cert and turns
      caching on. Wait until it shows **Active**.
- [ ] Test the raw URL in a browser, e.g.
      `https://media.bielanoc.sk/<some-existing-filename>` — it should load the file.

## Phase 6 — Point the app at the new media domain

- [ ] Vercel → project → **Settings → Environment Variables** → set
      `NEXT_PUBLIC_S3_URL = https://media.bielanoc.sk` (Production; also
      Preview/Development if desired). **No trailing slash.**
- [ ] **Redeploy** so the change takes effect.

## Phase 7 — Verify, then retire the dev URL

- [ ] Open the live site. Confirm:
  - [ ] Artist images load.
  - [ ] Homepage **background videos** play.
  - [ ] In browser DevTools → Network, media requests go to `media.bielanoc.sk`
        (and show `cf-cache-status: HIT` on repeat loads).
- [ ] **Only now:** Cloudflare → R2 → bucket → Settings → **disable the Public
      Development URL** (`r2.dev`).

---

## CORS note

The bucket's CORS "Allowed Origins" already include `https://bielanoc.sk`,
`http://localhost:3000`, and `https://bielanoc-web.vercel.app`. `<img>`/`<video>`
tags don't require CORS, so no change is needed. (If a future feature fetches media
via JS `fetch()`/canvas, re-check this.)

## Rollback

If anything breaks after Phase 6, set `NEXT_PUBLIC_S3_URL` back to the `r2.dev`
value and redeploy — as long as the Public Development URL is still enabled
(don't do Phase 7 until you're confident), media returns immediately.

## If moving DNS to Cloudflare isn't possible

If the org can't move nameservers off Websupport (access/DNSSEC concerns), the
fallback is fine: keep DNS at Websupport, point `bielanoc.sk` at Vercel with
records created *in Websupport's* DNS, and **keep media on the `r2.dev` URL**.
`r2.dev` is acceptable at normal traffic (~100 users/day); the rate limit only
becomes a concern at festival scale. In that case, skip Phases 1–5 and 7 and just
leave `NEXT_PUBLIC_S3_URL` on the `r2.dev` value.
