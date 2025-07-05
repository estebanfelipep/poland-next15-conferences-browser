'use server';

import { cookies } from 'next/headers';
import { slow } from '@/utils/slow';

export async function someRandomServerFunction(conference?: string, year?: string) {
  await slow(1500);
  const shouldEasterEgg = year === '2025' && conference === 'React Universe Conf';

  if (!shouldEasterEgg) {
    return;
  }
  (await cookies()).set('easterEgg', 'true');
}

export async function resetEasterEgg() {
  (await cookies()).set('easterEgg', 'false');
}
