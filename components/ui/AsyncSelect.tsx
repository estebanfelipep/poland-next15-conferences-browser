'use client';

import * as Ariakit from '@ariakit/react';
import React, { useOptimistic, useTransition } from 'react';
import SelectButton from './SelectButton';
import Spinner from './Spinner';

export type SelectItem = {
  id: string;
  text: string;
};

type Props = {
  value: SelectItem;
  label: string;
  options: SelectItem[];
  showSpinner?: boolean;
  selectAction?: (item: SelectItem) => void | Promise<void>;
  onSelect?: (item: SelectItem) => void;
};

export default function AsyncSelect({ options, label, value, showSpinner = true, selectAction, onSelect }: Props) {
  const [optimisticItem, setOptimisticItem] = useOptimistic(value);
  const [isPending, startTransition] = useTransition();
  const hasActiveFilter = options.length > 0 && optimisticItem.id !== options[0].id;

  return (
    <div>
      <Ariakit.SelectProvider value={optimisticItem.id}>
        <Ariakit.SelectLabel className="mb-1 text-sm font-bold uppercase sm:mb-2 sm:text-base">
          {label}
        </Ariakit.SelectLabel>
        <div className="flex items-center gap-4">
          <Ariakit.Select
            aria-busy={isPending}
            className="group flex items-center gap-2"
            render={<SelectButton variant={hasActiveFilter ? 'primary' : 'secondary'} />}
          >
            {optimisticItem.text}
            <Ariakit.SelectArrow className="transition-transform group-aria-expanded:rotate-180" />
          </Ariakit.Select>
          {isPending && showSpinner && <Spinner />}
        </div>
        <Ariakit.SelectPopover
          gutter={8}
          className="border-divider focus-visible:outline-primary dark:border-divider-dark z-50 flex max-h-60 flex-col gap-2 overflow-y-auto rounded-sm border bg-white py-2 shadow-lg -outline-offset-1 focus-visible:outline-2 dark:bg-black"
        >
          {options.map(option => {
            return (
              <Ariakit.SelectItem
                className="data-active-item:bg-card aria-disabled:text-gray dark:data-active-item:bg-card-dark data-focus-visible:bg-primary dark:data-focus-visible:bg-primary mx-2 flex items-center justify-between gap-4 rounded-md p-2 data-focus-visible:text-white"
                key={option.id}
                value={option.id}
                onClick={() => {
                  if (option.id === optimisticItem.id) return;

                  onSelect?.(option);
                  startTransition(async () => {
                    setOptimisticItem(option);
                    await selectAction?.(option);
                  });
                }}
              >
                {option.text}
                <Ariakit.SelectItemCheck />
              </Ariakit.SelectItem>
            );
          })}
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </div>
  );
}
