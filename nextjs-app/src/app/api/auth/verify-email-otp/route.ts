import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

function emailToKey(email: string) {
  return email.toLowerCase().replace(/\./g, ',').replace(/@/g, '_at_');
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = (await req.json()) as { email?: string; otp?: string };

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP.' }, { status: 400 });
    }

    const snap = await adminDb.ref(`emailOtps/${emailToKey(email)}`).get();

    if (!snap.exists()) {
      return NextResponse.json({ error: 'OTP not found. Please request a new one.' }, { status: 400 });
    }

    const data = snap.val() as { otp: string; expiresAt: number };

    if (Date.now() > data.expiresAt) {
      await adminDb.ref(`emailOtps/${emailToKey(email)}`).remove();
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
    }

    if (data.otp !== otp) {
      return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 });
    }

    await adminDb.ref(`emailOtps/${emailToKey(email)}`).remove();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('verify-email-otp error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
