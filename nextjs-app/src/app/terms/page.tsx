import type { Metadata } from 'next';
import { LegalSection } from '@/components/ui/LegalSection';

export const metadata: Metadata = {
  title: 'Terms & Conditions | SMA Builders & Real Estates',
  description: 'Terms and conditions for using the SMA Builders & Real Estates website and services.',
  alternates: { canonical: 'https://smaproperties.in/terms' }
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <header className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="font-display text-4xl sm:text-5xl font-black text-gray-900">Terms & Conditions</h1>
        <p className="text-sm text-gray-500 mt-2">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <LegalSection title="1. Agreement">
        <p>
          By accessing or using <strong>smaproperties.in</strong> (the &ldquo;Site&rdquo;), you agree to these Terms & Conditions. If you do not agree, please do not use the Site.
        </p>
      </LegalSection>

      <LegalSection title="2. About SMA Builders & Real Estates">
        <p>
          The Site is operated by <strong>SMA Builders & Real Estates</strong>, a real estate firm based at NTS Gate, Padugupadu, Nellore – 524137, Andhra Pradesh, India. We facilitate the buying and selling of plots, layouts, flats, houses, and agricultural land in and around Nellore district.
        </p>
      </LegalSection>

      <LegalSection title="3. Property listings — important disclaimer">
        <p>
          All property information published on the Site — including photos, dimensions, prices, availability, locations, facing direction, document status, and any other details — is provided for general information only. While we make every reasonable effort to keep listings accurate and up to date:
        </p>
        <ul>
          <li>Property prices, availability, and specifications may change at any time without notice.</li>
          <li>Photographs are indicative and may not reflect the current state of the property.</li>
          <li>Layout dimensions and area measurements should be independently verified before any transaction.</li>
          <li>Documents and approvals (DTCP, RERA, pattadar, title deed, etc.) must be independently verified by you or your legal advisor.</li>
        </ul>
        <p>
          <strong>Always conduct your own due diligence and seek independent legal advice before entering into any property transaction.</strong> SMA Builders & Real Estates accepts no liability for any decisions made in reliance on Site content alone.
        </p>
      </LegalSection>

      <LegalSection title="4. RERA disclosure">
        <p>
          Where applicable under the Real Estate (Regulation and Development) Act, 2016 and Andhra Pradesh state rules, project-specific RERA registration numbers will be provided on request before any sale agreement.
        </p>
        <p className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
          <strong>RERA Registration Number:</strong> [To be added — please contact us for project-specific RERA details]
        </p>
      </LegalSection>

      <LegalSection title="5. Use of the Site">
        <ul>
          <li>You may browse the Site freely without registration.</li>
          <li>Account registration is optional and only required if you wish to save preferences or be contacted with personalized recommendations.</li>
          <li>You agree not to misuse the Site, attempt to access restricted areas, scrape data, or interfere with its operation.</li>
          <li>You agree to provide accurate information when filling forms or registering an account.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Intellectual property">
        <p>
          All content on the Site — including the SMA Builders brand, logos, layouts, written content, and original photographs — is the property of SMA Builders & Real Estates and is protected by Indian copyright and trademark law. You may not reproduce, distribute, or commercially exploit any part of the Site without our written permission.
        </p>
        <p>
          Stock photographs used in the gallery and property cards are licensed from Unsplash and remain the property of their respective photographers.
        </p>
      </LegalSection>

      <LegalSection title="7. Third-party services">
        <p>
          The Site uses the following third-party services to function:
        </p>
        <ul>
          <li>Google Firebase (database & authentication)</li>
          <li>Vercel (hosting)</li>
          <li>EmailJS (transactional email)</li>
          <li>WhatsApp (for inquiries — opens external links)</li>
        </ul>
        <p>
          These services have their own terms which apply when you interact with them through the Site.
        </p>
      </LegalSection>

      <LegalSection title="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, SMA Builders & Real Estates and its founders shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or any property transaction initiated through it.
        </p>
        <p>
          Our total liability for any claim relating to the Site shall not exceed ₹1,000 INR.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing law">
        <p>
          These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Nellore, Andhra Pradesh.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes">
        <p>
          We may update these Terms at any time. Continued use of the Site after changes constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          <strong>SMA Builders & Real Estates</strong><br />
          NTS Gate, Padugupadu, Nellore – 524137<br />
          Email: <a href="mailto:umarshaikk992@gmail.com">umarshaikk992@gmail.com</a><br />
          Phone: <a href="tel:+917396979572">+91 73969 79572</a> · <a href="tel:+918886021688">+91 88860 21688</a>
        </p>
      </LegalSection>
    </article>
  );
}

