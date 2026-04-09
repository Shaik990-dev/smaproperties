import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BadgeColor = 'hot' | 'new' | 'ready' | 'default';

const colorClasses: Record<BadgeColor, string> = {
  hot: 'bg-red-500 text-white',
  new: 'bg-amber-400 text-gray-900',
  ready: 'bg-violet-500 text-white',
  default: 'bg-blue-500 text-white'
};

export function Badge({
  color = 'default',
  children,
  className
}: {
  color?: BadgeColor;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide',
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  );
}
