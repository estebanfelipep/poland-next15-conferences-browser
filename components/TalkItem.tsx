import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import { cn } from '@/utils/cn';
import { createQueryString } from '@/utils/createQueryString';
import Badge from './ui/Badge';
import Card from './ui/Card';
import type { Talk } from '@prisma/client';

type Props = {
  talk: Talk;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

export default function TalkItem({ talk, isExpanded, onToggleExpand }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    startTransition(() => {
      router.push(`?${createQueryString(searchParams, { name: 'tag', value: tag })}`);
    });
  };

  return (
    <Card
      className={cn('h-full cursor-pointer', isExpanded && 'shadow-primary/20 ring-primary/10 p-8 shadow-xl ring-1')}
    >
      <div
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleExpand();
          }
        }}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${talk.title}`}
        className="h-full"
      >
        <div className={cn('mb-6', isExpanded && 'mb-8')}>
          <h3
            className={cn(
              'mb-3 leading-tight font-semibold text-gray-900 dark:text-white',
              isExpanded ? 'mb-4 text-3xl' : 'text-lg',
            )}
          >
            {talk.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{talk.conference}</span>
            <span>•</span>
            <span>{talk.year}</span>
            <span>•</span>
            <span>{talk.speaker}</span>
          </div>
        </div>
        <div className={cn('space-y-6', isExpanded && 'grid grid-cols-1 gap-8 space-y-0 lg:grid-cols-3')}>
          <div className={cn(isExpanded && 'space-y-6 lg:col-span-2')}>
            {isExpanded && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Details</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TalkDetail label="Speaker" isExpanded={isExpanded}>
                    {talk.speaker}
                  </TalkDetail>
                  <TalkDetail label="Conference" isExpanded={isExpanded}>
                    {talk.conference}
                  </TalkDetail>
                  <TalkDetail label="Year" isExpanded={isExpanded}>
                    {talk.year}
                  </TalkDetail>
                  {talk.duration && (
                    <TalkDetail label="Duration" isExpanded={isExpanded}>
                      {talk.duration} minutes
                    </TalkDetail>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {talk.description && (
              <div className={cn(isExpanded && 'space-y-3')}>
                {isExpanded && <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Description</h4>}
                <p
                  className={cn(
                    'leading-relaxed text-gray-600 dark:text-gray-400',
                    isExpanded ? 'text-base leading-7' : 'mt-3 line-clamp-2 text-sm',
                  )}
                >
                  {talk.description}
                </p>
              </div>
            )}
          </div>
          <div className={cn('space-y-6', isExpanded && 'lg:col-span-1')}>
            {/* Actions */}
            {isExpanded && (
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Actions</h4>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      `${talk.title} by ${talk.speaker} at ${talk.conference} ${talk.year}`,
                    );
                  }}
                  className="w-full border-none bg-transparent p-0 text-left"
                >
                  <Badge variant="secondary" className="w-full justify-center">
                    📋 Copy Details
                  </Badge>
                </button>
              </div>
            )}
            <div className={cn('space-y-3', !isExpanded && 'space-y-2')}>
              {isExpanded && <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Resources</h4>}
              <div className={cn('flex gap-2', isExpanded ? 'flex-col space-y-2' : 'flex-wrap')}>
                {talk.tag && (
                  <button
                    onClick={e => {
                      handleTagClick(e, talk.tag!);
                    }}
                    className="border-none bg-transparent p-0"
                  >
                    <Badge variant="primary" className={cn(isExpanded && 'w-full justify-center')}>
                      {isPending ? '🏷️ Filtering...' : `🏷️ ${talk.tag}`}
                    </Badge>
                  </button>
                )}
                {!isExpanded && talk.duration && <Badge variant="secondary">⏱️ {talk.duration}m</Badge>}
                {talk.videoUrl && (
                  <Link
                    href={talk.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    className={cn(isExpanded && 'block')}
                  >
                    <Badge variant="accent" className={cn(isExpanded && 'w-full justify-center')}>
                      🎥 Watch Video
                    </Badge>
                  </Link>
                )}
                {talk.slides && (
                  <Link
                    href={talk.slides}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    className={cn(isExpanded && 'block')}
                  >
                    <Badge variant="accent" className={cn(isExpanded && 'w-full justify-center')}>
                      📊 View Slides
                    </Badge>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function TalkDetail({
  label,
  children,
  isExpanded = false,
}: {
  label: string;
  children: React.ReactNode;
  isExpanded?: boolean;
}) {
  return (
    <div
      className={cn('text-gray-700 dark:text-gray-300', isExpanded && 'rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50')}
    >
      <span className="mb-1 block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-gray-900 dark:text-gray-100">{children}</span>
    </div>
  );
}
