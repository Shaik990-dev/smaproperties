'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, CheckCircle, XCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { FavoriteButton } from './FavoriteButton';
import { CompareButton } from './CompareButton';
import { useLang, type Lang } from '@/components/layout/LanguageContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { AGENTS } from '@/data/agents';
import type { Property } from '@/lib/types';

function isSold(availability: string) {
  const a = availability.toLowerCase();
  return a.includes('sold') || a.includes('not available') || a.includes('unavailable') || a.includes('closed');
}

const TYPE_LABEL: Record<string, Record<Lang, string>> = {
  plot:         { en: 'Layout',       te: 'లేఅవుట్' },
  flat:         { en: 'Flats',        te: 'ఫ్లాట్లు' },
  house:        { en: 'Residential',  te: 'నివాస' },
  agricultural: { en: 'Agricultural', te: 'వ్యవసాయ' },
};

function localTypeLabel(type: string, lang: Lang): string {
  const map = TYPE_LABEL[type];
  if (!map) return type;
  return lang === 'en' ? map.en : `${map.en} / ${map[lang]}`;
}

export function PropertyCard({ property: p, index = 0 }: { property: Property; index?: number }) {
  const { lang } = useLang();
  const { user, openAuthModal } = useAuth();
  const displayName = lang === 'te' && p.nameLocal ? p.nameLocal : p.name;
  const sold = isSold(p.availability);

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      openAuthModal();
    }
  };

  return (
    <Link
      href={`/properties/${p.id}`}
      onClick={handleClick}
      className={`group block bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 fade-in ${sold ? 'border-gray-300 opacity-80' : 'border-gray-200'}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden" style={{ background: p.bgColor || '#e8e8e8' }}>
        {p.pics && p.pics.length > 0 ? (
          <Image
            src={p.pics[0]}
            alt={p.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${sold ? 'grayscale-[40%]' : ''}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {p.emoji || '🏠'}
          </div>
        )}
        {/* SOLD banner overlay */}
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rotate-[-20deg] bg-red-600 text-white text-sm font-black px-6 py-1.5 rounded shadow-lg tracking-widest uppercase">
              Sold Out
            </span>
          </div>
        )}
        {!sold && p.badge && (
          <div className="absolute top-3 left-3">
            <Badge color={p.badgeColor}>{p.badge}</Badge>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <FavoriteButton propertyId={p.id} size="sm" />
          <CompareButton property={p} size="sm" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-xs text-[var(--color-teal)] font-bold uppercase tracking-wide mb-1">
          {localTypeLabel(p.type, lang)}
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2">
          {displayName}
        </h3>
        <div className="flex items-start gap-1.5 mt-2 text-gray-500 text-sm">
          <MapPin size={14} className="flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{p.address}</span>
        </div>

        {/* Price — shown prominently */}
        {p.price ? (
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[var(--color-navy)]">{p.price}</span>
            {p.area && <span className="text-xs text-gray-400 font-medium">· {p.area}</span>}
          </div>
        ) : (
          <a
            href={`tel:+91${AGENTS[0].phones[0]}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-navy)] hover:underline"
          >
            <Phone size={13} /> Call for price
          </a>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {sold ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
              <XCircle size={12} /> {p.availability}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              <CheckCircle size={12} /> {p.availability}
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[var(--color-navy)] text-sm font-bold group-hover:gap-2 transition-all">
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
