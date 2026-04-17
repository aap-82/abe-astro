import { defineCollection, z } from 'astro:content';

/* ---------------------------------------------------------------- */
/* Shared sub-schemas                                                */
/* ---------------------------------------------------------------- */

const statItem = z.object({
  value: z.string(),
  label: z.string(),
  caption: z.string().optional()
});

const logoItem = z.object({
  name: z.string(),
  subtitle: z.string().optional(),
  href: z.string().url().optional(),
  imageSrc: z.string().optional()
});

const faqItem = z.object({
  question: z.string(),
  answer: z.string()
});

const ctaItem = z.object({
  label: z.string(),
  href: z.string()
});

const sectionSurface = z.enum(['page', 'subtle', 'inverse', 'brand', 'brand-tint']);

/* ---------------------------------------------------------------- */
/* Pages collection                                                  */
/* ---------------------------------------------------------------- */

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    // SEO
    metaTitle: z.string().max(65),
    metaDescription: z.string().max(165),
    canonical: z.string().url().optional(),
    ogImage: z.string().optional(),
    noindex: z.boolean().default(false),

    // Page shell
    h1: z.string(),
    breadcrumb: z
      .array(z.object({ name: z.string(), url: z.string() }))
      .min(1),
    lastUpdated: z.string(), // ISO date, surfaced in breadcrumb bar

    // Trust bar — 3 or 4 short items shown above the hero
    trustBar: z.array(z.string()).min(3).max(5).optional(),

    // Hero
    hero: z
      .object({
        overline: z.string().optional(),
        subhead: z.string().optional(),
        primaryCta: ctaItem.optional(),
        secondaryCta: ctaItem.optional(),
        imageSrc: z.string().optional(),
        imageAlt: z.string().optional(),
        surface: sectionSurface.default('page')
      })
      .optional(),

    // Stats band (S5)
    stats: z
      .object({
        overline: z.string().optional(),
        heading: z.string().optional(),
        items: z.array(statItem).min(1),
        surface: sectionSurface.default('subtle')
      })
      .optional(),

    // Logo row / recognition band
    logos: z
      .object({
        overline: z.string().optional(),
        heading: z.string().optional(),
        supportingLine: z.string().optional(),
        items: z.array(logoItem).min(1),
        surface: sectionSurface.default('page')
      })
      .optional(),

    // FAQ — emitted to DOM and to FAQPage JSON-LD
    faq: z
      .object({
        heading: z.string().default('Frequently asked questions'),
        items: z.array(faqItem).min(1)
      })
      .optional(),

    // Bottom CTA band
    ctaBand: z
      .object({
        headline: z.string(),
        subhead: z.string().optional(),
        primaryCta: ctaItem,
        secondaryCta: ctaItem.optional(),
        variant: z.enum(['brand', 'dark', 'light']).default('brand')
      })
      .optional()
  })
});

export const collections = { pages };
