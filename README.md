# abe-astro

ABE Education marketing site — Astro pilot for [abeeducation.edu.au](https://abeeducation.edu.au).

The pilot replatforms `/about` off Framer onto a zero-runtime-JS Astro stack, deployed to Cloudflare Pages, targeting 95+ mobile PageSpeed.

## Stack

- **Astro 4** with `output: 'static'` and the `@astrojs/cloudflare` adapter
- **Tailwind CSS** — theme values all read from CSS custom properties (see `src/styles/tokens.css`)
- **React 18** — only for components that need interaction (Accordion). Everything else renders as static HTML at build time
- **MDX** — page copy lives in `src/content/pages/*.mdx` with a typed Zod schema
- **Cloudflare Pages** — GitHub auto-deploy from the `main` branch

## Getting started

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # astro check + static build into ./dist
npm run preview        # preview the built site
```

Node 20.10+ is required (see `engines` in package.json).

## Folder structure

```
astro-scaffold/
  astro.config.mjs           # build config — cloudflare adapter, integrations
  tailwind.config.mjs        # theme extensions that point at CSS custom props
  tsconfig.json              # strict + path aliases (@components, @layouts, @lib)
  wrangler.toml              # cloudflare pages config
  public/
    fonts/
      archivo-latin.woff2    # 39 KB — headings
      dmsans-latin.woff2     # body (pending upload)
    robots.txt
    favicon.svg
  src/
    components/              # Button, Card, Hero, Stats, Accordion, etc.
    content/
      config.ts              # zod schemas for the page collection
      pages/
        about.mdx
    layouts/
      BaseLayout.astro       # <html>, <head>, preload, JSON-LD slot
    lib/
      schema.ts              # JSON-LD builders (EducationalOrganization, FAQ, Breadcrumb)
      site.ts                # site-wide constants (URL, ABN, contact)
    pages/
      index.astro            # temporary pilot landing
      about.astro            # renders the /about MDX
    styles/
      tokens.css             # design tokens — source of truth
      fonts.css              # @font-face declarations
      global.css             # tailwind layers + base resets
    env.d.ts
```

## Design tokens

All visual values live in `src/styles/tokens.css` as CSS custom properties. Tailwind's theme points at those properties by name — so `bg-maroon-700` compiles to `background-color: var(--color-maroon-700)`.

Rule: **never hard-code hex, px, or ms values outside `tokens.css`**. Add a new token if a value is missing.

## Content editing

`/about` copy sits in `src/content/pages/about.mdx`. The frontmatter is validated against the Zod schema in `src/content/config.ts`, so a typo in `metaTitle` or a missing `h1` fails the build.

Workflow for non-technical editors:

1. Open the MDX file on GitHub.
2. Click the pencil icon, edit copy, commit to a branch.
3. Cloudflare Pages builds a preview URL.
4. Review, then merge to `main` — production updates in under 90 seconds.

## Deployment

Cloudflare Pages project `abe-astro`, connected to this repo's `main` branch.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20.10.0` (via env var `NODE_VERSION`)

Preview branch `about-preview` maps to `about-preview.abeeducation.edu.au` for the pilot.

## Performance targets

| Metric (mobile, PageSpeed Insights) | Target | Framer baseline |
|-------------------------------------|--------|-----------------|
| Performance                         | 95+    | 62              |
| LCP                                 | < 1.8s | 3.9s            |
| CLS                                 | < 0.05 | 0.08            |
| Total JS transfer                   | < 30KB | 480KB           |

## Scripts

- `npm run dev` — dev server on port 4321
- `npm run build` — type-check with `astro check` then build to `dist`
- `npm run preview` — serve the built site locally
- `npm run format` — Prettier over `src/**/*.{astro,ts,tsx,mdx,css,md}`

## Licence

Proprietary — ABE Education Pty Ltd (ABN 64 125 455 272).
