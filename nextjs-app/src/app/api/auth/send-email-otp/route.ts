import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

function emailToKey(email: string) {
  return email.toLowerCase().replace(/\./g, ',').replace(/@/g, '_at_');
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = (await req.json()) as { email?: string; name?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Check if email is already registered
    try {
      await adminAuth.getUserByEmail(email);
      return NextResponse.json(
        { error: 'This email is already registered. Please sign in instead.' },
        { status: 409 }
      );
    } catch (err) {
      // auth/user-not-found means email is free — proceed
      if ((err as { code?: string }).code !== 'auth/user-not-found') throw err;
    }

    // Rate limiting: max 3 OTP sends per email per 10 minutes
    const rlKey = `otpRateLimit/${emailToKey(email)}`;
    const rlSnap = await adminDb.ref(rlKey).get();
    const now = Date.now();
    const rl = rlSnap.exists() ? (rlSnap.val() as { count: number; windowStart: number }) : { count: 0, windowStart: now };
    if (now - rl.windowStart < 10 * 60 * 1000) {
      if (rl.count >= 3) {
        const retryAfterSec = Math.ceil((rl.windowStart + 10 * 60 * 1000 - now) / 1000);
        return NextResponse.json(
          { error: `Too many OTP requests. Please wait ${Math.ceil(retryAfterSec / 60)} minute(s) and try again.` },
          { status: 429 }
        );
      }
      await adminDb.ref(rlKey).set({ count: rl.count + 1, windowStart: rl.windowStart });
    } else {
      // Window expired — reset
      await adminDb.ref(rlKey).set({ count: 1, windowStart: now });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    await adminDb.ref(`emailOtps/${emailToKey(email)}`).set({ otp, expiresAt });

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'SMA Builders <onboarding@resend.dev>',
      to: email,
      subject: `${otp} — Your SMA Properties verification code`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
              <tr><td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <tr>
                    <td style="background:linear-gradient(135deg,#0F2342,#1A3A5C);padding:28px 40px;">
                      <p style="margin:0;color:#E8A020;font-size:20px;font-weight:900;">SMA <span style="color:#fff;">Builders &amp; Real Estates</span></p>
                      <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">Nellore&apos;s Trusted Builders</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:40px;">
                      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0F2342;">Verify your email</h1>
                      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                        Hi${name ? ` ${name}` : ''}! Use the code below to complete your registration. It expires in <strong>10 minutes</strong>.
                      </p>
                      <div style="background:#f4f4f5;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                        <p style="margin:0 0 6px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your verification code</p>
                        <p style="margin:0;font-size:42px;font-weight:900;letter-spacing:12px;color:#0F2342;">${otp}</p>
                      </div>
                      <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                        If you didn&apos;t request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9fafb;padding:16px 40px;border-top:1px solid #e5e7eb;">
                      <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} SMA Builders &amp; Real Estates · Nellore, Andhra Pradesh</p>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('send-email-otp error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
