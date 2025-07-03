import React from 'react';
import Talks from '@/components/Talks';
import RouterSelect from '@/components/ui/RouterSelect';
import { getTalks, getTalkFilterOptions } from '@/data/services/talk';

type PageProps = {
  searchParams: Promise<{
    tag?: string;
    year?: string;
    conference?: string;
    speaker?: string;
  }>;
};

export default async function RootPage({ searchParams }: PageProps) {
  const { tag, year, conference, speaker } = await searchParams;
  const filterOptions = await getTalkFilterOptions();
  const talks = getTalks({ conference, speaker, tag, year });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <RouterSelect
            name="year"
            label="Year"
            value={{ id: year || '', text: year || 'All Years' }}
            options={[{ id: '', text: 'All Years' }, ...filterOptions.years]}
          />
          <RouterSelect
            name="tag"
            label="Tag"
            value={{ id: tag || '', text: tag || 'All Tags' }}
            options={[{ id: '', text: 'All Tags' }, ...filterOptions.tags]}
          />
          <RouterSelect
            name="conference"
            label="Conference"
            value={{ id: conference || '', text: conference || 'All Conferences' }}
            options={[{ id: '', text: 'All Conferences' }, ...filterOptions.conferences]}
          />
          <RouterSelect
            name="speaker"
            label="Speaker"
            value={{ id: speaker || '', text: speaker || 'All Speakers' }}
            options={[{ id: '', text: 'All Speakers' }, ...filterOptions.speakers]}
          />
        </div>
        <Talks talksPromise={talks} />
      </div>
    </div>
  );
}
