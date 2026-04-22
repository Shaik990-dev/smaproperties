'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PropertyGallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
        📷 Photos coming soon
      </div>
    );
  }

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images[idx]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-white"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:bg-white"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
              {idx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`relative aspect-square rounded-lg overflow-hidden ${
                i === idx ? 'ring-2 ring-[var(--color-navy)]' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={src} alt={`Property thumbnail ${i + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
