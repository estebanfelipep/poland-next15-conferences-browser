import React, { Suspense } from 'react';

import AccountSelector, { AccountSelectorSkeleton } from '@/components/AccountSelector';
import Contacts, { ContactsSkeleton } from '@/components/Contacts';

import Divider from '@/components/ui/Divider';
import { getAccounts, getCurrentAccount } from '@/data/services/account';
import { getContacts } from '@/data/services/contact';

export default async function RootPage() {
  const accounts = getAccounts();
  const currentAccount = getCurrentAccount();
  const contacts = getContacts();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Suspense fallback={<AccountSelectorSkeleton />}>
            <AccountSelector accountsPromise={accounts} currentAccountPromise={currentAccount} />
          </Suspense>
        </div>
        <Divider theme="primary" />
        <Suspense fallback={<ContactsSkeleton />}>
          <Contacts contactsPromise={contacts} />
        </Suspense>
      </div>
    </div>
  );
}
