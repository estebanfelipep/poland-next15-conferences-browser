'use client';

import * as Ariakit from '@ariakit/react';
import React from 'react';
import Spinner from '../Spinner';
import SelectButton from './SelectButton';

type SelectItem = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  selected: SelectItem;
  label: string;
  options: SelectItem[];
  hideSpinner?: boolean;
  isPending?: boolean;
  variant?: 'primary' | 'secondary';
  onSelect?: (item: SelectItem) => void;
};

export default function Select({ options, label, selected, hideSpinner = false, isPending, onSelect }: Props) {
  const hasActiveFilter = options.length > 0 && selected.value !== options[0].value;

  return (
    <div>
      <Ariakit.SelectProvider value={selected.value}>
        <Ariakit.SelectLabel className="mb-1 text-sm font-bold uppercase sm:mb-2 sm:text-base">
          {label}
        </Ariakit.SelectLabel>
        <div className="flex items-center gap-4">
          <Ariakit.Select
            aria-busy={isPending}
            className="group flex items-center gap-2"
            render={<SelectButton variant={hasActiveFilter ? 'primary' : 'secondary'} />}
          >
            {selected.label}
            <Ariakit.SelectArrow className="transition-transform group-aria-expanded:rotate-180" />
          </Ariakit.Select>
          {isPending && !hideSpinner && <Spinner />}
        </div>
        <Ariakit.SelectPopover
          gutter={8}
          className="border-divider focus-visible:outline-primary dark:border-divider-dark z-50 flex max-h-60 flex-col gap-2 overflow-y-auto rounded-sm border bg-white py-2 shadow-lg -outline-offset-1 focus-visible:outline-2 dark:bg-black"
        >
          {options.map(option => {
            return (
              <Ariakit.SelectItem
                className="data-active-item:bg-card aria-disabled:text-gray dark:data-active-item:bg-card-dark data-focus-visible:bg-primary dark:data-focus-visible:bg-primary mx-2 flex items-center justify-between gap-4 rounded-md p-2 data-focus-visible:text-white"
                key={option.value}
                value={option.value}
                onClick={() => {
                  onSelect?.(option);
                }}
              >
                {option.label}
                <Ariakit.SelectItemCheck />
              </Ariakit.SelectItem>
            );
          })}
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </div>
  );
}
