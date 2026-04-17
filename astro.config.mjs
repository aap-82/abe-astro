// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Note: no Cloudflare adapter. The pilot is a fully static site, and
// Cloudflare Pages deploys plain static output from ./dist without
// needing the @astrojs/cloudflare adapter. The adapter is only required
// for SSR on Workers, which this pilot does not use.

// https://astro.build/config
export default defineConfig({
  site: 'https://abeeducation.edu.au',
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/drafts/'),
      changefreq: 'weekly',
      priority: 0.7
    })
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
