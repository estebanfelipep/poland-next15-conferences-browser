'use client';

import RouterSelect from '@/components/ui/RouterSelect';
import type { FilterOptions, FilterType } from '@/types/filters';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filter({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        <RouterSelect
          name="year"
          label="Year"
          value={year || 'All Years'}
          options={['All Years', ...filterOptions.years]}
        />
        <RouterSelect name="tag" label="Tag" value={tag || 'All Tags'} options={['All Tags', ...filterOptions.tags]} />
        <RouterSelect
          name="conference"
          label="Conference"
          value={conference || 'All Conferences'}
          options={['All Conferences', ...filterOptions.conferences]}
        />
        <RouterSelect
          name="speaker"
          label="Speaker"
          value={speaker || 'All Speakers'}
          options={['All Speakers', ...filterOptions.speakers]}
        />
      </div>
    </div>
  );
}
