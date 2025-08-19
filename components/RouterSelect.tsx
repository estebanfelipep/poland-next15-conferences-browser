'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';
import { createQueryString } from '@/utils/createQueryString';
import Select from './ui/select/Select';
import type { SelectItem, SelectProps } from './ui/select/Select';

type Props = {
  selected: SelectItem;
  hideSpinner?: boolean;
  options: SelectItem[];
  selectAction?: (item: SelectItem) => void | Promise<void>;
  onSelect?: (item: SelectItem) => void;
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
      onSelect={item => {
        if (item.value === optimisticSelected.value) return;
        onSelect?.(item);

        startTransition(async () => {
          setOptimisticSelected(item);
          await selectAction?.(item);
          router.push(createQueryString(searchParams, { name, value: item.value }));
        });
      }}
    />
  );
}
