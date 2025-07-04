import React from 'react';
import { cn } from '@/utils/cn';

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'hover:border-accent/40 dark:hover:border-accent/40 rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition-all duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900',
        className,
      )}
    >
      {children}
    </div>
  );
}
