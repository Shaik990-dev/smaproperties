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

    type OtpRecord = { otp: string; expiresAt: number; attempts?: number };
    type Outcome = 'not-found' | 'expired' | 'too-many' | 'ok' | { attemptsLeft: number };

    let outcome: Outcome = 'not-found';

    await adminDb.ref(`emailOtps/${emailToKey(email)}`).transaction(
      (current: OtpRecord | null) => {
        if (!current) {
          outcome = 'not-found';
          return; // abort — no change
        }
        if (Date.now() > current.expiresAt) {
          outcome = 'expired';
          return null; // delete
        }
        const attempts = (current.attempts ?? 0) + 1;
        if (current.otp !== otp) {
          if (attempts >= 5) {
            outcome = 'too-many';
            return null; // delete
          }
          outcome = { attemptsLeft: 5 - attempts };
          return { ...current, attempts };
        }
        outcome = 'ok';
        return null; // delete on success
      }
    );

    if (outcome === 'not-found') {
      return NextResponse.json({ error: 'OTP not found. Please request a new one.' }, { status: 400 });
    }
    if (outcome === 'expired') {
      return NextResponse.json({ error: 'OTP expired. Please request a new one.' }, { status: 400 });
    }
    if (outcome === 'too-many') {
      return NextResponse.json({ error: 'Too many wrong attempts. Please request a new OTP.' }, { status: 400 });
    }
    if (typeof outcome === 'object') {
      const left = outcome.attemptsLeft;
      return NextResponse.json(
        { error: `Incorrect OTP. ${left} attempt${left === 1 ? '' : 's'} left.` },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('verify-email-otp error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
