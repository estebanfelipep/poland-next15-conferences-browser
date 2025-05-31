import { Mail } from 'lucide-react';
import React, { startTransition, use, unstable_ViewTransition as ViewTransition } from 'react';
import MessageForm from './MessageForm';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import type { Contact } from '@prisma/client';

type Props = {
  contactsPromise: Promise<Contact[]>;
  deferredSearch: string;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
};

export default function ContactList({ contactsPromise, deferredSearch, selectedContact, setSelectedContact }: Props) {
  const contacts = use(contactsPromise);
  const filteredContacts = contacts.filter(contact => {
    return contact.name.toLowerCase().includes(deferredSearch.toLowerCase());
  });

  return (
    <>
      {selectedContact ? (
        <>
          <button
            onClick={() => {
              startTransition(() => {
                setSelectedContact(null);
              });
            }}
            className="mb-4 text-sm font-semibold hover:underline"
          >
            &larr; Back to contacts
          </button>
          <MessageForm contact={selectedContact} />
        </>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map(contact => {
            return (
              <ViewTransition key={contact.id}>
                <Card>
                  <div className="relative">
                    <button
                      onClick={() => {
                        startTransition(() => {
                          setSelectedContact(contact);
                        });
                      }}
                      className="hover:bg-gray absolute top-0 right-0 cursor-pointer gap-2 rounded-full bg-black p-2 text-white dark:bg-white dark:text-black"
                    >
                      <span className="sr-only">Send message</span>
                      <Mail aria-hidden="true" width={16} height={16} />
                    </button>
                    <h3 className="mb-4 pr-12 text-lg font-semibold">{contact.name}</h3>
                    {contact.email && (
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-medium">EMAIL:</span> {contact.email}
                      </p>
                    )}
                    {contact.phone && (
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-medium">PHONE:</span> {contact.phone}
                      </p>
                    )}
                    {contact.company && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">COMPANY:</span> {contact.company}
                      </p>
                    )}
                  </div>
                </Card>
              </ViewTransition>
            );
          })}
        </div>
      )}
      {filteredContacts.length === 0 && (
        <div className="text-gray dark:text-gray py-8 text-center">
          No contacts found matching &quot;{deferredSearch}&quot;
        </div>
      )}
    </>
  );
}

export function ContactListSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
