'use client';

import { useOptimistic } from 'react';
import RouterSelect from '@/components/ui/RouterSelect';
import type { FilterOptions, FilterType } from '@/types/filters';
import Spinner from './ui/Spinner';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filter({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;
  const [isLoading, setLoading] = useOptimistic(false, () => {
    return true;
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        <RouterSelect
          name="year"
          label="Year"
          selectAction={setLoading}
          value={{ id: year || '', text: year || 'All Years' }}
          options={[{ id: '', text: 'All Years' }, ...filterOptions.years]}
        />
        <RouterSelect
          name="tag"
          label="Tag"
          selectAction={setLoading}
          value={{ id: tag || '', text: tag || 'All Tags' }}
          options={[{ id: '', text: 'All Tags' }, ...filterOptions.tags]}
        />
        <RouterSelect
          name="conference"
          label="Conference"
          selectAction={setLoading}
          value={{ id: conference || '', text: conference || 'All Conferences' }}
          options={[{ id: '', text: 'All Conferences' }, ...filterOptions.conferences]}
        />
        <RouterSelect
          name="speaker"
          label="Speaker"
          selectAction={setLoading}
          value={{ id: speaker || '', text: speaker || 'All Speakers' }}
          options={[{ id: '', text: 'All Speakers' }, ...filterOptions.speakers]}
        />
      </div>
      <div className="mt-8 flex h-5 w-5 flex-shrink-0 items-center justify-center">{isLoading && <Spinner />}</div>
    </div>
  );
}
