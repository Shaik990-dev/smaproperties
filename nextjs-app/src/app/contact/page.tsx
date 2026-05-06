import type { Metadata } from 'next';
import { Contact } from '@/components/sections/Contact';
import { AGENTS, OFFICE } from '@/data/agents';

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'RealEstateAgent'],
  '@id': 'https://smaproperties.in/#organization',
  name: 'SMA Builders & Real Estates',
  url: 'https://smaproperties.in',
  telephone: AGENTS.map((a) => `+91${a.phones[0]}`),
  email: OFFICE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near NTS Gate, Padugupadu',
    addressLocality: 'Nellore',
    addressRegion: 'Andhra Pradesh',
    postalCode: '524137',
    addressCountry: 'IN'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 14.4426, longitude: 79.9865 },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00'
  },
  contactPoint: AGENTS.map((a) => ({
    '@type': 'ContactPoint',
    telephone: `+91${a.phones[0]}`,
    contactType: 'sales',
    areaServed: 'IN',
    availableLanguage: ['English', 'Telugu']
  }))
};

export const metadata: Metadata = {
  title: 'Contact SMA Builders – Call or WhatsApp',
  description:
    `Contact SMA Builders Nellore. Call ${AGENTS[0].name}: ${AGENTS[0].phones[0]} or ${AGENTS[1].name}: ${AGENTS[1].phones[0]}. Near NTS Gate, Padugupadu, Nellore – 524137.`,
  keywords: [
    'contact SMA builders', 'SMA builders phone number', 'SMA builders nellore contact',
    'real estate agent nellore phone', 'property dealer nellore contact',
    'SMA builders address', 'SMA builders padugupadu', 'SMA builders NTS gate nellore',
    'call property dealer nellore', 'whatsapp real estate nellore'
  ],
  openGraph: {
    title: 'Contact SMA Builders Nellore – Call or WhatsApp',
    description: `Call or WhatsApp ${AGENTS[0].name}: ${AGENTS[0].phones[0]}. Near NTS Gate, Padugupadu, Nellore.`,
    url: 'https://smaproperties.in/contact',
    images: [{ url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80', width: 1200, height: 630, alt: 'Contact SMA Builders Nellore' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact SMA Builders Nellore',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80']
  },
  alternates: { canonical: 'https://smaproperties.in/contact' }
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <div
        className="text-white py-14 px-4"
        style={{ background: 'linear-gradient(150deg, var(--color-navy-dark), var(--color-navy) 60%, var(--color-navy-light))' }}
      >
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--color-amber-light)]">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black mt-2">
            Contact SMA Builders Nellore
          </h1>
          <p className="text-white/70 mt-3 text-sm max-w-xl">
            {OFFICE.hours} · {OFFICE.addressEn}
          </p>
        </div>
      </div>
      <Contact />
    </>
  );
}
