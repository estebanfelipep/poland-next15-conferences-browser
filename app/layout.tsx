import './globals.css';

import { Geist } from 'next/font/google';
import React, { unstable_ViewTransition as ViewTransition } from 'react';
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
        <Toaster position="top-right" />
        <ViewTransition>
          <Wrapper>
            <main>{children}</main>
          </Wrapper>
        </ViewTransition>
      </body>
      {/* 
      React Scan automatically detects performance issues in your React app.
      https://github.com/aidenybai/react-scan
      Comment in the script below tob debug React re-renders in the browser
      */}
      {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" async /> */}
    </html>
  );
}
