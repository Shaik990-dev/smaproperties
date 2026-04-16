import type { Metadata } from 'next';
import { getPropertiesServer } from '@/lib/firebase-server';
import { PropertiesListClient } from '@/components/property/PropertiesListClient';
import { faqJsonLd, breadcrumbJsonLd, PROPERTIES_FAQS } from '@/lib/seo';

// ISR — revalidate the page every 60s so newly added properties show up
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Properties for Sale in Nellore – Plots, Flats, Houses, Land | SMA Builders',
  description:
    'Browse all available real estate properties in Nellore district: DTCP-approved plots & layouts, 2BHK & 3BHK flats, individual houses, villas, agricultural land & farm land. Verified listings from SMA Builders. Best prices in Nellore, Kavali, Gudur, Sullurpeta, Atmakur.',
  keywords: [
    'properties for sale nellore', 'plots for sale nellore', 'DTCP approved plots nellore',
    'flats for sale nellore', '2BHK flats nellore', '3BHK flats nellore',
    'houses for sale nellore', 'villas nellore', 'agricultural land nellore',
    'open plots nellore', 'layouts nellore', 'farm land nellore',
    'residential plots nellore', 'commercial property nellore',
    'buy plots nellore', 'buy flat nellore', 'buy house nellore', 'buy land nellore',
    'nellore real estate listings', 'property listings nellore'
  ],
  openGraph: {
    title: 'All Properties for Sale in Nellore | SMA Builders',
    description:
      'Browse DTCP-approved plots, flats, houses & land in Nellore. Verified listings. Best prices.',
    url: 'https://smaproperties.in/properties',
    type: 'website'
  },
  alternates: { canonical: 'https://smaproperties.in/properties' }
};

export default async function PropertiesPage() {
  // Fetched at build/revalidation time on the server — full HTML for crawlers
  const properties = await getPropertiesServer();

  const propertiesBreadcrumb = breadcrumbJsonLd([
    { name: 'Home', url: 'https://smaproperties.in' },
    { name: 'Properties', url: 'https://smaproperties.in/properties' }
  ]);

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertiesBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(PROPERTIES_FAQS)) }}
      />
      {/* Page header (server-rendered) */}
      <div
        className="text-white py-16 px-4"
        style={{
          background:
            'linear-gradient(150deg, var(--color-navy-dark), var(--color-navy) 60%, var(--color-navy-light))'
        }}
      >
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--color-amber-light)]">
            Browse Properties
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black mt-2">
            Properties for Sale in Nellore
          </h1>
          <p className="text-white/70 mt-3 text-sm max-w-2xl">
            {properties.length} verified real estate listings — DTCP-approved plots, open layouts, flats, houses, villas, and agricultural land across Nellore district.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <PropertiesListClient initialProperties={properties} />

        {/* SEO-rich content section — visible and helpful for users AND crawlers */}
        <section className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="font-display text-2xl font-black text-gray-900 mb-4">
            Buy Property in Nellore — Plots, Flats, Houses & Land
          </h2>
          <div className="prose prose-sm text-gray-600 max-w-none columns-1 md:columns-2 gap-8">
            <p>
              Looking for <strong>plots for sale in Nellore</strong>? SMA Builders & Real Estates offers a wide range of
              <strong> DTCP-approved plots</strong>, <strong>open layouts</strong>, and <strong>residential plots</strong> across
              Nellore district including areas like Padugupadu, Vedayapalem, Muthukur, Kavali, and Gudur.
            </p>
            <p>
              We specialize in <strong>2BHK and 3BHK flats in Nellore</strong>, <strong>individual houses</strong>,
              <strong> independent villas</strong>, and <strong>agricultural land</strong> with clear title documents.
              All our properties come with proper government approvals and hassle-free registration assistance.
            </p>
            <p>
              Whether you&apos;re searching for <strong>affordable plots in Nellore</strong>,
              <strong> premium houses near NTS Gate</strong>, or <strong>farm land in Nellore district</strong>,
              we have verified listings at the best market prices. Our team has over 10 years of experience in
              Nellore real estate.
            </p>
            <p>
              <strong>Service areas:</strong> Nellore City, Padugupadu, Vedayapalem, Muthukur, Kavali, Gudur,
              Sullurpeta, Atmakur, Buchireddypalem, Venkatagiri, Rapur, and all mandals in Nellore district,
              Andhra Pradesh.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
