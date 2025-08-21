'use server';

import { cookies } from 'next/headers';
import { slow } from '@/utils/slow';

export async function someRandomServerFunction(conference?: string | string[], year?: string | string[]) {
  await slow(1500);

  const conferenceValue = Array.isArray(conference) ? conference[0] : conference;
  const yearValue = Array.isArray(year) ? year[0] : year;

  const shouldEasterEgg = yearValue === '2025' && conferenceValue === 'React Universe Conf';

  if (!shouldEasterEgg) {
    return;
  }
  (await cookies()).set('easterEgg', 'true');
}

export async function resetEasterEgg() {
  (await cookies()).set('easterEgg', 'false');
}

export async function hideIntro() {
  (await cookies()).set('hideIntro', 'true');
}
