import React from 'react';
import { cn } from '@/utils/cn';

export default function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(className, 'bg-card dark:bg-card-dark gap-6 rounded-xl p-4 md:px-6 md:py-4')}>{children}</div>
  );
}
