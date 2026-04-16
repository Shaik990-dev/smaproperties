/**
 * Centralized JSON-LD structured data generators for SEO.
 */

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export const HOME_FAQS = [
  {
    q: 'What types of properties does SMA Builders offer in Nellore?',
    a: 'SMA Builders offers DTCP-approved plots, open layouts, residential plots, 2BHK & 3BHK flats, individual houses, villas, agricultural land, and farm land across Nellore district, Andhra Pradesh.'
  },
  {
    q: 'Are the plots sold by SMA Builders DTCP approved?',
    a: 'Yes, all plots and layouts sold by SMA Builders have proper DTCP (Directorate of Town and Country Planning) approval with clear title documents and hassle-free registration.'
  },
  {
    q: 'Where is SMA Builders located in Nellore?',
    a: 'SMA Builders & Real Estates is located near NTS Gate, Padugupadu, Nellore – 524137, Andhra Pradesh. We are open Monday to Saturday, 9:00 AM to 6:00 PM.'
  },
  {
    q: 'How can I contact SMA Builders Nellore?',
    a: 'You can reach SMA Builders by calling Sk. Ahamad at 7396979572 or Sk. Umar at 8886021688. You can also WhatsApp us or fill out the contact form on our website smaproperties.in.'
  },
  {
    q: 'Which areas in Nellore does SMA Builders serve?',
    a: 'We serve all areas in Nellore district including Nellore City, Padugupadu, Vedayapalem, Muthukur, Kavali, Gudur, Sullurpeta, Atmakur, Buchireddypalem, Venkatagiri, Rapur, and all mandals in SPSR Nellore district.'
  },
  {
    q: 'What is the price range of plots in Nellore?',
    a: 'Plot prices in Nellore vary based on location, size, and approvals. SMA Builders offers plots starting from affordable ranges with the best market prices. Contact us for current pricing on specific properties.'
  },
  {
    q: 'Does SMA Builders help with property registration?',
    a: 'Yes, SMA Builders provides complete assistance with property registration, documentation, title verification, and legal processes. We ensure a hassle-free buying experience for all our clients.'
  },
  {
    q: 'How long has SMA Builders been in the real estate business?',
    a: 'SMA Builders & Real Estates has been operating since 2014, with over 10 years of experience in Nellore real estate. We have served 500+ happy clients and completed 50+ successful projects.'
  }
];

export const PROPERTIES_FAQS = [
  {
    q: 'How can I buy a plot in Nellore from SMA Builders?',
    a: 'Browse our properties page, select a plot you like, and contact us via WhatsApp or phone. We will arrange a site visit, provide all documents, and assist with the complete purchase and registration process.'
  },
  {
    q: 'Can I visit properties before buying?',
    a: 'Absolutely! We encourage site visits for all properties. Contact us to schedule a free site visit at your convenience. Our agents will personally show you the property and explain all details.'
  },
  {
    q: 'Do you offer home loan assistance for buying property?',
    a: 'Yes, we help connect buyers with banks and housing finance companies for home loans. Use our free EMI calculator on smaproperties.in to estimate your monthly payments before buying.'
  },
  {
    q: 'Are there any hidden charges when buying from SMA Builders?',
    a: 'No hidden charges. SMA Builders believes in transparent dealings. The price quoted includes what you pay. Registration charges and stamp duty are as per government rates.'
  }
];
