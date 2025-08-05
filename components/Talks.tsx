'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, {
  Suspense,
  useDeferredValue,
  useState,
  useTransition,
  unstable_ViewTransition as ViewTransition,
} from 'react';
import type { TalksResult } from '@/types/talk';
import TalksList, { TalksListSkeleton } from './TalksList';
import Button from './ui/Button';
import SearchField from './ui/SearchField';

type Props = {
  talksPromise: Promise<TalksResult>;
};

export default function Talks({ talksPromise }: Props) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const isSearching = search !== deferredSearch;
  const searchParams = useSearchParams();

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
      <ActiveFilters />
      <Suspense
        fallback={
          <ViewTransition exit="slide-down">
            <TalksListSkeleton />
          </ViewTransition>
        }
      >
        <ViewTransition key={searchParams.toString()} enter="slide-up" exit="slide-down">
          <TalksList talksPromise={talksPromise} search={deferredSearch} />
        </ViewTransition>
      </Suspense>
    </>
  );
}

function ActiveFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const entries = searchParams
    ? Array.from(searchParams.entries()).filter(([, value]) => {
        return value && value.trim() !== '';
      })
    : [];

  return (
    entries.length > 0 && (
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {entries.map(([key, value]) => {
            return (
              <span
                key={key}
                className="bg-primary/20 text-primary inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium"
              >
                <span className="capitalize">{key}: </span> <span>{value}</span>
              </span>
            );
          })}
        </div>
        <Button
          loading={isPending}
          onClick={() => {
            startTransition(() => {
              router.push('/?');
            });
          }}
          variant="secondary"
          type="button"
        >
          <div className="flex items-center gap-2">
            <X width={16} height={16} aria-hidden="true" />
            Clear
          </div>
        </Button>
      </div>
    )
  );
}
