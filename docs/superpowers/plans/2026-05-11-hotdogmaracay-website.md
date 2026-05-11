# Hot Dog Maracay Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (ES/EN) single-page marketing website for Hot Dog Maracay NYC that drives mobile visitors to Uber Eats or WhatsApp orders.

**Architecture:** Astro 4.x static site with one route per language (`/` Spanish, `/en` English). Zero JavaScript except a tiny React island for the language toggle. All copy in JSON, all outbound URLs in a single `links.ts` file. Deployed as static files to Cloudflare Pages.

**Tech Stack:** Astro 4, Tailwind CSS, TypeScript, React (one component only), Vitest (for lib unit tests), Plausible Analytics, Cloudflare Pages.

**Spec reference:** `docs/superpowers/specs/2026-05-11-hotdogmaracay-website-design.md`

---

## File Structure

```
hotdogmaracay/
├── .gitignore
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── vitest.config.ts
├── public/
│   ├── logo.png
│   ├── favicon.svg
│   ├── menu-es.pdf
│   ├── menu-en.pdf
│   ├── og-image.png
│   ├── noise.png                  # film-grain texture
│   ├── fonts/                     # self-hosted Anton + Inter subsets
│   └── images/
│       ├── menu/                  # food photos (or placeholders)
│       └── social/                # IG grid images (or placeholders)
├── src/
│   ├── content/
│   │   ├── i18n/
│   │   │   ├── es.json
│   │   │   └── en.json
│   │   └── menu.json
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── LangToggle.tsx
│   │   ├── Hero.astro
│   │   ├── OrderCTAs.astro
│   │   ├── MenuGrid.astro
│   │   ├── MenuCard.astro
│   │   ├── LocationBlock.astro
│   │   ├── StorySection.astro
│   │   ├── SocialGrid.astro
│   │   ├── ReviewQuote.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Base.astro
│   ├── lib/
│   │   ├── i18n.ts
│   │   ├── i18n.test.ts
│   │   ├── links.ts
│   │   └── links.test.ts
│   ├── styles/
│   │   └── globals.css
│   └── pages/
│       ├── index.astro
│       └── en/
│           └── index.astro
└── scripts/
    └── check-links.mjs
```

---

### Task 1: Initialize the project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Initialize: git repo

- [ ] **Step 1: Scaffold Astro project**

Run from `/Users/franccescopetta/Desktop/Personal-Projects/hotdogmaracay`:

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston --yes
```

Expected: creates `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `public/favicon.svg`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D @astrojs/tailwind @astrojs/react tailwindcss @types/react @types/react-dom vitest @astrojs/check
npm install react react-dom
```

- [ ] **Step 3: Initialize git**

```bash
git init
git branch -M main
```

- [ ] **Step 4: Write .gitignore**

Create `.gitignore`:
```
node_modules/
dist/
.astro/
.vercel/
.netlify/
.DS_Store
.env
.env.*
!.env.example
.superpowers/
```

- [ ] **Step 5: Verify dev server runs**

```bash
npm run dev
```

Expected: server starts, prints local URL. Stop with Ctrl-C.

- [ ] **Step 6: Initial commit**

```bash
git add .
git commit -m "chore: scaffold Astro project"
```

---

### Task 2: Configure Astro for i18n, Tailwind, and React

**Files:**
- Modify: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `src/styles/globals.css`

- [ ] **Step 1: Configure astro.config.mjs**

Replace `astro.config.mjs` contents:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://hotdogmaracay.nyc",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
```

- [ ] **Step 2: Create tailwind.config.mjs**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          elevated: "#111111",
        },
        accent: {
          orange: "#FF6B00",
          yellow: "#FFB800",
          warm: "#5C1E00",
        },
        text: {
          primary: "#FFFFFF",
          muted: "#A0A0A0",
        },
      },
      fontFamily: {
        display: ["Anton", "Impact", "Arial Black", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        cta: "0 8px 24px -6px rgba(255, 107, 0, 0.5)",
      },
    },
  },
};
```

- [ ] **Step 3: Create src/styles/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { scroll-behavior: smooth; }
  body {
    @apply bg-bg-primary text-text-primary font-body antialiased;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
}
```

- [ ] **Step 4: Verify build succeeds**

```bash
npm run build
```

Expected: build completes without errors.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs tailwind.config.mjs src/styles/globals.css
git commit -m "feat: configure Astro with Tailwind, React, and i18n"
```

---

### Task 3: Build the i18n helper (TDD)

**Files:**
- Create: `src/lib/i18n.ts`
- Create: `src/lib/i18n.test.ts`
- Create: `src/content/i18n/es.json`
- Create: `src/content/i18n/en.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

Add to `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 2: Seed minimal translation files**

`src/content/i18n/es.json`:
```json
{
  "hero": {
    "tagline": "Perros Venezolanos en Queens",
    "subtitle": "El sabor de Maracay, hecho en la calle.",
    "ctaOrder": "Ordenar",
    "ctaMenu": "Ver Menú"
  }
}
```

`src/content/i18n/en.json`:
```json
{
  "hero": {
    "tagline": "Venezuelan Hot Dogs in NYC",
    "subtitle": "The flavor of Maracay, made on the street.",
    "ctaOrder": "Order Now",
    "ctaMenu": "See Menu"
  }
}
```

- [ ] **Step 3: Write the failing test**

`src/lib/i18n.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { t } from "./i18n";

describe("t()", () => {
  it("returns Spanish value for the given key path", () => {
    expect(t("es", "hero.tagline")).toBe("Perros Venezolanos en Queens");
  });

  it("returns English value for the given key path", () => {
    expect(t("en", "hero.ctaOrder")).toBe("Order Now");
  });

  it("throws on missing keys (no silent fallback)", () => {
    expect(() => t("es", "hero.nonexistent")).toThrow(/missing translation/i);
  });
});
```

- [ ] **Step 4: Run test, verify failure**

```bash
npm test
```

Expected: FAIL — module `./i18n` not found.

- [ ] **Step 5: Implement src/lib/i18n.ts**

```ts
import es from "../content/i18n/es.json";
import en from "../content/i18n/en.json";

