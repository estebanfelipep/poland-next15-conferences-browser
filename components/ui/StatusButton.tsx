'use client';

import { useLinkStatus } from 'next/link';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/utils/cn';
import Spinner from './Spinner';

type Props = {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
};

export default function StatusButton({
  children,
  loading,
  type = 'submit',
  variant = 'primary',
  className,
  disabled,
  ...otherProps
}: Props & React.HTMLProps<HTMLButtonElement>) {
  const { pending: pendingFormSubmit } = useFormStatus();
  const { pending: pendingNavigate } = useLinkStatus();
  const isSubmitting = pendingNavigate || pendingFormSubmit || loading;

  const baseStyles = 'rounded-lg px-4 py-2 focus-visible:-outline-offset-4 enabled:focus-visible:outline';

  const variantStyles = {
    primary:
      'bg-primary hover:bg-primary-dark disabled:bg-primary-darker text-white enabled:focus-visible:outline-white shadow-md',
    secondary:
      'border border-gray-300 hover:bg-gray-50 disabled:bg-gray-100/30 text-gray-700 hover:text-gray-900 enabled:focus-visible:outline-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-100 dark:enabled:focus-visible:outline-gray-500',
  };

  return (
    <button
      disabled={isSubmitting || disabled}
      type={type}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...otherProps}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2">
          {children}
          <Spinner className={variant === 'primary' ? 'text-white' : 'text-gray-700'} width={16} height={16} />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
