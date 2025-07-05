'use client';

import { parseAsString, useQueryState } from 'nuqs';
// import { debounce } from 'nuqs/server';
import React, { Suspense, useDeferredValue } from 'react';
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
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const deferredSearch = useDeferredValue(search);
  const isSearching = search !== deferredSearch;

  return (
    <>
      <div className="relative">
        <input
          value={search}
          placeholder="Search by title, description, speaker, conference, or tag..."
          onChange={e => {
            setSearch(e.target.value, {
              // limitUrlUpdates: e.target.value === '' ? undefined : debounce(500),
              shallow: false,
            });
          }}
          className="pr-10"
        />
        {isSearching && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <Spinner />
          </div>
        )}
      </div>
      <ActiveFilters />
      <Suspense fallback={<TalksListSkeleton />}>
        <TalksList talksPromise={talksPromise} search={deferredSearch} />
      </Suspense>
    </>
  );
}
