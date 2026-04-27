import type { Metadata } from 'next';
import { About } from '@/components/sections/About';
import { Testimonials } from '@/components/sections/Testimonials';

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About SMA Builders & Real Estates Nellore',
  url: 'https://smaproperties.in/about',
  description: 'SMA Builders & Real Estates – Nellore\'s trusted real estate company since 2014. DTCP-approved plots, flats, houses & land.',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://smaproperties.in/#organization',
    name: 'SMA Builders & Real Estates',
    url: 'https://smaproperties.in',
    foundingDate: '2014',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
    founder: [
      { '@type': 'Person', name: 'Sk. Ahamad', telephone: '+917396979572' },
      { '@type': 'Person', name: 'Sk. Umar', telephone: '+918886021688' }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near NTS Gate, Padugupadu',
      addressLocality: 'Nellore',
      addressRegion: 'Andhra Pradesh',
      postalCode: '524137',
      addressCountry: 'IN'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '500',
      bestRating: '5'
    },
    sameAs: ['https://wa.me/917396979572']
  }
};

export const metadata: Metadata = {
  title: 'About SMA Builders – Trusted Real Estate Since 2014',
  description:
    'SMA Builders & Real Estates – Nellore\'s trusted property dealer since 2014. 500+ happy clients, 50+ projects. DTCP-approved plots, flats & land.',
  keywords: [
    'about SMA builders', 'SMA builders nellore', 'best builders nellore',
    'trusted real estate nellore', 'top property dealers nellore',
    'real estate company nellore', 'property agents nellore',
    'Sk Ahamad nellore', 'Sk Umar nellore', 'SMA real estates nellore'
  ],
  openGraph: {
    title: 'About SMA Builders – Nellore\'s Trusted Real Estate Partner',
    description: 'Trusted since 2014. 500+ happy clients. DTCP-approved plots, flats & land in Nellore.',
    url: 'https://smaproperties.in/about',
    images: [{ url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80', width: 1200, height: 630, alt: 'SMA Builders Nellore Office' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SMA Builders Nellore',
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80']
  },
  alternates: { canonical: 'https://smaproperties.in/about' }
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div
        className="text-white py-14 px-4"
        style={{ background: 'linear-gradient(150deg, var(--color-navy-dark), var(--color-navy) 60%, var(--color-navy-light))' }}
      >
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--color-amber-light)]">
            Our Story
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black mt-2">
            About SMA Builders Nellore
          </h1>
          <p className="text-white/70 mt-3 text-sm max-w-xl">
            Nellore&apos;s trusted real estate partner since 2014 — 500+ happy clients, 50+ completed projects.
          </p>
        </div>
      </div>
      <About />
      <Testimonials />
    </>
  );
}
