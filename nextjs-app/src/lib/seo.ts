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

export function howToBuyPropertyJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Buy Property in Nellore from SMA Builders',
    description: 'Step-by-step guide to buying plots, flats, or land in Nellore, Andhra Pradesh.',
    totalTime: 'P7D',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Browse Listings',
        text: 'Visit smaproperties.in/properties to browse all available plots, flats, houses, and land in Nellore.'
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Contact Us',
        text: 'Call or WhatsApp Sk. Ahamad (7396979572) or Sk. Umar (8886021688) to enquire about your chosen property.'
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Schedule a Site Visit',
        text: 'We will arrange a free site visit at your convenience so you can inspect the property in person.'
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Document Verification',
        text: 'Our team provides and verifies all documents: title deed, DTCP approval, pattadar passbook, and encumbrance certificate.'
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Registration',
        text: 'We guide you through the complete registration at the Sub-Registrar office, Nellore, including stamp duty and registration charges.'
      }
    ]
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
    a: 'Plot prices in Nellore vary by location and size. Open plots near Nellore city typically start from ₹800–₹2,000 per square yard depending on area and approvals. DTCP-approved residential plots in prime locations range higher. Contact SMA Builders for current pricing.'
  },
  {
    q: 'Does SMA Builders help with property registration?',
    a: 'Yes, SMA Builders provides complete assistance with property registration, documentation, title verification, and legal processes. We ensure a hassle-free buying experience for all our clients.'
  },
  {
    q: 'How long has SMA Builders been in the real estate business?',
    a: 'SMA Builders & Real Estates has been operating since 2014, with over 10 years of experience in Nellore real estate. We have served 500+ happy clients and completed 50+ successful projects.'
  },
  {
    q: 'Which are the best areas to buy plots in Nellore?',
    a: 'Top investment areas for plots in Nellore include Padugupadu, Vedayapalem, Muthukur, areas near NTS Gate, and developing localities along NH-16. For affordable options, Kavali, Gudur, and Sullurpeta offer great value. SMA Builders has verified listings across all these areas.'
  },
  {
    q: 'What documents are required to buy a plot in Nellore?',
    a: 'To buy a plot in Nellore you need: Pattadar Passbook, Title Deed, Encumbrance Certificate (EC), DTCP approval letter, Link documents, and layout plan. SMA Builders provides and verifies all these documents for every property we sell.'
  },
  {
    q: 'Is it safe to buy agricultural land in Nellore?',
    a: 'Yes, buying agricultural land in Nellore is safe when done through a trusted agent with proper documents. SMA Builders verifies title deeds, EC certificates, and land classification records before listing any agricultural property.'
  },
  {
    q: 'Can I get a home loan for plots and houses in Nellore?',
    a: 'Yes, home loans are available for DTCP-approved plots and constructed houses from SBI, HDFC, LIC Housing, and other banks. SMA Builders helps connect buyers with bank representatives. Use our free EMI calculator at smaproperties.in/emi-calculator to plan your budget.'
  },
  {
    q: 'What is the difference between DTCP and RERA approved projects in Nellore?',
    a: 'DTCP (Directorate of Town and Country Planning) approval applies to layout development and plot subdivision in Andhra Pradesh. RERA (Real Estate Regulatory Authority) registration applies to apartment and housing projects. SMA Builders provides DTCP-approved plots and will provide RERA numbers for applicable projects on request.'
  },
  {
    q: 'How is the real estate market in Nellore in 2025?',
    a: 'Nellore real estate is growing steadily in 2025 due to industrial development near Krishnapatnam Port, expanding NH-16 corridor, and rising residential demand. Areas near Padugupadu, Muthukur, and Vedayapalem have seen strong appreciation. It is a good time to invest in plots and open lands in Nellore district.'
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
    a: 'No hidden charges. SMA Builders believes in transparent dealings. The price quoted includes what you pay. Registration charges and stamp duty are as per government rates and will be explained clearly before any agreement.'
  },
  {
    q: 'Do you have plots for sale near Nellore city?',
    a: 'Yes, we have plots in and around Nellore city including Padugupadu, Vedayapalem, Muthukur, areas near NTS Gate, Grand Trunk Road, and Nellore bypass. Browse our listings or contact us for area-specific options.'
  },
  {
    q: 'What is the minimum plot size available in Nellore?',
    a: 'Plot sizes vary by location. We have options ranging from 100 sq yards (residential) to several acres (agricultural land). Most DTCP-approved residential plots in Nellore are available from 150–300 sq yards. Contact us for specific size requirements.'
  }
];
