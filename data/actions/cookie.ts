'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { slow } from '@/utils/slow';

export async function someRandomServerFunction(conference?: string, year?: string) {
  await slow(2000);
  const shouldEasterEgg = year === '2025' && conference === 'React Universe Conf';

  if (!shouldEasterEgg) {
    return;
  }
  (await cookies()).set('easterEgg', 'true');
  redirect('/');
}

export async function resetEasterEgg() {
  (await cookies()).set('easterEgg', 'false');
}
