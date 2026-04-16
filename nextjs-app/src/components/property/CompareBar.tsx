'use client';

import { useState } from 'react';
import { X, Scale, ChevronUp, ChevronDown } from 'lucide-react';
import { useCompare } from './CompareContext';

export function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [expanded, setExpanded] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[var(--color-navy)] shadow-2xl">
      {/* Expanded comparison table */}
      {expanded && (
        <div className="max-h-[70vh] overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-black text-gray-900">Property Comparison</h3>
              <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-gray-700">
                <ChevronDown size={20} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-bold uppercase text-gray-500 w-36">Feature</th>
                    {compareList.map((p) => (
                      <th key={p.id} className="py-3 px-4 text-left">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{p.name}</p>
                            <p className="text-xs text-gray-500 truncate">{p.typeLabel}</p>
                          </div>
                          <button
                            onClick={() => removeFromCompare(p.id)}
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <CompareRow label="Image" values={compareList.map((p) => (
                    p.pics?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={p.id} src={p.pics[0]} alt={p.name} className="w-full h-24 object-cover rounded-lg" />
                    ) : (
                      <div key={p.id} className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                        {p.emoji || '🏠'}
                      </div>
                    )
                  ))} />
                  <CompareRow label="Address" values={compareList.map((p) => p.address)} />
                  <CompareRow label="Type" values={compareList.map((p) => p.typeLabel)} />
                  <CompareRow label="Status" values={compareList.map((p) => p.availability)} />
                  <CompareRow label="Price" values={compareList.map((p) =>
                    p.priceNumber
                      ? `₹${p.priceNumber.toLocaleString('en-IN')}`
                      : p.price || 'Contact for price'
                  )} />
                  <CompareRow label="Area" values={compareList.map((p) => p.area || '-')} />
                  <CompareRow label="Facing" values={compareList.map((p) => p.facing || '-')} />
                  <CompareRow label="Bedrooms" values={compareList.map((p) =>
                    p.bedrooms ? String(p.bedrooms) : '-'
                  )} />
                  <CompareRow label="Badge" values={compareList.map((p) => p.badge || '-')} />
                  <CompareRow label="Tags" values={compareList.map((p) => p.tags.join(', ') || '-')} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed bar */}
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Scale size={18} className="text-[var(--color-navy)]" />
          <span className="text-sm font-bold text-gray-900">
            {compareList.length} propert{compareList.length === 1 ? 'y' : 'ies'} selected
          </span>
          <div className="hidden sm:flex gap-2">
            {compareList.map((p) => (
              <span key={p.id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                {p.name.length > 20 ? p.name.slice(0, 20) + '...' : p.name}
                <button onClick={() => removeFromCompare(p.id)} className="text-gray-400 hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {compareList.length >= 2 && (
            <button
              onClick={() => setExpanded((s) => !s)}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[var(--color-navy)] text-white text-sm font-bold hover:bg-[var(--color-navy-light)]"
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              {expanded ? 'Collapse' : 'Compare Now'}
            </button>
          )}
          <button
            onClick={clearCompare}
            className="px-3 py-2 rounded-lg text-gray-500 text-sm hover:text-red-600 hover:bg-red-50"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareRow({ label, values }: { label: string; values: React.ReactNode[] }) {
  return (
    <tr>
      <td className="py-3 px-4 text-xs font-bold uppercase text-gray-500 align-top">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-3 px-4 text-sm text-gray-700 align-top">{v}</td>
      ))}
    </tr>
  );
}
