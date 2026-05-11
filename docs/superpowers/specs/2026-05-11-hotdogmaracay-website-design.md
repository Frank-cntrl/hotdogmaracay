# Hot Dog Maracay NYC — Website Design Spec

**Date:** 2026-05-11
**Status:** Approved, ready for implementation planning

## Overview

A frontend-only marketing website for Hot Dog Maracay NYC, a Venezuelan-style hot dog food cart in Queens, New York. The site replaces the current Beacons.ai link-in-bio with a fast, modern, bilingual single-page experience optimized for one job: **driving customers to existing ordering channels (Uber Eats and WhatsApp).**

## Goals & non-goals

**Goals**
- Convert mobile visitors to Uber Eats or WhatsApp orders within 30 seconds of arrival
- Communicate location, hours, and menu clearly to walk-up customers
- Present the brand with bold, street-food energy that matches the existing logo and Instagram aesthetic
- Serve both Spanish-speaking core audience and English-speaking NYC reach
- Load fast on mobile 4G (Lighthouse mobile score ≥ 95)

**Non-goals**
- No backend, no database, no server-side anything
- No online ordering on-site (delegate to Uber Eats / WhatsApp)
- No email signup, no newsletter — explicitly dropped from scope
- No catering inquiry form — `mailto:` or pre-filled WhatsApp instead
- No CMS — copy lives in JSON files and is edited via code

## Audience

Primary: Spanish-speaking Queens residents (Venezuelan diaspora and broader Latino community) deciding whether to order or visit.
Secondary: Non-Latino NYC food explorers discovering Venezuelan hot dogs via Instagram, TikTok, or word of mouth.

## Visual direction

**Concept: Street Food Bold** — dark mode, loud display typography, NYC street energy. Feels like the cart at night under the streetlights.

**Color tokens**
- `bg-primary`: `#0a0a0a` (near-black)
- `bg-elevated`: `#111111` (slightly lighter for cards/sections)
- `accent-orange`: `#FF6B00` (from the logo — primary CTA color)
- `accent-yellow`: `#FFB800` (from the logo — highlights, stars, labels)
- `accent-warm`: `#5C1E00` (deep red-brown — used sparingly for warm contrast)
- `text-primary`: `#FFFFFF`
- `text-muted`: `#A0A0A0`

**Typography**
- Display: **Anton** (Google Fonts) — chunky condensed sans, Impact-like but free and clean
- Body: **Inter** (Google Fonts)
- All-caps treatment on hero and section headers; sentence case for body

**Texture & motion**
- Film-grain noise overlay on hero only: tileable 256×256 PNG at 4% opacity, applied as a `::before` pseudo-element with `mix-blend-mode: overlay`
- Hero text: opacity 0→1 + translateY(16px→0) over 400ms, eased
- Section reveals on scroll via Intersection Observer (one-shot, no replay)
- Button press: `transform: scale(0.98)` + 5% brightness on `:active`
- All motion under 400ms; respects `prefers-reduced-motion: reduce` (disables non-essential animation entirely)

## Information architecture

Single-page scroll with a sticky top nav. The whole experience is one route per language. Section order:

1. **Hero** — Logo, bold tagline (`Perros Venezolanos en Queens` / `Venezuelan Hot Dogs in NYC`), two primary CTAs (Order, See Menu), language toggle, sticky nav
2. **Order CTAs** — Uber Eats + WhatsApp as large tappable cards. Component is reused once more between the Story and Social sections so it stays reachable mid-scroll.
3. **Menu showcase** — Grid of 6–8 hero items with photos; "View full menu" links to PDF
4. **Find Us** — Embedded Google Map (coords: 40.7556909, -73.882144), address, hours, directions button, Google Reviews link
5. **Our Story** — Short brand narrative (Maracay → Queens)
6. **Social wall** — Manually-curated Instagram grid (8–9 thumbnails), TikTok link
7. **Reviews** — 2–3 pulled Google review quotes
8. **Footer** — All socials, email contact, copyright

**Sticky nav** stays visible while scrolling. Contains: language toggle, anchor links (Menu / Find Us), and a persistent Order CTA. Mobile: hamburger that opens a full-screen overlay with anchor links + the Order CTA pinned to the bottom.

