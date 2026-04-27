'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Save, Trash2, Plus, X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { saveProperty, deleteProperty } from '@/lib/properties';
import { uploadPropertyImage, deletePropertyImage } from '@/lib/storage';
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
  const [pics, setPics] = useState<string[]>(property?.pics || []);
  const [picsRaw, setPicsRaw] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when target property changes
  useEffect(() => {
    if (property) {
      setP(property);
      setTagsRaw(property.tags.join(', '));
      setDetailsRaw(property.details.map((d) => `${d.icon}|${d.label}|${d.value}`).join('\n'));
      setPics(property.pics || []);
    }
  }, [property]);

  const update = <K extends keyof Property>(key: K, value: Property[K]) => {
    setP((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = Array.from(files).filter((f) => {
      if (!validTypes.includes(f.type)) {
        toast.error(`${f.name}: Only JPG, PNG, WebP, GIF allowed`);
        return false;
      }
      if (f.size > maxSize) {
        toast.error(`${f.name}: Max size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const urls: string[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        const url = await uploadPropertyImage(validFiles[i], p.id, (prog) => {
          const overall = Math.round(((i + prog.percent / 100) / validFiles.length) * 100);
          setUploadProgress(overall);
        });
        urls.push(url);
      }
      setPics((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded`);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed. Check Firebase Storage rules & sign in as admin.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addUrlImages = () => {
    const urls = picsRaw.split('\n').map((s) => s.trim()).filter((s) => s.startsWith('http'));
    if (urls.length === 0) {
      toast.error('No valid URLs found');
      return;
    }
    setPics((prev) => [...prev, ...urls]);
    setPicsRaw('');
    toast.success(`${urls.length} URL${urls.length > 1 ? 's' : ''} added`);
  };

  const removeImage = async (index: number) => {
    const url = pics[index];
    setPics((prev) => prev.filter((_, i) => i !== index));
    // Try to delete from storage if it's a Firebase Storage URL
    if (url.includes('firebasestorage.googleapis.com')) {
      await deletePropertyImage(url);
    }
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pics.length) return;
    const newPics = [...pics];
    [newPics[index], newPics[newIndex]] = [newPics[newIndex], newPics[index]];
    setPics(newPics);
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Price Display Text *">
            <input
              value={p.price || ''}
              onChange={(e) => update('price', e.target.value)}
              className={inputCls}
              placeholder="e.g. ₹25 Lakhs  /  From ₹10 Lakhs  /  ₹1,200/sq yd"
            />
            <p className="text-xs text-gray-400 mt-1">This is what shows on the property card.</p>
          </Field>
          <Field label="Price (numeric, for sorting)">
            <input
              type="number"
              value={p.priceNumber || ''}
              onChange={(e) => update('priceNumber', e.target.value ? Number(e.target.value) : undefined)}
              className={inputCls}
              placeholder="2500000"
            />
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
          <Field label="Area / Plot Size">
            <input value={p.area || ''} onChange={(e) => update('area', e.target.value)} className={inputCls} placeholder="867 sq.ft / 25 Ankanams" />
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

        {/* Image upload section */}
        <Field label="Property Images">
          <div className="space-y-4">
            {/* Upload area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                uploading ? 'border-[var(--color-amber)] bg-amber-50' : 'border-gray-300 hover:border-[var(--color-navy)] hover:bg-gray-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              {uploading ? (
                <div className="space-y-2">
                  <Loader2 size={28} className="mx-auto text-[var(--color-amber)] animate-spin" />
                  <p className="text-sm font-bold text-gray-700">Uploading... {uploadProgress}%</p>
                  <div className="w-48 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-amber)] rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div>
                  <Upload size={28} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-700">Drag & drop images here or click to browse</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, GIF — max 5 MB each</p>
                </div>
              )}
            </div>

            {/* URL fallback */}
            <div className="flex gap-2">
              <input
                value={picsRaw}
                onChange={(e) => setPicsRaw(e.target.value)}
                className={inputCls + ' text-xs font-mono flex-1'}
                placeholder="Or paste image URLs (one per line) and click Add"
              />
              <button
                type="button"
                onClick={addUrlImages}
                disabled={!picsRaw.trim()}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 disabled:opacity-50 flex-shrink-0"
              >
                <Plus size={14} className="inline mr-1" /> Add URLs
              </button>
            </div>

            {/* Image preview grid */}
            {pics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {pics.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-[4/3] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 px-2 py-0.5 rounded bg-[var(--color-amber)] text-gray-900 text-[10px] font-bold">
                        COVER
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {i > 0 && (
                        <button
                          onClick={() => moveImage(i, -1)}
                          className="w-7 h-7 rounded-full bg-white text-gray-900 text-xs font-bold flex items-center justify-center"
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(i)}
                        className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                      {i < pics.length - 1 && (
                        <button
                          onClick={() => moveImage(i, 1)}
                          className="w-7 h-7 rounded-full bg-white text-gray-900 text-xs font-bold flex items-center justify-center"
                          title="Move right"
                        >
                          →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              {pics.length} image{pics.length !== 1 ? 's' : ''} — first image is the cover photo
            </p>
          </div>
        </Field>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-navy)] text-white font-bold disabled:opacity-60 hover:bg-[var(--color-navy-light)]"
          >
            <Save size={16} /> {saving ? 'Saving...' : (isNew ? 'Create Property' : 'Save Changes')}
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
