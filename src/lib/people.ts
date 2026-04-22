// Centralised Person records. Any page that attributes authorship,
// development or review of content pulls from here — so the Person
// schema stays consistent across every page, and E-E-A-T signals
// (credentials, awards, publications) only have to be maintained
// in one file.
//
// Each Person record produces a schema.org Person node when passed
// to personSchema() in lib/schema.ts. The same record drives the
// PersonCard component for on-page display.

import { SITE } from './site';

export type PersonRole = 'developer' | 'reviewer' | 'author' | 'instructor';

export interface PersonRecord {
  /** Short identifier used as the @id fragment, e.g. 'dominic-ogburn'. */
  slug: string;
  name: string;
  givenName: string;
  familyName: string;
  /** Short credential line printed beside the name, e.g. "NSW Builder Lic. 369417C". */
  credentialLine: string;
  /** Current job title used in Person.jobTitle. */
  jobTitle: string;
  /** Current affiliation — plain string, emitted as Organization node. */
  affiliation?: string;
  /** One-paragraph biography for on-page PersonCard. */
  bio: string;
  /** Path relative to SITE.url for the headshot image, e.g. '/images/people/dominic.jpg'. Optional. */
  image?: string;
  /** Person page URL relative to SITE.url, e.g. '/experts/dominic-ogburn'. Optional. */
  profileUrl?: string;
  /** Schema.org honorificPrefix, e.g. 'Mr', 'Dr'. Optional. */
  honorificPrefix?: string;
  /** sameAs URLs — LinkedIn, AuthorityLink, publications. */
  sameAs?: string[];
  /** Free-form credential chips printed in the card — awards, memberships, publications. */
  credentials?: string[];
  /** Roles this person can play on a page. Used as filter in content collections. */
  roles: PersonRole[];
}

/* ---------------------------------------------------------------- */
/* Dominic Ogburn — course developer                                 */
/* ---------------------------------------------------------------- */

const dominicOgburn: PersonRecord = {
  slug: 'dominic-ogburn',
  name: 'Dominic Ogburn',
  givenName: 'Dominic',
  familyName: 'Ogburn',
  honorificPrefix: 'Mr',
  credentialLine: 'NSW Builder Licence 369417C — 40+ years',
  jobTitle: 'Course Developer',
  affiliation: 'ABE Education',
  bio:
    'Dominic has built residential and commercial projects across NSW for more than 40 years, ' +
    'holds NSW Builder Licence 369417C, and received the 2005 NSW Ministers Award for construction ' +
    'excellence. He sits on Standards Australia committee BD-038 and is co-author of the Allen & Unwin ' +
    'title on residential construction practice. His work has been cited in NSW Hansard on owner-builder ' +
    'policy. Dominic develops and updates every ABE owner-builder course.',
  image: '/images/people/dominic-ogburn.jpg',
  profileUrl: '/experts/dominic-ogburn',
  sameAs: [
    'https://www.linkedin.com/in/dominic-ogburn'
  ],
  credentials: [
    'NSW Builder Licence 369417C',
    '2005 NSW Ministers Award',
    'Standards Australia BD-038',
    'Co-author — Allen & Unwin residential construction title',
    'Cited in NSW Hansard'
  ],
  roles: ['developer', 'author', 'instructor']
};

/* ---------------------------------------------------------------- */
/* Warwick Smith — technical reviewer                                */
/* ---------------------------------------------------------------- */

const warwickSmith: PersonRecord = {
  slug: 'warwick-smith',
  name: 'Warwick Smith',
  givenName: 'Warwick',
  familyName: 'Smith',
  honorificPrefix: 'Mr',
  credentialLine: '27+ years in vocational education compliance',
  jobTitle: 'Senior Consultant — Compliance and Operations',
  affiliation: 'Corporate Development Resource Group',
  bio:
    'Warwick is Senior Consultant for Compliance and Operations at Corporate Development Resource ' +
    'Group, with more than 27 years working across the Australian vocational education and training ' +
    'sector. He reviews ABE course content for regulatory currency, alignment with state knowledge ' +
    'requirements, and quality of assessment design.',
  image: '/images/people/warwick-smith.jpg',
  profileUrl: '/experts/warwick-smith',
  sameAs: [
    'https://www.linkedin.com/in/warwick-smith-vet'
  ],
  credentials: [
    'Senior Consultant — Compliance and Operations, Corporate Development Resource Group',
    '27+ years in the VET sector'
  ],
  roles: ['reviewer']
};

/* ---------------------------------------------------------------- */
/* Registry                                                          */
/* ---------------------------------------------------------------- */

export const PEOPLE: Record<string, PersonRecord> = {
  'dominic-ogburn': dominicOgburn,
  'warwick-smith':  warwickSmith
} as const;

/** Look up a PersonRecord by slug. Throws at build time if the slug is unknown. */
export function getPerson(slug: string): PersonRecord {
  const record = PEOPLE[slug];
  if (!record) {
    throw new Error(
      `Unknown person slug "${slug}". Add it to src/lib/people.ts before referencing.`
    );
  }
  return record;
}

/** Resolve a PersonRecord's profileUrl to an absolute URL. */
export function personUrl(record: PersonRecord): string | undefined {
  if (!record.profileUrl) return undefined;
  return record.profileUrl.startsWith('http')
    ? record.profileUrl
    : `${SITE.url}${record.profileUrl}`;
}

/** Resolve a PersonRecord's image to an absolute URL. */
export function personImage(record: PersonRecord): string | undefined {
  if (!record.image) return undefined;
  return record.image.startsWith('http')
    ? record.image
    : `${SITE.url}${record.image}`;
}