export type Locale = "es" | "en";

const translations = { es, en } as const;

export function t(locale: Locale, key: string): string {
  const parts = key.split(".");
  let node: unknown = translations[locale];
  for (const part of parts) {
    if (node && typeof node === "object" && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      throw new Error(`Missing translation for "${key}" in locale "${locale}"`);
    }
  }
  if (typeof node !== "string") {
    throw new Error(`Translation for "${key}" in "${locale}" is not a string`);
  }
  return node;
}

export const locales: Locale[] = ["es", "en"];
```

- [ ] **Step 6: Verify tests pass**

```bash
npm test
```

Expected: all 3 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/i18n.ts src/lib/i18n.test.ts src/content/i18n/ vitest.config.ts package.json package-lock.json
git commit -m "feat: add type-safe i18n helper with tests"
```

---

### Task 4: Build the links helper (TDD)

**Files:**
- Create: `src/lib/links.ts`
- Create: `src/lib/links.test.ts`

- [ ] **Step 1: Write the failing test**

`src/lib/links.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { links } from "./links";

describe("links", () => {
  it("exposes the Uber Eats store URL", () => {
    expect(links.uberEats).toMatch(/^https:\/\/www\.ubereats\.com\/store-browse-uuid\//);
  });

  it("exposes the WhatsApp ordering link", () => {
    expect(links.whatsapp).toMatch(/^https:\/\/wa\.link\//);
  });

  it("exposes Instagram, TikTok, Google Maps, Google Reviews", () => {
    expect(links.instagram).toContain("instagram.com/hotdogmaracay.nyc");
    expect(links.tiktok).toContain("tiktok.com/@hotdogmaracay.nyc");
    expect(links.googleMaps).toContain("maps.app.goo.gl");
    expect(links.googleReviews).toContain("maps.app.goo.gl");
  });

  it("exposes self-hosted menu PDFs (not Drive URLs)", () => {
    expect(links.menuPdf.es).toBe("/menu-es.pdf");
    expect(links.menuPdf.en).toBe("/menu-en.pdf");
  });

  it("exposes cart coordinates", () => {
    expect(links.cart.coords).toEqual({ lat: 40.7556909, lng: -73.882144 });
  });
});
```

- [ ] **Step 2: Run test, verify failure**

```bash
npm test -- links
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement src/lib/links.ts**

```ts
export const links = {
  uberEats:
    "https://www.ubereats.com/store-browse-uuid/900165af-7313-44a9-9a7e-5c96e83e7510?diningMode=DELIVERY",
  whatsapp: "https://wa.link/lrx2b6",
  instagram: "https://www.instagram.com/hotdogmaracay.nyc/",
  tiktok: "https://www.tiktok.com/@hotdogmaracay.nyc",
  googleMaps: "https://maps.app.goo.gl/JdbpqysHd7sWEYFx5",
  googleReviews: "https://maps.app.goo.gl/o5eePnXwZFDWmXYi8",
  menuPdf: {
    es: "/menu-es.pdf",
    en: "/menu-en.pdf",
  },
  cart: {
    // TODO: confirm exact street address. Coords are from Google Maps redirect.
    address: "Queens, NY",
    coords: { lat: 40.7556909, lng: -73.882144 },
    hours: "Mon–Sun · 11am – 11pm", // TODO: confirm
  },
  contact: {
    email: "hello@hotdogmaracay.nyc", // TODO: confirm real email
  },
} as const;
```

- [ ] **Step 4: Verify tests pass**

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/links.ts src/lib/links.test.ts
git commit -m "feat: centralize all external URLs in links.ts"
```

---

### Task 5: Populate i18n JSON with full copy

**Files:**
- Modify: `src/content/i18n/es.json`
- Modify: `src/content/i18n/en.json`

- [ ] **Step 1: Replace src/content/i18n/es.json with full copy**

```json
{
  "meta": {
    "title": "Hot Dog Maracay NYC — Perros Venezolanos en Queens",
    "description": "El sabor de Maracay, parqueado en Queens. Ordena por Uber Eats o WhatsApp."
  },
  "nav": {
    "menu": "Menú",
    "find": "Ubicación",
    "order": "Ordenar"
  },
  "hero": {
    "tagline": "Perros Venezolanos en Queens",
    "subtitle": "El sabor de Maracay, hecho en la calle.",
    "ctaOrder": "Ordenar ahora",
    "ctaMenu": "Ver Menú"
  },
  "order": {
    "heading": "Ordena ahora",
    "uberEatsTitle": "Uber Eats",
    "uberEatsSubtitle": "Delivery en 20–40 min",
    "whatsappTitle": "WhatsApp",
    "whatsappSubtitle": "Ordena directo · más rápido"
  },
  "menu": {
    "heading": "El Menú",
    "viewFull": "Ver menú completo →"
  },
  "location": {
    "heading": "Encuéntranos",
    "addressLabel": "Dirección",
    "hoursLabel": "Horario",
    "directions": "Cómo llegar →",
    "reviewsLink": "Déjanos una reseña en Google ⭐"
  },
  "story": {
    "heading": "Desde Maracay, para Nueva York",
    "body": "Trajimos las recetas de la calle de Maracay a Queens. Cada perro lleva ese sabor venezolano que no se encuentra en ningún otro lado de la ciudad."
  },
  "social": {
    "heading": "Síguenos",
    "subtitle": "Lo último del carrito en Instagram y TikTok"
  },
  "reviews": {
    "heading": "Lo que dicen"
  },
  "footer": {
    "tagline": "Perros Venezolanos · Queens, NY",
    "contact": "Contacto",
    "rights": "Todos los derechos reservados."
  }
}
```

- [ ] **Step 2: Replace src/content/i18n/en.json with mirrored English copy**