**No separate routes** for /menu, /about, etc. Single-page scroll matches the "decide in 30 seconds" use case and ships faster.

## Component inventory

All components are `.astro` files unless noted. They live in `src/components/`.

- `Nav` — sticky top nav, hamburger on mobile, language toggle
- `Hero` — full-bleed dark hero with animated headline
- `OrderCTAs` — Uber Eats + WhatsApp button row; reused at top and near footer
- `MenuGrid` — wraps `MenuCard` instances from `menu.json`
- `MenuCard` — square photo tile with name + price overlay
- `LocationBlock` — map iframe + address + hours table + directions button
- `StorySection` — text-only narrative block
- `SocialGrid` — IG static grid (manually-curated image URLs)
- `ReviewQuote` — pulled review with stars
- `Footer` — all socials, contact email, copyright
- `LangToggle` (`.tsx` — the one hydrated island) — switches URL between `/` and `/en` while preserving scroll position, persists choice in `localStorage`

## Tech stack

- **Framework:** Astro 4.x (zero-JS-by-default, content-first, built-in i18n)
- **Styling:** Tailwind CSS with custom brand tokens defined in `tailwind.config.mjs`
- **Language:** TypeScript throughout
- **Interactivity:** A single React island for the language toggle (`client:idle` hydration). Everything else is static HTML.
- **Build:** Vite (via Astro)
- **Hosting:** Cloudflare Pages (free, fast global CDN, free custom domain)
- **Domain:** `hotdogmaracay.nyc` (to be purchased — ~$30–50/year)
- **Analytics:** Plausible (privacy-friendly, no cookie banner needed, ~1 KB script). Embed via their hosted script tag in `Base.astro`.

## Project structure

```
hotdogmaracay/
├── astro.config.mjs          # i18n: defaultLocale=es, locales=[es,en]
├── tailwind.config.mjs        # brand tokens
├── tsconfig.json
├── package.json
├── public/
│   ├── logo.png
│   ├── menu-es.pdf
│   ├── menu-en.pdf
│   ├── fonts/                 # Anton + Inter self-hosted for perf
│   └── images/
│       ├── menu/              # food photography
│       └── social/            # IG grid images
├── src/
│   ├── content/
│   │   ├── i18n/
│   │   │   ├── es.json        # all Spanish copy, keyed by section
│   │   │   └── en.json        # all English copy, keyed by section
│   │   └── menu.json          # shared structure: items + photo paths + prices
│   ├── components/            # see Component Inventory above
│   ├── layouts/
│   │   └── Base.astro         # html shell, fonts, meta tags, analytics
│   ├── lib/
│   │   ├── i18n.ts            # type-safe translation helper
│   │   └── links.ts           # all external URLs in one place
│   └── pages/
│       ├── index.astro        # Spanish homepage (default)
│       └── en/
│           └── index.astro    # English homepage
```

## Internationalization

- Astro built-in i18n routing
- `defaultLocale: "es"` → root URL `/` serves Spanish
- `locales: ["es", "en"]` → English at `/en`
- All user-facing strings live in `src/content/i18n/{es,en}.json`, keyed by section/component
- `src/lib/i18n.ts` exports a `t(locale, key)` helper with TypeScript autocomplete on keys
- `LangToggle` component switches URL prefix and persists choice in `localStorage` (so a returning English visitor lands directly on `/en` next time)
- Both routes export the same component tree with different locale prop

## External links — single source of truth

`src/lib/links.ts` exports an object containing every outbound URL. Components import from this file rather than hardcoding URLs. This makes ordering channels easy to update.

Confirmed links:
- Uber Eats: `https://www.ubereats.com/store-browse-uuid/900165af-7313-44a9-9a7e-5c96e83e7510?diningMode=DELIVERY`
- WhatsApp: `https://wa.link/lrx2b6`
- Menu PDF (ES): `https://drive.google.com/file/d/1pcPeu5nDiuCDI_4p2USe0Mg15M0Ae6Jv/view` (TODO: download and self-host)
- Menu PDF (EN): `https://drive.google.com/file/d/1sGpTsNxKei7p0PJCMwpFPRVOZMEGqXSS/view` (TODO: download and self-host)
- Google Maps: `https://maps.app.goo.gl/JdbpqysHd7sWEYFx5`
- Google Reviews: `https://maps.app.goo.gl/o5eePnXwZFDWmXYi8`
- TikTok: `https://www.tiktok.com/@hotdogmaracay.nyc`
- Instagram: `https://www.instagram.com/hotdogmaracay.nyc/`

