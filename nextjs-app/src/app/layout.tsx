import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AGENTS } from '@/data/agents';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';
import { CompareProvider } from '@/components/property/CompareContext';
import { CompareBar } from '@/components/property/CompareBar';
import { LanguageProvider } from '@/components/layout/LanguageContext';

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
  title: {
    default: 'SMA Builders & Real Estates Nellore – Plots, Houses, Flats, Land for Sale',
    template: '%s | SMA Builders Nellore'
  },
  description:
    `SMA Builders & Real Estates Nellore – Buy DTCP approved plots, open layouts, 2BHK & 3BHK flats, individual houses, villas & agricultural land in Nellore, Andhra Pradesh. Best prices in Nellore district. Contact ${AGENTS[0].name}: ${AGENTS[0].phones[0]} | ${AGENTS[1].name}: ${AGENTS[1].phones[0]}. Trusted since 2014.`,
  keywords: [
    // Brand
    'SMA Builders', 'SMA Builders Nellore', 'SMA Real Estates', 'smaproperties', 'sma properties nellore',
    // Property types — buyer intent
    'plots in nellore', 'plots for sale in nellore', 'DTCP approved plots nellore',
    'open plots nellore', 'residential plots nellore', 'house plots nellore',
    'buy plots in nellore', 'cheap plots nellore', 'low cost plots nellore',
    'affordable plots nellore', 'plots near nellore city', 'plots near nellore bypass',
    'layouts in nellore', 'DTCP layouts nellore', 'approved layouts nellore',
    'open plots near highway nellore', 'plots near krishnapatnam port',
    'flats in nellore', 'flats for sale nellore', '2BHK flats nellore', '3BHK flats nellore',
    'apartments in nellore', 'apartments for sale nellore', 'ready to move flats nellore',
    'houses in nellore', 'houses for sale nellore', 'individual houses nellore',
    'villas in nellore', 'independent houses nellore', 'duplex houses nellore',
    'land in nellore', 'land for sale nellore', 'agricultural land nellore',
    'farm land nellore', 'commercial land nellore', 'nellore land price per square yard',
    'plot price nellore', 'property rate nellore', 'plot rate nellore per gunta',
    // General
    'real estate nellore', 'property in nellore', 'property for sale nellore',
    'nellore real estate', 'nellore properties', 'buy property nellore',
    'best real estate nellore', 'top builders nellore', 'trusted builders nellore',
    'real estate agents nellore', 'property dealers nellore',
    'nellore real estate 2025', 'property investment nellore',
    // Locations
    'plots padugupadu', 'properties kavali', 'plots gudur', 'land sullurpeta',
    'real estate vedayapalem', 'plots muthukur', 'land atmakur nellore',
    'properties buchireddypalem', 'plots venkatagiri', 'land rapur',
    'plots near nts gate nellore', 'properties grand trunk road nellore',
    'nellore district properties', 'andhra pradesh real estate', 'spsr nellore',
    // Document-related searches
    'DTCP approved plots andhra pradesh', 'pattadar plots nellore', 'clear title plots nellore',
    // Telugu keywords
    'నెల్లూరు ప్లాట్లు', 'నెల్లూరు ఫ్లాట్లు', 'నెల్లూరు ఇళ్ళు', 'నెల్లూరు భూములు',
    'నెల్లూరు రియల్ ఎస్టేట్', 'SMA బిల్డర్స్ నెల్లూరు', 'నెల్లూరు ఆస్తులు'
  ],
  authors: [{ name: 'SMA Builders & Real Estates' }],
  creator: 'SMA Builders & Real Estates Nellore',
  publisher: 'SMA Builders & Real Estates',
  metadataBase: new URL('https://smaproperties.in'),
  openGraph: {
    title: 'SMA Builders & Real Estates – Plots, Houses, Flats in Nellore',
    description: `Buy DTCP approved plots, flats, houses, villas & agricultural land in Nellore, Andhra Pradesh. Best prices. Trusted since 2014. Call: ${AGENTS[0].phones[0]}`,
    url: 'https://smaproperties.in',
    siteName: 'SMA Builders & Real Estates Nellore',
    locale: 'en_IN',
    type: 'website',
    countryName: 'India'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMA Builders & Real Estates – Nellore',
    description: `Buy plots, flats, houses & land in Nellore. DTCP approved. Best prices. Call: ${AGENTS[0].phones[0]}`
  },
  alternates: { canonical: 'https://smaproperties.in' },
  category: 'Real Estate',
  classification: 'Real Estate',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'yn9XlTskhjGKBsZN5HDzMdogzaLNtT83kdo_OkmU4s4',
  },
  other: {
    'theme-color': '#0F2342',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'geo.region': 'IN-AP',
    'geo.placename': 'Nellore',
    'geo.position': '14.4426;79.9865',
    'ICBM': '14.4426, 79.9865',
    'distribution': 'global',
    'rating': 'general',
    'revisit-after': '3 days'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <meta name="theme-color" content="#0F2342" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
          <CompareProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CompareBar />
            <WhatsAppFloat />
            <ServiceWorkerRegister />
            <Toaster position="top-right" richColors closeButton />
          </CompareProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
