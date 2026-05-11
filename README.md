# Hot Dog Maracay NYC

Bilingual (ES/EN) marketing site for the Venezuelan hot dog cart in Queens.
Deployed at **https://hotdogmaracay.francces.co**.

## Stack

- [Astro 4](https://astro.build) static site, zero-JS by default
- [Tailwind CSS](https://tailwindcss.com) for styling
- TypeScript everywhere
- Hosted on GitHub Pages via the workflow in `.github/workflows/deploy.yml`

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
```

## Build & preview production

```sh
npm run build    # outputs to ./dist
npm run preview  # serves ./dist at http://localhost:4321
```

## Test

```sh
npm test         # vitest unit tests for src/lib/
```

## Sanity-check outbound URLs

```sh
npm run check:links
```

Reports HTTP status for every URL declared in `src/lib/links.ts`.
Note: WhatsApp and TikTok return 4xx to bots — that's expected, not a real failure.

## Deploying

Pushing to `main` triggers the GitHub Pages workflow. To deploy from scratch:

1. Push this repo to GitHub.
2. In **Settings → Pages**, set source to **GitHub Actions**.
3. In **Settings → Pages → Custom domain**, set `hotdogmaracay.francces.co`.
4. Add a `CNAME` DNS record on `francces.co`:
   - **Name:** `hotdogmaracay`
   - **Value:** `<your-github-username>.github.io`
5. Push to `main`. The workflow builds and deploys.

The `public/CNAME` file is committed so GitHub Pages keeps the custom domain on each deploy.

## Content gaps (TODO before launch)

These placeholders live in `src/lib/links.ts` and `src/data/menu.json`:

- Exact street address (currently `Queens, NY`)
- Real business hours
- Contact email
- Menu item prices (placeholders)
- Real food photography (`public/images/menu/`)
- Real Instagram post screenshots (`public/images/social/`)
- Three real Google review quotes (currently placeholders in the page files)

## Project layout

```
src/
├── components/   # Astro components (Hero, Nav, MenuGrid, etc.)
├── data/         # menu.json + i18n JSONs
├── layouts/      # Base.astro (html shell)
├── lib/          # i18n.ts, links.ts, schema.ts (logic helpers)
├── pages/        # / (Spanish) + /en/ (English)
└── styles/       # globals.css
```
