import type { MetadataRoute } from 'next';
import { getPropertiesServer } from '@/lib/firebase-server';

const BASE = 'https://smaproperties.in';

// Fixed dates per page — only update when that page's content actually changes.
// Using new Date() here causes Google to re-crawl everything on every deploy,
// wasting crawl budget since most pages haven't changed.
const DATES = {
  home:          new Date('2025-04-01'),
  properties:    new Date('2025-04-01'),
  about:         new Date('2025-02-01'),
  contact:       new Date('2025-02-01'),
  emiCalculator: new Date('2025-02-01'),
  legal:         new Date('2025-02-01'),
  propertyPages: new Date('2025-04-01'),
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPropertiesServer();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: DATES.home,          changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/properties`,       lastModified: DATES.properties,    changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE}/about`,            lastModified: DATES.about,         changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`,          lastModified: DATES.contact,       changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/emi-calculator`,   lastModified: DATES.emiCalculator, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`,          lastModified: DATES.legal,         changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,            lastModified: DATES.legal,         changeFrequency: 'yearly',  priority: 0.3 }
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE}/properties/${p.id}`,
    lastModified: DATES.propertyPages,
    changeFrequency: 'weekly' as const,
    priority: 0.85
  }));

  return [...staticRoutes, ...propertyRoutes];
}
