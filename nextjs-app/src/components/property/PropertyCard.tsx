import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Property } from '@/lib/types';

export function PropertyCard({ property: p, index = 0 }: { property: Property; index?: number }) {
  return (
    <Link
      href={`/properties/${p.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 fade-in"
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
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {p.emoji || '🏠'}
          </div>
        )}
        {p.badge && (
          <div className="absolute top-3 left-3">
            <Badge color={p.badgeColor}>{p.badge}</Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-xs text-[var(--color-teal)] font-bold uppercase tracking-wide mb-1">
          {p.typeLabel}
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2">
          {p.name}
        </h3>
        <div className="flex items-start gap-1.5 mt-2 text-gray-500 text-sm">
          <MapPin size={14} className="flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{p.address}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {p.tags.slice(0, 3).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
            <CheckCircle size={12} /> {p.availability}
          </span>
          <span className="inline-flex items-center gap-1 text-[var(--color-navy)] text-sm font-bold group-hover:gap-2 transition-all">
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
