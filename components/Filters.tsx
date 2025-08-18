'use client';

import React, { useState } from 'react';
import { ConfettiExplosion } from 'react-confetti-explosion';
import LoadingBar from 'react-top-loading-bar';
import type { FilterOptions, FilterType } from '@/types/filters';
import AsyncSelect from './AsyncSelect';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filters({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;
  const [isExploding] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="flex items-center justify-between gap-4">
      {isExploding && <ConfettiExplosion />}
      <LoadingBar
        color="#8132fe"
        height={5}
        progress={progress}
        onLoaderFinished={() => {
          setProgress(0);
        }}
      />
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
