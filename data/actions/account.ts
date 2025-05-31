'use server';

import { cookies } from 'next/headers';
import { toast } from '../utils/toast';

export async function setCurrentAccount(accountId: string) {
  (await cookies()).set('selectedAccountId', accountId);
  await toast.success('Account changed successfully!');
}
