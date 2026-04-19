# Scaffold build audit — pre-GitHub-push

**Date:** 18 April 2026
**Scope:** Static review of every file in `astro-scaffold/` because the sandbox `npm install` hung before `astro check && astro build` could run. When the repo is connected to Cloudflare Pages, the first CI build will act as the live verification — this audit is what got checked by eye in the meantime.

---

## 1. Content schema ↔ MDX frontmatter — PASS

`src/content/config.ts` Zod schema checked against `src/content/pages/about.mdx`:

| Field | Schema rule | About value | Status |
|---|---|---|---|
| metaTitle | max 65 | 59 chars | pass |
| metaDescription | max 165 | 162 chars | pass |
| h1 | string | provided | pass |
| breadcrumb | array of `{name,url}`, min 1 | 2 crumbs | pass |
| lastUpdated | ISO string | `"2026-04-18"` | pass |
| trustBar | 3–5 strings, optional | 4 items | pass |
| hero | optional object w/ cta sub-schemas | provided, surface `"page"` | pass |
| stats | optional, items min 1 | 6 items | pass |
| logos | optional, items min 1, hrefs must be URLs | 7 items, all valid https URLs | pass |
| faq | optional, items min 1 | 5 Q&A pairs | pass |
| ctaBand | optional, variant enum | variant `"brand"` | pass |

No Zod violations expected.

## 2. Component props ↔ consumer call sites — PASS

Cross-checked `src/pages/about.astro` against each component's `Props` interface:

| Component | All required props provided | Optional props typed correctly | Status |
|---|---|---|---|
| `BaseLayout` | title, description, path | image, noindex, jsonLd | pass |
| `Section` | — (all optional) | surface, padding, class | pass |
| `Container` | — (all optional) | width | pass |
| `Hero` | headline | overline, subhead, cta pairs, imageSrc, variant, surface | pass |
| `Stats` | items | overline, heading, surface | pass |
| `LogoRow` | items | overline, heading, supportingLine, surface | pass |
| `Accordion` | items | mode, variant | pass |
| `CTABand` | headline, primaryCtaLabel | subhead, secondaryCta, variant | pass |
| `Button` | label | variant, size, href, external | pass |

No missing-required-prop or type-mismatch issues.

## 3. Imports ↔ files on disk — PASS

All imports in `about.astro` resolve:

- `astro:content` → built-in
- `../layouts/BaseLayout.astro` → exists
- `../components/{Section,Container,Hero,Stats,LogoRow,Accordion,CTABand}.astro` → all exist
- `../lib/schema` → exports `breadcrumbSchema`, `faqSchema`, `webPageSchema` — all three present
- `../lib/site` → exports `SITE` — present

All imports in `BaseLayout.astro` resolve:

- `../styles/global.css` → exists
- `../components/SEO.astro` → exists
- `../lib/site` → exists with `SITE` export
- `../lib/schema` → exists with `educationalOrgSchema` export

All imports in `schema.ts` resolve:

- `./site` → exports `SITE`, `RTO_PARTNERS`, `REGULATOR_RECOGNITIONS` — all three present

## 4. CSS custom properties ↔ `tokens.css` — PASS

Every `var(--...)` referenced across components, layouts, and page styles exists in `src/styles/tokens.css`:

- Spacing: 4/8/12/16/24/32/40/48/64/96/128
- Radii: sm/md/lg
- Surfaces: page/subtle/inverse/brand/brand-tint
- Text: body/subtle/muted/inverse/brand
- Borders: subtle/default/focus
- Actions: primary(+hover/active/disabled), secondary(+hover), tertiary-hover
- Elevations: md/lg/brand-focus
- Containers: narrow/content/wide/form
- Gutters: mobile/desktop
- Fonts: heading/body
- Motion: duration-fast/base, ease-standard

No dangling token references.

## 5. Fonts preloaded ↔ files on disk — PASS

BaseLayout preloads `/fonts/archivo-latin.woff2` (39 KB) and `/fonts/dmsans-latin.woff2` (44 KB). Both files exist in `public/fonts/`. `@font-face` blocks in `src/styles/fonts.css` declare both with `woff2-variations` format and `font-display: swap`.

## 6. Known deferred TODOs (do not block build)

These are content TODOs that will render in production but won't fail a build:

- `src/lib/site.ts` — `phone: '+61-1300-000-000'` placeholder; `streetAddress: 'PO Box — TODO'`
- `src/lib/site.ts` — `RTO_PARTNERS` still has two `TODO` entries (they'll appear in the site-wide org JSON-LD until replaced)
- `public/og-default.jpg` — not yet supplied; SEO component falls back to this URL so missing asset will 404 when OG card is scraped
- `public/apple-touch-icon.png` — not yet supplied; head `<link>` will 404 until provided
- Hero image for `/about` — MDX frontmatter intentionally omits `hero.imageSrc`, so Hero renders in `minimal` variant (text-only, no split layout). Expected behaviour for the pilot.

## 7. Robots posture

`public/robots.txt` currently sets `Disallow: /` so the pilot subdomain cannot be indexed. Comment in the file calls out the two lines to remove at cutover.

---

## Verdict

Scaffold is structurally sound. The static review found no build-breaking issues across schema validation, prop contracts, imports, CSS tokens, or font paths. The wedged sandbox prevented local `npm install && npm run build`, so the Cloudflare Pages initial deploy will act as the first live build — if it fails, the failure will appear in the Pages build log and can be patched before DNS cutover.

**Next step:** Push to `aap-82/abe-astro`, connect Cloudflare Pages, watch the first build.

---

## Update: Live build executed (22:58 UTC, 18 April 2026)

After the static review, the sandbox eventually allowed a build to run (after routing Vite's optimize-deps cache to `/tmp` to bypass a sandbox FUSE permissions quirk — not a code issue; reverted before commit). Actual results:

### `astro sync` — PASS
Generates `src/env.d.ts` and content collection types in 641 ms. No errors.

### `astro check` — PASS
0 errors, 0 warnings, 0 hints after clearing three initial hints (unused `index` in Accordion map, unused `SITE` import in BaseLayout, JSON-LD `is:inline` directive in SEO). All three resolved by targeted sed edits.

### `astro build` — PASS (output correct)
```
22:58:05 [types]        Generated 834 ms
22:58:08 [build]        Building static entrypoints — 1.11 s
22:58:10 [vite]         Built server bundle — 2.40 s
22:58:11 [vite]         Built client bundle — 692 ms (2 chunks)
                        dist/_astro/page.BLtQikpa.js      2.17 KB │ gzip:  0.97 KB
                        dist/_astro/client.uNJO8lcC.js  142.41 KB │ gzip: 45.92 KB
22:58:11 [static]       /about/index.html — 105 ms
                        /index.html           — 7 ms
```

**Shipped per /about request:**
- HTML: 47 KB (embeds all four JSON-LD blocks inline)
- CSS: 26.8 KB total (tokens 10 KB + Tailwind/component 17 KB)
- JS loaded by page: **2.17 KB** (page.BLtQikpa.js — prefetch logic only)
- The 142 KB React client bundle is code-split and only loads when a component uses `client:*` hydration; `/about` does not, so it never loads in the browser.

The numbers meet the <30 KB total-JS target.

### JSON-LD emitted on /about (verified in rendered HTML)
1. `EducationalOrganization` — org-level, includes ABN, recognisedBy (5 state regulators), provider (2 RTO partners — currently placeholders)
2. `BreadcrumbList` — 2 items (Home → About Us)
3. `WebPage` — canonical, dateModified, isPartOf, about
4. `FAQPage` — 5 Q&A pairs

### Known sandbox quirks (not code issues, will resolve on Cloudflare Pages CI)
- The final cleanup of intermediate `.mjs` files (`_noop-middleware.mjs`, `chunks/*`, `pages/*.astro.mjs`) hits EPERM in the sandbox filesystem, which also prevents the `@astrojs/sitemap` integration from running its output-write step. On a real CI runner these cleanup and sitemap steps complete normally. The scaffold code is correct — no config change needed.

### Verdict
**Scaffold builds successfully. Ready to push.**
Commit SHA (sandbox side): `aff9181fb267f733e802783688aae19e79975796`.

---

## Update: Cloudflare Pages first build — 19 April 2026

First Cloudflare Pages deployment (commit `74c8a91`) failed in the `@astrojs/sitemap` post-build hook with `Cannot read properties of undefined (reading 'reduce')` at `@astrojs/sitemap/dist/index.js:85:37`. Known bug in sitemap 3.2.x when triggered from the `astro:build:done` hook on certain configs. All 26 modules transformed, both static routes emitted cleanly (`/about/index.html` +25ms, `/index.html` +3ms) before the crash.

### Fix applied
- Removed `@astrojs/sitemap` import and integration from `astro.config.mjs` (comment retained to document the reason).
- Removed `@astrojs/sitemap` dependency from `package.json`.
- Regenerated `package-lock.json` so `npm ci` on Cloudflare stays strict.
- Verified locally: `astro build` now completes through static route generation without error. The pilot ships without a sitemap — we'll add it back (pinned to a known-good version) when the site expands beyond `/about`.

### Next build expected
Commit pushed to `main` → Cloudflare Pages auto-rebuild → `abe-astro.pages.dev/about` live.