```json
{
  "meta": {
    "title": "Hot Dog Maracay NYC — Venezuelan Hot Dogs in Queens",
    "description": "The flavor of Maracay, parked in Queens. Order via Uber Eats or WhatsApp."
  },
  "nav": {
    "menu": "Menu",
    "find": "Find Us",
    "order": "Order"
  },
  "hero": {
    "tagline": "Venezuelan Hot Dogs in NYC",
    "subtitle": "The flavor of Maracay, made on the street.",
    "ctaOrder": "Order Now",
    "ctaMenu": "See Menu"
  },
  "order": {
    "heading": "Order now",
    "uberEatsTitle": "Uber Eats",
    "uberEatsSubtitle": "Delivery in 20–40 min",
    "whatsappTitle": "WhatsApp",
    "whatsappSubtitle": "Order direct · faster"
  },
  "menu": {
    "heading": "The Menu",
    "viewFull": "View full menu →"
  },
  "location": {
    "heading": "Find Us",
    "addressLabel": "Address",
    "hoursLabel": "Hours",
    "directions": "Get Directions →",
    "reviewsLink": "Leave us a Google review ⭐"
  },
  "story": {
    "heading": "From Maracay, to New York",
    "body": "We brought the street recipes of Maracay to Queens. Every dog carries that Venezuelan flavor you won't find anywhere else in the city."
  },
  "social": {
    "heading": "Follow Us",
    "subtitle": "Latest from the cart on Instagram and TikTok"
  },
  "reviews": {
    "heading": "What people say"
  },
  "footer": {
    "tagline": "Venezuelan Hot Dogs · Queens, NY",
    "contact": "Contact",
    "rights": "All rights reserved."
  }
}
```

- [ ] **Step 3: Verify tests still pass**

```bash
npm test
```

Expected: PASS (existing tests use keys still present).

- [ ] **Step 4: Commit**

```bash
git add src/content/i18n/
git commit -m "feat: add full bilingual copy for all sections"
```

---

### Task 6: Create menu.json data

**Files:**
- Create: `src/content/menu.json`

- [ ] **Step 1: Create the menu data file**

```json
{
  "items": [
    {
      "id": "perro-maracay",
      "name": { "es": "Perro Maracay", "en": "Perro Maracay" },
      "description": {
        "es": "El clásico venezolano con todos los toppings.",
        "en": "The Venezuelan classic with all the toppings."
      },
      "price": "$8",
      "image": "/images/menu/perro-maracay.jpg"
    },
    {
      "id": "perro-especial",
      "name": { "es": "Perro Especial", "en": "Special Dog" },
      "description": {
        "es": "Versión XL con queso fundido y tocineta.",
        "en": "XL version with melted cheese and bacon."
      },
      "price": "$10",
      "image": "/images/menu/perro-especial.jpg"
    },
    {
      "id": "salchipapa",
      "name": { "es": "Salchipapa", "en": "Salchipapa" },
      "description": {
        "es": "Papas con salchichas y salsas venezolanas.",
        "en": "Fries topped with hot dog slices and Venezuelan sauces."
      },
      "price": "$9",
      "image": "/images/menu/salchipapa.jpg"
    },
    {
      "id": "cachapa",
      "name": { "es": "Cachapa", "en": "Cachapa" },
      "description": {
        "es": "Panqueca dulce de maíz con queso de mano.",
        "en": "Sweet corn pancake with fresh cheese."
      },
      "price": "$12",
      "image": "/images/menu/cachapa.jpg"
    },
    {
      "id": "tequenos",
      "name": { "es": "Tequeños (6 uds)", "en": "Tequeños (6 pcs)" },
      "description": {
        "es": "Dedos de queso frito, el aperitivo venezolano.",
        "en": "Fried cheese sticks — the Venezuelan appetizer."
      },
      "price": "$7",
      "image": "/images/menu/tequenos.jpg"
    },
    {
      "id": "empanada",
      "name": { "es": "Empanada", "en": "Empanada" },
      "description": {
        "es": "De carne, pollo o queso. Crujiente y dorada.",
        "en": "Beef, chicken, or cheese. Crispy and golden."
      },
      "price": "$5",
      "image": "/images/menu/empanada.jpg"
    },
    {
      "id": "patacon",
      "name": { "es": "Patacón", "en": "Patacón" },
      "description": {
        "es": "Plátano frito relleno de carne mechada.",
        "en": "Fried plantain stuffed with shredded beef."
      },
      "price": "$13",
      "image": "/images/menu/patacon.jpg"
    },
    {
      "id": "papas",
      "name": { "es": "Papas Fritas", "en": "Fries" },
      "description": {
        "es": "Crujientes con sal venezolana.",
        "en": "Crispy with Venezuelan salt."
      },
      "price": "$4",
      "image": "/images/menu/papas.jpg"
    }
  ]
}
```

> Note: prices and descriptions are placeholders. Real values come from the menu PDFs and need owner confirmation pre-launch.

- [ ] **Step 2: Commit**

```bash
git add src/content/menu.json
git commit -m "feat: add menu items data with placeholder prices"
```

---

### Task 7: Create asset placeholders

**Files:**
- Create: `public/logo.png` (user-provided)
- Create: `public/noise.png` (film-grain texture)
- Create: `public/images/menu/placeholder.svg`
- Create: `public/images/social/placeholder.svg`

- [ ] **Step 1: Save the logo**

Copy the user-provided Hot Dog Maracay logo to `public/logo.png`. If the source path is `/Users/franccescopetta/Desktop/profile_hotdogmaracay.nyc.jpeg`, copy it:

```bash
cp /Users/franccescopetta/Desktop/profile_hotdogmaracay.nyc.jpeg public/logo.png
```

Verify it loads at http://localhost:4321/logo.png after starting dev server.

- [ ] **Step 2: Create a placeholder menu image SVG**

`public/images/menu/placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#111111"/>
  <rect x="20" y="20" width="360" height="360" fill="none" stroke="#FF6B00" stroke-width="2" stroke-dasharray="8 8"/>
  <text x="200" y="200" font-family="Impact, sans-serif" font-size="48" fill="#FF6B00" text-anchor="middle" dominant-baseline="middle">🌭</text>
  <text x="200" y="260" font-family="Inter, sans-serif" font-size="14" fill="#666" text-anchor="middle">photo coming</text>
</svg>
```

- [ ] **Step 3: Generate the noise texture**

