import Link from 'next/link';
import { useQueryState } from 'nuqs';
import React, { useTransition, unstable_ViewTransition as ViewTransition } from 'react';
import Badge from './ui/Badge';
import Card from './ui/Card';
import type { Talk } from '@prisma/client';

type Props = {
  talk: Talk;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

export default function TalkItem({ talk, isExpanded, onToggleExpand }: Props) {
  const [, setTagQuery] = useQueryState('tag');
  const [isPending, startTransition] = useTransition();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    startTransition(() => {
      setTagQuery(tag, { shallow: false });
    });
  };
  return (
    <ViewTransition name={`talk-${talk.id}`}>
      <Card className={`h-full ${isExpanded ? 'z-10 scale-110 shadow-2xl' : 'scale-100'}`}>
        <div
          className="flex h-full w-full cursor-pointer flex-col p-0 text-left"
          onClick={onToggleExpand}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              onToggleExpand();
            }
          }}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${talk.title}`}
        >
          <div className="flex-1">
            <h3 className={`mb-4 font-semibold text-black dark:text-white ${isExpanded ? 'text-xl' : 'text-lg'}`}>
              {talk.title}
            </h3>

            <div className="text-gray dark:text-gray mb-4 space-y-1 text-sm">
              <p>
                <span className="font-medium">Speaker:</span> {talk.speaker}
              </p>
              <p>
                <span className="font-medium">Conference:</span> {talk.conference}
              </p>
              <p>
                <span className="font-medium">Year:</span> {talk.year}
              </p>
              {isExpanded && talk.duration && (
                <p>
                  <span className="font-medium">Duration:</span> {talk.duration} minutes
                </p>
              )}
            </div>
            {talk.description && (
              <p className={`text-gray dark:text-gray mb-4 text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
                {talk.description}
              </p>
            )}
            {isExpanded && (
              <div className="mb-4 space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(
                        `${talk.title} by ${talk.speaker} at ${talk.conference} ${talk.year}`,
                      );
                    }}
                    className="border-none bg-transparent p-0"
                  >
                    <Badge variant="secondary">📋 Copy</Badge>
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {talk.tag && (
                <button
                  onClick={e => {
                    handleTagClick(e, talk.tag!);
                  }}
                  className="border-none bg-transparent p-0"
                >
                  <Badge variant="primary">{isPending ? '🏷️ Filtering...' : `🏷️ ${talk.tag}`}</Badge>
                </button>
              )}
              {talk.duration && <Badge variant="secondary">⏱️ {talk.duration}m</Badge>}
              {talk.videoUrl && (
                <Link
                  href={talk.videoUrl}
                  target="_blank"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <Badge variant="accent">🎥 Video</Badge>
                </Link>
              )}
              {talk.slides && (
                <Link
                  href={talk.slides}
                  target="_blank"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                >
                  <Badge variant="accent">📊 Slides</Badge>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    </ViewTransition>
  );
}
