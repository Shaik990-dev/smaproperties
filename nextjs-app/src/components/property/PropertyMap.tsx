'use client';

import { MapPin } from 'lucide-react';

interface Props {
  address: string;
  name: string;
}

/**
 * Embeds a Google Maps view for the given address.
 * Uses the free embed API (no key needed for basic place embeds).
 */
export function PropertyMap({ address, name }: Props) {
  const query = encodeURIComponent(`${name}, ${address}`);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <MapPin size={18} className="text-[var(--color-amber)]" />
        <h3 className="font-bold text-gray-900">Location</h3>
      </div>
      <div className="relative w-full h-[300px] bg-gray-100">
        <iframe
          title={`Map showing ${name}`}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="px-6 py-3 bg-gray-50">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[var(--color-navy)] font-bold hover:underline inline-flex items-center gap-1"
        >
          <MapPin size={14} /> Open in Google Maps
        </a>
      </div>
    </div>
  );
}
