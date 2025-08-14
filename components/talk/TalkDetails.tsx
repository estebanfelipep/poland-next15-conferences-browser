import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useOptimistic } from 'react';
import { createQueryString } from '@/utils/createQueryString';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import type { Talk } from '@prisma/client';

type Props = {
  talk: Talk | null;
  onClose: () => void;
};

export function TalkDetails({ talk, onClose }: Props) {
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
              {talk.duration && <span className="ml-3">• {talk.duration} min</span>}
            </p>
          </div>
          <Button onClick={onClose} type="button" variant="secondary">
            ← Back to List
          </Button>
        </div>
        <div className="mb-6">
          <p className="text-theme-text-secondary mb-3 text-sm">Click these badges to filter for similar talks:</p>
          <div className="flex flex-wrap gap-3">
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
