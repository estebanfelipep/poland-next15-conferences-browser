import 'server-only';

import { prisma } from '@/db';
import { slow } from '@/utils/slow';
import { getCurrentAccount } from './account';

export async function getContacts() {
  await slow(1500);
  const currentAccount = await getCurrentAccount();

  return prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      accountId: currentAccount?.id,
    },
  });
}
