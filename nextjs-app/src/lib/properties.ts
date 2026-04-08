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
    return Object.values(data);
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

export async function saveProperty(p: Property): Promise<void> {
  await set(ref(db, `properties/${p.id}`), p);
}

export async function deleteProperty(id: string): Promise<void> {
  await remove(ref(db, `properties/${id}`));
}