Generate a 256×256 PNG with random noise. Quick approach — create `public/noise.png` with this one-liner (requires ImageMagick) OR if not available, use this SVG-based data URL approach later in CSS. For simplicity, use a CSS-only approach with `feTurbulence` in `Hero.astro` later; skip creating noise.png here.

- [ ] **Step 4: Commit**

```bash
git add public/
git commit -m "feat: add logo and placeholder menu image"
```

---

### Task 8: Build the Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create Base.astro**

```astro
---
import "../styles/globals.css";
import { t, type Locale } from "../lib/i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const title = t(locale, "meta.title");
const description = t(locale, "meta.description");
const alternateLocale: Locale = locale === "es" ? "en" : "es";
const alternateHref = alternateLocale === "es" ? "/" : "/en/";
const canonicalHref = locale === "es" ? "/" : "/en/";
---

<!doctype html>
<html lang={locale} class="bg-bg-primary">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href={`https://hotdogmaracay.nyc${canonicalHref}`} />
    <link rel="alternate" hreflang={alternateLocale} href={`https://hotdogmaracay.nyc${alternateHref}`} />
    <link rel="alternate" hreflang={locale} href={`https://hotdogmaracay.nyc${canonicalHref}`} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
    <script defer data-domain="hotdogmaracay.nyc" src="https://plausible.io/js/script.js"></script>
  </head>
  <body class="min-h-screen">
    <slot />
  </body>
</html>
```

> Self-hosting fonts is a later optimization; using Google Fonts CDN with `preconnect` is acceptable for v1.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add Base layout with meta, fonts, and analytics"
```

---

### Task 9: Build the LangToggle React island

**Files:**
- Create: `src/components/LangToggle.tsx`

- [ ] **Step 1: Implement LangToggle.tsx**

```tsx
import { useEffect, useState } from "react";

type Locale = "es" | "en";

interface Props {
  currentLocale: Locale;
}

export default function LangToggle({ currentLocale }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      localStorage.setItem("preferredLocale", currentLocale);
    } catch {
      // localStorage unavailable; ignore
    }
  }, [currentLocale]);

  const switchTo = (locale: Locale) => {
    const target = locale === "es" ? "/" : "/en/";
    const hash = window.location.hash || "";
    try {
      localStorage.setItem("preferredLocale", locale);
    } catch {
      // ignore
    }
    window.location.href = target + hash;
  };

  return (
    <div className="inline-flex items-center rounded-full border border-white/20 text-xs font-semibold" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => switchTo("es")}
        aria-pressed={currentLocale === "es"}
        className={`px-3 py-1 rounded-full transition ${currentLocale === "es" ? "bg-accent-orange text-black" : "text-white/70"}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={currentLocale === "en"}
        className={`px-3 py-1 rounded-full transition ${currentLocale === "en" ? "bg-accent-orange text-black" : "text-white/70"}`}
      >
        EN
      </button>
      {/* avoid hydration flash by deferring class swap until mounted */}
      <span className="sr-only">{mounted ? "" : "loading"}</span>
    </div>
  );
}
```

- [ ] **Step 2: Add auto-redirect logic to index pages later** (handled in Task 17)

- [ ] **Step 3: Commit**

```bash
git add src/components/LangToggle.tsx
git commit -m "feat: add LangToggle React island"
```

---

### Task 10: Build the Nav component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Implement Nav.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";
import LangToggle from "./LangToggle";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const prefix = locale === "es" ? "" : "/en";
---

<nav class="sticky top-0 z-50 bg-bg-primary/90 backdrop-blur border-b border-white/10">
  <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href={`${prefix}/`} class="font-display text-accent-yellow text-lg tracking-tight uppercase">
      Hot Dog Maracay
    </a>
    <div class="hidden md:flex items-center gap-6 text-sm">
      <a href={`${prefix}/#menu`} class="hover:text-accent-orange transition">{t(locale, "nav.menu")}</a>
      <a href={`${prefix}/#location`} class="hover:text-accent-orange transition">{t(locale, "nav.find")}</a>
      <a href={links.uberEats} target="_blank" rel="noopener" class="bg-accent-orange text-black font-bold px-4 py-2 rounded-md hover:brightness-110 transition">
        {t(locale, "nav.order")} ↗
      </a>
      <LangToggle client:idle currentLocale={locale} />
    </div>
    <div class="md:hidden flex items-center gap-3">
      <LangToggle client:idle currentLocale={locale} />
      <button id="mobile-menu-toggle" type="button" class="text-white text-2xl leading-none" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        ≡
      </button>
    </div>
  </div>
  <div id="mobile-menu" class="md:hidden hidden border-t border-white/10 bg-bg-primary">
    <div class="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4 text-base">
      <a href={`${prefix}/#menu`} class="py-2 hover:text-accent-orange">{t(locale, "nav.menu")}</a>
      <a href={`${prefix}/#location`} class="py-2 hover:text-accent-orange">{t(locale, "nav.find")}</a>
      <a href={links.uberEats} target="_blank" rel="noopener" class="bg-accent-orange text-black font-bold py-3 text-center rounded-md">
        {t(locale, "nav.order")} ↗
      </a>
    </div>
  </div>
</nav>

