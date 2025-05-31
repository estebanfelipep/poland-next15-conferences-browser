'use client';

import React, { use, useDeferredValue, useState, unstable_ViewTransition as ViewTransition } from 'react';

import Skeleton from './ui/Skeleton';
import type { Contact } from '@prisma/client';

type Props = {
  contactsPromise: Promise<Contact[]>;
};

export default function Contacts({ contactsPromise }: Props) {
  const contacts = use(contactsPromise);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(deferredSearch.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <label htmlFor="contact-search" className="mb-2 block text-sm font-bold uppercase">
          Search Contacts
        </label>
        <input
          id="contact-search"
          type="search"
          placeholder="Search by name..."
          className="border-divider dark:border-divider-dark focus-visible:outline-primary w-full rounded-md border bg-white px-4 py-2 -outline-offset-1 focus-visible:outline-2 dark:bg-black"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map(contact => {
          return (
            <ViewTransition key={contact.id}>
              <div className="border-primary rounded-md border p-4">
                <h3 className="mb-2 text-lg font-semibold">{contact.name}</h3>
                {contact.email && (
                  <p className="text-gray dark:text-gray mb-1 text-sm">
                    <span className="font-medium">Email:</span> {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-gray dark:text-gray mb-1 text-sm">
                    <span className="font-medium">Phone:</span> {contact.phone}
                  </p>
                )}
                {contact.company && (
                  <p className="text-gray dark:text-gray text-sm">
                    <span className="font-medium">Company:</span> {contact.company}
                  </p>
                )}
              </div>
            </ViewTransition>
          );
        })}
      </div>
      {filteredContacts.length === 0 && (
        <div className="text-gray dark:text-gray py-8 text-center">
          No contacts found matching &quot;{deferredSearch}&quot;
        </div>
      )}
    </div>
  );
}

export function ContactsSkeleton() {
  return <Skeleton />;
}
