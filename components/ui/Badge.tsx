import React from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'primary' | 'secondary' | 'accent';

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

export default function Badge({ children, variant = 'secondary', className }: Props) {
  const variantStyles = {
    accent: 'bg-accent/20 text-accent dark:bg-accent/20 dark:text-blue-300',
    primary: 'bg-primary/20 text-primary dark:bg-primary/20 dark:text-purple-300',
    secondary: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-1 text-xs', variantStyles[variant], className)}>
      {children}
    </span>
  );
}
