'use client';

import * as Ariakit from '@ariakit/react';
import { useRouter } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';
import SelectButton from './SelectButton';
import Spinner from './Spinner';

type SelectItem = {
  id: string;
  text: string;
};

type Props = {
  name: string;
  options: SelectItem[];
  value: SelectItem;
  label: string;
  selectAction?: (item: SelectItem) => void | Promise<void>;
  onSelect?: (item: SelectItem) => void;
};

export default function RouterSelect({ name, options, label, value, selectAction, onSelect }: Props) {
  const [optimisticItem, setOptimisticItem] = useOptimistic(value);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div>
      <Ariakit.SelectProvider value={optimisticItem.id}>
        <Ariakit.SelectLabel className="mb-2 font-bold uppercase">{label}</Ariakit.SelectLabel>
        <div className="flex items-center gap-4">
          <Ariakit.Select aria-busy={isPending} className="group flex items-center gap-2" render={<SelectButton />}>
            {optimisticItem.text}
            <Ariakit.SelectArrow className="transition-transform group-aria-expanded:rotate-180" />
          </Ariakit.Select>
          {isPending && <Spinner />}
        </div>
        <Ariakit.SelectPopover
          gutter={8}
          className="border-divider focus-visible:outline-primary dark:border-divider-dark flex flex-col gap-2 rounded-sm border bg-white py-2 shadow-lg -outline-offset-1 focus-visible:outline-2 dark:bg-black"
        >
          {options.map(option => {
            return (
              <Ariakit.SelectItem
                className="data-active-item:bg-card aria-disabled:text-gray dark:data-active-item:bg-card-dark data-focus-visible:bg-primary dark:data-focus-visible:bg-primary mx-2 flex items-center justify-between gap-4 rounded-md p-2 data-focus-visible:text-white"
                key={option.text}
                value={option.id}
                onClick={() => {
                  onSelect?.(option);
                  startTransition(async () => {
                    setOptimisticItem(option);
                    await selectAction?.(option);
                    const url = new URL(window.location.href);
                    url.searchParams.set(name, option.id);
                    router.push(url.href, { scroll: false });
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
