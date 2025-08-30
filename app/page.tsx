import React from 'react';
import Filters from '@/components/Filters';
import { getTalkFilterOptions } from '@/data/services/talk';
import type { FilterType } from '@/types/filters';

export default async function RootPage({ searchParams }: PageProps<'/'>) {
  const activeFilters: FilterType = await searchParams;
  const filterOptions = await getTalkFilterOptions();
  // const talks = getTalks(activeFilters);

  return (
    <div className="flex flex-col gap-8">
      <Filters filterOptions={filterOptions} filters={activeFilters} />
      {/* <TalksExplorer talksPromise={talks} /> */}
    </div>
  );
}
