'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import type { Property, PropertyType } from '@/lib/types';

const FILTERS: { value: PropertyType | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🏠' },
  { value: 'plot', label: 'Plots & Layouts', emoji: '🏘️' },
  { value: 'flat', label: 'Flats', emoji: '🏢' },
  { value: 'house', label: 'Houses', emoji: '🏡' },
  { value: 'agricultural', label: 'Agricultural Land', emoji: '🌾' }
];

export function PropertiesListClient({ initialProperties }: { initialProperties: Property[] }) {
  const [filter, setFilter] = useState<PropertyType | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return initialProperties.filter((p) => {
      if (filter !== 'all' && p.type !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [initialProperties, filter, query]);

  return (
    <>
      {/* Search bar (in-page, separate from server-rendered hero) */}
      <div className="mb-8">
        <div className="relative max-w-2xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, location, or tag..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--color-navy)]"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${
              filter === f.value
                ? 'bg-[var(--color-navy)] text-white border-[var(--color-navy)]'
                : 'bg-white text-[var(--color-navy)] border-gray-200 hover:border-[var(--color-navy)]'
            }`}
          >
            <span className="mr-1">{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        Showing <strong className="text-gray-900">{filtered.length}</strong>{' '}
        {filtered.length === 1 ? 'property' : 'properties'}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No properties found.</p>
          <p className="text-sm mt-2">Try adjusting your filters or search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <PropertyCard key={p.id} property={p} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
