/**
 * Server-side Firebase data fetching using the Realtime Database REST API.
 *
 * Why REST and not the Firebase JS SDK on the server?
 * - Avoids initializing the client SDK during build / on the server
 * - Lets Next.js cache responses via the standard fetch() options
 * - Enables ISR (revalidate every N seconds) without extra plumbing
 *
 * Used by Server Components (app/properties/page.tsx, app/properties/[id]/page.tsx,
 * app/sitemap.ts) so HTML is fully rendered for crawlers.
 */
import type { Property } from './types';
import { DEFAULT_PROPERTIES } from '@/data/properties';

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

export async function getPropertiesServer(): Promise<Property[]> {
  if (!DB_URL) return DEFAULT_PROPERTIES;
  try {
    const res = await fetch(`${DB_URL}/properties.json`, {
      next: { revalidate: 60, tags: ['properties'] }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Record<string, Property> | null;
    if (!data) return DEFAULT_PROPERTIES;
    const list = Object.values(data);
    return list.length ? list : DEFAULT_PROPERTIES;
  } catch (e) {
    console.warn('getPropertiesServer fallback to seed data:', e);
    return DEFAULT_PROPERTIES;
  }
}

export async function getPropertyServer(id: string): Promise<Property | null> {
  if (!DB_URL) return DEFAULT_PROPERTIES.find((p) => p.id === id) ?? null;
  try {
    const res = await fetch(`${DB_URL}/properties/${encodeURIComponent(id)}.json`, {
      next: { revalidate: 60, tags: ['properties', `property-${id}`] }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Property | null;
    if (data) return data;
  } catch (e) {
    console.warn('getPropertyServer fallback to seed data:', e);
  }
  return DEFAULT_PROPERTIES.find((p) => p.id === id) ?? null;
}
