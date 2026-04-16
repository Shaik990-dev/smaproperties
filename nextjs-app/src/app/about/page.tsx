import type { Metadata } from 'next';
import { About } from '@/components/sections/About';
import { Testimonials } from '@/components/sections/Testimonials';

export const metadata: Metadata = {
  title: 'About SMA Builders & Real Estates – Trusted Since 2014 in Nellore',
  description:
    'SMA Builders & Real Estates is Nellore\'s most trusted real estate company. Founded by Sk. Ahamad & Sk. Umar. 10+ years experience, 500+ happy clients, 50+ completed projects. DTCP approved plots, flats, houses & land in Nellore, Andhra Pradesh.',
  keywords: [
    'about SMA builders', 'SMA builders nellore', 'best builders nellore',
    'trusted real estate nellore', 'top property dealers nellore',
    'real estate company nellore', 'property agents nellore',
    'Sk Ahamad nellore', 'Sk Umar nellore', 'SMA real estates nellore'
  ],
  openGraph: {
    title: 'About SMA Builders – Nellore\'s Trusted Real Estate Partner',
    description: 'Trusted since 2014. 500+ happy clients. DTCP approved properties in Nellore.',
    url: 'https://smaproperties.in/about'
  },
  alternates: { canonical: 'https://smaproperties.in/about' }
};

export default function AboutPage() {
  return (
    <>
      <About />
      <Testimonials />
    </>
  );
}
