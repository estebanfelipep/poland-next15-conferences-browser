import Filter from '@/components/Filter';
import Talks from '@/components/Talks';
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
      <Filter filterOptions={filterOptions} filters={activeFilters} />
      <Talks talksPromise={talks} activeFilters={activeFilters} />
    </div>
  );
}
