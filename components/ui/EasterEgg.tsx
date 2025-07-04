import React from 'react';

export default function EasterEgg() {
  return (
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
          <div className="bg-divider dark:bg-divider-dark mb-2 flex h-36 w-36 items-center justify-center rounded-lg">
            <span className="text-xs text-gray-400 dark:text-gray-600">QR CODE</span>
          </div>
          <div className="text-accent-dark dark:text-accent-light text-lg font-medium">@aurorascharff</div>
        </div>
        <div className="text-accent-dark dark:text-accent-light mt-2 text-lg font-medium">
          <span className="text-accent">Enjoy the party 🎉</span>
        </div>
      </div>
    </div>
  );
}

export function shouldShowEasterEgg(conference?: string, year?: string): boolean {
  return year === '2025' && conference === 'React Universe Conf';
}
