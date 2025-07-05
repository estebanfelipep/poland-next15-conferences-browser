'use client';

import React, { Suspense, useDeferredValue, useState } from 'react';
import type { TalksResult } from '@/types/talk';
import TalksList, { TalksListSkeleton } from './TalksList';
import SearchField from './ui/SearchField';

type Props = {
  talksPromise: Promise<TalksResult>;
  children?: React.ReactNode;
};

export default function Talks({ talksPromise, children }: Props) {
  const [search, setSearch] = useState('');
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
