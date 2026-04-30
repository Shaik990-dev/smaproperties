'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property } from '@/lib/types';

export function FeaturedProperties() {
  const [props, setProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties().then((all) => {
      const available = all.filter((p) => {
        const a = p.availability.toLowerCase();
        return !a.includes('sold') && !a.includes('not available') && !a.includes('unavailable') && !a.includes('closed');
      });
      setProps(available);
      setLoading(false);
    });
  }, []);

  return (
    <section id="properties" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--color-teal)]">
              Our Listings · మా ఆస్తులు
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              Featured Properties
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Click any property to see full details, photos and contact our agents directly.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-[var(--color-navy)] font-semibold text-sm hover:gap-3 transition-all"
          >
            View all properties <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {props.slice(0, 6).map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
