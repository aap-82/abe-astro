// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// Note: no Cloudflare adapter. The pilot is a fully static site, and
// Cloudflare Pages deploys plain static output from ./dist without
// needing the @astrojs/cloudflare adapter. The adapter is only required
// for SSR on Workers, which this pilot does not use.
//
// Sitemap integration removed for the pilot — @astrojs/sitemap 3.2.x
// has a known bug that throws "Cannot read properties of undefined
// (reading 'reduce')" in its astro:build:done hook on some configs.
// With only two pages in the pilot we don't need a sitemap yet; we'll
// re-add it (pinned to a known-good version) when we expand beyond /about.

// https://astro.build/config
export default defineConfig({
  site: 'https://abeeducation.edu.au',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react(),
    mdx()
  ],
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' }
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover'
  },
  vite: {
    cacheDir: '/tmp/vite-cache'
  }
});
