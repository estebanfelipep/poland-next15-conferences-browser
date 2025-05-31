'use client';

import React, { useTransition } from 'react';
import { logOut } from '@/data/actions/auth';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await logOut();
        });
      }}
      disabled={isPending}
      className="px-2 pb-2 not-disabled:hover:underline disabled:text-gray-500 disabled:italic"
    >
      {isPending ? 'Logging out...' : 'Log out'}
    </button>
  );
}
