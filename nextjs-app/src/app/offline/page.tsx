import Link from 'next/link';
import { WifiOff } from 'lucide-react';

export const metadata = {
  title: 'Offline — SMA Builders',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)] px-4">
      <div className="text-center max-w-md">
        <WifiOff size={64} className="mx-auto text-gray-300 mb-6" />
        <h1 className="font-display text-3xl font-black text-gray-900 mb-3">You&apos;re Offline</h1>
        <p className="text-gray-500 mb-6">
          It looks like you&apos;ve lost your internet connection. Please check your connection and try again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-navy)] text-white font-bold hover:bg-[var(--color-navy-light)]"
        >
          Try Again
        </Link>
        <div className="mt-8 text-sm text-gray-400">
          <p>Need help? Call us directly:</p>
          <a href="tel:+917396979572" className="text-[var(--color-navy)] font-bold">+91 73969 79572</a>
        </div>
      </div>
    </div>
  );
}
