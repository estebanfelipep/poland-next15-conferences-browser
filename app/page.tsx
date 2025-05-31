import React, { Suspense } from 'react';
import AccountSelector, { AccountSelectorSkeleton } from '@/components/AccountSelector';
import Contacts from '@/components/Contacts';
import LogoutButton from '@/components/LogoutButton';
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
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
          <Suspense fallback={<AccountSelectorSkeleton />}>
            <AccountSelector accountsPromise={accounts} currentAccountPromise={currentAccount} />
          </Suspense>
          <LogoutButton />
        </div>
        <Divider theme="primary" />
        <Contacts contactsPromise={contacts} />
      </div>
    </div>
  );
}