<script>
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  toggle?.addEventListener("click", () => {
    const open = menu?.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  // close on anchor click
  menu?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.add("hidden");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
</script>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add sticky Nav with mobile menu and language toggle"
```

---

### Task 11: Build the Hero component

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Implement Hero.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const prefix = locale === "es" ? "" : "/en";
const tagline = t(locale, "hero.tagline");
const subtitle = t(locale, "hero.subtitle");
const ctaOrder = t(locale, "hero.ctaOrder");
const ctaMenu = t(locale, "hero.ctaMenu");
---

<section class="relative overflow-hidden">
  <!-- gradient backdrop -->
  <div class="absolute inset-0 -z-10" aria-hidden="true">
    <div class="absolute inset-0 bg-bg-primary"></div>
    <div class="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-accent-orange/40 to-transparent blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-accent-yellow/20 to-transparent blur-3xl"></div>
  </div>
  <!-- film grain (inline SVG turbulence, no extra asset) -->
  <svg class="absolute inset-0 -z-10 w-full h-full opacity-[0.05] mix-blend-overlay pointer-events-none" aria-hidden="true">
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>

  <div class="max-w-6xl mx-auto px-4 pt-16 md:pt-28 pb-24 md:pb-32">
    <h1 class="font-display text-5xl md:text-8xl leading-none uppercase tracking-tight hero-headline opacity-0">
      <span class="block">{tagline.split(" ").slice(0, 2).join(" ")}</span>
      <span class="block text-accent-orange">{tagline.split(" ").slice(2).join(" ")}</span>
    </h1>
    <p class="mt-6 text-text-muted text-lg max-w-md hero-headline opacity-0" style="animation-delay:120ms">
      {subtitle}
    </p>
    <div class="mt-10 flex flex-wrap gap-3 hero-headline opacity-0" style="animation-delay:240ms">
      <a href={links.uberEats} target="_blank" rel="noopener"
         class="bg-accent-orange text-black font-bold px-6 py-3 rounded-md shadow-cta hover:brightness-110 active:scale-[0.98] transition">
        {ctaOrder} →
      </a>
      <a href={`${prefix}/#menu`}
         class="border border-white/30 text-white font-bold px-6 py-3 rounded-md hover:bg-white/5 active:scale-[0.98] transition">
        {ctaMenu}
      </a>
    </div>
  </div>
</section>

<style>
  .hero-headline {
    animation: heroIn 400ms cubic-bezier(0.2, 0.6, 0.2, 1) forwards;
  }
  @keyframes heroIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-headline { animation: none; opacity: 1; }
  }
</style>
```

- [ ] **Step 2: Add `bg-gradient-radial` utility to Tailwind**

Add to `tailwind.config.mjs` under `theme.extend`:

```js
backgroundImage: {
  'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
},
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro tailwind.config.mjs
git commit -m "feat: add Hero with animated headline and film-grain"
```

---

### Task 12: Build the OrderCTAs component

**Files:**
- Create: `src/components/OrderCTAs.astro`

- [ ] **Step 1: Implement OrderCTAs.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";

interface Props {
  locale: Locale;
  variant?: "primary" | "secondary";
}

const { locale, variant = "primary" } = Astro.props;
const heading = t(locale, "order.heading");
---

<section id="order" class="bg-bg-elevated">
  <div class="max-w-6xl mx-auto px-4 py-16">
    {variant === "primary" && (
      <h2 class="font-display text-3xl md:text-5xl uppercase mb-8">
        {heading}
      </h2>
    )}
    <div class="grid md:grid-cols-2 gap-4">
      <a href={links.uberEats} target="_blank" rel="noopener"
         class="group flex items-center justify-between bg-bg-primary border border-white/10 hover:border-accent-orange rounded-xl p-5 transition">
        <div>
          <div class="font-display text-2xl uppercase">{t(locale, "order.uberEatsTitle")}</div>
          <div class="text-text-muted text-sm mt-1">{t(locale, "order.uberEatsSubtitle")}</div>
        </div>
        <span class="text-accent-orange text-2xl group-hover:translate-x-1 transition">→</span>
      </a>
      <a href={links.whatsapp} target="_blank" rel="noopener"
         class="group flex items-center justify-between bg-bg-primary border border-white/10 hover:border-accent-orange rounded-xl p-5 transition">
        <div>
          <div class="font-display text-2xl uppercase">{t(locale, "order.whatsappTitle")}</div>
          <div class="text-text-muted text-sm mt-1">{t(locale, "order.whatsappSubtitle")}</div>
        </div>
        <span class="text-accent-orange text-2xl group-hover:translate-x-1 transition">→</span>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/OrderCTAs.astro
git commit -m "feat: add OrderCTAs component with Uber Eats and WhatsApp"
```

---

### Task 13: Build the MenuGrid and MenuCard components

**Files:**
- Create: `src/components/MenuCard.astro`
- Create: `src/components/MenuGrid.astro`

- [ ] **Step 1: Implement MenuCard.astro**

```astro
---
import type { Locale } from "../lib/i18n";

interface Props {
  locale: Locale;
  item: {
    id: string;
    name: { es: string; en: string };
    description: { es: string; en: string };
    price: string;
    image: string;
  };
}

const { locale, item } = Astro.props;
const fallback = "/images/menu/placeholder.svg";
---

<article class="group relative overflow-hidden rounded-xl bg-bg-elevated border border-white/5 aspect-square">
  <img
    src={item.image}
    onerror={`this.onerror=null;this.src='${fallback}'`}
    alt={item.name[locale]}
    loading="lazy"
    decoding="async"
    class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
  />
  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
  <div class="absolute bottom-0 left-0 right-0 p-4">
    <div class="flex items-baseline justify-between gap-2">
      <h3 class="font-display text-xl uppercase leading-tight">{item.name[locale]}</h3>
      <span class="font-bold text-accent-yellow">{item.price}</span>
    </div>
    <p class="text-text-muted text-xs mt-1 line-clamp-2">{item.description[locale]}</p>
  </div>
</article>
```

- [ ] **Step 2: Implement MenuGrid.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";
import MenuCard from "./MenuCard.astro";
import menuData from "../content/menu.json";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const menuPdf = links.menuPdf[locale];
---

<section id="menu" class="bg-bg-primary">
  <div class="max-w-6xl mx-auto px-4 py-16 md:py-24">
    <h2 class="font-display text-3xl md:text-5xl uppercase mb-8">
      {t(locale, "menu.heading")}
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {menuData.items.map((item) => (
        <MenuCard locale={locale} item={item} />
      ))}
    </div>
    <div class="mt-8 text-center">
      <a href={menuPdf} target="_blank" rel="noopener"
         class="inline-block text-accent-orange font-bold hover:underline">
        {t(locale, "menu.viewFull")}
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MenuCard.astro src/components/MenuGrid.astro
git commit -m "feat: add MenuGrid and MenuCard components"
```

---

### Task 14: Build the LocationBlock component

**Files:**
- Create: `src/components/LocationBlock.astro`

- [ ] **Step 1: Implement LocationBlock.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const { lat, lng } = links.cart.coords;
// Public Google Maps embed (no API key)
const mapSrc = `https://www.google.com/maps?q=${lat},${lng}&hl=${locale}&z=16&output=embed`;
---

<section id="location" class="bg-bg-elevated">
  <div class="max-w-6xl mx-auto px-4 py-16 md:py-24">
    <h2 class="font-display text-3xl md:text-5xl uppercase mb-8">
      {t(locale, "location.heading")}
    </h2>
    <div class="grid md:grid-cols-2 gap-8 items-start">
      <div class="rounded-xl overflow-hidden border border-white/10 aspect-video md:aspect-square">
        <iframe
          src={mapSrc}
          title="Map"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="w-full h-full"
          style="border:0"
          allowfullscreen
        ></iframe>
      </div>
      <div class="space-y-6">
        <div>
          <div class="text-accent-yellow text-xs font-bold uppercase tracking-wider mb-1">
            {t(locale, "location.addressLabel")}
          </div>
          <p class="text-lg">{links.cart.address}</p>
        </div>
        <div>
          <div class="text-accent-yellow text-xs font-bold uppercase tracking-wider mb-1">
            {t(locale, "location.hoursLabel")}
          </div>
          <p class="text-lg">{links.cart.hours}</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href={links.googleMaps} target="_blank" rel="noopener"
             class="bg-accent-orange text-black font-bold px-5 py-3 rounded-md hover:brightness-110 active:scale-[0.98] transition">
            {t(locale, "location.directions")}
          </a>
          <a href={links.googleReviews} target="_blank" rel="noopener"
             class="border border-white/30 text-white font-bold px-5 py-3 rounded-md hover:bg-white/5 transition">
            {t(locale, "location.reviewsLink")}
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LocationBlock.astro
git commit -m "feat: add LocationBlock with map embed and directions"
```

---

### Task 15: Build the StorySection component

**Files:**
- Create: `src/components/StorySection.astro`

- [ ] **Step 1: Implement StorySection.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
---

<section id="story" class="bg-bg-primary relative overflow-hidden">
  <div class="absolute -top-20 -right-20 w-96 h-96 bg-gradient-radial from-accent-orange/15 to-transparent blur-3xl" aria-hidden="true"></div>
  <div class="max-w-3xl mx-auto px-4 py-20 md:py-28 text-center">
    <h2 class="font-display text-4xl md:text-6xl uppercase leading-none">
      {t(locale, "story.heading")}
    </h2>
    <p class="mt-6 text-lg text-text-muted leading-relaxed">
      {t(locale, "story.body")}
    </p>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StorySection.astro
git commit -m "feat: add StorySection"
```

---

### Task 16: Build the SocialGrid and ReviewQuote components

**Files:**
- Create: `src/components/SocialGrid.astro`
- Create: `src/components/ReviewQuote.astro`

- [ ] **Step 1: Implement SocialGrid.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;

// Curated grid — replace with real IG screenshot paths when available
const tiles = [
  "/images/social/placeholder.svg",
  "/images/social/placeholder.svg",
  "/images/social/placeholder.svg",
  "/images/social/placeholder.svg",
  "/images/social/placeholder.svg",
  "/images/social/placeholder.svg",
];
---

<section id="social" class="bg-bg-elevated">
  <div class="max-w-6xl mx-auto px-4 py-16 md:py-24">
    <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h2 class="font-display text-3xl md:text-5xl uppercase">{t(locale, "social.heading")}</h2>
        <p class="text-text-muted mt-2">{t(locale, "social.subtitle")}</p>
      </div>
      <div class="flex gap-3">
        <a href={links.instagram} target="_blank" rel="noopener"
           class="border border-white/20 hover:border-accent-orange px-4 py-2 rounded-md transition">Instagram</a>
        <a href={links.tiktok} target="_blank" rel="noopener"
           class="border border-white/20 hover:border-accent-orange px-4 py-2 rounded-md transition">TikTok</a>
      </div>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
      {tiles.map((src) => (
        <a href={links.instagram} target="_blank" rel="noopener"
           class="aspect-square overflow-hidden rounded-md bg-bg-primary border border-white/5 hover:opacity-80 transition">
          <img src={src} alt="Instagram post" class="w-full h-full object-cover" loading="lazy" />
        </a>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Create the social placeholder SVG**

`public/images/social/placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#1a1a1a"/>
  <text x="100" y="105" font-family="Inter, sans-serif" font-size="48" fill="#FF6B00" text-anchor="middle" dominant-baseline="middle">🌭</text>
</svg>
```

- [ ] **Step 3: Implement ReviewQuote.astro**

```astro
---
interface Props {
  quote: string;
  author: string;
}

const { quote, author } = Astro.props;
---

<figure class="bg-bg-elevated border border-white/5 rounded-xl p-6">
  <div class="text-accent-yellow text-lg" aria-hidden="true">★★★★★</div>
  <blockquote class="mt-3 italic text-text-primary leading-relaxed">"{quote}"</blockquote>
  <figcaption class="mt-3 text-text-muted text-sm">— {author}</figcaption>
</figure>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SocialGrid.astro src/components/ReviewQuote.astro public/images/social/
git commit -m "feat: add SocialGrid and ReviewQuote components"
```

---

### Task 17: Build the Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Implement Footer.astro**

```astro
---
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const year = new Date().getFullYear();
---

<footer class="bg-black border-t border-white/10">
  <div class="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
    <div class="text-center md:text-left">
      <div class="font-display text-accent-yellow text-xl uppercase">Hot Dog Maracay NYC</div>
      <p class="text-text-muted text-sm mt-1">{t(locale, "footer.tagline")}</p>
    </div>
    <div class="flex items-center gap-5 text-sm">
      <a href={links.instagram} target="_blank" rel="noopener" class="hover:text-accent-orange transition">Instagram</a>
      <a href={links.tiktok} target="_blank" rel="noopener" class="hover:text-accent-orange transition">TikTok</a>
      <a href={`mailto:${links.contact.email}`} class="hover:text-accent-orange transition">Email</a>
    </div>
  </div>
  <div class="border-t border-white/5">
    <div class="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-text-muted">
      © {year} Hot Dog Maracay NYC. {t(locale, "footer.rights")}
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer"
```

---

### Task 18: Assemble the Spanish homepage

**Files:**
- Replace: `src/pages/index.astro`

- [ ] **Step 1: Implement src/pages/index.astro**

```astro
---
import Base from "../layouts/Base.astro";
import Nav from "../components/Nav.astro";
import Hero from "../components/Hero.astro";
import OrderCTAs from "../components/OrderCTAs.astro";
import MenuGrid from "../components/MenuGrid.astro";
import LocationBlock from "../components/LocationBlock.astro";
import StorySection from "../components/StorySection.astro";
import SocialGrid from "../components/SocialGrid.astro";
import ReviewQuote from "../components/ReviewQuote.astro";
import Footer from "../components/Footer.astro";
import { t, type Locale } from "../lib/i18n";
import { links } from "../lib/links";

const locale: Locale = "es";

const reviews = [
  { quote: "El mejor perro caliente que he comido en Queens. Sabe a casa.", author: "María G., Google Review" },
  { quote: "Auténticamente venezolano. Los teques están increíbles.", author: "Carlos R., Google Review" },
  { quote: "Vengo todos los fines de semana. Servicio rápido y comida sabrosa.", author: "Laura P., Google Review" },
];

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Hot Dog Maracay NYC",
  image: "https://hotdogmaracay.nyc/logo.png",
  servesCuisine: "Venezuelan",
  priceRange: "$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Queens",
    addressRegion: "NY",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: links.cart.coords.lat,
    longitude: links.cart.coords.lng,
  },
  url: "https://hotdogmaracay.nyc",
  sameAs: [links.instagram, links.tiktok],
};
---

<Base locale={locale}>
  <script
    type="application/ld+json"
    set:html={JSON.stringify(restaurantSchema)}
    slot="head"
  />
  <Nav locale={locale} />
  <main>
    <Hero locale={locale} />
    <OrderCTAs locale={locale} variant="primary" />
    <MenuGrid locale={locale} />
    <LocationBlock locale={locale} />
    <StorySection locale={locale} />
    <OrderCTAs locale={locale} variant="secondary" />
    <SocialGrid locale={locale} />
    <section id="reviews" class="bg-bg-primary">
      <div class="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 class="font-display text-3xl md:text-5xl uppercase mb-8">{t(locale, "reviews.heading")}</h2>
        <div class="grid md:grid-cols-3 gap-4">
          {reviews.map((r) => <ReviewQuote quote={r.quote} author={r.author} />)}
        </div>
      </div>
    </section>
  </main>
  <Footer locale={locale} />
</Base>
```

> Note: `slot="head"` on the script means Base.astro needs a named head slot. Update Base.astro to include `<slot name="head" />` inside `<head>`.

- [ ] **Step 2: Update Base.astro to include a head slot**

In `src/layouts/Base.astro`, inside `<head>`, just before `</head>`, add:

```astro
<slot name="head" />
```

- [ ] **Step 3: Verify build and dev server**

```bash
npm run build
npm run dev
```

Open http://localhost:4321/ — verify the full page renders with all sections.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/layouts/Base.astro
git commit -m "feat: assemble Spanish homepage with all sections"
```

---

### Task 19: Assemble the English homepage

**Files:**
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Implement src/pages/en/index.astro**

```astro
---
import Base from "../../layouts/Base.astro";
import Nav from "../../components/Nav.astro";
import Hero from "../../components/Hero.astro";
import OrderCTAs from "../../components/OrderCTAs.astro";
import MenuGrid from "../../components/MenuGrid.astro";
import LocationBlock from "../../components/LocationBlock.astro";
import StorySection from "../../components/StorySection.astro";
import SocialGrid from "../../components/SocialGrid.astro";
import ReviewQuote from "../../components/ReviewQuote.astro";
import Footer from "../../components/Footer.astro";
import { t, type Locale } from "../../lib/i18n";
import { links } from "../../lib/links";

const locale: Locale = "en";

const reviews = [
  { quote: "Best hot dog I've had in Queens. Tastes like home.", author: "Maria G., Google Review" },
  { quote: "Authentically Venezuelan. The tequeños are amazing.", author: "Carlos R., Google Review" },
  { quote: "I come every weekend. Fast service, flavorful food.", author: "Laura P., Google Review" },
];

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Hot Dog Maracay NYC",
  image: "https://hotdogmaracay.nyc/logo.png",
  servesCuisine: "Venezuelan",
  priceRange: "$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Queens",
    addressRegion: "NY",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: links.cart.coords.lat,
    longitude: links.cart.coords.lng,
  },
  url: "https://hotdogmaracay.nyc/en/",
  sameAs: [links.instagram, links.tiktok],
};
---

<Base locale={locale}>
  <script
    type="application/ld+json"
    set:html={JSON.stringify(restaurantSchema)}
    slot="head"
  />
  <Nav locale={locale} />
  <main>
    <Hero locale={locale} />
    <OrderCTAs locale={locale} variant="primary" />
    <MenuGrid locale={locale} />
    <LocationBlock locale={locale} />
    <StorySection locale={locale} />
    <OrderCTAs locale={locale} variant="secondary" />
    <SocialGrid locale={locale} />
    <section id="reviews" class="bg-bg-primary">
      <div class="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <h2 class="font-display text-3xl md:text-5xl uppercase mb-8">{t(locale, "reviews.heading")}</h2>
        <div class="grid md:grid-cols-3 gap-4">
          {reviews.map((r) => <ReviewQuote quote={r.quote} author={r.author} />)}
        </div>
      </div>
    </section>
  </main>
  <Footer locale={locale} />
</Base>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
npm run preview
```

Open http://localhost:4321/en/ — verify the English page renders correctly.

- [ ] **Step 3: Commit**

```bash
git add src/pages/en/
git commit -m "feat: assemble English homepage with all sections"
```

---

### Task 20: Add language auto-redirect on first visit

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Add the redirect snippet**

In `src/layouts/Base.astro`, inside `<head>` (BEFORE the title/meta tags so it fires fast), add:

```astro
<script is:inline>
  (function () {
    try {
      var stored = localStorage.getItem("preferredLocale");
      var path = window.location.pathname;
      var isEn = path.startsWith("/en");
      if (!stored) return;
      if (stored === "en" && !isEn) {
        window.location.replace("/en" + (path === "/" ? "/" : path));
      } else if (stored === "es" && isEn) {
        window.location.replace(path.replace(/^\/en/, "") || "/");
      }
    } catch (e) {}
  })();
</script>
```

- [ ] **Step 2: Verify in dev server**

Open http://localhost:4321/, click "EN" toggle → lands on /en/. Refresh http://localhost:4321/ → should auto-redirect to /en/.

Open DevTools → Application → Local Storage → delete `preferredLocale` to test fresh state.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: auto-redirect on first visit based on stored locale"
```

---

### Task 21: Add a sitemap and robots.txt

**Files:**
- Create: `public/robots.txt`
- Install: `@astrojs/sitemap`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install sitemap integration**

```bash
npm install -D @astrojs/sitemap
```

- [ ] **Step 2: Modify astro.config.mjs**

Update to include sitemap:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hotdogmaracay.nyc",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    sitemap({ i18n: { defaultLocale: "es", locales: { es: "es-VE", en: "en-US" } } }),
  ],
});
```

- [ ] **Step 3: Create public/robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://hotdogmaracay.nyc/sitemap-index.xml
```

