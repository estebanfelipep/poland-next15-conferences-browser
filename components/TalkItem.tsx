'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';

import { createQueryString } from '@/utils/createQueryString';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';
import type { Talk } from '@prisma/client';

type MinimizedTalkProps = {
  talk: Talk;
  onSelect: () => void;
  isExpanded: boolean;
};

export function MinimizedTalk({ talk, onSelect, isExpanded }: MinimizedTalkProps) {
  return (
    <Card className="hover:shadow-primary/25 h-full w-full transition-all hover:shadow-lg">
      <button onClick={onSelect} className="flex h-full w-full flex-col text-left">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-theme-text mb-2 text-lg leading-tight font-semibold">{talk.title}</h3>
            <p className="text-theme-text-secondary text-sm">
              by <span className="font-medium">{talk.speaker}</span>
            </p>
          </div>
          {!isExpanded && (
            <span className="bg-theme-accent shrink-0 rounded-full px-3 py-1 text-xs font-medium text-white">
              Expand
            </span>
          )}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary">{talk.conference}</Badge>
          {talk.tag && <Badge variant="primary">{talk.tag}</Badge>}
          {talk.videoUrl && <Badge variant="accent">🎥 Video</Badge>}
          {talk.slides && <Badge variant="accent">📊 Slides</Badge>}
          {talk.duration && <Badge variant="secondary">{talk.duration}m</Badge>}
        </div>
        <p className="text-theme-text-secondary line-clamp-3 flex-1 text-sm">{talk.description}</p>
      </button>
    </Card>
  );
}

type ExpandedTalkProps = {
  talk: Talk | null;
  onClose: () => void;
};

export function ExpandedTalk({ talk, onClose }: ExpandedTalkProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useOptimistic<string | null>(null);

  const handleFilter = (filterType: string, value: string) => {
    const filterKey = `${filterType}:${value}`;
    startTransition(() => {
      setActiveFilter(filterKey);
      const queryString = createQueryString(searchParams, { name: filterType, value });
      router.push(`/?${queryString}`);
    });
  };

  if (!talk) return null;

  return (
    <Card className="shadow-primary/25 w-full shadow-lg">
      <div className="p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-theme-text mb-2 text-3xl font-bold">{talk.title}</h1>
            <p className="text-theme-text-secondary text-lg">
              by <span className="font-semibold">{talk.speaker}</span>
            </p>
          </div>
          <Button onClick={onClose} type="button" variant="secondary">
            ← Back to List
          </Button>
        </div>
        <div className="mb-6 flex flex-wrap gap-3">
          <Badge
            disabled={isPending && activeFilter === `conference:${talk.conference}`}
            variant="secondary"
            onClick={() => {
              handleFilter('conference', talk.conference);
            }}
          >
            {isPending && activeFilter === `conference:${talk.conference}` ? 'Filtering...' : talk.conference}
          </Badge>
          <Badge
            disabled={isPending && activeFilter === `year:${talk.year}`}
            variant="accent"
            onClick={() => {
              handleFilter('year', talk.year.toString());
            }}
          >
            {isPending && activeFilter === `year:${talk.year}` ? 'Filtering...' : talk.year}
          </Badge>
          {talk.tag && (
            <Badge
              disabled={isPending && activeFilter === `tag:${talk.tag}`}
              variant="primary"
              onClick={() => {
                handleFilter('tag', talk.tag!);
              }}
            >
              {isPending && activeFilter === `tag:${talk.tag}` ? 'Filtering...' : talk.tag}
            </Badge>
          )}
          {talk.duration && <Badge variant="secondary">{talk.duration} min</Badge>}
        </div>
        {talk.description && (
          <div className="mb-8">
            <h2 className="text-theme-text mb-3 text-xl font-semibold">Description</h2>
            <p className="text-theme-text-secondary leading-relaxed">{talk.description}</p>
          </div>
        )}
        <div className="mb-8">
          <h2 className="text-theme-text mb-3 text-xl font-semibold">Resources</h2>
          <div className="flex flex-wrap gap-3">
            {talk.videoUrl && (
              <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Badge variant="accent" className="w-full justify-center">
                  🎥 Watch Video
                </Badge>
              </a>
            )}
            {talk.slides && (
              <a href={talk.slides} target="_blank" rel="noopener noreferrer" className="inline-block">
                <Badge variant="accent" className="w-full justify-center">
                  📊 View Slides
                </Badge>
              </a>
            )}
            {!talk.videoUrl && !talk.slides && (
              <p className="text-theme-text-secondary text-sm">No resources available for this talk.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
