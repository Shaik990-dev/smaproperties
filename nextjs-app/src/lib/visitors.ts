'use client';

import { ref, push, get } from 'firebase/database';
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

export async function getVisitorCount(): Promise<number> {
  try {
    const snap = await get(ref(db, 'visitors'));
    if (!snap.exists()) return 0;
    return Object.keys(snap.val()).length;
  } catch {
    return 0;
  }
}