- [ ] **Step 4: Verify build outputs sitemap**

```bash
npm run build
ls dist/sitemap*
```

Expected: `dist/sitemap-index.xml` and `dist/sitemap-0.xml` exist.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs public/robots.txt package.json package-lock.json
git commit -m "feat: add sitemap and robots.txt"
```

---

### Task 22: Add the link checker script

**Files:**
- Create: `scripts/check-links.mjs`
- Modify: `package.json` (add script)

- [ ] **Step 1: Implement scripts/check-links.mjs**

```js
import { links } from "../src/lib/links.ts";

const urls = [
  links.uberEats,
  links.whatsapp,
  links.instagram,
  links.tiktok,
  links.googleMaps,
  links.googleReviews,
];

let failures = 0;

for (const url of urls) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (res.ok || res.status === 302 || res.status === 301) {
      console.log(`✓ ${res.status} ${url}`);
    } else {
      console.log(`✗ ${res.status} ${url}`);
      failures++;
    }
  } catch (err) {
    console.log(`✗ ERROR ${url} — ${err.message}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n${failures} link(s) failed.`);
  process.exit(1);
}
console.log("\nAll links OK.");
```

- [ ] **Step 2: Add tsx loader for the script**

```bash
npm install -D tsx
```

In `package.json` scripts, add:

```json
"check:links": "tsx scripts/check-links.mjs"
```

- [ ] **Step 3: Run it**

```bash
npm run check:links
```

Expected: all 6 URLs return OK.

- [ ] **Step 4: Commit**

```bash
git add scripts/check-links.mjs package.json package-lock.json
git commit -m "chore: add link checker for outbound URLs"
```

---

### Task 23: Cross-device manual verification

**Files:** none

- [ ] **Step 1: Build and preview**

```bash
npm run build
npm run preview
```

- [ ] **Step 2: Open in browser and verify each viewport**

Use Chrome DevTools device emulation. Verify each viewport, both routes (`/` and `/en/`):

- iPhone SE (375 × 667)
- iPhone 15 (393 × 852)
- iPad (768 × 1024)
- Desktop (1280 × 800)

For each:
- Hero animates in on load
- Sticky nav stays at top while scrolling
- Mobile hamburger opens and closes; tapping a link closes it
- Language toggle switches the URL and translates every visible string
- All 8 sections render in order
- Map embed loads
- Menu cards lay out 2-col on mobile, 4-col on desktop
- All CTA buttons feel tappable (≥ 44px tap target)

- [ ] **Step 3: Run Lighthouse audit**

In Chrome DevTools → Lighthouse → Mobile + all categories → Analyze.

Expected: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

If any score is below 95, note the failing audit and create a follow-up task. Common fixes:
- Performance: ensure images are lazy-loaded with `loading="lazy"`
- Accessibility: missing alt text, low contrast — fix at component level
- SEO: missing meta description — confirm Base.astro is rendering it

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: lighthouse audit findings"
```

