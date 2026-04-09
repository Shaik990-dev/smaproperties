'use client';

import { ref, set, get, remove, onValue } from 'firebase/database';
import { db } from './firebase';

/**
 * Favorites are stored at /users/{uid}/favorites/{propertyId} = true
 * This piggybacks on the existing user node so it inherits user-scoped security rules.
 */

export async function addFavorite(uid: string, propertyId: string): Promise<void> {
  await set(ref(db, `users/${uid}/favorites/${propertyId}`), true);
}

export async function removeFavorite(uid: string, propertyId: string): Promise<void> {
  await remove(ref(db, `users/${uid}/favorites/${propertyId}`));
}

export async function isFavorite(uid: string, propertyId: string): Promise<boolean> {
  const snap = await get(ref(db, `users/${uid}/favorites/${propertyId}`));
  return snap.exists() && snap.val() === true;
}

export async function getFavoriteIds(uid: string): Promise<string[]> {
  const snap = await get(ref(db, `users/${uid}/favorites`));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, boolean>;
  return Object.keys(data).filter((k) => data[k] === true);
}

/**
 * Subscribe to live updates of a user's favorite IDs.
 * Returns an unsubscribe function.
 */
export function subscribeFavorites(uid: string, callback: (ids: string[]) => void): () => void {
  const r = ref(db, `users/${uid}/favorites`);
  const unsub = onValue(r, (snap) => {
    if (!snap.exists()) {
      callback([]);
      return;
    }
    const data = snap.val() as Record<string, boolean>;
    callback(Object.keys(data).filter((k) => data[k] === true));
  });
  return unsub;
}
