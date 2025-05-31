import React, { useState } from 'react';
import Card from './ui/Card';
import type { Contact } from '@prisma/client';

export default function ContactMessageForm({ contact }: { contact: Contact }) {
  const [message, setMessage] = useState('');

  return (
    <Card>
      <div className="space-y-4">
        <div className="border-divider dark:border-divider-dark border-b pb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white">Send message to {contact.name}</h3>
          {contact.email && <p className="mt-1 text-sm text-gray-500">{contact.email}</p>}
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-bold text-black uppercase dark:text-white">
            Message
          </label>
          <textarea
            value={message}
            onChange={e => {
              return setMessage(e.target.value);
            }}
            id="message"
            rows={6}
            placeholder="Type your message here..."
          />
        </div>
      </div>
    </Card>
  );
}
