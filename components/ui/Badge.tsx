import React from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'primary' | 'secondary' | 'accent';

type Props = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export default function Badge({ children, variant = 'secondary', className, onClick, disabled }: Props) {
  const variantStyles = {
    accent:
      'bg-accent/20 text-accent hover:bg-accent/40 hover:text-white dark:bg-accent/20 dark:text-white dark:hover:bg-accent/60 dark:hover:text-white',
    primary:
      'bg-primary/20 text-primary hover:bg-primary/40 hover:text-white dark:bg-primary/20 dark:text-white dark:hover:bg-primary/60 dark:hover:text-white',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
  };

  const Component = onClick ? 'button' : 'span';

  return (
    <Component
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs duration-150',
        onClick && !disabled ? 'cursor-pointer' : 'cursor-default',
        disabled ? 'opacity-50' : variantStyles[variant],
        !disabled && variantStyles[variant],
        className,
      )}
    >
      {children}
    </Component>
  );
}
