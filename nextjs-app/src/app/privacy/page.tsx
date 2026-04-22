import type { Metadata } from 'next';
import { LegalSection } from '@/components/ui/LegalSection';

export const metadata: Metadata = {
  title: 'Privacy Policy | SMA Builders & Real Estates',
  description: 'How SMA Builders & Real Estates collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://smaproperties.in/privacy' }
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 prose-content">
      <header className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-gray-900">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      <LegalSection title="1. Who we are">
        <p>
          SMA Builders & Real Estates (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a real estate firm based at NTS Gate, Padugupadu, Nellore – 524137, Andhra Pradesh, India. We operate the website <strong>smaproperties.in</strong>.
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>We collect the following information when you use our website:</p>
        <ul>
          <li><strong>Information you give us</strong> when you fill the contact form, register an account, or send an enquiry: your name, phone number, email address, and any property preferences or messages you choose to share.</li>
          <li><strong>Anonymous usage data</strong> that your browser automatically sends: browser type, approximate timestamp of visit, and which pages you viewed. We do not link this to your identity.</li>
          <li><strong>Account data</strong> if you register: a hashed password (handled by Firebase Authentication — we never see your plain password).</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. How we use your information">
        <ul>
          <li>To respond to your property enquiries via WhatsApp, phone call, or email.</li>
          <li>To inform you about new properties, price changes, or projects that match your stated interest.</li>
          <li>To improve the website (which pages are popular, where users come from).</li>
          <li>To detect and prevent fraud or abuse of our services.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Who we share your information with">
        <p>
          We do <strong>not</strong> sell, rent, or trade your personal information to third parties for marketing purposes.
        </p>
        <p>
          We share data only with the service providers we need to operate the website, all of whom are bound by their own privacy policies:
        </p>
        <ul>
          <li><strong>Google Firebase</strong> (Realtime Database, Authentication) — stores your account and inquiries.</li>
          <li><strong>Vercel</strong> — hosts the website.</li>
          <li><strong>EmailJS</strong> — sends notification emails to our team when a new lead arrives.</li>
        </ul>
        <p>
          We may also disclose information when required by law or to protect our legal rights.
        </p>
      </LegalSection>

      <LegalSection title="5. How long we keep your information">
        <p>
          We keep your inquiry and account data for as long as you continue to interact with us, or for up to 3 years from your last activity, whichever is later. After that we delete or anonymize the data.
        </p>
        <p>
          You can request immediate deletion of your account and all associated data at any time — see LegalSection 7 below.
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies and tracking">
        <p>
          Our website uses minimal cookies — only those required for the site to function (e.g. keeping you signed in to your account). We do not use third-party advertising cookies or cross-site trackers.
        </p>
      </LegalSection>

      <LegalSection title="7. Your rights">
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Correct any inaccurate information.</li>
          <li>Request deletion of your account and all associated data.</li>
          <li>Withdraw consent for marketing communications.</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at <a href="mailto:umarshaikk992@gmail.com">umarshaikk992@gmail.com</a> or call <a href="tel:+918886021688">+91 88860 21688</a>. We will respond within 30 days.
        </p>
      </LegalSection>

      <LegalSection title="8. Children">
        <p>
          Our website is not directed at children under 18. We do not knowingly collect information from anyone under 18. If you believe we have collected such information, please contact us so we can delete it.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top reflects the latest revision. Significant changes will be communicated via a notice on the website.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          For any questions about this policy:<br />
          <strong>SMA Builders & Real Estates</strong><br />
          NTS Gate, Padugupadu, Nellore – 524137<br />
          Email: <a href="mailto:umarshaikk992@gmail.com">umarshaikk992@gmail.com</a><br />
          Phone: <a href="tel:+917396979572">+91 73969 79572</a> · <a href="tel:+918886021688">+91 88860 21688</a>
        </p>
      </LegalSection>
    </article>
  );
}

