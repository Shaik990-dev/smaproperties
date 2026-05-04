'use client';

import { ref, push, get, runTransaction } from 'firebase/database';
import { db } from './firebase';

export async function trackVisit(page: string) {
  try {
    await push(ref(db, 'visitors'), {
      time: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-IN'),
      page,
      ref: typeof document !== 'undefined' ? (document.referrer || 'direct') : 'direct',
      ua: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 80) : ''
    });
  } catch {}
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function trackPropertyView(propertyId: string): Promise<void> {
  try {
    await runTransaction(ref(db, `propertyViews/${propertyId}/${todayKey()}`), (current: number | null) => (current ?? 0) + 1);
  } catch {}
}

export async function getPropertyViewsToday(propertyId: string): Promise<number> {
  try {
    const snap = await get(ref(db, `propertyViews/${propertyId}/${todayKey()}`));
    return snap.exists() ? (snap.val() as number) : 0;
  } catch {
    return 0;
  }
}

