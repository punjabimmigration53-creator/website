// Single source of truth for SEO. Change SITE_URL if the live domain differs.
export const SITE_URL = 'https://punjabimmigration.in';
export const SITE_NAME = 'Punjab Immigration';
export const PHONE = '+919507795077';
export const OG_IMAGE = '/img/office-client.webp';

/** Trim to a search-result friendly length without cutting a word. */
export const clip = (text, max = 155) =>
  text.length <= max ? text : text.slice(0, text.lastIndexOf(' ', max)).replace(/[,;:.]$/, '') + '…';

/** Page metadata with canonical URL + Open Graph + Twitter card. */
export function pageMeta({ title, description, path = '/', image = OG_IMAGE }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title, description, url: path, siteName: SITE_NAME, type: 'website', locale: 'en_IN',
      images: [{ url: image }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  description: 'Study, work, PR and visitor visa consultants in Amritsar for Canada, the UK, Australia, the USA and Europe.',
  url: SITE_URL,
  telephone: PHONE,
  email: 'Contact@punjabimmigration.in',
  image: `${SITE_URL}${OG_IMAGE}`,
  logo: `${SITE_URL}/logowhite.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'SCO 53, B Block, Ranjit Avenue',
    addressLocality: 'Amritsar',
    addressRegion: 'Punjab',
    addressCountry: 'IN',
  },
  // second office
  location: [
    {
      '@type': 'Place',
      name: 'Punjab Immigration — B Block office',
      address: { '@type': 'PostalAddress', streetAddress: 'SCO 53, B Block, Ranjit Avenue', addressLocality: 'Amritsar', addressRegion: 'Punjab', addressCountry: 'IN' },
    },
    {
      '@type': 'Place',
      name: 'Punjab Immigration — D Block office',
      address: { '@type': 'PostalAddress', streetAddress: 'SCO 19, D Block, Ranjit Avenue', addressLocality: 'Amritsar', addressRegion: 'Punjab', addressCountry: 'IN' },
    },
  ],
  areaServed: ['Amritsar', 'Punjab', 'India'],
  sameAs: [
    'https://www.facebook.com/share/1Am5DtawRN/?mibextid=wwXIfr',
    'https://www.instagram.com/_punjabimmigration/',
    'https://www.linkedin.com/in/punjab-immigration-a37827383',
    'https://www.youtube.com/@PunjabImmigration53',
  ],
};

export const faqLd = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const breadcrumbLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ label: 'Home', href: '/' }, ...crumbs].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: `${SITE_URL}${c.href === '/' ? '' : c.href}` } : {}),
  })),
});
