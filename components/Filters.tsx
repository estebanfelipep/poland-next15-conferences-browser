'use client';

import React, { useEffect, useRef, useState } from 'react';
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
        <AsyncSelect
          name="year"
          label="Year"
          selected={toSelectItems(year, filterOptions.years)}
          options={filterOptions.years}
        />
        <AsyncSelect
          name="tag"
          label="Tag"
          selected={toSelectItems(tag, filterOptions.tags)}
          options={filterOptions.tags}
        />
        <AsyncSelect
          name="speaker"
          label="Speaker"
          selected={toSelectItems(speaker, filterOptions.speakers)}
          options={filterOptions.speakers}
        />
        <AsyncSelect
          name="conference"
          label="Conference"
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
