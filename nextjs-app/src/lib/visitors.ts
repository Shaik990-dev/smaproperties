'use client';

import { ref, push } from 'firebase/database';
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

