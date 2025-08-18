import React from 'react';
import type { FilterOptions, FilterType } from '@/types/filters';
import AsyncSelect from './AsyncSelect';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filters({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 md:gap-6">
        <AsyncSelect
          name="year"
          label="Year"
          selected={{ label: year || 'All Years', value: year || '' }}
          options={[{ label: 'All Years', value: '' }, ...filterOptions.years]}
        />
        <AsyncSelect
          name="tag"
          label="Tag"
          selected={{ label: tag || 'All Tags', value: tag || '' }}
          options={[{ label: 'All Tags', value: '' }, ...filterOptions.tags]}
        />
        <AsyncSelect
          name="speaker"
          label="Speaker"
          selected={{ label: speaker || 'All Speakers', value: speaker || '' }}
          options={[{ label: 'All Speakers', value: '' }, ...filterOptions.speakers]}
        />
        <AsyncSelect
          name="conference"
          label="Conference"
          selected={{ label: conference || 'All Conferences', value: conference || '' }}
          options={[{ label: 'All Conferences', value: '' }, ...filterOptions.conferences]}
        />
      </div>
    </div>
  );
}
