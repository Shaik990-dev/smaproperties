import type { Metadata } from 'next';
import { Contact } from '@/components/sections/Contact';

export const metadata: Metadata = {
  title: 'Contact SMA Builders Nellore – Call, WhatsApp or Visit Us',
  description:
    'Contact SMA Builders & Real Estates Nellore. Call Sk. Ahamad: 7396979572 | Sk. Umar: 8886021688. Visit us near NTS Gate, Padugupadu, Nellore – 524137. Buy plots, flats, houses & land in Nellore.',
  keywords: [
    'contact SMA builders', 'SMA builders phone number', 'SMA builders nellore contact',
    'real estate agent nellore phone', 'property dealer nellore contact',
    'SMA builders address', 'SMA builders padugupadu', 'SMA builders NTS gate nellore',
    'call property dealer nellore', 'whatsapp real estate nellore'
  ],
  openGraph: {
    title: 'Contact SMA Builders Nellore',
    description: 'Call Sk. Ahamad: 7396979572 | Sk. Umar: 8886021688. NTS Gate, Padugupadu, Nellore.',
    url: 'https://smaproperties.in/contact'
  },
  alternates: { canonical: 'https://smaproperties.in/contact' }
};

export default function ContactPage() {
  return <Contact />;
}
