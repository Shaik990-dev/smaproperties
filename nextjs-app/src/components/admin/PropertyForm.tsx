'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Trash2, Plus, X } from 'lucide-react';
import { saveProperty, deleteProperty } from '@/lib/properties';
import type { Property, PropertyType, PropertyDetail } from '@/lib/types';

interface Props {
  property?: Property;          // omit for "create new"
  onSaved: () => void;
  onCancel: () => void;
}

const TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: 'plot', label: 'Plot / Layout' },
  { value: 'flat', label: 'Flat / Apartment' },
  { value: 'house', label: 'House / Villa' },
  { value: 'land', label: 'Land' },
  { value: 'agricultural', label: 'Agricultural Land' }
];

const BADGE_OPTIONS: { value: NonNullable<Property['badgeColor']>; label: string }[] = [
  { value: 'default', label: 'Available (blue)' },
  { value: 'hot', label: 'Hot Deal (red)' },
  { value: 'new', label: 'New (yellow)' },
  { value: 'ready', label: 'Ready to Move (purple)' }
];

const blank = (): Property => ({
  id: 'p' + Date.now(),
  name: 'New Property',
  nameLocal: '',
  type: 'plot',
  typeLabel: 'Plot / Layout',
  badge: 'Available',
  badgeColor: 'default',
  bgColor: '#dbeafe',
  emoji: '🏘️',
  address: 'Nellore, Andhra Pradesh',
  availability: 'Available',
  tags: [],
  details: [],
  pics: []
});

export function PropertyForm({ property, onSaved, onCancel }: Props) {
  const isNew = !property;
  const [p, setP] = useState<Property>(property ?? blank());
  const [tagsRaw, setTagsRaw] = useState((property?.tags || []).join(', '));
  const [detailsRaw, setDetailsRaw] = useState(
    (property?.details || []).map((d) => `${d.icon}|${d.label}|${d.value}`).join('\n')
  );
  const [picsRaw, setPicsRaw] = useState((property?.pics || []).join('\n'));
  const [saving, setSaving] = useState(false);

  // Reset form when target property changes
  useEffect(() => {
    if (property) {
      setP(property);
      setTagsRaw(property.tags.join(', '));
      setDetailsRaw(property.details.map((d) => `${d.icon}|${d.label}|${d.value}`).join('\n'));
      setPicsRaw(property.pics.join('\n'));
    }
  }, [property]);

  const update = <K extends keyof Property>(key: K, value: Property[K]) => {
    setP((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!p.name.trim()) {
      toast.error('Property name is required');
      return;
    }
    if (!p.address.trim()) {
      toast.error('Address is required');
      return;
    }

    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);
    const details: PropertyDetail[] = detailsRaw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('|').map((s) => s.trim());
        return { icon: parts[0] || '📌', label: parts[1] || '', value: parts[2] || '' };
      });
    const pics = picsRaw.split('\n').map((s) => s.trim()).filter((s) => s.startsWith('http'));

    setSaving(true);
    try {
      await saveProperty({ ...p, tags, details, pics });
      toast.success(isNew ? 'Property created' : 'Property updated');
      onSaved();
    } catch (e) {
      console.error(e);
      toast.error('Could not save. Check Firebase rules + sign in as admin.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${p.name}"?`)) return;
    setSaving(true);
    try {
      await deleteProperty(p.id);
      toast.success('Property deleted');
      onSaved();
    } catch {
      toast.error('Could not delete property.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h3 className="font-bold text-gray-900">
          {isNew ? '➕ Add New Property' : '✏️ Editing: ' + p.name}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-700" aria-label="Close">
          <X size={20} />
        </button>
      </header>

      <div className="p-6 space-y-5">
        {/* IDs and core fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Property ID *">
            <input value={p.id} onChange={(e) => update('id', e.target.value)} className={inputCls} disabled={!isNew} />
          </Field>
          <Field label="Type *">
            <select
              value={p.type}
              onChange={(e) => {
                const t = e.target.value as PropertyType;
                const opt = TYPE_OPTIONS.find((o) => o.value === t);
                update('type', t);
                if (opt) update('typeLabel', opt.label);
              }}
              className={inputCls}
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Property Name (English) *">
          <input value={p.name} onChange={(e) => update('name', e.target.value)} className={inputCls} />
        </Field>

        <Field label="Property Name (Telugu)">
          <input value={p.nameLocal || ''} onChange={(e) => update('nameLocal', e.target.value)} className={inputCls} placeholder="Optional Telugu name" />
        </Field>

        <Field label="Type Label (display)">
          <input value={p.typeLabel} onChange={(e) => update('typeLabel', e.target.value)} className={inputCls} placeholder="e.g. Layout / లేఅవుట్" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Badge Text">
            <input value={p.badge || ''} onChange={(e) => update('badge', e.target.value)} className={inputCls} placeholder="Hot Deal / Available / Ready to Move / New" />
          </Field>
          <Field label="Badge Color">
            <select value={p.badgeColor || 'default'} onChange={(e) => update('badgeColor', e.target.value as Property['badgeColor'])} className={inputCls}>
              {BADGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Full Address *">
          <input value={p.address} onChange={(e) => update('address', e.target.value)} className={inputCls} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Availability Text">
            <input value={p.availability} onChange={(e) => update('availability', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Area">
            <input value={p.area || ''} onChange={(e) => update('area', e.target.value)} className={inputCls} placeholder="33½ Ankanams / 1200 sq.ft" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Facing">
            <input value={p.facing || ''} onChange={(e) => update('facing', e.target.value)} className={inputCls} placeholder="East / West / North / South" />
          </Field>
          <Field label="Bedrooms (for flats/houses)">
            <input
              type="number"
              value={p.bedrooms || ''}
              onChange={(e) => update('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
              className={inputCls}
            />
          </Field>
          <Field label="Price (₹, numeric)">
            <input
              type="number"
              value={p.priceNumber || ''}
              onChange={(e) => update('priceNumber', e.target.value ? Number(e.target.value) : undefined)}
              className={inputCls}
              placeholder="2500000"
            />
          </Field>
        </div>

        <Field label="Tags (comma separated)">
          <input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} className={inputCls} placeholder="DTCP Approved, East Facing, Water & Power" />
        </Field>

        <Field label="Details (one per line, format: emoji|Label|Value)">
          <textarea
            value={detailsRaw}
            onChange={(e) => setDetailsRaw(e.target.value)}
            className={inputCls + ' h-32 font-mono text-xs'}
            placeholder={`📐|Plot Size|33½ Ankanams\n🧭|Facing|East\n💰|Price|Contact us`}
          />
        </Field>

        <Field label="Photo URLs (one per line)">
          <textarea
            value={picsRaw}
            onChange={(e) => setPicsRaw(e.target.value)}
            className={inputCls + ' h-24 font-mono text-xs'}
            placeholder={`https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2...`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Image upload to Firebase Storage coming in next sprint. For now paste image URLs (Unsplash, your own server, etc.)
          </p>
        </Field>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-navy)] text-white font-bold disabled:opacity-60 hover:bg-[var(--color-navy-light)]"
          >
            <Save size={16} /> {saving ? 'Saving…' : (isNew ? 'Create Property' : 'Save Changes')}
          </button>
          {!isNew && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold disabled:opacity-60 hover:bg-red-700"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)] disabled:bg-gray-50 disabled:text-gray-500';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}
