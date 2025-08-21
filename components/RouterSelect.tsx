'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';
import { createQueryString } from '@/utils/createQueryString';
import Select from './ui/select/Select';
import type { SelectItem, SelectProps } from './ui/select/Select';

type Props = {
  selected: SelectItem[];
  hideSpinner?: boolean;
  options: SelectItem[];
  selectAction?: (items: SelectItem[]) => void | Promise<void>;
  onSelect?: (items: SelectItem[]) => void;
} & SelectProps;

export default function RouterSelect({ name, selected, selectAction, onSelect, ...otherProps }: Props) {
  const [optimisticSelected, setOptimisticSelected] = useOptimistic(selected);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Select
      {...otherProps}
      name={name}
      isPending={isPending}
      selected={optimisticSelected}
      onSelect={items => {
        onSelect?.(items);

        startTransition(async () => {
          setOptimisticSelected(items);
          await selectAction?.(items);

          router.push(
            createQueryString(searchParams, {
              name,
              value: items,
            }),
          );
        });
      }}
    />
  );
}
