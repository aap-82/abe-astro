// JSON-LD schema builders. All return plain objects that get emitted
// inside <script type="application/ld+json"> tags at build time.

import { SITE, RTO_PARTNERS, REGULATOR_RECOGNITIONS } from './site';

type JsonLd = Record<string, unknown>;

/* ---------------------------------------------------------------- */
/* EducationalOrganization — site-wide                               */
/* ---------------------------------------------------------------- */

export function educationalOrgSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: SITE.logo,
    description: SITE.description,
    foundingDate: SITE.foundingDate,
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'ABN',
      value: SITE.abn
    },
    address: {
      '@type': 'PostalAddress',
      ...SITE.address
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: SITE.email,
      telephone: SITE.phone,
      areaServed: 'AU',
      availableLanguage: ['en-AU']
    },
    sameAs: Object.values(SITE.social),
    recognizedBy: REGULATOR_RECOGNITIONS.map((r) => ({
      '@type': 'Organization',
      name: r.name,
      url: r.url
    })),
    provider: RTO_PARTNERS.map((p) => ({
      '@type': 'EducationalOrganization',
      name: p.name,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'RTO Code',
        value: p.rtoCode
      },
      url: p.url
    }))
  };
}

/* ---------------------------------------------------------------- */
/* FAQPage                                                           */
/* ---------------------------------------------------------------- */

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  };
}

/* ---------------------------------------------------------------- */
/* BreadcrumbList                                                    */
/* ---------------------------------------------------------------- */

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL or path. Paths are resolved against SITE.url. */
  url: string;
}

export function breadcrumbSchema(crumbs: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${SITE.url}${c.url}`
    }))
  };
}

/* ---------------------------------------------------------------- */
/* WebPage — generic wrapper for any content page                    */
/* ---------------------------------------------------------------- */

export interface WebPageInput {
  url: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  primaryImage?: string;
}

export function webPageSchema(input: WebPageInput): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': `${SITE.url}/#organization` },
    ...(input.datePublished && { datePublished: input.datePublished }),
    ...(input.dateModified && { dateModified: input.dateModified }),
    ...(input.primaryImage && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: input.primaryImage
      }
    })
  };
}

/* ---------------------------------------------------------------- */
/* Utility — wrap multiple nodes into a single @graph                */
/* ---------------------------------------------------------------- */

export function schemaGraph(...nodes: JsonLd[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map(({ '@context': _ctx, ...rest }) => rest)
  };
}
