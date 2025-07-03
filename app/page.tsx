import React from 'react';
import Filter from '@/components/Filter';
import Talks from '@/components/Talks';
import { getTalks, getTalkFilterOptions } from '@/data/services/talk';
import type { FilterType } from '@/types/filters';

type PageProps = {
  searchParams: Promise<FilterType>;
};

export default async function RootPage({ searchParams }: PageProps) {
  const { tag, year, conference, speaker } = await searchParams;
  const filterOptions = await getTalkFilterOptions();
  const talks = getTalks({ conference, speaker, tag, year });

  return (
    <div className="flex flex-col gap-8">
      <Filter filterOptions={filterOptions} filters={{ conference, speaker, tag, year }} />
      <Talks talksPromise={talks} activeFilters={{ conference, speaker, tag, year }} />
    </div>
  );
}
