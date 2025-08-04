import Link from 'next/link';
import { useQueryState } from 'nuqs';
import React, { useTransition } from 'react';
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
    <Card className={`h-full ${isExpanded ? 'shadow-primary/25 shadow-2xl' : ''}`}>
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
      >
        <h3
          className={`mb-4 leading-tight font-semibold text-gray-900 dark:text-white ${isExpanded ? 'text-xl' : 'text-lg'}`}
        >
          {talk.title}
        </h3>
        <div className="mb-4 space-y-2 text-sm">
          <TalkDetail label="Speaker">{talk.speaker}</TalkDetail>
          <TalkDetail label="Conference">{talk.conference}</TalkDetail>
          <TalkDetail label="Year">{talk.year}</TalkDetail>
          {isExpanded && talk.duration && <TalkDetail label="Duration">{talk.duration} minutes</TalkDetail>}
        </div>
        {isExpanded && (
          <div className="mb-4">
            <button
              onClick={e => {
                e.stopPropagation();
                navigator.clipboard.writeText(`${talk.title} by ${talk.speaker} at ${talk.conference} ${talk.year}`);
              }}
              className="border-none bg-transparent p-0"
            >
              <Badge variant="secondary">📋 Copy</Badge>
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
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
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <Badge variant="accent">📊 Slides</Badge>
            </Link>
          )}
        </div>

        {talk.description && (
          <p
            className={`mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400 ${isExpanded ? '' : 'line-clamp-2'}`}
          >
            {talk.description}
          </p>
        )}
      </div>
    </Card>
  );
}

function TalkDetail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-gray-700 dark:text-gray-300">
      <span className="text-gray-900 dark:text-gray-100">{label}:</span> {children}
    </p>
  );
}
