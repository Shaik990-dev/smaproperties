'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit3 } from 'lucide-react';
import { fetchProperties } from '@/lib/properties';
import { PropertyForm } from '@/components/admin/PropertyForm';
import type { Property } from '@/lib/types';

type Mode = { kind: 'list' } | { kind: 'edit'; property: Property } | { kind: 'new' };

export default function AdminPropertiesPage() {
  const [props, setProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>({ kind: 'list' });

  const refresh = async () => {
    setLoading(true);
    setProps(await fetchProperties());
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  if (mode.kind === 'edit' || mode.kind === 'new') {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => setMode({ kind: 'list' })}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-navy)] mb-6"
        >
          <ArrowLeft size={16} /> Back to property list
        </button>
        <PropertyForm
          property={mode.kind === 'edit' ? mode.property : undefined}
          onSaved={() => {
            refresh();
            setMode({ kind: 'list' });
          }}
          onCancel={() => setMode({ kind: 'list' })}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--color-navy)]">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="font-display text-4xl font-black text-gray-900 mt-3">Manage Properties</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, or delete property listings.</p>
        </div>
        <button
          onClick={() => setMode({ kind: 'new' })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-amber)] text-gray-900 font-bold hover:bg-[var(--color-amber-light)]"
        >
          <Plus size={16} /> Add New Property
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">Loading properties…</div>
        ) : props.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
            No properties yet. Click <strong>Add New Property</strong> above to create your first listing.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            {props.map((p) => (
              <div key={p.id} className="p-5 flex items-center justify-between gap-4 flex-wrap hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
                    style={{ background: p.bgColor || '#e8e8e8' }}
                  >
                    {p.pics?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.pics[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      p.emoji || '🏠'
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{p.typeLabel}</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">📍 {p.address}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/properties/${p.id}`}
                    target="_blank"
                    className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-100"
                  >
                    👁 View
                  </Link>
                  <button
                    onClick={() => setMode({ kind: 'edit', property: p })}
                    className="px-3 py-1.5 rounded-md bg-[var(--color-navy)] text-white text-xs font-bold inline-flex items-center gap-1"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
