'use client';

import React, { useEffect, useOptimistic, useRef, useState } from 'react';
import { ConfettiExplosion } from 'react-confetti-explosion';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { someRandomServerFunction } from '@/data/actions/cookie';
import type { FilterOptions, FilterType } from '@/types/filters';
import { updateThemeColor } from '@/utils/themeColors';
import RouterSelect from './RouterSelect';

type Props = {
  filterOptions: FilterOptions;
  filters: FilterType;
};

export default function Filters({ filterOptions, filters }: Props) {
  const { year, tag, conference, speaker } = filters;
  const [isExploding, setIsExploding] = useOptimistic(false);
  const [progress, setProgress] = useState(0);
  const documentRef = useRef<Document | null>(null);

  useEffect(() => {
    documentRef.current = document;
  }, []);

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
          selected={toSelectItems(year, filterOptions.years)}
          options={[{ label: 'All Years', value: '' }, ...filterOptions.years]}
        />
        <RouterSelect
          // This executes on selecting an item as a regular event
          onSelect={items => {
            updateThemeColor(items[0]?.value, documentRef);
          }}
          // This executes at the end of the transition
          selectAction={items => {
            toast.success('Applied tag filter: ' + items[0]?.value, { duration: 5000 });
          }}
          name="tag"
          label="Tag"
          selected={toSelectItems(tag, filterOptions.tags)}
          options={[{ label: 'All Tags', value: '' }, ...filterOptions.tags]}
        />
        <RouterSelect
          name="speaker"
          // Using useOptimistic means it will automatically revert to false once the transition is complete
          selectAction={items => {
            if (items[0]?.value === 'Kent C. Dodds') {
              setIsExploding(true);
            }
          }}
          label="Speaker"
          selected={toSelectItems(speaker, filterOptions.speakers)}
          options={[{ label: 'All Speakers', value: '' }, ...filterOptions.speakers]}
        />
        <RouterSelect
          name="conference"
          label="Conference"
          selectAction={async items => {
            // This also executes when the transition is complete
            await someRandomServerFunction(items[0]?.value || '', year);
          }}
          selected={toSelectItems(conference, filterOptions.conferences)}
          options={[{ label: 'All Conferences', value: '' }, ...filterOptions.conferences]}
        />
      </div>
    </div>
  );
}

const toSelectItems = (values: string | string[] | undefined, options: { label: string; value: string }[]) => {
  if (!values) return [];
  const valueArray = Array.isArray(values) ? values : [values];
  return valueArray
    .filter(v => {
      return v.trim();
    })
    .map(value => {
      const option = options.find(opt => {
        return opt.value === value;
      });
      return option || { label: value, value };
    });
};
