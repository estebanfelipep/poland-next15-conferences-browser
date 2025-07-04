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

  return (
    <button
      disabled={isSubmitting || disabled}
      type={type}
      className={cn(
        'focus-visible:outline-primary rounded-md border px-4 py-2 -outline-offset-1 focus-visible:outline-2',
        variant === 'primary'
          ? 'bg-primary border-primary enabled:hover:bg-primary-dark disabled:bg-primary-darker text-white'
          : 'border-divider disabled:bg-divider dark:enabled:hover:bg-card-dark enabled:hover:bg-card disabled:dark:bg-divider-dark bg-white text-black dark:bg-black dark:text-white',
        className,
      )}
      {...otherProps}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2">
          {children}
          <Spinner
            className={variant === 'primary' ? 'text-white' : 'text-black dark:text-white'}
            width={16}
            height={16}
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
