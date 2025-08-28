'use client';

import React, { useEffect, useOptimistic, useRef, useState } from 'react';
import { ConfettiExplosion } from 'react-confetti-explosion';
import toast from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { someRandomServerFunction } from '@/data/actions/cookie';
import { logUserSelectedConference } from '@/data/actions/logger';
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
  const [optimisticProgress, incrementProgress] = useOptimistic(progress, (prev, increment: number) => {
    const next = prev + increment;
    return next >= 100 ? 99.99 : next;
  });
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
        progress={optimisticProgress}
        onLoaderFinished={() => {
          setProgress(0);
        }}
      />
      <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4 md:gap-6">
        <RouterSelect
          hideSpinner
          // The optimistic update happens immediately on selecting an item, then the loader completes when the transition is done
          selectAction={() => {
            incrementProgress(30);
            setProgress(100);
          }}
          name="year"
          label="Year"
          selected={toSelectItems(year, filterOptions.years)}
          options={filterOptions.years}
        />
        <RouterSelect
          // This executes on selecting an item as a regular event
          onSelect={items => {
            updateThemeColor(items, documentRef);
          }}
          // This executes at the end of the transition
          selectAction={items => {
            if (items.length > 0) {
              const message = `Applied ${items.length} tag filter${items.length > 1 ? 's' : ''}`;
              toast.success(message);
            }
          }}
          name="tag"
          label="Tag"
          selected={toSelectItems(tag, filterOptions.tags)}
          options={filterOptions.tags}
        />
        <RouterSelect
          name="speaker"
          // Using useOptimistic means it will automatically revert to false once the transition is complete
          selectAction={items => {
            if (
              items.some(item => {
                return item.value === 'Anisha Malde';
              })
            ) {
              setIsExploding(true);
            }
          }}
          label="Speaker"
          selected={toSelectItems(speaker, filterOptions.speakers)}
          options={filterOptions.speakers}
        />
        <RouterSelect
          name="conference"
          label="Conference"
          selectAction={async items => {
            // This also executes when the transition is complete
            await logUserSelectedConference(items);
            await someRandomServerFunction(items, year);
          }}
          selected={toSelectItems(conference, filterOptions.conferences)}
          options={filterOptions.conferences}
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
