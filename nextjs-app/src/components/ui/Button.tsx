import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'amber' | 'ghost' | 'whatsapp' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-light)]',
  amber: 'bg-[var(--color-amber)] text-gray-900 hover:bg-[var(--color-amber-light)] shadow-lg shadow-amber-500/20',
  ghost: 'border-2 border-white/40 text-white hover:bg-white/10',
  whatsapp: 'bg-[var(--color-wa)] text-white hover:opacity-90',
  outline: 'border border-gray-300 text-gray-800 hover:bg-gray-50'
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base'
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className || ''
      )}
      {...props}
    >
      {children}
    </button>
  );
}
