import type { MetadataRoute } from 'next';
import { getPropertiesServer } from '@/lib/firebase-server';

const BASE = 'https://smaproperties.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPropertiesServer();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/properties`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/about`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 }
  ];

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE}/properties/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [...staticRoutes, ...propertyRoutes];
}
