'use client';

import React, { useOptimistic, useState } from 'react';
import { ConfettiExplosion } from 'react-confetti-explosion';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { someRandomServerFunction } from '@/data/actions/cookie';
import type { FilterOptions, FilterType } from '@/types/filters';
import RouterSelect from './RouterSelect';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filters({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;
  const [isExploding, setIsExploding] = useOptimistic(false);
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
      <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:gap-6">
        <RouterSelect
          hideSpinner
          // The onSelect is triggered when an item is first selected
          onSelect={() => {
            setProgress(progress + 10);
          }}
          // With useState, we know that the selectAction will be called after the transition is complete
          selectAction={() => {
            setProgress(100);
          }}
          name="year"
          label="Year"
          selected={{ label: year || 'All Years', value: year || '' }}
          options={[{ label: 'All Years', value: '' }, ...filterOptions.years]}
        />
        <RouterSelect
          // This executes on selecting an item as a regular event
          onSelect={item => {
            document.title = `${item.value} - Conference Explorer`;
          }}
          // This executes at the end of the transition
          selectAction={item => {
            toast.success('Applied tag filter: ' + item.value, { duration: 5000 });
          }}
          name="tag"
          label="Tag"
          selected={{ label: tag || 'All Tags', value: tag || '' }}
          options={[{ label: 'All Tags', value: '' }, ...filterOptions.tags]}
        />
        <RouterSelect
          name="speaker"
          // Using useOptimistic means it will automatically revert to false once the transition is complete
          selectAction={item => {
            if (item.value === 'Kent C. Dodds') {
              setIsExploding(true);
            }
          }}
          label="Speaker"
          selected={{ label: speaker || 'All Speakers', value: speaker || '' }}
          options={[{ label: 'All Speakers', value: '' }, ...filterOptions.speakers]}
        />
        <RouterSelect
          name="conference"
          label="Conference"
          selectAction={async item => {
            // This also executes when the transition is complete
            await someRandomServerFunction(item.value, year);
          }}
          selected={{ label: conference || 'All Conferences', value: conference || '' }}
          options={[{ label: 'All Conferences', value: '' }, ...filterOptions.conferences]}
        />
      </div>
    </div>
  );
}
