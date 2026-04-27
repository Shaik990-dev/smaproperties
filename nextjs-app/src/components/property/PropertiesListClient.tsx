'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import type { Property, PropertyType } from '@/lib/types';

type SortKey = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

function isSold(availability: string) {
  const a = availability.toLowerCase();
  return a.includes('sold') || a.includes('not available') || a.includes('unavailable') || a.includes('closed');
}

const TYPE_FILTERS: { value: PropertyType | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '🏠' },
  { value: 'plot', label: 'Plots & Layouts', emoji: '🏘️' },
  { value: 'flat', label: 'Flats', emoji: '🏢' },
  { value: 'house', label: 'Houses', emoji: '🏡' },
  { value: 'agricultural', label: 'Agricultural', emoji: '🌾' }
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low → high' },
  { value: 'price-desc', label: 'Price: high → low' },
  { value: 'name-asc', label: 'Name: A → Z' }
];

/**
 * Extract a coarse "location" (last 1-2 comma-separated tokens) from each property's
 * full address — gives the user a clean dropdown without needing structured data.
 */
function extractLocations(properties: Property[]): string[] {
  const set = new Set<string>();
  for (const p of properties) {
    const parts = p.address.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length === 0) continue;
    // Take the last meaningful token (mandal/district), strip pincode
    const candidate = parts[parts.length - 2] || parts[parts.length - 1];
    const cleaned = candidate.replace(/[-–]\s*\d+/, '').trim();
    if (cleaned) set.add(cleaned);
  }
  return Array.from(set).sort();
}

export function PropertiesListClient({ initialProperties }: { initialProperties: Property[] }) {
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSold, setShowSold] = useState(false);

  // Split available vs sold upfront — sold properties go to their own section
  const availableProperties = useMemo(
    () => initialProperties.filter((p) => !isSold(p.availability)),
    [initialProperties]
  );
  const soldProperties = useMemo(
    () => initialProperties.filter((p) => isSold(p.availability)),
    [initialProperties]
  );

  const locations = useMemo(() => extractLocations(availableProperties), [availableProperties]);

  const filtered = useMemo(() => {
    let result = availableProperties.filter((p) => {
      // Type
      if (type !== 'all' && p.type !== type) return false;
      // Search
      if (query) {
        const q = query.toLowerCase();
        const hit =
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      // Location
      if (location !== 'all' && !p.address.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      // Price range
      if (minPrice && (p.priceNumber ?? 0) < Number(minPrice)) return false;
      if (maxPrice && (p.priceNumber ?? Number.MAX_SAFE_INTEGER) > Number(maxPrice)) return false;
      return true;
    });

    // Sort
    switch (sort) {
      case 'price-asc':
        result = [...result].sort((a, b) => (a.priceNumber ?? Infinity) - (b.priceNumber ?? Infinity));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => (b.priceNumber ?? -Infinity) - (a.priceNumber ?? -Infinity));
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [availableProperties, type, query, location, minPrice, maxPrice, sort]);

  const activeFilterCount =
    (type !== 'all' ? 1 : 0) +
    (location !== 'all' ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (query ? 1 : 0);

  const clearAll = () => {
    setType('all');
    setQuery('');
    setLocation('all');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  return (
    <>
      {/* Search bar + sort */}
      <div className="mb-6 flex flex-col lg:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, location, or tag..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[var(--color-navy)]"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="px-4 py-3.5 rounded-xl bg-white border-2 border-gray-200 text-gray-900 font-medium focus:outline-none focus:border-[var(--color-navy)] cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border-2 border-gray-200 font-bold text-gray-700 hover:border-[var(--color-navy)]"
        >
          <SlidersHorizontal size={16} />
          Filters {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[var(--color-amber)] text-gray-900 text-xs">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Type chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setType(f.value)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-colors ${
              type === f.value
                ? 'bg-[var(--color-navy)] text-white border-[var(--color-navy)]'
                : 'bg-white text-[var(--color-navy)] border-gray-200 hover:border-[var(--color-navy)]'
            }`}
          >
            <span className="mr-1">{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Advanced filters drawer */}
      {showAdvanced && (
        <div className="mb-6 p-5 rounded-xl bg-white border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm">Advanced Filters</h3>
            <button
              onClick={clearAll}
              className="text-xs text-gray-500 hover:text-red-600 inline-flex items-center gap-1"
            >
              <X size={12} /> Clear all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)]"
              >
                <option value="all">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Min Price (₹)</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Max Price (₹)</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Any"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)]"
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Note: Properties without a numeric price are included by default. Set a max price to exclude them.
          </p>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        Showing <strong className="text-gray-900">{filtered.length}</strong>{' '}
        {filtered.length === 1 ? 'property' : 'properties'}
        {activeFilterCount > 0 && (
          <button onClick={clearAll} className="ml-3 text-xs text-[var(--color-navy)] underline hover:no-underline">
            Clear filters
          </button>
        )}
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

      {/* Sold Properties — trust-building section */}
      {soldProperties.length > 0 && (
        <section className="mt-16 pt-10 border-t-2 border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-gray-900">{soldProperties.length}</span>
                <span className="font-display text-2xl font-black text-gray-900">
                  {soldProperties.length === 1 ? 'Property' : 'Properties'} Sold
                </span>
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">✅ Verified</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Real clients, real transactions — proof of our trust and service in Nellore.
              </p>
            </div>
            <button
              onClick={() => setShowSold((v) => !v)}
              className="px-4 py-2 rounded-lg border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-[var(--color-navy)] hover:text-[var(--color-navy)] transition-colors"
            >
              {showSold ? 'Hide' : 'View Sold Properties'}
            </button>
          </div>

          {showSold && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldProperties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
