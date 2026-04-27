'use client';

import { ref, get, set, remove } from 'firebase/database';
import { db } from './firebase';
import type { Property } from './types';
import { DEFAULT_PROPERTIES } from '@/data/properties';

export async function fetchProperties(): Promise<Property[]> {
  try {
    const [snap, deletedSnap] = await Promise.all([
      get(ref(db, 'properties')),
      get(ref(db, 'deletedProperties'))
    ]);
    const deletedSet = new Set<string>(
      deletedSnap.exists() ? Object.keys(deletedSnap.val() as Record<string, boolean>) : []
    );
    if (!snap.exists()) return DEFAULT_PROPERTIES.filter((p) => !deletedSet.has(p.id));
    const data = snap.val() as Record<string, Property>;
    const fromDb = Object.values(data);
    if (!fromDb.length) return DEFAULT_PROPERTIES.filter((p) => !deletedSet.has(p.id));
    const dbIds = new Set(fromDb.map((p) => p.id));
    const missing = DEFAULT_PROPERTIES.filter((p) => !dbIds.has(p.id) && !deletedSet.has(p.id));
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

// Upsert DEFAULT_PROPERTIES missing from Firebase, skipping any already deleted by admin.
async function ensureSeeded(): Promise<void> {
  const [snap, deletedSnap] = await Promise.all([
    get(ref(db, 'properties')),
    get(ref(db, 'deletedProperties'))
  ]);
  const existing = snap.exists() ? (snap.val() as Record<string, Property>) : {};
  const deleted = deletedSnap.exists() ? (deletedSnap.val() as Record<string, boolean>) : {};
  const writes: Promise<void>[] = [];
  for (const p of DEFAULT_PROPERTIES) {
    if (!existing[p.id] && !deleted[p.id]) {
      writes.push(set(ref(db, `properties/${p.id}`), p));
    }
  }
  await Promise.all(writes);
}

export async function saveProperty(p: Property): Promise<void> {
  await ensureSeeded();
  // If re-adding a previously deleted default property, remove it from the deleted set
  await remove(ref(db, `deletedProperties/${p.id}`));
  await set(ref(db, `properties/${p.id}`), p);
}

export async function deleteProperty(id: string): Promise<void> {
  await ensureSeeded();
  await remove(ref(db, `properties/${id}`));
  // Prevent merge logic from restoring deleted default properties
  if (DEFAULT_PROPERTIES.some((p) => p.id === id)) {
    await set(ref(db, `deletedProperties/${id}`), true);
  }
}
