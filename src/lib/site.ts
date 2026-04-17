// Site-wide constants. Anything that appears in more than one page or
// in structured data belongs here — single source of truth.

export const SITE = {
  name: 'ABE Education',
  legalName: 'ABE Education Pty Ltd',
  abn: '64 125 455 272',
  url: 'https://abeeducation.edu.au',
  logo: 'https://abeeducation.edu.au/images/abe-logo.svg',
  description:
    'ABE Education delivers online CPD and owner-builder training recognised by state regulators across Australia. Self-paced, compliant, affordable.',
  foundingDate: '2007',
  email: 'support@abeeducation.edu.au',
  phone: '+61-1300-000-000', // TODO: confirm public number
  address: {
    streetAddress: 'PO Box — TODO',
    addressLocality: 'Hobart',
    addressRegion: 'TAS',
    postalCode: '7000',
    addressCountry: 'AU'
  },
  social: {
    linkedin: 'https://www.linkedin.com/company/abe-education',
    facebook: 'https://www.facebook.com/abeeducation'
  }
} as const;

/** RTO partners that deliver the accredited components of ABE's programs. */
export const RTO_PARTNERS = [
  {
    name: 'TODO: RTO partner 1',
    rtoCode: 'TODO',
    url: 'https://training.gov.au/Organisation/Details/TODO'
  },
  {
    name: 'TODO: RTO partner 2',
    rtoCode: 'TODO',
    url: 'https://training.gov.au/Organisation/Details/TODO'
  }
] as const;

/** Regulators that recognise ABE's non-accredited CPD. */
export const REGULATOR_RECOGNITIONS = [
  { name: 'CBOS Tasmania',                  url: 'https://cbos.tas.gov.au' },
  { name: 'Access Canberra',                url: 'https://www.accesscanberra.act.gov.au' },
  { name: 'NSW Fair Trading',               url: 'https://www.fairtrading.nsw.gov.au' },
  { name: 'QBCC',                           url: 'https://www.qbcc.qld.gov.au' },
  { name: 'LGIRS Western Australia',        url: 'https://www.commerce.wa.gov.au/building-commission' }
] as const;
