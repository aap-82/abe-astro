// JSON-LD schema builders. All return plain objects that get emitted
// inside <script type="application/ld+json"> tags at build time.

import { SITE, RTO_PARTNERS, REGULATOR_RECOGNITIONS } from './site';
import { type PersonRecord, personUrl, personImage } from './people';

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
/* Course + EducationalOccupationalCredential + Offer                */
/* ---------------------------------------------------------------- */

export interface CourseOfferInput {
  /** Price in AUD. Pass the course training fee, not the LGIRS permit fee. */
  price: number;
  priceCurrency?: string; // default 'AUD'
  availability?: string;  // default 'https://schema.org/InStock'
  url?: string;           // default: page URL
  validFrom?: string;     // ISO date
}

export interface CourseCredentialInput {
  /** Short name of the credential awarded, e.g. 'Certificate of Completion'. */
  name: string;
  /** Category: e.g. 'Certificate', 'Training Credential'. */
  credentialCategory: string;
  /** Which regulator the credential supports, e.g. 'LGIRS Form 75 — WA'. */
  recognizedBy?: string;
  /** Free-form description of what the credential demonstrates. */
  description?: string;
}

export interface CourseSchemaInput {
  /** Absolute page URL, e.g. 'https://www.abeeducation.edu.au/wa-owner-builder-course'. */
  url: string;
  /** Course display name. */
  name: string;
  /** Full course description for rich results — keep factual, no marketing fluff. */
  description: string;
  /** Short description used for Google rich results — keep under 60 chars if possible. */
  shortDescription?: string;
  /** Primary image for the course, absolute URL. */
  image?: string;
  /** Course mode — default 'online'. */
  courseMode?: 'online' | 'onsite' | 'blended';
  /** Typical completion time in ISO 8601 duration, e.g. 'PT4H' for 4 hours. */
  timeRequired?: string;
  /** Hours the enrolment stays active, e.g. 'P12M' for 12 months. */
  accessPeriod?: string;
  /** Language tag, default 'en-AU'. */
  inLanguage?: string;
  /** Typical age range, e.g. '18-' for 18+. */
  typicalAgeRange?: string;
  /** Keyword topics taught in the course. */
  teaches?: string[];
  /** Broad subject tags — e.g. ['Owner-builder training', 'WA building law']. */
  about?: string[];
  /** Offer block — training fee paid to ABE. */
  offer: CourseOfferInput;
  /** Credential awarded on completion. */
  credential: CourseCredentialInput;
  /** Slug of the course developer in PEOPLE. */
  developerSlug?: string;
  /** Slug of the content reviewer in PEOPLE. */
  reviewerSlug?: string;
  /** ISO date content was last reviewed, e.g. '2026-04-14'. */
  dateReviewed?: string;
}

export function courseSchema(input: CourseSchemaInput): JsonLd {
  const graphId = `${input.url}#course`;
  const credentialId = `${input.url}#credential`;
  const offerId = `${input.url}#offer`;

  const course: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': graphId,
    name: input.name,
    description: input.description,
    ...(input.shortDescription && { disambiguatingDescription: input.shortDescription }),
    ...(input.image && { image: input.image }),
    url: input.url,
    provider: { '@id': `${SITE.url}/#organization` },
    courseMode: input.courseMode ?? 'online',
    inLanguage: input.inLanguage ?? 'en-AU',
    isAccessibleForFree: false,
    ...(input.timeRequired && { timeRequired: input.timeRequired }),
    ...(input.typicalAgeRange && { typicalAgeRange: input.typicalAgeRange }),
    ...(input.teaches && input.teaches.length > 0 && { teaches: input.teaches }),
    ...(input.about && input.about.length > 0 && {
      about: input.about.map((a) => ({ '@type': 'Thing', name: a }))
    }),
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: input.courseMode ?? 'online',
      courseWorkload: input.timeRequired ?? 'PT4H',
      inLanguage: input.inLanguage ?? 'en-AU'
    },
    educationalCredentialAwarded: { '@id': credentialId },
    offers: { '@id': offerId },
    ...(input.developerSlug && {
      author: { '@id': `${SITE.url}/#person-${input.developerSlug}` }
    }),
    ...(input.reviewerSlug && {
      reviewedBy: { '@id': `${SITE.url}/#person-${input.reviewerSlug}` }
    }),
    ...(input.dateReviewed && { dateModified: input.dateReviewed })
  };

  const credential: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    '@id': credentialId,
    name: input.credential.name,
    credentialCategory: input.credential.credentialCategory,
    ...(input.credential.description && { description: input.credential.description }),
    ...(input.credential.recognizedBy && {
      recognizedBy: {
        '@type': 'Organization',
        name: input.credential.recognizedBy
      }
    })
  };

  const offer: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    '@id': offerId,
    price: input.offer.price.toFixed(2),
    priceCurrency: input.offer.priceCurrency ?? 'AUD',
    availability: input.offer.availability ?? 'https://schema.org/InStock',
    url: input.offer.url ?? input.url,
    ...(input.offer.validFrom && { validFrom: input.offer.validFrom }),
    seller: { '@id': `${SITE.url}/#organization` }
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [course, credential, offer].map(({ '@context': _ctx, ...rest }) => rest)
  };
}

/* ---------------------------------------------------------------- */
/* Person — developer, reviewer, author, instructor                  */
/* ---------------------------------------------------------------- */

/**
 * Build a schema.org Person node from a PersonRecord. Emits a stable @id
 * so multiple pages can reference the same Person via @graph cross-ref.
 */
export function personSchema(record: PersonRecord): JsonLd {
  const url = personUrl(record);
  const image = personImage(record);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE.url}/#person-${record.slug}`,
    name: record.name,
    givenName: record.givenName,
    familyName: record.familyName,
    ...(record.honorificPrefix && { honorificPrefix: record.honorificPrefix }),
    jobTitle: record.jobTitle,
    description: record.bio,
    ...(record.affiliation && {
      affiliation: {
        '@type': 'Organization',
        name: record.affiliation
      }
    }),
    ...(image && { image }),
    ...(url && { url }),
    ...(record.sameAs && record.sameAs.length > 0 && { sameAs: record.sameAs }),
    ...(record.credentials && record.credentials.length > 0 && {
      hasCredential: record.credentials.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        name: c
      }))
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
