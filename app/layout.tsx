import './globals.css';

import { Geist } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Wrapper from '@/components/ui/Wrapper';
import { cn } from '@/utils/cn';
import type { Metadata } from 'next';

const GeistSans = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  description: 'Next.js 15 Conference Explorer using React 19, View Transitions and Prisma',
  title: 'Conference Explorer',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(GeistSans.className, 'mb-12 flex grow flex-col p-4 sm:p-10 xl:px-40 2xl:px-96')}>
        <NuqsAdapter>
          <Toaster position="top-right" />
          <Wrapper>
            <main>{children}</main>
          </Wrapper>
        </NuqsAdapter>
      </body>
    </html>
  );
}
