'use client';

import React, {
  Suspense,
  useDeferredValue,
  useState,
  unstable_ViewTransition as ViewTransition,
  unstable_Activity as Activity,
} from 'react';
import ContactList, { ContactListSkeleton } from './ContactList';
import type { Contact } from '@prisma/client';

type Props = {
  contactsPromise: Promise<Contact[]>;
};

export default function Contacts({ contactsPromise }: Props) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div className="space-y-4">
      <Activity mode={selectedContact?.id ? 'hidden' : 'visible'}>
        <div className="mb-6">
          <label htmlFor="contact-search" className="mb-2 block font-bold uppercase">
            Search Contacts
          </label>
          <input
            id="contact-search"
            type="search"
            name="contact-search"
            placeholder="Search by name..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
            }}
          />
        </div>
      </Activity>
      <Suspense fallback={<ContactListSkeleton />}>
        <ViewTransition>
          <ContactList
            setSelectedContact={setSelectedContact}
            selectedContact={selectedContact}
            contactsPromise={contactsPromise}
            deferredSearch={deferredSearch}
          />
        </ViewTransition>
      </Suspense>
    </div>
  );
}
