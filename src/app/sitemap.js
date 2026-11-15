import { SITE_URL } from '@/lib/site';
import visas from '@/data/visas.json';
import countries from '@/data/countries.json';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  const page = (path, priority, changeFrequency = 'monthly') => ({
    url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority,
  });
  return [
    page('', 1, 'weekly'),
    page('/visa-services', 0.9),
    ...Object.keys(visas).map((k) => page(`/visa-services/${k}`, 0.9)),
    page('/destinations', 0.8),
    ...Object.keys(countries).map((k) => page(`/destinations/${k}`, 0.8)),
    page('/happy-customers', 0.7, 'weekly'),
    page('/about', 0.6),
    page('/contact', 0.8),
  ];
}
