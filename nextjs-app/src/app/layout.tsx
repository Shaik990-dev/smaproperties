import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'SMA Builders & Real Estates – Nellore | Plots, Houses, Flats',
  description:
    'SMA Builders & Real Estates – Buy plots, layouts, houses, flats & agricultural land in Nellore, Andhra Pradesh. Contact Sk. Ahamad: 7396979572 | Sk. Umar: 8886021688',
  keywords: [
    'real estate nellore',
    'plots nellore',
    'houses nellore',
    'flats nellore',
    'agricultural land nellore',
    'SMA builders',
    'DTCP approved plots nellore'
  ],
  authors: [{ name: 'SMA Builders & Real Estates' }],
  metadataBase: new URL('https://smaproperties.in'),
  openGraph: {
    title: 'SMA Builders & Real Estates – Nellore',
    description: 'Buy plots, houses, flats & agricultural land in Nellore, AP. Best prices guaranteed.',
    url: 'https://smaproperties.in',
    siteName: 'SMA Builders',
    locale: 'en_IN',
    type: 'website'
  },
  alternates: { canonical: 'https://smaproperties.in' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
