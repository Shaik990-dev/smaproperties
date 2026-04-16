import type { Metadata } from 'next';
import { EMICalculatorClient } from '@/components/tools/EMICalculatorClient';

export const metadata: Metadata = {
  title: 'Home Loan EMI Calculator – Plan Your Property Purchase in Nellore',
  description:
    'Free home loan EMI calculator. Calculate monthly EMI for buying plots, flats, houses & land in Nellore. Estimate loan amount, interest rate & tenure. Plan your property purchase with SMA Builders Nellore.',
  keywords: [
    'EMI calculator nellore', 'home loan calculator nellore', 'property loan EMI',
    'plot loan EMI calculator', 'flat loan EMI nellore', 'house loan calculator',
    'home loan interest rate nellore', 'property EMI calculator india',
    'SMA builders EMI calculator', 'monthly EMI property nellore'
  ],
  openGraph: {
    title: 'Home Loan EMI Calculator | SMA Builders Nellore',
    description: 'Calculate your monthly EMI for buying property in Nellore. Free tool by SMA Builders.',
    url: 'https://smaproperties.in/emi-calculator'
  },
  alternates: { canonical: 'https://smaproperties.in/emi-calculator' }
};

export default function EMICalculatorPage() {
  return <EMICalculatorClient />;
}
