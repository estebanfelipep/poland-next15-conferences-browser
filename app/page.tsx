import { X } from 'lucide-react';
import Link from 'next/link';
import Filters from '@/components/Filters';
import Talks from '@/components/Talks';
import StatusButton from '@/components/ui/StatusButton';
import { getTalks, getTalkFilterOptions } from '@/data/services/talk';
import type { FilterType } from '@/types/filters';

type PageProps = {
  searchParams: Promise<FilterType>;
};

export default async function RootPage({ searchParams }: PageProps) {
  const activeFilters = await searchParams;
  const filterOptions = await getTalkFilterOptions();
  const talks = getTalks(activeFilters);

  return (
    <div className="flex flex-col gap-8">
      <Filters filterOptions={filterOptions} filters={activeFilters} />
      <Talks talksPromise={talks}>
        <ActiveFilters activeFilters={activeFilters} />
      </Talks>
    </div>
  );
}

function ActiveFilters({ activeFilters }: { activeFilters?: FilterType }) {
  const entries = activeFilters
    ? Object.entries(activeFilters).filter(([, value]) => {
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
        <Link href="/?" className="text-sm">
          <StatusButton variant="secondary" type="button">
            <div className="flex items-center gap-2">
              <X width={16} height={16} aria-hidden="true" />
              Clear
            </div>
          </StatusButton>
        </Link>
      </div>
    )
  );
}
