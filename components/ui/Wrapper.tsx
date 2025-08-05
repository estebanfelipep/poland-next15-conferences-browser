import { cookies } from 'next/headers';
import Image from 'next/image';
import React from 'react';
import { resetEasterEgg } from '@/data/actions/cookie';
import StatusButton from './Button';
import type { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default async function Wrapper({ children }: Props) {
  const shouldShowEasterEgg = (await cookies()).get('easterEgg')?.value === 'true';

  return (
    <>
      {children}
      {shouldShowEasterEgg && (
        <div className="bg-card/90 dark:bg-card-dark/90 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="dark:bg-card-dark border-primary relative flex flex-col items-center rounded-3xl border-4 bg-white px-8 py-10 shadow-2xl">
            <span className="animate-spin-slow text-accent absolute -top-8 left-1/2 -translate-x-1/2 text-5xl select-none">
              🎊
            </span>
            <span className="text-primary-dark dark:text-primary mb-4 animate-bounce text-6xl select-none">🕺</span>
            <div className="text-primary-dark dark:text-primary mb-2 text-center text-2xl font-extrabold md:text-4xl">
              Thank you
              <br />
              <span className="bg-primary dark:bg-primary-dark bg-clip-text text-transparent">
                React Universe Conf 2025
              </span>
            </div>
            <div className="my-4 flex flex-col items-center">
              <div className="bg-divider dark:bg-divider-dark border-primary-dark dark:border-primary mb-2 flex h-36 w-36 items-center justify-center rounded-xl border-4 shadow-lg">
                <Image priority src={'/qr-code.png'} alt="QR Code" width={144} height={144} className="rounded-lg" />
              </div>
              <div className="text-accent-dark dark:text-accent-light text-lg font-medium">@aurorascharff</div>
            </div>
            <div className="text-accent-dark dark:text-accent-light mt-2 text-lg font-medium">
              <span className="text-accent">Enjoy the party 🎉</span>
            </div>
            <form action={resetEasterEgg} className="mt-6">
              <StatusButton>Return</StatusButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