(Skip this step if no fixes were needed.)

---

### Task 24: Deploy to Cloudflare Pages

**Files:** none (deployment config done in Cloudflare dashboard)

- [ ] **Step 1: Push to GitHub**

If a GitHub repo doesn't exist yet, create one:

```bash
gh repo create hotdogmaracay --public --source=. --remote=origin --push
```

If you'd rather create the repo via the GitHub web UI, do that and then:

```bash
git remote add origin git@github.com:<user>/hotdogmaracay.git
git push -u origin main
```

- [ ] **Step 2: Connect Cloudflare Pages**

In the Cloudflare dashboard:
1. Workers & Pages → Create application → Pages → Connect to Git
2. Select the `hotdogmaracay` repo
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Environment variables: none required
6. Deploy

Expected: first deploy succeeds. Note the `*.pages.dev` URL.

- [ ] **Step 3: Add custom domain**

1. Cloudflare Pages project → Custom domains → Set up a custom domain
2. Enter `hotdogmaracay.nyc` (purchase the domain first if not already owned)
3. Follow DNS instructions

- [ ] **Step 4: Verify live site**

Open `https://hotdogmaracay.nyc/` and `https://hotdogmaracay.nyc/en/` — verify both load.

Re-run Lighthouse against the live site to confirm production performance.

---

## Post-launch follow-ups (not part of MVP)

These are explicitly out of scope for this plan but should be tracked:

- Replace placeholder food photography with real hi-res images
- Replace placeholder review quotes with real Google review excerpts
- Replace placeholder IG grid with real screenshots (or wire up a service like SnapWidget)
- Confirm real street address and update `src/lib/links.ts`
- Confirm real business hours
- Confirm contact email
- Replace `og-image.png` with a real hero shot for social previews
- Self-host fonts (Anton + Inter) and subset to used characters for perf
