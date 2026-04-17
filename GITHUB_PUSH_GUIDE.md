# GitHub push + Cloudflare Pages setup

The scaffold is committed locally and ready to ship. Sandbox auth isn't available, so the push runs from your Windows terminal. Five minutes, start to finish.

## 1. Push to `aap-82/abe-astro`

Open **PowerShell** (not the Cowork sandbox — PowerShell on your actual machine) and run:

```powershell
cd C:\Users\andre\AppData\Roaming\Claude\local-agent-mode-sessions\3f335d05-607f-4041-b834-5c4eee7af163\9bd23de6-5481-4827-ae39-a0d9aee1fcaf\local_92d3aba7-6f6d-47fe-9ffe-37aa918e6d35\outputs\astro-scaffold

# Fresh repo on your machine — the sandbox .git is discarded
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
git init -b main
git add .
git commit -m "Initial commit: Astro pilot scaffold for /about"
git remote add origin https://github.com/aap-82/abe-astro.git
git push -u origin main
```

The repo at `https://github.com/aap-82/abe-astro` should already exist (create it empty on github.com if not — **do not** tick "initialise with README"). If you want it private, tick private on creation.

## 2. Connect Cloudflare Pages

1. Go to **Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git**.
2. Authorise GitHub if not already, select `aap-82/abe-astro`.
3. Settings:
   - **Production branch**: `main`
   - **Framework preset**: **Astro**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `20` (set via environment variable `NODE_VERSION=20` under Settings → Environment variables, or in a `.nvmrc` — CF Pages picks it up)
   - **Environment variables**: none required for this pilot
4. Save and deploy. First build runs ~2–3 minutes.

## 3. Wire the preview subdomain

Once the first deploy succeeds:

1. In the Cloudflare Pages project → **Custom domains → Set up a custom domain**.
2. Enter `about-preview.abeeducation.edu.au`.
3. CF will add a CNAME automatically (since the zone `abeeducation.edu.au` is on Cloudflare). SSL cert provisions in 1–2 minutes.
4. Visit `https://about-preview.abeeducation.edu.au/about` — should render the about page; root `/` will render the stub.

## 4. Post-deploy sanity checks

- `https://about-preview.abeeducation.edu.au/about` — 200, full page renders
- `https://about-preview.abeeducation.edu.au/about/index.html` view-source — 4 JSON-LD blocks present
- `https://about-preview.abeeducation.edu.au/robots.txt` — `Disallow: /` (confirms the subdomain is blocked from indexing; this is intentional for the pilot)
- Google Rich Results Test on `/about` URL — should validate Organization + Breadcrumb + FAQPage + WebPage

## 5. PageSpeed Insights baseline

Target: **95+ mobile Performance**, **<1.8 s LCP**, **<30 KB total JS loaded**.

```
https://pagespeed.web.dev/analysis?url=https://about-preview.abeeducation.edu.au/about
```

Record the scores side-by-side against the Framer `/about` for the migration report.

## Deferred TODOs before cutover (not blocking the push)

These will render placeholders on the pilot but won't fail anything:

- `src/lib/site.ts` — phone `+61-1300-000-000` and `streetAddress: 'PO Box — TODO'` placeholders
- `src/lib/site.ts` — two `TODO: RTO partner` entries in `RTO_PARTNERS`
- `public/og-default.jpg` — missing (OG card scrapers will 404)
- `public/apple-touch-icon.png` — missing (link tag will 404)
- Hero image for `/about` — intentionally omitted so Hero renders text-only

Replace before flipping DNS from Framer to the Astro build.
