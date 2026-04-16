import { Hero } from '@/components/sections/Hero';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { About } from '@/components/sections/About';
import { Testimonials } from '@/components/sections/Testimonials';
import { Contact } from '@/components/sections/Contact';
import { faqJsonLd, HOME_FAQS } from '@/lib/seo';

// Local Business + RealEstateAgent + Organization JSON-LD
const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  '@id': 'https://smaproperties.in/#organization',
  name: 'SMA Builders & Real Estates',
  alternateName: ['SMA Builders', 'SMA Real Estates', 'SMA Builders Nellore', 'SMA Properties'],
  description: 'Buy DTCP approved plots, open layouts, flats, houses, villas & agricultural land in Nellore, Andhra Pradesh. Trusted since 2014.',
  url: 'https://smaproperties.in',
  telephone: ['+917396979572', '+918886021688'],
  email: 'umarshaikk992@gmail.com',
  foundingDate: '2014',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Bank Transfer, UPI',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near NTS Gate, Padugupadu',
    addressLocality: 'Nellore',
    addressRegion: 'Andhra Pradesh',
    postalCode: '524137',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 14.4426,
    longitude: 79.9865
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00'
  },
  areaServed: [
    { '@type': 'City', name: 'Nellore', containedInPlace: { '@type': 'State', name: 'Andhra Pradesh' } },
    { '@type': 'Place', name: 'Kavali' },
    { '@type': 'Place', name: 'Gudur' },
    { '@type': 'Place', name: 'Sullurpeta' },
    { '@type': 'Place', name: 'Atmakur' },
    { '@type': 'Place', name: 'Muthukur' },
    { '@type': 'Place', name: 'Buchireddypalem' },
    { '@type': 'Place', name: 'Venkatagiri' },
    { '@type': 'Place', name: 'Rapur' },
    { '@type': 'Place', name: 'Padugupadu' },
    { '@type': 'Place', name: 'Vedayapalem' }
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Real Estate Properties in Nellore',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'DTCP Approved Plots in Nellore' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Open Layouts in Nellore' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: '2BHK & 3BHK Flats in Nellore' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Individual Houses & Villas in Nellore' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Agricultural Land in Nellore' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Farm Land in Nellore District' } }
    ]
  },
  sameAs: [
    'https://wa.me/917396979572'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '500',
    bestRating: '5'
  },
  founder: [
    { '@type': 'Person', name: 'Sk. Ahamad', telephone: '+917396979572' },
    { '@type': 'Person', name: 'Sk. Umar', telephone: '+918886021688' }
  ]
};

// Website SearchAction schema (enables Google sitelinks search box)
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SMA Builders & Real Estates',
  url: 'https://smaproperties.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://smaproperties.in/properties?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
      />
      <Hero />
      <FeaturedProperties />
      <About />
      <Testimonials />
      <Contact />
      {/* SEO keyword-rich content — visible, crawlable, helpful */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-black text-gray-900 text-center mb-8">
            Real Estate Services in Nellore, Andhra Pradesh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Plots & Layouts in Nellore</h3>
              <p>
                Buy <strong>DTCP approved plots in Nellore</strong> with clear title documents. We offer
                <strong> residential plots</strong>, <strong>open layouts</strong>, and <strong>house plots</strong> in
                prime locations across Nellore city and district including Padugupadu, Vedayapalem, and Muthukur.
                All plots come with proper government approvals and hassle-free registration.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Flats & Apartments in Nellore</h3>
              <p>
                Looking for <strong>2BHK flats in Nellore</strong> or <strong>3BHK apartments</strong>?
                SMA Builders offers affordable and premium <strong>flats for sale in Nellore</strong> with modern
                amenities, car parking, and 24/7 water supply. Ready to move and under construction options available.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Houses & Villas in Nellore</h3>
              <p>
                Find your dream <strong>individual house in Nellore</strong>. We have <strong>independent houses</strong>,
                <strong> duplex villas</strong>, and <strong>ready-to-move houses</strong> in the best residential areas.
                From budget homes to premium villas — we have options for every budget.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Agricultural & Farm Land</h3>
              <p>
                Buy <strong>agricultural land in Nellore district</strong> and <strong>farm land near Nellore</strong>.
                Ideal for farming, investment, or future development. Land available in Kavali, Gudur, Sullurpeta,
                Atmakur, Buchireddypalem, and surrounding mandals.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Nellore District Coverage</h3>
              <p>
                We serve all areas in <strong>Nellore district</strong>: Nellore City, Kavali, Gudur, Sullurpeta,
                Atmakur, Muthukur, Buchireddypalem, Venkatagiri, Rapur, Padugupadu, Vedayapalem, and all mandals
                in <strong>SPSR Nellore district, Andhra Pradesh</strong>.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Why Choose SMA Builders?</h3>
              <p>
                <strong>10+ years of experience</strong> in Nellore real estate. <strong>500+ happy clients</strong>.
                All properties are verified with <strong>clear titles</strong> and <strong>DTCP approval</strong>.
                We offer the <strong>best prices in Nellore</strong> with transparent dealings and no hidden charges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
