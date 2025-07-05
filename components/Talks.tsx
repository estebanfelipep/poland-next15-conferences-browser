'use client';

import { parseAsString, useQueryState } from 'nuqs';
import React, { Suspense, useDeferredValue } from 'react';
import type { FilterType } from '@/types/filters';
import TalksList, { TalksListSkeleton } from './TalksList';
import SearchField from './ui/SearchField';
import type { Talk } from '@prisma/client';

type Props = {
  talksPromise: Promise<Talk[]>;
  activeFilters?: FilterType;
  children?: React.ReactNode;
};

export default function Talks({ talksPromise, children }: Props) {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const deferredSearch = useDeferredValue(search);
  const isSearching = search !== deferredSearch;

  return (
    <>
      <SearchField
        value={search}
        name="search"
        isSearching={isSearching}
        placeholder="Search by title, description, speaker, conference, or tag..."
        onChange={e => {
          setSearch(e.currentTarget.value);
        }}
      />
      {children}
      <Suspense fallback={<TalksListSkeleton />}>
        <TalksList talksPromise={talksPromise} search={deferredSearch} />
      </Suspense>
    </>
  );
}
