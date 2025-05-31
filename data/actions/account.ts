'use server';

import { cookies } from 'next/headers';

export async function setCurrentAccount(accountId: string) {
  (await cookies()).set('selectedAccountId', accountId);
}
