'use client';

import React, { Suspense, useDeferredValue, useState, unstable_ViewTransition as ViewTransition } from 'react';
import type { FilterType } from '@/types/filters';
import ActiveFilters from './ActiveFilters';
import TalksList, { TalksListSkeleton } from './TalksList';
import Spinner from './ui/Spinner';

import type { Talk } from '@prisma/client';

type Props = {
  talksPromise: Promise<Talk[]>;
  activeFilters?: FilterType;
};

export default function Talks({ talksPromise }: Props) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const isSearching = search !== deferredSearch;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <input
          id="talk-search"
          type="search"
          name="talk-search"
          placeholder="Search by title, speaker, conference, or tag..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
          }}
        />
        {isSearching && <Spinner />}
      </div>
      <ActiveFilters />
      <Suspense fallback={<TalksListSkeleton />}>
        <ViewTransition>
          <TalksList talksPromise={talksPromise} deferredSearch={deferredSearch} />
        </ViewTransition>
      </Suspense>
    </>
  );
}
