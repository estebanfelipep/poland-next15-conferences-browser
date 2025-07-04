'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import AsyncSelect from '@/components/ui/AsyncSelect';
import type { FilterOptions, FilterType } from '@/types/filters';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filter({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilter = (name: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set(name, value);
    router.push('?' + newSearchParams.toString(), { scroll: false });
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        <AsyncSelect
          label="Year"
          selectAction={item => {
            setFilter('year', item.id);
          }}
          value={{ id: year || '', text: year || 'All Years' }}
          options={[{ id: '', text: 'All Years' }, ...filterOptions.years]}
        />
        <AsyncSelect
          selectAction={item => {
            setFilter('tag', item.id);
          }}
          label="Tag"
          value={{ id: tag || '', text: tag || 'All Tags' }}
          options={[{ id: '', text: 'All Tags' }, ...filterOptions.tags]}
        />
        <AsyncSelect
          label="Conference"
          selectAction={item => {
            setFilter('conference', item.id);
          }}
          value={{ id: conference || '', text: conference || 'All Conferences' }}
          options={[{ id: '', text: 'All Conferences' }, ...filterOptions.conferences]}
        />
        <AsyncSelect
          label="Speaker"
          selectAction={item => {
            setFilter('speaker', item.id);
          }}
          value={{ id: speaker || '', text: speaker || 'All Speakers' }}
          options={[{ id: '', text: 'All Speakers' }, ...filterOptions.speakers]}
        />
      </div>
    </div>
  );
}
