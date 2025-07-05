import React from 'react';
import { cn } from '@/utils/cn';

export type Props = {
  children?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
};

export default function SelectButton({
  children,
  className,
  type = 'button',
  variant = 'primary',
  ...otherProps
}: Props & React.HTMLProps<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cn(
        variant === 'secondary' &&
          'hover:bg-card hover:dark:bg-card-dark focus-visible:outline-primary bg-white focus-visible:outline-2 focus-visible:-outline-offset-1 dark:bg-black dark:text-white',
        variant === 'primary' &&
          'bg-primary hover:bg-primary-dark aria-expanded:hover:bg-card dark:aria-expanded:hover:bg-card-dark aria-expanded:focus-visible:outline-primary text-white focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-white aria-expanded:bg-white aria-expanded:text-black aria-expanded:focus-visible:outline-2 aria-expanded:focus-visible:-outline-offset-1 dark:aria-expanded:bg-black dark:aria-expanded:text-white',
        'border-primary justify-between rounded-2xl border px-3 py-1 shadow-sm outline-offset-1 sm:px-4 sm:py-2',
        className,
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
}
