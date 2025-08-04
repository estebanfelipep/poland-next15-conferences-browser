'use client';

import { useSearchParams } from 'next/navigation';
import React, { startTransition, use } from 'react';
import ViewTransition from '@/components/ui/ViewTransition';
import { getTalksAction } from '@/data/actions/talk';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { TalksResult } from '@/types/talk';
import TalkItem from './TalkItem';
import Skeleton from './ui/Skeleton';
import Spinner from './ui/Spinner';
import type { Talk } from '@prisma/client';

type Props = {
  talksPromise: Promise<TalksResult>;
  search: string;
};

export default function TalksList({ talksPromise, search }: Props) {
  const searchParams = useSearchParams();
  const activeFilters = Object.fromEntries(searchParams.entries());
  const { talks: initialTalks, totalPages } = use(talksPromise);
  const normalizedSearch = search.trim().toLowerCase();
  const [expandedTalkId, setExpandedTalkId] = React.useState<string | null>(null);

  const {
    data: talks,
    ref,
    pageNumber,
    loading,
  } = useInfiniteScroll<Talk>(
    initialTalks,
    async () => {
      const talksResult = await getTalksAction(activeFilters, pageNumber + 1);
      return talksResult.talks;
    },
    totalPages,
  );

  const filteredTalks = talks.filter(talk => {
    return (
      talk.title.toLowerCase().includes(normalizedSearch) ||
      talk.speaker.toLowerCase().includes(normalizedSearch) ||
      talk.conference.toLowerCase().includes(normalizedSearch) ||
      (talk.tag && talk.tag.toLowerCase().includes(normalizedSearch))
    );
  });

  return (
    <ViewTransition key={search}>
      <div
        className={`grid gap-6 ${expandedTalkId ? 'sm:grid-cols-1 lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
      >
        {filteredTalks.map(talk => {
          const isExpanded = expandedTalkId === talk.id;
          return (
            <div key={talk.id} className={isExpanded ? 'sm:col-span-1 lg:col-span-2' : ''}>
              <ViewTransition name={`talk-${talk.id}`}>
                <TalkItem
                  talk={talk}
                  isExpanded={isExpanded}
                  onToggleExpand={() => {
                    startTransition(() => {
                      setExpandedTalkId(isExpanded ? null : talk.id);
                    });
                  }}
                />
              </ViewTransition>
            </div>
          );
        })}
      </div>
      {filteredTalks.length === 0 && (
        <div className="py-16 text-center text-gray-500 dark:text-gray-400">
          <div className="mb-3 text-5xl">🔍</div>
          <p className="mb-2 text-xl">No talks found</p>
          <p className="text-sm">Try adjusting your filters or search terms</p>
        </div>
      )}
      <div className="flex h-5 justify-center pt-5" ref={ref}>
        {loading && <Spinner />}
      </div>
    </ViewTransition>
  );
}

export function TalksListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
}
