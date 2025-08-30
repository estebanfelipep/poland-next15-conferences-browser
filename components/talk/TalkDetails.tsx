import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useOptimistic } from 'react';
import { createQueryString } from '@/utils/createQueryString';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import type { Talk } from '@prisma/client';
import type { Route } from 'next';

type Props = {
  talk: Talk | null;
  onClose?: () => void;
  closeAction?: () => void | Promise<void>;
};

export function TalkDetails({ talk, onClose, closeAction }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useOptimistic<string | null>(null);

  const handleFilter = (filterType: string, value: string) => {
    const filterKey = `${filterType}:${value}`;
    startTransition(() => {
      setActiveFilter(filterKey);
      const queryString = createQueryString(searchParams, { name: filterType, value });
      router.push(`${queryString}` as Route);
    });
  };

  if (!talk) return null;

  return (
    <Card className="shadow-primary/25 w-full p-4 shadow-lg sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-theme-text mb-2 text-2xl font-bold break-words sm:text-3xl">{talk.title}</h1>
          <p className="text-theme-text-secondary text-base sm:text-lg">
            by <span className="font-semibold">{talk.speaker}</span>
            {talk.duration && <span className="ml-3">• {talk.duration} min</span>}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            onClick={() => {
              onClose?.();
              startTransition(async () => {
                await closeAction?.();
              });
            }}
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            ← Back to List
          </Button>
        </div>
      </div>
      <div className="mb-6">
        <p className="text-theme-text-secondary mb-3 text-sm">Filter for similar talks:</p>
        <div className="flex flex-wrap gap-2 sm:gap-3">
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
        </div>
      </div>
      {(talk.longDescription || talk.description) && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-theme-text mb-3 text-lg font-semibold sm:text-xl">Description</h2>
          <div className="text-theme-text-secondary text-sm leading-relaxed sm:text-base">
            {talk.longDescription ? (
              <div className="whitespace-pre-line">{talk.longDescription}</div>
            ) : (
              <p>{talk.description}</p>
            )}
          </div>
        </div>
      )}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-theme-text mb-3 text-lg font-semibold sm:text-xl">Resources</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
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
    </Card>
  );
}
