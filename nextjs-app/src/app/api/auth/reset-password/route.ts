import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { adminAuth } from '@/lib/firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Verify email is registered — throws auth/user-not-found if not
    try {
      await adminAuth.getUserByEmail(email);
    } catch (err) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/user-not-found') {
        return NextResponse.json(
          { error: 'No account found with this email. Please register first.' },
          { status: 404 }
        );
      }
      throw err;
    }

    // Generate the Firebase reset link (server-side)
    const resetLink = await adminAuth.generatePasswordResetLink(email);

    // Send branded email via Resend
    const { error } = await resend.emails.send({
      from: 'SMA Builders <noreply@smaproperties.in>',
      to: email,
      subject: 'Reset your SMA Properties password',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
              <tr><td align="center">
                <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0F2342,#1A3A5C);padding:32px 40px;">
                      <p style="margin:0;color:#E8A020;font-size:22px;font-weight:900;letter-spacing:-0.5px;">
                        SMA <span style="color:#ffffff;">Builders &amp; Real Estates</span>
                      </p>
                      <p style="margin:6px 0 0;color:rgba(255,255,255,0.6);font-size:13px;">Nellore&apos;s Trusted Builders</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      <h1 style="margin:0 0 12px;font-size:24px;font-weight:800;color:#0F2342;">Reset your password</h1>
                      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                        We received a request to reset the password for your SMA Properties account
                        associated with <strong>${email}</strong>.
                      </p>
                      <p style="margin:0 0 32px;color:#6b7280;font-size:15px;line-height:1.6;">
                        Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
                      </p>
                      <!-- CTA button -->
                      <table cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
                        <tr>
                          <td style="background:#E8A020;border-radius:10px;">
                            <a href="${resetLink}"
                               style="display:block;padding:14px 36px;color:#111827;font-size:15px;font-weight:700;text-decoration:none;">
                              Reset Password →
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;line-height:1.5;">
                        If the button doesn&apos;t work, copy and paste this link into your browser:
                      </p>
                      <p style="margin:0 0 32px;word-break:break-all;">
                        <a href="${resetLink}" style="color:#1A3A5C;font-size:12px;">${resetLink}</a>
                      </p>
                      <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />
                      <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
                        If you didn&apos;t request a password reset, you can safely ignore this email.
                        Your password will not change.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
                      <p style="margin:0;color:#9ca3af;font-size:12px;">
                        © ${new Date().getFullYear()} SMA Builders &amp; Real Estates · Nellore, Andhra Pradesh
                      </p>
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
    console.error('reset-password error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
