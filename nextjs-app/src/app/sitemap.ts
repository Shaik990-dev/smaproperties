import type { MetadataRoute } from 'next';
import { getPropertiesServer } from '@/lib/firebase-server';

const BASE = 'https://smaproperties.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPropertiesServer();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/properties`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE}/about`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/contact`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/emi-calculator`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,            lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 }
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE}/properties/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85
  }));

  return [...staticRoutes, ...propertyRoutes];
}
