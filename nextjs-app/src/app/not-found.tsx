import Link from 'next/link';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-9xl font-display font-black text-[var(--color-amber)]">404</div>
      <h1 className="font-display text-3xl font-black text-gray-900 mt-4">
        Page not found
      </h1>
      <p className="text-gray-500 mt-3 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-navy)] text-white font-bold hover:bg-[var(--color-navy-light)]"
        >
          <Home size={16} /> Back to home
        </Link>
        <Link
          href="/properties"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-800 font-bold hover:bg-gray-50"
        >
          Browse properties <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
