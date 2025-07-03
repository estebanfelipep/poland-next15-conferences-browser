'use client';

import React, { Suspense, useDeferredValue, useState, unstable_ViewTransition as ViewTransition } from 'react';
import TalksList, { TalksListSkeleton } from './TalksList';
import type { Talk } from '@prisma/client';

type Props = {
  talksPromise: Promise<Talk[]>;
};

export default function Talks({ talksPromise }: Props) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedTalk, setSelectedTalk] = useState<Talk | null>(null);

  return (
    <div className="space-y-4">
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
      <Suspense fallback={<TalksListSkeleton />}>
        <ViewTransition>
          <TalksList
            setSelectedTalk={setSelectedTalk}
            selectedTalk={selectedTalk}
            talksPromise={talksPromise}
            deferredSearch={deferredSearch}
          />
        </ViewTransition>
      </Suspense>
    </div>
  );
}
