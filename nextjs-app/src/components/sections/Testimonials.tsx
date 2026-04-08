import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/data/properties';

export function Testimonials() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--color-teal)]">
            Reviews · సమీక్షలు
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-gray-900 mt-2">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Real feedback from our happy customers across Nellore district.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[var(--color-navy)] text-white font-bold flex items-center justify-center text-sm">
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
