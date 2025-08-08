'use client';

import { useSearchParams } from 'next/navigation';
import React, { startTransition, use, useRef, useState, unstable_ViewTransition as ViewTransition } from 'react';
import { getTalksAction } from '@/data/actions/talk';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { TalksResult } from '@/types/talk';
import { cn } from '@/utils/cn';
import { ExpandedTalk, MinimizedTalk } from './TalkItem';
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
  const [expandedTalkId, setExpandedTalkId] = useState<string | null>(null);
  const scrollPositionRef = useRef<number>(0);

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

  return expandedTalkId ? (
    <ViewTransition enter="slide-in" name={`talk-${expandedTalkId}`}>
      <ExpandedTalk
        talk={
          filteredTalks.find(talk => {
            return talk.id === expandedTalkId;
          }) || null
        }
        onClose={() => {
          startTransition(() => {
            setExpandedTalkId(null);
            setTimeout(() => {
              window.scrollTo({ behavior: 'smooth', top: scrollPositionRef.current });
            }, 100);
          });
        }}
      />
    </ViewTransition>
  ) : (
    <>
      <div suppressHydrationWarning className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {filteredTalks.map(talk => {
          const isExpanded = expandedTalkId === talk.id;
          return (
            <div
              key={talk.id}
              className={cn(
                'col-span-1',
                isExpanded && 'z-10 col-span-2 rounded-2xl bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-2xl',
              )}
            >
              <ViewTransition name={`talk-${talk.id}`}>
                <MinimizedTalk
                  talk={talk}
                  onSelect={() => {
                    scrollPositionRef.current = window.scrollY;
                    startTransition(() => {
                      setExpandedTalkId(talk.id);
                    });
                  }}
                  isExpanded={isExpanded}
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
    </>
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
