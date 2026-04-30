'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { trackPropertyView, getPropertyViewsToday } from '@/lib/visitors';

export function PropertyViewCounter({ propertyId }: { propertyId: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await trackPropertyView(propertyId);
      const c = await getPropertyViewsToday(propertyId);
      if (!cancelled) setCount(c);
    })();
    return () => { cancelled = true; };
  }, [propertyId]);

  if (count === null || count < 2) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
      <Eye size={12} />
      {count} {count === 1 ? 'person' : 'people'} viewed today
    </span>
  );
}
