'use client';

import React, { use } from 'react';
import { setCurrentAccount } from '@/data/actions/account';

import AsyncSelect from './ui/async-select/AsyncSelect';
import type { Account } from '@prisma/client';

type Props = {
  accountsPromise: Promise<Account[]>;
  currentAccountPromise: Promise<Account>;
};

export default function AccountSelector({ accountsPromise, currentAccountPromise }: Props) {
  const accounts = use(accountsPromise);
  const currentAccount = use(currentAccountPromise);

  return (
    <AsyncSelect
      selectAction={async item => {
        await setCurrentAccount(item.value);
      }}
      label="Account"
      options={accounts.map(account => {
        return {
          text: account.name,
          value: account.id,
        };
      })}
      selectedItem={{
        text: currentAccount.name,
        value: currentAccount.id,
      }}
    />
  );
}

export function AccountSelectorSkeleton() {
  return (
    <div className="flex w-fit flex-col">
      <span className="mb-2 font-bold">ACCOUNT</span>
      <button disabled className="border-gray text-gray rounded-2xl border px-4 py-2">
        Loading...
      </button>
    </div>
  );
}
