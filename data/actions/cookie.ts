'use server';

import { cookies } from 'next/headers';
import { slow } from '@/utils/slow';

export async function someRandomServerFunction(
  conference?: { label: string; value: string }[] | string | string[],
  year?: { label: string; value: string }[] | string | string[],
) {
  await slow(1500);

  let conferenceValue: string | undefined;
  if (Array.isArray(conference)) {
    if (conference.length > 0 && typeof conference[0] === 'object' && 'value' in conference[0]) {
      conferenceValue = (conference as { label: string; value: string }[])[conference.length - 1]?.value;
    } else {
      conferenceValue = (conference as string[])[conference.length - 1];
    }
  } else {
    conferenceValue = conference as string;
  }

  let yearValue: string | undefined;
  if (Array.isArray(year)) {
    if (year.length > 0 && typeof year[0] === 'object' && 'value' in year[0]) {
      yearValue = (year as { label: string; value: string }[])[year.length - 1]?.value;
    } else {
      yearValue = (year as string[])[year.length - 1];
    }
  } else {
    yearValue = year as string;
  }

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
