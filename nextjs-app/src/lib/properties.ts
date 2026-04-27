'use client';

import { ref, get, set, remove } from 'firebase/database';
import { db } from './firebase';
import type { Property } from './types';
import { DEFAULT_PROPERTIES } from '@/data/properties';

export async function fetchProperties(): Promise<Property[]> {
  try {
    const snap = await get(ref(db, 'properties'));
    if (!snap.exists()) return DEFAULT_PROPERTIES;
    const data = snap.val() as Record<string, Property>;
    const fromDb = Object.values(data);
    if (!fromDb.length) return DEFAULT_PROPERTIES;
    // Fill in any DEFAULT_PROPERTIES that are missing from Firebase
    const dbIds = new Set(fromDb.map((p) => p.id));
    const missing = DEFAULT_PROPERTIES.filter((p) => !dbIds.has(p.id));
    return [...fromDb, ...missing];
  } catch (e) {
    console.warn('fetchProperties error', e);
    return DEFAULT_PROPERTIES;
  }
}

export async function fetchProperty(id: string): Promise<Property | null> {
  try {
    const snap = await get(ref(db, `properties/${id}`));
    if (snap.exists()) return snap.val() as Property;
  } catch {}
  return DEFAULT_PROPERTIES.find((p) => p.id === id) || null;
}

// Upsert all DEFAULT_PROPERTIES that are missing from Firebase.
// Called before every write so no default listing is ever permanently lost.
async function ensureSeeded(): Promise<void> {
  const snap = await get(ref(db, 'properties'));
  const existing = snap.exists() ? (snap.val() as Record<string, Property>) : {};
  const writes: Promise<void>[] = [];
  for (const p of DEFAULT_PROPERTIES) {
    if (!existing[p.id]) {
      writes.push(set(ref(db, `properties/${p.id}`), p));
    }
  }
  await Promise.all(writes);
}

export async function saveProperty(p: Property): Promise<void> {
  await ensureSeeded();
  await set(ref(db, `properties/${p.id}`), p);
}

export async function deleteProperty(id: string): Promise<void> {
  await ensureSeeded();
  await remove(ref(db, `properties/${id}`));
}
