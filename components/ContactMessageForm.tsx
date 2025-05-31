import React, { useState } from 'react';
import Card from './ui/Card';
import type { Contact } from '@prisma/client';

export default function ContactMessageForm({ contact }: { contact: Contact }) {
  const [message, setMessage] = useState('');

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <div className="text-lg font-semibold">Send message to {contact.name}</div>
          {contact.email && <p className="mt-1 text-sm text-gray-500">{contact.email}</p>}
        </div>
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-bold uppercase">
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
