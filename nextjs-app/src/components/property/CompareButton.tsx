'use client';

import { Scale } from 'lucide-react';
import { useCompare } from './CompareContext';
import { toast } from 'sonner';
import type { Property } from '@/lib/types';

interface Props {
  property: Property;
  size?: 'sm' | 'md';
}

export function CompareButton({ property, size = 'sm' }: Props) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const active = isInCompare(property.id);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      removeFromCompare(property.id);
      toast.info('Removed from compare');
    } else {
      if (compareList.length >= 3) {
        toast.error('You can compare up to 3 properties');
        return;
      }
      addToCompare(property);
      toast.success('Added to compare');
    }
  };

  const sz = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSz = size === 'sm' ? 14 : 18;

  return (
    <button
      onClick={toggle}
      className={`${sz} rounded-full flex items-center justify-center transition-all shadow-sm ${
        active
          ? 'bg-[var(--color-navy)] text-white'
          : 'bg-white/90 text-gray-600 hover:bg-[var(--color-navy)] hover:text-white'
      }`}
      title={active ? 'Remove from compare' : 'Add to compare'}
    >
      <Scale size={iconSz} />
    </button>
  );
}