## Map embed

Standard Google Maps iframe embed (no API key needed): `https://www.google.com/maps/embed/v1/place?...` using the cart coordinates as the marker. No JS shipped. Lazy-loaded via `loading="lazy"` so it doesn't block first paint.

## Performance budget

- Lighthouse mobile score ≥ 95 (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint < 1.2s on simulated 4G
- Largest Contentful Paint < 2.0s on simulated 4G
- Total JS shipped < 30 KB (just the language toggle)
- Hero image: WebP, < 80 KB, served at correct DPR
- Self-host fonts and subset to used characters

## Accessibility

- All interactive elements keyboard-navigable
- Visible focus states (orange outline against dark background)
- Color contrast meets WCAG AA on every text/background pair
- Semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`)
- Alt text for all images
- `lang` attribute set correctly on `<html>` per route
- Respects `prefers-reduced-motion` (disables non-essential animation)

## SEO

- Per-locale `<title>` and `<meta description>`
- Open Graph + Twitter Card meta with hero image
- `<link rel="alternate" hreflang="es" />` + `hreflang="en"` cross-references
- JSON-LD `Restaurant` schema with address, hours, geo coordinates, cuisine
- Sitemap auto-generated by Astro
- `robots.txt` allowing all crawlers

## Content gaps (placeholders in v1)

The following content is missing and will be implemented as clearly-marked placeholders (e.g. `{/* TODO: real address */}`) that the owner can swap pre-launch:

1. **Exact street address** — coordinates are known, street address is TODO
2. **Hours of operation** — placeholder: `Mon–Sun · 11am – 11pm` until confirmed
3. **Menu items + prices** — placeholder: ~8 hero items with names like *Perro Maracay, Perro Especial, Salchipapa, Cachapa, Tequeños*; real data from the menu PDFs
4. **Food photography** — placeholders use the logo + bold typography compositions where real photos are missing
5. **Brand story copy** — placeholder paragraph about Maracay-to-NYC origin, to be refined
6. **Google review quotes** — placeholders use plausible-sounding quotes; owner pulls real ones from Google reviews before launch
7. **IG grid images** — placeholder uses a colored grid; owner provides 8–9 real IG screenshots

## Out of scope (explicitly deferred)

- Online ordering on-site
- Email newsletter signup
- Catering inquiry form (replaced by `mailto:`/WhatsApp)
- Blog or news section
- Multi-location support (we assume one fixed location)
- E-commerce (merch, gift cards)
- Customer accounts or login
- Live IG feed via API (we use a manually-curated static grid)

## Testing & verification

- Manual cross-device check on iPhone SE (375px), iPhone 15 (393px), iPad (768px), desktop (1280px+)
- Lighthouse CI run in the build pipeline; PR blocked if mobile score drops below 95
- Link check: a simple script that hits every URL in `src/lib/links.ts` and asserts 200/302 — run pre-deploy
- Manual smoke test of language toggle: switch on each section, refresh, verify persistence

## Failure modes

The site has minimal moving parts, but a few external dependencies can drift:
- **Ordering URLs change** (Uber Eats store ID, WhatsApp link) → centralized in `src/lib/links.ts`, easy one-line update + redeploy
- **Menu PDFs move on Google Drive** → mitigated by downloading and self-hosting in `public/` (not relying on Drive links)
- **Google Maps embed format changes** → unlikely, but the embed URL is the only failure path; static fallback link to Google Maps acts as a degraded experience

## Success criteria

- Live at `hotdogmaracay.nyc` with both `/` (Spanish) and `/en` (English) routes serving correctly
- Lighthouse mobile score ≥ 95 across all four categories
- Tapping Uber Eats button on mobile opens the Uber Eats app or web flow
- Tapping WhatsApp button opens the WhatsApp app pre-filled with the destination
- Language toggle switches every visible string and persists across visits
- Site renders correctly on iPhone SE width (375px) up through desktop
- All confirmed external links open in a new tab with `rel="noopener"`
