'use client';

import * as Ariakit from '@ariakit/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';
import SelectButton from './SelectButton';
import Spinner from './Spinner';

type Props = {
  name: string;
  value: string;
  label: string;
  options: string[];
  hideSpinner?: boolean;
  selectAction?: (item: string) => void | Promise<void>;
  onSelect?: (item: string) => void;
};

export default function RouterSelect({
  name,
  options,
  label,
  value,
  hideSpinner = false,
  selectAction,
  onSelect,
}: Props) {
  const [optimisticItem, setOptimisticItem] = useOptimistic(value);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const hasActiveFilter = options.length > 0 && optimisticItem !== options[0];

  return (
    <div>
      <Ariakit.SelectProvider value={optimisticItem}>
        <Ariakit.SelectLabel className="mb-1 text-sm font-bold uppercase sm:mb-2 sm:text-base">
          {label}
        </Ariakit.SelectLabel>
        <div className="flex items-center gap-4">
          <Ariakit.Select
            aria-busy={isPending}
            className="group flex items-center gap-2"
            render={<SelectButton variant={hasActiveFilter ? 'primary' : 'secondary'} />}
          >
            {optimisticItem}
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
                key={option}
                value={option}
                onClick={() => {
                  if (option === optimisticItem) return;

                  onSelect?.(option);
                  startTransition(async () => {
                    setOptimisticItem(option);
                    const newSearchParams = new URLSearchParams(searchParams.toString());
                    newSearchParams.set(name, option);
                    router.push('?' + newSearchParams.toString(), { scroll: false });
                    await selectAction?.(option);
                  });
                }}
              >
                {option}
                <Ariakit.SelectItemCheck />
              </Ariakit.SelectItem>
            );
          })}
        </Ariakit.SelectPopover>
      </Ariakit.SelectProvider>
    </div>
  );
}
