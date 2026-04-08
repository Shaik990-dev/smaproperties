'use client';

import { ref, push, get, remove } from 'firebase/database';
import { db } from './firebase';

export type InquirySource = 'home_contact' | 'property_detail' | 'quick_enquiry';

export interface Inquiry {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyId?: string;
  propertyName?: string;
  source: InquirySource;
  createdAt: string;
  createdAtIN: string;
  status?: 'new' | 'contacted' | 'closed';
}

/**
 * Save a lead to Firebase BEFORE opening WhatsApp.
 * This guarantees we capture the lead even if the user's WhatsApp link fails.
 */
export async function saveInquiry(input: Omit<Inquiry, 'createdAt' | 'createdAtIN' | 'status'>) {
  const data: Inquiry = {
    ...input,
    status: 'new',
    createdAt: new Date().toISOString(),
    createdAtIN: new Date().toLocaleString('en-IN')
  };
  try {
    await push(ref(db, 'inquiries'), data);
  } catch (e) {
    console.warn('saveInquiry failed:', e);
  }
}

export async function getInquiries(): Promise<Record<string, Inquiry>> {
  try {
    const snap = await get(ref(db, 'inquiries'));
    return snap.exists() ? (snap.val() as Record<string, Inquiry>) : {};
  } catch {
    return {};
  }
}

export async function deleteInquiry(id: string) {
  await remove(ref(db, `inquiries/${id}`));
}
