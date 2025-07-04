'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, {
  startTransition,
  Suspense,
  useDeferredValue,
  useOptimistic,
  unstable_ViewTransition as ViewTransition,
} from 'react';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useOptimistic(searchParams.get('search') || '');
  const deferredSearch = useDeferredValue(search);
  const isSearching = search !== deferredSearch;

  return (
    <>
      <div className="relative">
        <input
          id="talk-search"
          type="search"
          name="talk-search"
          placeholder="Search by title, description, speaker, conference, or tag..."
          value={search}
          onChange={e => {
            startTransition(() => {
              setSearch(e.target.value);
              router.push('?search=' + e.target.value);
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
        <ViewTransition>
          <TalksList talksPromise={talksPromise} search={deferredSearch} />
        </ViewTransition>
      </Suspense>
    </>
  );
}
