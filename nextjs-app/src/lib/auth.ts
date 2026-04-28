'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from './firebase';
import type { AppUser } from './types';

export type { ConfirmationResult };

let _recaptcha: RecaptchaVerifier | null = null;

export async function sendPhoneOtp(phone: string, containerId: string): Promise<ConfirmationResult> {
  if (!auth) throw new Error('Firebase auth not initialized');
  if (_recaptcha) { try { _recaptcha.clear(); } catch {} _recaptcha = null; }
  _recaptcha = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
  return signInWithPhoneNumber(auth, `+91${phone}`, _recaptcha);
}

export async function verifyPhoneOtp(result: ConfirmationResult, otp: string): Promise<void> {
  const cred = await result.confirm(otp);
  // Remove the temporary phone-auth user — we use email/password auth
  try { await cred.user.delete(); } catch {}
}

export async function registerUser(input: {
  name: string;
  phone: string;
  email: string;
  password: string;
  interest?: string;
}): Promise<AppUser> {
  const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
  await updateProfile(cred.user, { displayName: input.name });

  const userData: AppUser = {
    uid: cred.user.uid,
    name: input.name,
    phone: input.phone,
    email: input.email,
    interest: input.interest || '',
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  await set(ref(db, `users/${cred.user.uid}`), userData);
  return userData;
}

export async function loginUser(email: string, password: string): Promise<AppUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await get(ref(db, `users/${cred.user.uid}`));
  if (!snap.exists()) throw new Error('User profile not found');
  return snap.val() as AppUser;
}

export async function signOutUser() {
  await fbSignOut(auth);
}

export async function getUserProfile(fbUser: FirebaseUser): Promise<AppUser | null> {
  const snap = await get(ref(db, `users/${fbUser.uid}`));
  return snap.exists() ? (snap.val() as AppUser) : null;
}
