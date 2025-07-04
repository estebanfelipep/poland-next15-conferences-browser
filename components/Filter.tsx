'use client';

import React, { useEffect, useOptimistic, useState } from 'react';
import { ConfettiExplosion } from 'react-confetti-explosion';
import toast, { Toaster } from 'react-hot-toast';
import Sparkle from 'react-sparkle';
import LoadingBar from 'react-top-loading-bar';
import { someRandomServerFunction } from '@/data/actions/cookie';
import type { FilterOptions, FilterType } from '@/types/filters';
import RouterSelect from './RouterSelect';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filter({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;
  const [isExploding, setIsExploding] = useOptimistic(false);
  const [progress, setProgress] = useState(0);
  const [sparkle, setSparkle] = useState(false);

  useEffect(() => {
    setProgress(0);
    if (tag !== 'React') {
      setSparkle(false);
    }
  }, [conference, filters, setIsExploding, tag, year]);

  return (
    <div className="flex items-center justify-between gap-4">
      {isExploding && <ConfettiExplosion />}
      <Toaster position="top-right" />
      <LoadingBar
        color="#8132fe"
        height={5}
        progress={progress}
        onLoaderFinished={() => {
          setProgress(0);
        }}
      />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        <RouterSelect
          hideSpinner
          // The onSelect is triggered when an item is selected
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
        <div className="relative">
          <RouterSelect
            // This executes on selecting an item as a regular event
            onSelect={item => {
              if (item.value === 'React') {
                setSparkle(true);
              } else {
                setSparkle(false);
              }
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
          {sparkle && <Sparkle />}
        </div>
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
            await someRandomServerFunction(item.value, year);
          }}
          selected={{ label: conference || 'All Conferences', value: conference || '' }}
          options={[{ label: 'All Conferences', value: '' }, ...filterOptions.conferences]}
        />
      </div>
    </div>
  );
}
