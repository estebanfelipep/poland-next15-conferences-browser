import React from 'react';
import { cn } from '@/utils/cn';

// Uses only Tailwind theme colors

type BadgeVariant = 'primary' | 'secondary' | 'accent';

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({ children, variant = 'secondary', className }: Props) {
  const variantStyles = {
    accent:
      'bg-accent/20 text-accent hover:bg-accent/40 hover:text-white dark:bg-accent/20 dark:text-accent dark:hover:bg-accent/60 dark:hover:text-white',
    primary:
      'bg-primary/20 text-primary hover:bg-primary/40 hover:text-white dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/60 dark:hover:text-white',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
  };

  return (
    <span
      className={cn(
        'inline-flex cursor-default items-center rounded-full px-2 py-1 text-xs duration-150',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
