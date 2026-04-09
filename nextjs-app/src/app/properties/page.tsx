import type { Metadata } from 'next';
import { getPropertiesServer } from '@/lib/firebase-server';
import { PropertiesListClient } from '@/components/property/PropertiesListClient';

// ISR — revalidate the page every 60s so newly added properties show up
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Properties for Sale in Nellore — Plots, Flats, Houses, Land | SMA Builders',
  description:
    'Browse all available real estate properties in Nellore: DTCP-approved plots, layouts, 2BHK & 3BHK flats, houses, and agricultural land. Verified listings from SMA Builders.',
  openGraph: {
    title: 'Properties for Sale in Nellore | SMA Builders',
    description:
      'Browse plots, flats, houses, and agricultural land in Nellore, Andhra Pradesh.',
    url: 'https://smaproperties.in/properties'
  },
  alternates: { canonical: 'https://smaproperties.in/properties' }
};

export default async function PropertiesPage() {
  // Fetched at build/revalidation time on the server — full HTML for crawlers
  const properties = await getPropertiesServer();

  return (
    <div className="bg-white min-h-screen">
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
            All Properties in Nellore
          </h1>
          <p className="text-white/70 mt-3 text-sm max-w-2xl">
            {properties.length} verified real estate listings — DTCP-approved plots, flats, houses, and agricultural land across Nellore district.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <PropertiesListClient initialProperties={properties} />
      </div>
    </div>
  );
}
