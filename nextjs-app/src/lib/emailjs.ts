'use client';

import emailjs from '@emailjs/browser';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const OWNER_EMAIL = process.env.NEXT_PUBLIC_EMAILJS_OWNER_EMAIL || '';

let initialized = false;

export function isEmailJSConfigured(): boolean {
  return Boolean(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID);
}

function ensureInit() {
  if (initialized || !isEmailJSConfigured()) return;
  emailjs.init({ publicKey: PUBLIC_KEY });
  initialized = true;
}

interface NotifyParams {
  type: 'registration' | 'lead';
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyName?: string;
  interest?: string;
}

/**
 * Send an owner-notification email via EmailJS.
 * Silently no-ops if EmailJS isn't configured (so the rest of the app keeps working).
 * Errors are caught + logged so a failed email never breaks the user-facing flow.
 */
export async function notifyOwner(params: NotifyParams): Promise<boolean> {
  if (!isEmailJSConfigured()) {
    console.info('[emailjs] not configured — skipping owner notification');
    return false;
  }
  ensureInit();
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email: OWNER_EMAIL,
      subject: params.type === 'registration' ? 'New SMA Registration' : 'New SMA Lead',
      type: params.type,
      user_name: params.name,
      user_phone: params.phone,
      user_email: params.email || '(not provided)',
      user_interest: params.interest || params.propertyName || '(general enquiry)',
      user_message: params.message || '(no message)',
      reg_time: new Date().toLocaleString('en-IN')
    });
    return true;
  } catch (e) {
    console.warn('[emailjs] send failed:', e);
    return false;
  }
}
