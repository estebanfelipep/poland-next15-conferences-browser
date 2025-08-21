'use client';

import * as Ariakit from '@ariakit/react';
import React from 'react';
import Spinner from '../Spinner';
import SelectButton from './SelectButton';

export type SelectItem = {
  value: string;
  label: string;
};

export type SelectProps = {
  name: string;
  selected: SelectItem[];
  label: string;
  options: SelectItem[];
  hideSpinner?: boolean;
  isPending?: boolean;
  variant?: 'primary' | 'secondary';
  onSelect?: (items: SelectItem[]) => void;
};

export default function Select({ options, label, selected, hideSpinner = false, isPending, onSelect }: SelectProps) {
  const hasActiveFilter = selected.length > 0;
  const selectedValues = selected.map(item => {
    return item.value;
  });

  const displayText =
    selected.length === 0
      ? options[0]?.label || 'Select...'
      : selected.length === 1
        ? selected[0].label
        : `${selected.length} selected`;

  return (
    <div>
      <Ariakit.SelectProvider
        value={selectedValues}
        setValue={values => {
          const newSelected = values.map(value => {
            const option = options.find(opt => {
              return opt.value === value;
            });
            return option || { label: value, value };
          });
          onSelect?.(newSelected);
        }}
      >
        <Ariakit.SelectLabel className="mb-2 font-bold uppercase">{label}</Ariakit.SelectLabel>
        <div className="flex items-center gap-4">
          <Ariakit.Select
            aria-busy={isPending}
            className="group flex min-w-0 items-center gap-2 sm:flex-initial"
            render={<SelectButton variant={hasActiveFilter ? 'primary' : 'secondary'} />}
          >
            <span className="flex-1 truncate text-left sm:flex-initial">{displayText}</span>
            <Ariakit.SelectArrow className="flex-shrink-0 transition-transform group-aria-expanded:rotate-180" />
          </Ariakit.Select>
          {isPending && !hideSpinner && <Spinner />}
        </div>
        <Ariakit.SelectPopover
          style={{ viewTransitionName: 'anything' }}
          gutter={8}
          className="border-divider focus-visible:outline-primary dark:border-divider-dark z-50 flex max-h-60 flex-col gap-2 overflow-y-auto rounded-sm border bg-white py-2 shadow-lg -outline-offset-1 focus-visible:outline-2 dark:bg-black"
        >
          {options.map(option => {
            return (
              <Ariakit.SelectItem
                className="data-active-item:bg-card aria-disabled:text-gray dark:data-active-item:bg-card-dark data-focus-visible:bg-primary dark:data-focus-visible:bg-primary mx-2 flex items-center justify-between gap-4 rounded-md p-2 data-focus-visible:text-white"
                key={option.value}
                value={option.value}
              >
                <span className="flex-1">{option.label}</span>
                <Ariakit.SelectItemCheck />
              </Ariakit.SelectItem>
            );
          })}
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </div>
  );
}
